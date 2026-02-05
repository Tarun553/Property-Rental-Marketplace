"use client";

import { useState } from "react";
import {
  usePropertyApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, User, Briefcase, DollarSign, Loader2 } from "lucide-react";
import { Application } from "@/types/application";
import { AxiosError } from "axios";

interface PropertyApplicationsProps {
  propertyId: string;
}

interface Tenant {
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-600";
    case "rejected":
      return "bg-red-600";
    case "reviewing":
      return "bg-yellow-600";
    case "pending":
      return "bg-blue-600";
    default:
      return "bg-gray-600";
  }
};

const PropertyApplicationCard = ({
  application,
}: {
  application: Application;
}) => {
  const [landlordNotes, setLandlordNotes] = useState("");
  const updateMutation = useUpdateApplicationStatus();
  const tenant = application.tenant as unknown as Tenant;

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await updateMutation.mutateAsync({
        applicationId,
        status: newStatus,
        landlordNotes: landlordNotes || undefined,
      });
      toast.success(`Application ${newStatus}`);
      setLandlordNotes("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "Failed to update application",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {tenant?.profile?.firstName} {tenant?.profile?.lastName}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{tenant?.email}</p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="font-semibold">Occupation:</span>
            </div>
            <p>{application.personalInfo.occupation}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="font-semibold">Employer:</span>
            </div>
            <p>{application.personalInfo.employer}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">Annual Income:</span>
            </div>
            <p>${application.personalInfo.annualIncome.toLocaleString()}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">Move-in Date:</span>
            </div>
            <p>
              {new Date(
                application.personalInfo.moveInDate,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {application.references && application.references.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">References</h4>
            <div className="space-y-2">
              {application.references.map((ref, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-3 rounded">
                  <p className="font-semibold">{ref.name}</p>
                  <p className="text-gray-600">
                    {ref.relationship} • {ref.phone} • {ref.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {application.additionalInfo && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Additional Information</h4>
            <p className="text-gray-700">{application.additionalInfo}</p>
          </div>
        )}

        {application.documents && application.documents.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Documents</h4>
            <div className="space-y-1">
              {application.documents.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm block"
                >
                  {doc.name || `Document ${idx + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 border-t pt-4">
          <Calendar className="h-4 w-4" />
          <span>
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>

        {application.status === "pending" ||
        application.status === "reviewing" ? (
          <div className="flex gap-2 border-t pt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="flex-1">
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Application</DialogTitle>
                  <DialogDescription>
                    Add optional notes for the tenant about their approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Congratulations! You've been approved..."
                    value={landlordNotes}
                    onChange={(e) => setLandlordNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleStatusUpdate(application._id, "approved")
                      }
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      Confirm Approval
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Reviewing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark as Reviewing</DialogTitle>
                  <DialogDescription>
                    Let the tenant know their application is under review.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="We're reviewing your application..."
                    value={landlordNotes}
                    onChange={(e) => setLandlordNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleStatusUpdate(application._id, "reviewing")
                      }
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                  <DialogDescription>
                    Add optional notes explaining the rejection.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Thank you for your interest, however..."
                    value={landlordNotes}
                    onChange={(e) => setLandlordNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleStatusUpdate(application._id, "rejected")
                      }
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : application.landlordNotes ? (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Your Notes</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">
              {application.landlordNotes}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export function PropertyApplications({
  propertyId,
}: PropertyApplicationsProps) {
  const { data: applications, isLoading } = usePropertyApplications(propertyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-600">
          No applications received yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <PropertyApplicationCard
          key={application._id}
          application={application}
        />
      ))}
    </div>
  );
}
