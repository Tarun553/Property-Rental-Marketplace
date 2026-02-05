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
import Link from "next/link";
import { Loader2, MapPin, Calendar, DollarSign } from "lucide-react";

// Tenant Leases Tab Component
function TenantLeasesTab({ userId }: { userId: string }) {
  const { data: leases, isLoading } = useTenantLeases(userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Leases</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          </CardContent>
        </Card>
      ) : leases && leases.length > 0 ? (
        <div className="grid gap-4">
          {leases.map((lease) => (
            <LeaseCard key={lease._id} lease={lease} userRole="tenant" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-2">No leases yet.</p>
            <p className="text-sm text-gray-500">
              Your leases will appear here once approved by a landlord.
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
    (lease) => lease.status === "active" || lease.status === "pending_signatures",
  )?.property;

  const propertyId =
    typeof activeProperty === "object" ? activeProperty?._id : activeProperty;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>
        {propertyId && <MaintenanceRequestForm propertyId={propertyId} />}
      </div>

      {!propertyId && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-2">
              You need an active lease to submit maintenance requests.
            </p>
            <p className="text-sm text-gray-500">
              Once you have an active lease, you can submit maintenance requests
              here.
            </p>
          </CardContent>
        </Card>
      )}

      {propertyId && (
        <>
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              </CardContent>
            </Card>
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
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600 mb-4">
                  No maintenance requests yet.
                </p>
                <p className="text-sm text-gray-500">
                  Submit a request using the button above for any issues with
                  your rental.
                </p>
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

  return (
    <ProtectedRoute allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {user?.profile?.firstName}!
            </h1>
            <p className="text-gray-600">
              Track your applications and find your next home
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {applications?.length || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {applications?.filter(
                    (a) => a.status === "pending" || a.status === "reviewing",
                  ).length || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {applications?.filter((a) => a.status === "approved")
                    .length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Interface */}
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">My Applications</TabsTrigger>
              <TabsTrigger value="leases">My Leases</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Applications</h2>
                <Link href="/properties">
                  <Button>Browse Properties</Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const property = application.property as any; // Property is populated
                    return (
                      <Card
                        key={application._id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold">
                                  {property?.title || "Property"}
                                </h3>
                                <Badge
                                  className={getStatusColor(application.status)}
                                >
                                  {application.status}
                                </Badge>
                              </div>

                              {property && (
                                <div className="space-y-2 text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                      {property.address?.city},{" "}
                                      {property.address?.state}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-semibold">
                                      $
                                      {property.pricing?.monthlyRent?.toLocaleString()}
                                      /month
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Applied on{" "}
                                  {new Date(
                                    application.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {application.personalInfo && (
                                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                                  <p className="font-semibold mb-1">
                                    Application Details:
                                  </p>
                                  <p className="text-gray-600">
                                    Occupation:{" "}
                                    {application.personalInfo.occupation}
                                  </p>
                                  <p className="text-gray-600">
                                    Employer:{" "}
                                    {application.personalInfo.employer}
                                  </p>
                                  <p className="text-gray-600">
                                    Move-in Date:{" "}
                                    {new Date(
                                      application.personalInfo.moveInDate,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {application.landlordNotes && (
                                <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                                  <p className="font-semibold text-sm text-blue-900 mb-1">
                                    Landlord Notes:
                                  </p>
                                  <p className="text-sm text-blue-800">
                                    {application.landlordNotes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              {property && (
                                <Link href={`/properties/${property._id}`}>
                                  <Button variant="outline" size="sm">
                                    View Property
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600 mb-4">
                      You haven't submitted any applications yet.
                    </p>
                    <Link href="/properties">
                      <Button>Browse Properties</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="leases" className="mt-6">
              <TenantLeasesTab userId={user?._id || ""} />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6">
              <TenantMaintenanceTab userId={user?._id || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
