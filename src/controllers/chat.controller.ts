import { Request, Response } from 'express';
import Chat, { IChat } from '../models/chatModel';

export const getChatHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch chat history from MongoDB
    const chatHistory: IChat[] = await Chat.find().sort('createdAt').limit(50);
    // console.log(chatHistory);
    res.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Error fetching chat history' });
  }
};

export const saveChatMessage = async (data: IChat): Promise<void> => {
  try {
    // Save the new message to MongoDB
    const newMessage = new Chat(data);
    await newMessage.save();
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};
