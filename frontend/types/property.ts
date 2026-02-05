export interface Property {
  _id: string;
  landlord:
    | string
    | {
        _id: string;
        profile: {
          firstName: string;
          lastName: string;
          avatar?: string;
        };
        email: string;
      };
  title: string;
  description: string;
  type: "apartment" | "house" | "condo" | "commercial" | "other";

  address: {
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  pricing: {
    monthlyRent: number;
    securityDeposit?: number;
    utilitiesIncluded: boolean;
  };

  details: {
    bedrooms: number;
    bathrooms: number;
    size?: number;
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };

  amenities: string[];

  media: {
    photos: string[];
    virtualTourUrl?: string;
  };

  availability: {
    status: "available" | "rented" | "pending";
    availableFrom?: Date;
    leaseDuration?: number;
  };

  stats: {
    views: number;
    applications: number;
    averageRating: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFilters {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: Property["type"];
  petsAllowed?: boolean;
  furnished?: boolean;
  status?: Property["availability"]["status"];
  search?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pages: number;
}
