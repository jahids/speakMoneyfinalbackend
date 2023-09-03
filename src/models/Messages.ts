import { Timestamp } from 'mongodb';
import { InferSchemaType, Schema, model } from 'mongoose';

// one login user id , and secound is target  person chat user id
const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

type msg = InferSchemaType<typeof MessageSchema>;

const Message = model<msg>('Message', MessageSchema);
export default Message;
