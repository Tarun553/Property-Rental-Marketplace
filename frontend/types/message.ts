export interface Message {
  sender: string | { _id: string; profile: { firstName: string; lastName: string; avatar?: string } };
  content: string;
  read: boolean;
  timestamp: Date | string;
  _id?: string;
}

export interface MessageThread {
  _id: string;
  conversationId: string;
  participants: Array<{
    _id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }>;
  messages: Message[];
  relatedProperty?: {
    _id: string;
    title: string;
  };
  lastMessageAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  recipientId: string;
  propertyId?: string;
}
