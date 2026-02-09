"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLandlordMaintenance } from "@/hooks/useMaintenance";
import { MaintenanceCard } from "@/components/maintenance/MaintenanceCard";
import { MaintenanceStatusUpdate } from "@/components/maintenance/MaintenanceStatusUpdate";
import {
  Wrench,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { User as UserType } from "@/types/maintenance";
import { Property } from "@/types/property";
import { cn } from "@/lib/utils";

const priorityConfig = {
  urgent: {
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    border: "border-rose-200",
  },
  high: {
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    border: "border-orange-200",
  },
  medium: {
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-200",
  },
  low: {
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-200",
  },
};

export default function LandlordMaintenancePage() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useLandlordMaintenance(user?._id || "");

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
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Maintenance
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Service Requests
              </h1>
              <p className="text-muted-foreground text-lg">
                Track and manage maintenance and repair requests from your
                tenants.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-normal bg-background/50 backdrop-blur-sm"
              >
                {requests?.length || 0} Total Requests
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-1/4 bg-muted rounded mb-4" />
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-8 h-48 bg-muted/20" />
                  </Card>
                </div>
              ))}
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-12">
              {requests.map((request) => {
                const tenant = request.tenant as unknown as UserType;
                const property = request.property as unknown as Property;
                const priority =
                  priorityConfig[
                    request.priority as keyof typeof priorityConfig
                  ] || priorityConfig.medium;

                return (
                  <div key={request._id} className="space-y-4 group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-full", priority.bg)}>
                          <AlertTriangle
                            className={cn("h-4 w-4", priority.color)}
                          />
                        </div>
                        <div className="text-sm">
                          <span className="font-bold text-foreground">
                            {property?.title || "Property"}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-muted-foreground inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property?.address?.city},{" "}
                            {property?.address?.state}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>
                            {tenant?.profile?.firstName}{" "}
                            {tenant?.profile?.lastName}
                          </span>
                        </div>
                        <span className="mx-1">•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={cn(
                          "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm bg-linear-to-r",
                          request.priority === "urgent"
                            ? "from-rose-500/20 to-orange-500/20"
                            : "from-primary/10 to-blue-500/10",
                        )}
                      />
                      <div className="relative">
                        <MaintenanceCard
                          request={request}
                          userRole="landlord"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <MaintenanceStatusUpdate
                        maintenanceId={request._id}
                        currentStatus={request.status}
                        currentPriority={request.priority}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
              <CardContent className="p-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Service Requests</h3>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
                  Everything looks good! Any maintenance requests submitted by
                  your tenants will appear here.
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
