"use client";

import { Review } from "@/types/review";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ReviewCardProps {
  review: Review;
  onRespond?: (reviewId: string, response: string) => void;
  isResponding?: boolean;
  showProperty?: boolean;
  isOwnReview?: boolean;
}

export const ReviewCard = ({ 
  review, 
  onRespond, 
  isResponding,
  showProperty = true,
  isOwnReview = false,
}: ReviewCardProps) => {
  const { user } = useAuth();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");

  const canRespond = user?._id === review.reviewee && !review.response && !isOwnReview;

  const handleSubmitResponse = () => {
    if (responseText.trim() && onRespond) {
      onRespond(review._id, responseText.trim());
      setResponseText("");
      setShowResponseForm(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={review.reviewer.profile.avatar} />
              <AvatarFallback>
                {review.reviewer.profile.firstName[0]}
                {review.reviewer.profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">
                {isOwnReview ? "Your Review" : (
                  <>
                    {review.reviewer.profile.firstName}{" "}
                    {review.reviewer.profile.lastName}
                  </>
                )}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-muted-foreground">
                  {review.rating}/5
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {review.reviewerRole === "landlord" ? "Landlord" : "Tenant"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Info */}
        {showProperty && review.property && (
          <div className="text-sm">
            <span className="text-muted-foreground">Property: </span>
            <span className="font-medium">{review.property.title}</span>
            {review.property.address && (
              <span className="text-muted-foreground">
                {" "}
                - {review.property.address.city}, {review.property.address.state}
              </span>
            )}
          </div>
        )}

        {/* Comment */}
        {review.comment && (
          <p className="text-sm">{review.comment}</p>
        )}

        {/* Criteria Ratings */}
        {review.criteria && Object.keys(review.criteria).length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium">Detailed Ratings:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(review.criteria).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(value as number)}
                      <span className="text-xs">{value}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Response */}
        {review.response && (
          <div className="bg-muted p-3 rounded-lg mt-4">
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm font-medium">
                {isOwnReview ? "Response received:" : "Response from reviewee:"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{review.response}</p>
          </div>
        )}

        {/* Response Form */}
        {canRespond && !showResponseForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResponseForm(true)}
            className="mt-2"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Respond
          </Button>
        )}

        {showResponseForm && (
          <div className="space-y-2 mt-4">
            <Textarea
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitResponse}
                disabled={!responseText.trim() || isResponding}
                size="sm"
              >
                {isResponding ? "Submitting..." : "Submit Response"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowResponseForm(false);
                  setResponseText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
