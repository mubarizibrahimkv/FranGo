import { Schema, Types, Document, model } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}


const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
