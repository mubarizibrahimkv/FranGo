export type Role = "customer" | "investor" | "company" | "admin";

export type Payment = {
  amount: number;
  type: "advance" | "subscription";
  method: "razorpay";
};

export type INotification = {
  _id: string;
  userId: string;
  isRead: boolean;
  message: string;
  createdAt: string;
};

export interface IconversationWithUser {
  _id?: string;
  channel: string;
  participants: {
    userId: string;
    role: "company" | "investor";
  }[];
  lastMessage: string;
  lastSender: string;
  unread?: boolean;
  timestamps: Date;
  userName?: string;
  profileImage?: string;
  unreadCount: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  _id: string;
  channel: string;
  senderId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
