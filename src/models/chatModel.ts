import mongoose, { Document } from 'mongoose';

export interface IChat extends Document {
  username: string;
  message: string;
  createdAt: Date;
}

const chatSchema = new mongoose.Schema({
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model<IChat>('LCHAT', chatSchema);

export default Chat;
