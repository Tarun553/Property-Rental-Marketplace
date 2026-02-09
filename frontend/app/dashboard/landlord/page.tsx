"use client";

"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  useLandlordProperties,
  useDeleteProperty,
} from "@/hooks/useProperties";
import { useLandlordApplications } from "@/hooks/useApplications";
import { useLandlordMaintenance } from "@/hooks/useMaintenance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User as UserType } from "@/types/maintenance";
import { Property } from "@/types/property";

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
  ChevronRight,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useLandlordProperties(
    user?._id || "",
  );
  const { data: applications } = useLandlordApplications(user?._id || "");
  const { data: maintenanceRequests } = useLandlordMaintenance(user?._id || "");
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
    totalApplications: applications?.length || 0,
    totalMaintenance: maintenanceRequests?.length || 0,
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

        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />
                  Landlord Dashboard
                </Badge>
                <Badge
                  variant="outline"
                  className="animate-pulse bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live Sync
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, {user?.profile?.firstName || "Landlord"}!
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Your property portfolio is performing well. Here&apos;s what&apos;s
                happening today.
              </p>
            </div>
            <Link href="/properties/create">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                <Plus className="h-6 w-6" />
                Add New Property
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground transform transition-transform hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-primary-foreground/80 font-medium">
                      Total Properties
                    </p>
                    <p className="text-4xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
                    <Home className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 font-medium">
                  <div className="p-1 rounded-full bg-white/20">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span>{stats.totalViews} total views</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground font-medium">
                      Available
                    </p>
                    <p className="text-4xl font-bold mt-2 text-emerald-600">
                      {stats.available}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/10">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${stats.total > 0 ? (stats.available / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground font-medium">Rented</p>
                    <p className="text-4xl font-bold mt-2 text-blue-600">
                      {stats.rented}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-500/10">
                    <Users className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${stats.total > 0 ? (stats.rented / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground font-medium">
                      Applications
                    </p>
                    <p className="text-4xl font-bold mt-2 text-amber-600">
                      {stats.totalApplications}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-500/10">
                    <FileText className="h-7 w-7 text-amber-600" />
                  </div>
                </div>
                <Link href="/dashboard/landlord/applications" className="group">
                  <div className="mt-6 flex items-center justify-between text-sm text-primary font-semibold">
                    <span>Manage all</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                href: "/dashboard/landlord/applications",
                icon: FileText,
                title: "Applications",
                description: "Review and approve tenants",
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                href: "/messages",
                icon: MessageSquare,
                title: "Messages",
                description: "Communicate with residents",
                color: "bg-emerald-500/10 text-emerald-600",
              },
              {
                href: "/dashboard/landlord/maintenance",
                icon: Wrench,
                title: "Maintenance",
                description: "Handle repair requests",
                color: "bg-rose-500/10 text-rose-600",
              },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 bg-background/40">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
                        action.color,
                      )}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Recent Applications */}
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl overflow-hidden">
              <div className="p-1 w-full bg-linear-to-r from-blue-500/20 to-transparent" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Recent Applications</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        Latest submissions
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/landlord/applications"
                    className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => {
                      const tenant = application.tenant as unknown as UserType;
                      const property = application.property as unknown as Property;

                      return (
                        <div
                          key={application._id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-muted/50 p-5 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate text-lg">
                                {tenant?.profile?.firstName || "Guest"}{" "}
                                {tenant?.profile?.lastName || ""}
                              </p>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                <Building2 className="h-3.5 w-3.5" />
                                <span className="truncate">
                                  {property?.title || "Property"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-semibold capitalize"
                          >
                            {application.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed flex flex-col items-center">
                    <FileText className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      No applications matching your status.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Maintenance */}
            <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl overflow-hidden">
              <div className="p-1 w-full bg-linear-to-r from-rose-500/20 to-transparent" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-rose-500/10">
                      <Wrench className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Recent Requests</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        Maintenance tracking
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/landlord/maintenance"
                    className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {maintenanceRequests && maintenanceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRequests.slice(0, 3).map((request) => {
                      const property = request.property as unknown as Property;

                      return (
                        <div
                          key={request._id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-muted/50 p-5 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform",
                                request.priority === "urgent"
                                  ? "bg-rose-500/10"
                                  : "bg-primary/5",
                              )}
                            >
                              <Wrench
                                className={cn(
                                  "h-6 w-6",
                                  request.priority === "urgent"
                                    ? "text-rose-600"
                                    : "text-primary",
                                )}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate text-lg">
                                {request.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate">
                                  {property?.title}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-3 py-1 font-semibold capitalize",
                              request.status === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100",
                            )}
                          >
                            {request.status.replace("_", " ")}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed flex flex-col items-center">
                    <Wrench className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      No active maintenance requests.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Properties Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Your Properties
                </h2>
                <Badge
                  variant="outline"
                  className="font-bold px-4 py-1 text-base bg-white/50 backdrop-blur-md"
                >
                  {stats.total} total
                </Badge>
              </div>
              <Link href="/properties/create">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-2 hover:bg-primary/5"
                >
                  <Plus className="h-5 w-5" />
                  Add Property
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-background/20 rounded-3xl border border-dashed border-muted-foreground/20">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Home className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                </div>
                <p className="mt-6 text-muted-foreground font-medium text-lg">
                  Curating your property listings...
                </p>
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => {
                  const status =
                    statusConfig[property.availability.status] ||
                    statusConfig.available;
                  const StatusIcon = status.icon;

                  return (
                    <Card
                      key={property._id}
                      className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group rounded-3xl bg-background/40 backdrop-blur-sm"
                    >
                      {/* Property Image */}
                      <div className="relative h-64 bg-muted overflow-hidden">
                        {property.media.photos.length > 0 ? (
                          <Image
                            src={property.media.photos[0]}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/30">
                            <Home className="h-16 w-16 mb-2 opacity-20" />
                            <span className="font-medium">
                              No image provided
                            </span>
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Status Badge */}
                        <Badge
                          className={cn(
                            "absolute top-5 left-5 border-0 backdrop-blur-md font-bold px-4 py-1.5 text-sm shadow-lg",
                            status.color,
                          )}
                        >
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {status.label}
                        </Badge>

                        {/* Actions Menu */}
                        <div className="absolute top-5 right-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 bg-white/90 hover:bg-white border-0 shadow-lg"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 p-2 rounded-2xl shadow-2xl border-0 bg-background/95 backdrop-blur-xl"
                            >
                              <Link href={`/properties/${property._id}`}>
                                <DropdownMenuItem className="rounded-xl h-11 px-4 text-base font-medium">
                                  <ExternalLink className="h-4 w-4 mr-3 text-primary" />
                                  View Public Listing
                                </DropdownMenuItem>
                              </Link>
                              <Link
                                href={`/dashboard/landlord/properties/${property._id}`}
                              >
                                <DropdownMenuItem className="rounded-xl h-11 px-4 text-base font-medium">
                                  <Eye className="h-4 w-4 mr-3 text-blue-600" />
                                  Manage Details
                                </DropdownMenuItem>
                              </Link>
                              <Link
                                href={`/dashboard/landlord/properties/${property._id}/edit`}
                              >
                                <DropdownMenuItem className="rounded-xl h-11 px-4 text-base font-medium">
                                  <Edit className="h-4 w-4 mr-3 text-amber-600" />
                                  Edit Listing
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator className="my-2" />
                              <DropdownMenuItem
                                className="rounded-xl h-11 px-4 text-base font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => handleDeleteClick(property._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Permanently Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Bottom Stats */}
                        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                          {property.stats?.views !== undefined && (
                            <Badge
                              variant="secondary"
                              className="bg-black/40 text-white border-0 backdrop-blur-md px-3 font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              {property.stats.views} views
                            </Badge>
                          )}
                          {property.stats?.applications !== undefined && (
                            <Badge
                              variant="secondary"
                              className="bg-black/40 text-white border-0 backdrop-blur-md px-3 font-semibold"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              {property.stats.applications} apps
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Property Info */}
                      <CardContent className="p-8">
                        <div className="mb-6">
                          <Link
                            href={`/dashboard/landlord/properties/${property._id}`}
                          >
                            <h3 className="font-bold text-2xl line-clamp-1 hover:text-primary transition-colors mb-2">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 text-muted-foreground font-medium">
                            <div className="p-1 rounded-full bg-primary/10">
                              <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <span className="line-clamp-1">
                              {property.address.city}, {property.address.state}
                            </span>
                          </div>
                        </div>

                        {/* Property Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-muted/50">
                          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl">
                            <div className="p-2 rounded-xl bg-background shadow-sm">
                              <Bed className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xl font-bold leading-none">
                                {property.details.bedrooms}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                                Beds
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl">
                            <div className="p-2 rounded-xl bg-background shadow-sm">
                              <Bath className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xl font-bold leading-none">
                                {property.details.bathrooms}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                                Baths
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-3xl font-black text-primary tracking-tight">
                              ${property.pricing.monthlyRent.toLocaleString()}
                              <span className="text-sm font-bold text-muted-foreground ml-1">
                                /mo
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}/edit`}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-xl border-2 hover:bg-primary/5 transition-colors"
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/landlord/properties/${property._id}`}
                            >
                              <Button className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
                                Manage
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-2xl bg-background/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="py-32 text-center relative">
                  <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
                  <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Home className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-4xl font-black mb-4 tracking-tight">
                    Start Your Portfolio
                  </h3>
                  <p className="text-muted-foreground mb-10 text-xl max-w-xl mx-auto leading-relaxed">
                    List your first property today and start reaching thousands
                    of potential tenants in minutes.
                  </p>
                  <Link href="/properties/create">
                    <Button
                      size="lg"
                      className="h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 gap-3"
                    >
                      <Plus className="h-7 w-7" />
                      Create First Listing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl max-w-md">
            <DialogHeader>
              <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="h-8 w-8 text-destructive" />
              </div>
              <DialogTitle className="text-center text-2xl font-black">
                Delete Listing?
              </DialogTitle>
              <DialogDescription className="text-center text-lg mt-2">
                This action is permanent. All tenant applications and historical
                data for this property will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 mt-8 flex-row justify-center sm:justify-center">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-xl border-2 font-bold"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-destructive/20"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 mr-3" />
                    Delete Now
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
