export interface Application {
  _id: string;
  property: string;
  tenant: string;
  landlord: string;

  personalInfo: {
    occupation: string;
    employer: string;
    annualIncome: number;
    moveInDate: string | Date;
  };

  references: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;

  documents: Array<{
    type: string;
    url: string;
    name: string;
  }>;

  status:
    | "pending"
    | "reviewing"
    | "approved"
    | "rejected"
    | "withdrawn"
    | "cancelled";
  landlordNotes?: string;
  additionalInfo?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationFormData {
  property: string;
  personalInfo: {
    occupation: string;
    employer: string;
    annualIncome: number;
    moveInDate: string | Date;
  };
  references: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  additionalInfo?: string;
}
