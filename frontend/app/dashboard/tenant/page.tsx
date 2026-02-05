"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useTenantApplications } from "@/hooks/useApplications";
import { useTenantLeases } from "@/hooks/useLeases";
import { useTenantMaintenance } from "@/hooks/useMaintenance";
import { LeaseCard } from "@/components/lease/LeaseCard";
import { MaintenanceCard } from "@/components/maintenance/MaintenanceCard";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  MessageSquare,
  Wrench,
  ClipboardList,
  ArrowUpRight,
  Sparkles,
  Eye,
  Building2,
  AlertCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tenant Leases Tab Component
function TenantLeasesTab({ userId }: { userId: string }) {
  const { data: leases, isLoading } = useTenantLeases(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">My Leases</h2>
          <Badge variant="secondary" className="font-normal">
            {leases?.length || 0} total
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <FileText className="absolute inset-0 m-auto h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading leases...</p>
        </div>
      ) : leases && leases.length > 0 ? (
        <div className="grid gap-4">
          {leases.map((lease) => (
            <LeaseCard key={lease._id} lease={lease} userRole="tenant" />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Leases Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your leases will appear here once your application is approved by
              a landlord.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Tenant Maintenance Tab Component
function TenantMaintenanceTab({ userId }: { userId: string }) {
  const { data: leases } = useTenantLeases(userId);
  const { data: requests, isLoading } = useTenantMaintenance(userId);

  // Get the first active lease's property ID for the request form
  const activeProperty = leases?.find(
    (lease) =>
      lease.status === "active" || lease.status === "pending_signatures",
  )?.property;

  const propertyId =
    typeof activeProperty === "object" ? activeProperty?._id : activeProperty;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Maintenance Requests</h2>
          <Badge variant="secondary" className="font-normal">
            {requests?.length || 0} total
          </Badge>
        </div>
        {propertyId && <MaintenanceRequestForm propertyId={propertyId} />}
      </div>

      {!propertyId && (
        <Card className="border-0 shadow-lg bg-amber-50/50 dark:bg-amber-500/10">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Active Lease Required
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You need an active lease to submit maintenance requests. Once you
              have an active lease, you can submit requests here.
            </p>
          </CardContent>
        </Card>
      )}

      {propertyId && (
        <>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Wrench className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Loading maintenance requests...
              </p>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="grid gap-4">
              {requests.map((request) => (
                <MaintenanceCard
                  key={request._id}
                  request={request}
                  userRole="tenant"
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Wrench className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Maintenance Requests
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Submit a request using the button above for any issues with
                  your rental property.
                </p>
                <MaintenanceRequestForm propertyId={propertyId} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default function TenantDashboard() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useTenantApplications(
    user?._id || "",
  );

  const stats = {
    total: applications?.length || 0,
    pending:
      applications?.filter(
        (a) => a.status === "pending" || a.status === "reviewing",
      ).length || 0,
    approved: applications?.filter((a) => a.status === "approved").length || 0,
    rejected: applications?.filter((a) => a.status === "rejected").length || 0,
  };

  const statusConfig: Record<
    string,
    { color: string; icon: React.ElementType; bgColor: string }
  > = {
    approved: {
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      icon: CheckCircle2,
    },
    rejected: {
      color: "text-rose-600",
      bgColor: "bg-rose-500/10 border-rose-500/20",
      icon: XCircle,
    },
    reviewing: {
      color: "text-amber-600",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      icon: Clock,
    },
    pending: {
      color: "text-blue-600",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      icon: Clock,
    },
    withdrawn: {
      color: "text-gray-600",
      bgColor: "bg-gray-500/10 border-gray-500/20",
      icon: XCircle,
    },
  };

  return (
    <ProtectedRoute allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  <User className="h-3 w-3 mr-1" />
                  Tenant Dashboard
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {user?.profile?.firstName || "Tenant"}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your applications, leases, and find your perfect home.
              </p>
            </div>
            <Link href="/properties">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                <Search className="h-5 w-5" />
                Browse Properties
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-linear-to-b from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Applications
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-3xl font-bold mt-1 text-blue-600">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Approved
                    </p>
                    <p className="text-3xl font-bold mt-1 text-emerald-600">
                      {stats.approved}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Rejected
                    </p>
                    <p className="text-3xl font-bold mt-1 text-rose-600">
                      {stats.rejected}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10">
                    <XCircle className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{
                        width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Link href="/properties">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Find Properties</p>
                    <p className="text-sm text-muted-foreground">
                      Browse available rentals
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/messages">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">
                      Chat with landlords
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="#maintenance">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Maintenance</p>
                    <p className="text-sm text-muted-foreground">
                      Submit repair requests
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Tabbed Interface */}
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50">
              <TabsTrigger
                value="applications"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
              <TabsTrigger
                value="leases"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Leases</span>
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Maintenance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">My Applications</h2>
                    <Badge variant="secondary" className="font-normal">
                      {stats.total} total
                    </Badge>
                  </div>
                  <Link href="/properties">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Search className="h-4 w-4" />
                      Browse Properties
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <ClipboardList className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      Loading applications...
                    </p>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const property = application.property as any;
                      const status =
                        statusConfig[application.status] ||
                        statusConfig.pending;
                      const StatusIcon = status.icon;

                      return (
                        <Card
                          key={application._id}
                          className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Status Indicator */}
                              <div
                                className={cn(
                                  "w-full md:w-2 h-2 md:h-auto",
                                  application.status === "approved" &&
                                    "bg-emerald-500",
                                  application.status === "rejected" &&
                                    "bg-rose-500",
                                  application.status === "pending" &&
                                    "bg-blue-500",
                                  application.status === "reviewing" &&
                                    "bg-amber-500",
                                )}
                              />

                              <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                      <h3 className="text-xl font-semibold">
                                        {property?.title || "Property"}
                                      </h3>
                                      <Badge
                                        className={cn(
                                          "border",
                                          status.bgColor,
                                          status.color,
                                        )}
                                      >
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {application.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          application.status.slice(1)}
                                      </Badge>
                                    </div>

                                    {/* Property Info */}
                                    {property && (
                                      <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1.5">
                                          <MapPin className="h-4 w-4 text-primary/70" />
                                          <span>
                                            {property.address?.city},{" "}
                                            {property.address?.state}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <DollarSign className="h-4 w-4 text-primary/70" />
                                          <span className="font-semibold text-foreground">
                                            $
                                            {property.pricing?.monthlyRent?.toLocaleString()}
                                            <span className="font-normal text-muted-foreground">
                                              /month
                                            </span>
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-4 w-4 text-primary/70" />
                                          <span>
                                            Applied{" "}
                                            {new Date(
                                              application.createdAt,
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Application Details */}
                                    {application.personalInfo && (
                                      <div className="p-4 bg-muted/50 rounded-xl text-sm space-y-1">
                                        <p className="font-medium mb-2">
                                          Application Details
                                        </p>
                                        <div className="grid sm:grid-cols-3 gap-2">
                                          <div>
                                            <span className="text-muted-foreground">
                                              Occupation:
                                            </span>{" "}
                                            <span className="font-medium">
                                              {
                                                application.personalInfo
                                                  .occupation
                                              }
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">
                                              Employer:
                                            </span>{" "}
                                            <span className="font-medium">
                                              {
                                                application.personalInfo
                                                  .employer
                                              }
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">
                                              Move-in:
                                            </span>{" "}
                                            <span className="font-medium">
                                              {new Date(
                                                application.personalInfo
                                                  .moveInDate,
                                              ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Landlord Notes */}
                                    {application.landlordNotes && (
                                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
                                        <p className="font-medium text-sm text-blue-900 dark:text-blue-400 mb-1">
                                          Landlord Notes
                                        </p>
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                          {application.landlordNotes}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex md:flex-col gap-2">
                                    {property && (
                                      <Link
                                        href={`/properties/${property._id}`}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-2"
                                        >
                                          <Eye className="h-4 w-4" />
                                          View Property
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="py-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <ClipboardList className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No Applications Yet
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start your search for the perfect rental home and submit
                        applications to properties you love.
                      </p>
                      <Link href="/properties">
                        <Button size="lg" className="gap-2">
                          <Search className="h-5 w-5" />
                          Browse Properties
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="leases" className="mt-6">
              <TenantLeasesTab userId={user?._id || ""} />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6" id="maintenance">
              <TenantMaintenanceTab userId={user?._id || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
