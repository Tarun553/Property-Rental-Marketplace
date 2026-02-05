export interface ReviewCriteria {
  communication?: number;
  cleanliness?: number;
  respectfulness?: number;
  responsiveness?: number;
  propertyCondition?: number;
  paymentTimeliness?: number;
  propertyMaintenance?: number;
}

export interface Review {
  _id: string;
  reviewer: {
    _id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  reviewee: string;
  property: {
    _id: string;
    title: string;
    address?: {
      city: string;
      state: string;
    };
  };
  lease?: string;
  reviewerRole: "landlord" | "tenant";
  rating: number;
  criteria: ReviewCriteria;
  comment?: string;
  response?: string;
  helpful: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateReviewPayload {
  property: string;
  reviewee: string;
  reviewerRole: "landlord" | "tenant";
  rating: number;
  criteria: ReviewCriteria;
  comment?: string;
  lease?: string;
}

export interface ReviewResponsePayload {
  response: string;
}
