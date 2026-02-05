"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  useLandlordProperties,
  useDeleteProperty,
} from "@/hooks/useProperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Loader2,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";

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
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete property",
        );
      }
    }
  };

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">
                Welcome, {user?.profile?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your properties and applications
              </p>
            </div>
            <Link href="/properties/create">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{properties?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {properties?.filter(
                    (p) => p.availability.status === "available",
                  ).length || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rented</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {properties?.filter((p) => p.availability.status === "rented")
                    .length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Properties List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Properties</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card
                    key={property._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {property.media.photos.length > 0 ? (
                        <Image
                          src={property.media.photos[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-blue-600">
                        {property.availability.status}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {property.address.city}, {property.address.state}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-gray-600" />
                          <span>{property.details.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-gray-600" />
                          <span>{property.details.bathrooms}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                        <DollarSign className="h-5 w-5" />
                        <span>
                          {property.pricing.monthlyRent.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Link
                          href={`/dashboard/landlord/properties/${property._id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                          >
                            Manage
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/landlord/properties/${property._id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(property._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t listed any properties yet.
                  </p>
                  <Link href="/properties/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
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
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this property? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
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
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
