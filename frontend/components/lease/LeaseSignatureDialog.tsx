"use client";

import { useState } from "react";
import { useSignLease } from "@/hooks/useLeases";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileSignature } from "lucide-react";

interface LeaseSignatureDialogProps {
  leaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LeaseSignatureDialog({
  leaseId,
  open,
  onOpenChange,
  onSuccess,
}: LeaseSignatureDialogProps) {
  const [signature, setSignature] = useState("");
  const signMutation = useSignLease();

  const handleSign = async () => {
    if (!signature.trim()) {
      toast.error("Please enter your full name to sign");
      return;
    }

    try {
      await signMutation.mutateAsync({
        leaseId,
        signatureData: { signatureData: signature },
      });

      toast.success("Lease signed successfully!");
      setSignature("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign lease");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Sign Lease Agreement
          </DialogTitle>
          <DialogDescription>
            By signing this lease, you agree to all terms and conditions
            outlined in the lease agreement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="signature">
              Digital Signature (Type your full name)
            </Label>
            <Input
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="John Doe"
              className="text-xl font-serif italic"
            />
            <p className="text-xs text-gray-500">
              Your name will serve as your digital signature
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> This is a legally binding signature.
              Make sure you have read and understood all lease terms before
              signing.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={signMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSign}
            className="flex-1"
            disabled={signMutation.isPending || !signature.trim()}
          >
            {signMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing...
              </>
            ) : (
              "Sign Lease"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
