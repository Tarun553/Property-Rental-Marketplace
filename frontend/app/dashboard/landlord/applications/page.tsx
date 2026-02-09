"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useLandlordApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import {
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  ChevronRight,
  Briefcase,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { User as UserType } from "@/types/maintenance";
import { Property } from "@/types/property";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string; bg: string }
> = {
  approved: {
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    icon: CheckCircle2,
    label: "Approved",
  },
  rejected: {
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    icon: XCircle,
    label: "Rejected",
  },
  reviewing: {
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    icon: Clock,
    label: "Reviewing",
  },
  pending: {
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    icon: AlertCircle,
    label: "Pending",
  },
};

export default function LandlordApplicationsPage() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useLandlordApplications(
    user?._id || "",
  );
  console.log(applications)
  const updateMutation = useUpdateApplicationStatus();

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await updateMutation.mutateAsync({
        applicationId,
        status: newStatus,
      });
      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "Failed to update application",
      );
    }
  };

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Management
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Rental Applications
              </h1>
              <p className="text-muted-foreground text-lg">
                Review and manage prospective tenants for your properties.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-normal bg-background/50 backdrop-blur-sm"
              >
                {applications?.length || 0} Total Applications
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-sm animate-pulse">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-muted rounded-full" />
                      <div className="flex-1 space-y-4">
                        <div className="h-6 w-1/4 bg-muted rounded" />
                        <div className="h-4 w-1/2 bg-muted rounded" />
                        <div className="flex gap-4">
                          <div className="h-4 w-24 bg-muted rounded" />
                          <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="grid gap-6">
              {applications.map((application) => {
                const tenant = application.tenant as unknown as UserType;
                const property = application.property as unknown as Property;
                const status =
                  statusConfig[application.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card
                    key={application._id}
                    className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/60 backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-300 group-hover:bg-primary" />

                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Tenant Info Section */}
                        <div className="p-8 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-muted/50">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                <User className="h-7 w-7 text-primary" />
                              </div>
                              <div
                                className={cn(
                                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center",
                                  status.bg,
                                )}
                              >
                                <StatusIcon
                                  className={cn("h-3 w-3", status.color)}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">
                                {tenant?.profile?.firstName}{" "}
                                {tenant?.profile?.lastName}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Mail className="h-3 w-3" />
                                {tenant?.email}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground leading-none mb-1">
                                  Occupation
                                </p>
                                <p className="font-medium">
                                  {application.personalInfo.occupation}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground leading-none mb-1">
                                  Annual Income
                                </p>
                                <p className="font-bold text-emerald-600">
                                  $
                                  {application.personalInfo.annualIncome.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Property & Request Details */}
                        <div className="p-8 flex-1 flex flex-col justify-between">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Building2 className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                  Property Details
                                </span>
                              </div>
                              <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                {property?.title || "Property"}
                              </h4>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {property?.address?.city},{" "}
                                {property?.address?.state}
                              </div>
                              {property?._id && (
                                <Link
                                  href={`/properties/${property._id}`}
                                  className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:underline"
                                >
                                  View Property Listing
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                  Application Info
                                </span>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">
                                    Preferred Move-in
                                  </span>
                                  <span className="font-medium flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-primary/70" />
                                    {new Date(
                                      application.personalInfo.moveInDate,
                                    ).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">
                                    References
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="bg-muted/50 font-medium"
                                  >
                                    {application.references.length} Provided
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between mt-8 pt-6 border-t border-muted/50">
                            <div className="flex items-center gap-3">
                              <Badge
                                className={cn(
                                  "px-3 py-1 font-medium border-0",
                                  status.bg,
                                  status.color,
                                )}
                              >
                                <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                {status.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Submitted on{" "}
                                {new Date(
                                  application.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            {(application.status === "pending" ||
                              application.status === "reviewing") && (
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  className="h-10 px-6 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application._id,
                                      "rejected",
                                    )
                                  }
                                  disabled={updateMutation.isPending}
                                >
                                  Reject
                                </Button>
                                <Button
                                  className="h-10 px-6 bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application._id,
                                      "approved",
                                    )
                                  }
                                  disabled={updateMutation.isPending}
                                >
                                  Approve Application
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
              <CardContent className="p-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
                  When potential tenants apply for your properties, they will
                  appear here for your review.
                </p>
                <Link href="/dashboard/landlord">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
