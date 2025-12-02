import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId
  channel: string;
  participants: {
    userId: string;
    role: "company" | "investor"
  }[];
  lastMessage: string;
  lastSender: string;
  unread?: boolean;
  timestamps: Date;
}

export interface Iconver {
  _id?: Types.ObjectId
  channel: string;
  participants: {
    userId: string;
     role: "company" | "investor"
  }[];
  lastMessage: string;
  lastSender: string;
  unread?: boolean;
  timestamps: Date;
}

export interface IconversationWithUser {
  _id?: Types.ObjectId
  channel: string;
  participants: {
    userId: string;
     role: "company" | "investor"
  }[];
  lastMessage: string;
  lastSender: string;
  unread?: boolean;
  timestamps: Date;
  userName:string,
  profileImage:string
  unreadCount:string
}

const ConversationSchema = new Schema<IConversation>({
  channel: { type: String, required: true, unique: true },
  participants: [
    {
      userId: { type: String, required: true },
      role: { type: String, enum: ["company", "investor"], required: true },
    },
  ],
  lastMessage: { type: String, default: "" },
  lastSender: { type: String, default: "" },
  unread: {
    type: Map,
    of: Boolean,
    default: {},
  },
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;