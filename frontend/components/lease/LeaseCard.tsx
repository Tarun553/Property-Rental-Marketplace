"use client";

import { useState } from "react";
import { Lease } from "@/types/lease";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeaseSignatureDialog } from "./LeaseSignatureDialog";
import {
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface LeaseCardProps {
  lease: Lease;
  userRole?: "landlord" | "tenant";
  onViewDetails?: (leaseId: string) => void;
  onSign?: (leaseId: string) => void;
}

export function LeaseCard({ lease, userRole, onViewDetails }: LeaseCardProps) {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "signed":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      case "terminated":
      case "expired":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const tenant = typeof lease.tenant === "object" ? lease.tenant : null;
  const property = typeof lease.property === "object" ? lease.property : null;

  // Check signatures - support both new and legacy structure
  const hasLandlordSignature =
    lease.signatures?.landlord?.signed || lease.landlordSignature !== undefined;
  const hasTenantSignature =
    lease.signatures?.tenant?.signed || lease.tenantSignature !== undefined;

  const needsSignature =
    (userRole === "tenant" && !hasTenantSignature) ||
    (userRole === "landlord" && !hasLandlordSignature);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              {property?.title || "Lease Agreement"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {userRole === "landlord"
                  ? tenant?.profile?.firstName + " " + tenant?.profile?.lastName
                  : "Lease Agreement"}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(lease.status)}>{lease.status}</Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>
              {new Date(lease.terms.startDate).toLocaleDateString()} -{" "}
              {new Date(lease.terms.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <span className="font-semibold">
              ${lease.terms.monthlyRent.toLocaleString()}/month
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-gray-600" />
            <span>
              Deposit: ${lease.terms.securityDeposit.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {hasLandlordSignature && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Landlord Signed</span>
            </div>
          )}
          {hasTenantSignature && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Tenant Signed</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(lease._id)}
            >
              View Details
            </Button>
          )}
          {needsSignature && (
            <Button className="flex-1" onClick={() => setSignDialogOpen(true)}>
              Sign Lease
            </Button>
          )}
        </div>

        <LeaseSignatureDialog
          leaseId={lease._id}
          open={signDialogOpen}
          onOpenChange={setSignDialogOpen}
        />
      </CardContent>
    </Card>
  );
}
