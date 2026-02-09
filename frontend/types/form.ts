import { UseFormReturn } from "react-hook-form";

export interface PropertyFormValues {
  title: string;
  description: string;
  type: "apartment" | "house" | "condo" | "commercial" | "other";
  address: {
    street?: string;
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
    virtualTourUrl?: string;
  };
  availability: {
    status: "available" | "rented" | "pending";
    availableFrom?: string;
    leaseDuration?: number;
  };
}

export interface PropertyFormProps {
  form: UseFormReturn<PropertyFormValues>;
}
