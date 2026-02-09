"use client";

import {
  MaintenanceRequest,
  MaintenancePriority,
  MaintenanceCategory,
} from "@/types/maintenance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Zap,
  Wind,
  Home,
  Bug,
  AlertCircle,
  Calendar,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
  onViewDetails?: (requestId: string) => void;
  userRole?: "landlord" | "tenant";
}

export function MaintenanceCard({
  request,
  onViewDetails,
}: MaintenanceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "in_progress":
        return "bg-blue-600";
      case "acknowledged":
        return "bg-yellow-600";
      case "submitted":
        return "bg-orange-600";
      case "cancelled":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case MaintenancePriority.URGENT:
        return "text-red-600 bg-red-50";
      case MaintenancePriority.HIGH:
        return "text-orange-600 bg-orange-50";
      case MaintenancePriority.MEDIUM:
        return "text-yellow-600 bg-yellow-50";
      case MaintenancePriority.LOW:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: MaintenanceCategory) => {
    const iconClass = "h-5 w-5";
    switch (category) {
      case MaintenanceCategory.PLUMBING:
        return <Wrench className={iconClass} />;
      case MaintenanceCategory.ELECTRICAL:
        return <Zap className={iconClass} />;
      case MaintenanceCategory.HVAC:
        return <Wind className={iconClass} />;
      case MaintenanceCategory.STRUCTURAL:
        return <Home className={iconClass} />;
      case MaintenanceCategory.PEST_CONTROL:
        return <Bug className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              {getCategoryIcon(request.category)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{request.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {request.description}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Badge
            variant="outline"
            className={getPriorityColor(request.priority)}
          >
            <ArrowUp className="h-3 w-3 mr-1" />
            {request.priority}
          </Badge>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>

          <Badge variant="secondary" className="capitalize">
            {request.category.replace("_", " ")}
          </Badge>
        </div>

        {request.photos.length > 0 && (
          <div className="flex gap-2 mb-4">
            {request.photos.slice(0, 3).map((photo, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded overflow-hidden bg-gray-100"
              >
                <Image
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  priority
                  width={64}
                  height={64}
                />
              </div>
            ))}
            {request.photos.length > 3 && (
              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                +{request.photos.length - 3}
              </div>
            )}
          </div>
        )}

        {request.landlordResponse && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Landlord Response:
            </p>
            <p className="text-sm text-blue-800">{request.landlordResponse}</p>
          </div>
        )}

        {onViewDetails && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(request._id)}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
