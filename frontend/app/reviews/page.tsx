"use client";

import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewForm } from "@/components/review/ReviewForm";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ReviewsPage = () => {
  const { user } = useAuth();
  const {
    useUserReviews,
    useWrittenReviews,
    respondToReviewAsync,
    isRespondingToReview,
  } = useReviews();

  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  // Fetch user reviews (reviews about this user)
  const { data: userReviews, isLoading: reviewsLoading } = useUserReviews(
    user?._id,
  );

  // Fetch reviews written by this user
  const { data: writtenReviews, isLoading: writtenReviewsLoading } = useWrittenReviews(
    user?._id,
  );

  const handleRespond = async (reviewId: string, response: string) => {
    try {
      await respondToReviewAsync({ reviewId, response: { response } });
    } catch (error) {
      console.error("Failed to respond to review:", error);
    }
  };

  const averageRating =
    userReviews && userReviews.length > 0
      ? (
          userReviews.reduce((sum, review) => sum + review.rating, 0) /
          userReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Reviews</h1>
            {user?.role === "tenant" && (
              <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience with a property you&apos;ve rented
                    </DialogDescription>
                  </DialogHeader>
                  <ReviewForm onSuccess={() => setOpenReviewDialog(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-muted-foreground">
            Manage and respond to reviews about your rental experiences
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">{averageRating}</span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">
                  {userReviews?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Reviews About Me</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">
                  {writtenReviews?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Reviews I&apos;ve Written
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="received">Reviews About Me</TabsTrigger>
            <TabsTrigger value="written">Reviews I Wrote</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6">
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : userReviews && userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onRespond={handleRespond}
                    isResponding={isRespondingToReview}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Reviews from landlords and tenants will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="written" className="mt-6">
            {writtenReviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : writtenReviews && writtenReviews.length > 0 ? (
              <div className="space-y-4">
                {writtenReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    showProperty={true}
                    isOwnReview={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No reviews written yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {user?.role === "tenant" 
                      ? "You can write reviews for properties you've rented"
                      : "You can write reviews for tenants who have rented your properties"
                    }
                  </p>
                  {user?.role === "tenant" && (
                    <Button onClick={() => setOpenReviewDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Write Your First Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default ReviewsPage;
