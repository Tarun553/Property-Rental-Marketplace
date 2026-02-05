"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTenantLeases } from "@/hooks/useLeases";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Star, AlertCircle } from "lucide-react";
import { CreateReviewPayload } from "@/types/review";

interface ReviewFormProps {
  onSuccess?: () => void;
}

const criteriaLabels: Record<
  string,
  { label: string; roles: ("landlord" | "tenant")[] }
> = {
  communication: { label: "Communication", roles: ["landlord", "tenant"] },
  cleanliness: { label: "Cleanliness", roles: ["landlord", "tenant"] },
  respectfulness: { label: "Respectfulness", roles: ["landlord", "tenant"] },
  responsiveness: { label: "Responsiveness", roles: ["tenant"] },
  propertyCondition: { label: "Property Condition", roles: ["tenant"] },
  paymentTimeliness: { label: "Payment Timeliness", roles: ["landlord"] },
  propertyMaintenance: { label: "Property Maintenance", roles: ["landlord"] },
};

export const ReviewForm = ({ onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const { createReviewAsync, isCreatingReview } = useReviews();
  const { data: leases, isLoading: leasesLoading } = useTenantLeases(
    user?._id || "",
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [criteriaRatings, setCriteriaRatings] = useState<
    Record<string, number>
  >({});

  const { register, handleSubmit, reset } = useForm();

  // Filter leases that are active or signed (reviewable)
  const reviewableLeases =
    leases?.filter(
      (lease) => lease.status === "active" || lease.status === "signed",
    ) || [];

  const selectedLease = reviewableLeases.find(
    (lease) =>
      (typeof lease.property === "object"
        ? lease.property._id
        : lease.property) === selectedPropertyId,
  );

  const revieweeId =
    selectedLease && typeof selectedLease.property === "object"
      ? typeof selectedLease.property.landlord === "object"
        ? selectedLease.property.landlord._id
        : selectedLease.property.landlord
      : "";

  const handleFormSubmit = async (formData: { comment?: string }) => {
    if (!selectedPropertyId || !revieweeId || overallRating === 0) {
      return;
    }

    const payload: CreateReviewPayload = {
      property: selectedPropertyId,
      reviewee: revieweeId,
      reviewerRole: user?.role as "landlord" | "tenant",
      rating: overallRating,
      criteria: criteriaRatings,
      comment: formData.comment,
    };

    try {
      await createReviewAsync(payload);

      // Reset form on success
      setSelectedPropertyId("");
      setOverallRating(0);
      setCriteriaRatings({});
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error("Review submission error:", error);
    }
  };

  const renderStars = (
    currentRating: number,
    onRate: (rating: number) => void,
    hovered: number,
    onHover: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hovered || currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const availableCriteria = Object.entries(criteriaLabels).filter(
    ([_criteriaKey, config]) =>
      config.roles.includes(user?.role as "landlord" | "tenant"),
  );

  if (leasesLoading) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Loading your leases...</p>
      </div>
    );
  }

  if (reviewableLeases.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Properties to Review</h3>
          <p className="text-sm text-muted-foreground">
            You need to have an active or completed lease to write a review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Property Selection */}
      <div>
        <Label htmlFor="property">Select Property *</Label>
        <Select
          value={selectedPropertyId}
          onValueChange={setSelectedPropertyId}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choose a property you've rented" />
          </SelectTrigger>
          <SelectContent>
            {reviewableLeases.map((lease) => {
              const property =
                typeof lease.property === "object" ? lease.property : null;
              if (!property) return null;

              return (
                <SelectItem key={property._id} value={property._id}>
                  {property.title} - {property.address?.city},{" "}
                  {property.address?.state}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {!selectedPropertyId && (
          <p className="text-sm text-muted-foreground mt-1">
            Select a property you&apos;ve rented to review
          </p>
        )}
      </div>

      {selectedPropertyId && (
        <>
          {/* Overall Rating */}
          <div>
            <Label>Overall Rating *</Label>
            <div className="flex items-center gap-3 mt-2">
              {renderStars(
                overallRating,
                setOverallRating,
                hoveredRating,
                setHoveredRating,
              )}
              <span className="text-sm text-muted-foreground">
                {overallRating > 0 && `${overallRating}/5`}
              </span>
            </div>
            {overallRating === 0 && (
              <p className="text-sm text-destructive mt-1">
                Please select an overall rating
              </p>
            )}
          </div>

          {/* Criteria Ratings */}
          <div className="space-y-4">
            <Label>Detailed Ratings</Label>
            {availableCriteria.map(([criteriaKey, config]) => (
              <div
                key={criteriaKey}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{config.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setCriteriaRatings((prev) => ({
                          ...prev,
                          [criteriaKey]: star,
                        }))
                      }
                      className="transition-colors"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= (criteriaRatings[criteriaKey] || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Share your experience with this property and landlord..."
              className="mt-2 min-h-[120px]"
            />
          </div>

          <Button
            type="submit"
            disabled={
              !selectedPropertyId || overallRating === 0 || isCreatingReview
            }
            className="w-full"
          >
            {isCreatingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </>
      )}
    </form>
  );
};
