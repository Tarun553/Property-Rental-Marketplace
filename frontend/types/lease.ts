export interface LeaseTerms {
  startDate: string | Date;
  endDate: string | Date;
  monthlyRent: number;
  securityDeposit: number;
  paymentDueDate: number; // Day of month (1-31)
}

export interface LeaseResponsibilities {
  landlord: string[];
  tenant: string[];
}

export interface LeaseSignature {
  signedBy: string; // User ID
  signedAt: Date;
  signatureData: string;
}

export interface Lease {
  _id: string;
  property: string | any; // Property ID or populated property
  landlord: string | any; // User ID or populated user
  tenant: string | any; // User ID or populated user
  terms: LeaseTerms;
  responsibilities: LeaseResponsibilities;
  status: "draft" | "pending_signatures" | "active" | "expired" | "terminated";
  signatures?: {
    landlord?: {
      signed: boolean;
      signatureData: string;
      signedAt: Date;
    };
    tenant?: {
      signed: boolean;
      signatureData: string;
      signedAt: Date;
    };
  };
  // Legacy support for old structure
  landlordSignature?: LeaseSignature;
  tenantSignature?: LeaseSignature;
  document?: {
    url: string;
    publicId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaseData {
  property: string;
  tenant: string;
  terms: LeaseTerms;
  responsibilities: LeaseResponsibilities;
}

export interface SignLeaseData {
  signatureData: string;
}
