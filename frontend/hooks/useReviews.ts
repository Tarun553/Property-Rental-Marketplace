"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Review, CreateReviewPayload, ReviewResponsePayload } from "@/types/review";
import { toast } from "sonner";

export const useReviews = () => {
  const queryClient = useQueryClient();

  // Fetch property reviews
  const usePropertyReviews = (propertyId: string | undefined) => {
    return useQuery<Review[]>({
      queryKey: ["reviews", "property", propertyId],
      queryFn: async () => {
        const { data } = await api.get(`/reviews/property/${propertyId}`);
        return data;
      },
      enabled: !!propertyId,
    });
  };

  // Fetch user reviews (reviews about this user)
  const useUserReviews = (userId: string | undefined) => {
    return useQuery<Review[]>({
      queryKey: ["reviews", "user", userId],
      queryFn: async () => {
        const { data } = await api.get(`/reviews/user/${userId}`);
        return data;
      },
      enabled: !!userId,
    });
  };

  // Fetch reviews written by the user
  const useWrittenReviews = (userId: string | undefined) => {
    return useQuery<Review[]>({
      queryKey: ["reviews", "written", userId],
      queryFn: async () => {
        const { data } = await api.get(`/reviews/written/${userId}`);
        return data;
      },
      enabled: !!userId,
    });
  };

  // Create review mutation
  const createReview = useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const { data } = await api.post("/reviews", payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", "property", variables.property] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "user", variables.reviewee] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "written"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  // Respond to review mutation
  const respondToReview = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: ReviewResponsePayload }) => {
      const { data } = await api.put(`/reviews/${reviewId}/response`, response);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Response added successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add response");
    },
  });

  return {
    usePropertyReviews,
    useUserReviews,
    useWrittenReviews,
    createReview: createReview.mutate,
    createReviewAsync: createReview.mutateAsync,
    isCreatingReview: createReview.isPending,
    respondToReview: respondToReview.mutate,
    respondToReviewAsync: respondToReview.mutateAsync,
    isRespondingToReview: respondToReview.isPending,
  };
};
