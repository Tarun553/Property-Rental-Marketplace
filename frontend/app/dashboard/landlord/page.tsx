"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  useLandlordProperties,
  useDeleteProperty,
} from "@/hooks/useProperties";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Loader2,
  MapPin,
  Bed,
  Bath,
  Edit,
  Trash2,
  Home,
  TrendingUp,
  Users,
  Eye,
  MoreVertical,
  ExternalLink,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useLandlordProperties(
    user?._id || "",
  );
  const deleteMutation = useDeleteProperty();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const handleDeleteClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPropertyId) {
      try {
        await deleteMutation.mutateAsync(selectedPropertyId);
        toast.success("Property deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedPropertyId(null);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || "Failed to delete property");
      }
    }
  };

  const stats = {
    total: properties?.length || 0,
    available:
      properties?.filter((p) => p.availability.status === "available").length ||
      0,
    rented:
      properties?.filter((p) => p.availability.status === "rented").length || 0,
    pending:
      properties?.filter((p) => p.availability.status === "pending").length ||
      0,
    totalViews:
      properties?.reduce((sum, p) => sum + (p.stats?.views || 0), 0) || 0,
    totalApplications:
      properties?.reduce((sum, p) => sum + (p.stats?.applications || 0), 0) ||
      0,
  };

  const statusConfig: Record<
    string,
    { color: string; icon: React.ElementType; label: string }
  > = {
    available: {
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2,
      label: "Available",
    },
    rented: {
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Users,
      label: "Rented",
    },
    pending: {
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: Clock,
      label: "Pending",
    },
  };

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
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
                  <Building2 className="h-3 w-3 mr-1" />
                  Landlord Dashboard
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {user?.profile?.firstName || "Landlord"}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your properties, applications, and tenants all in one
                place.
              </p>
            </div>
            <Link href="/properties/create">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                <Plus className="h-5 w-5" />
                Add New Property
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
                      Total Properties
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-muted-foreground">
                    {stats.totalViews} total views
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Available
                    </p>
                    <p className="text-3xl font-bold mt-1 text-emerald-600">
                      {stats.available}
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
                        width: `${stats.total > 0 ? (stats.available / stats.total) * 100 : 0}%`,
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
                      Rented
                    </p>
                    <p className="text-3xl font-bold mt-1 text-blue-600">
                      {stats.rented}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${stats.total > 0 ? (stats.rented / stats.total) * 100 : 0}%`,
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
                      Applications
                    </p>
                    <p className="text-3xl font-bold mt-1 text-amber-600">
                      {stats.totalApplications}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <Link href="/dashboard/landlord/applications">
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline">
                    View all applications
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/landlord/applications">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Applications</p>
                    <p className="text-sm text-muted-foreground">
                      Review tenant applications
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
                      Chat with tenants
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/landlord/maintenance">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Maintenance</p>
                    <p className="text-sm text-muted-foreground">
                      Handle repair requests
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Properties Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">My Properties</h2>
                <Badge variant="secondary" className="font-normal">
                  {stats.total} total
                </Badge>
              </div>
              <Link href="/properties/create">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Home className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 text-muted-foreground">
                  Loading properties...
                </p>
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const status =
                    statusConfig[property.availability.status] ||
                    statusConfig.available;
                  const StatusIcon = status.icon;

                  return (
                    <Card
                      key={property._id}
                      className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all group"
                    >
                      {/* Property Image */}
                      <div className="relative h-48 bg-muted">
                        {property.media.photos.length > 0 ? (
                          <Image
                            src={property.media.photos[0]}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Home className="h-12 w-12 mb-2 opacity-50" />
                            <span className="text-sm">No image</span>
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        {/* Status Badge */}
                        <Badge
                          className={cn(
                            "absolute top-3 left-3 border backdrop-blur-sm font-medium",
                            status.color,
                          )}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/properties/${property._id}`}>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Listing
                              </DropdownMenuItem>
                            </Link>
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}`}
                            >
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Manage
                              </DropdownMenuItem>
                            </Link>
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}/edit`}
                            >
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(property._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Bottom Stats */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                          {property.stats?.views !== undefined &&
                            property.stats.views > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-black/50 text-white border-0 backdrop-blur-sm"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {property.stats.views}
                              </Badge>
                            )}
                          {property.stats?.applications !== undefined &&
                            property.stats.applications > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-black/50 text-white border-0 backdrop-blur-sm"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                {property.stats.applications} apps
                              </Badge>
                            )}
                        </div>
                      </div>

                      {/* Property Info */}
                      <CardContent className="p-5">
                        <div className="mb-4">
                          <Link
                            href={`/dashboard/landlord/properties/${property._id}`}
                          >
                            <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 text-primary/70" />
                            <span className="line-clamp-1">
                              {property.address.city}, {property.address.state}
                            </span>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
                          <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <Bed className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">
                              {property.details.bedrooms}
                            </span>
                            <span className="text-xs">Beds</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <Bath className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">
                              {property.details.bathrooms}
                            </span>
                            <span className="text-xs">Baths</span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              ${property.pricing.monthlyRent.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground">
                                /mo
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}/edit`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}`}
                            >
                              <Button size="sm">Manage</Button>
                            </Link>
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
                    <Home className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Properties Yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start building your rental portfolio by listing your first
                    property.
                  </p>
                  <Link href="/properties/create">
                    <Button size="lg" className="gap-2">
                      <Plus className="h-5 w-5" />
                      Create Your First Property
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this property? This action
                cannot be undone and all associated data will be permanently
                removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
