import { Server } from 'socket.io';
import chatModel, { IChat } from './src/models/chatModel';

export const configureChatSocket = (io: Server) => {
  io.on('connection', async (socket) => {
    console.log('Socket connected');

    try {
      // Fetch chat history from MongoDB and send it to the connected client
      const chatHistory: IChat[] = await chatModel
        .find()
        .sort('createdAt')
        .limit(50);
      socket.emit('chatHistory', chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }

    socket.on('chat', async (data) => {
      console.log('Received message:', data);

      // Save the chat message to the database
      const newMessage = new chatModel(data);
      await newMessage.save();

      // Send the new message to all connected clients
      io.emit('chatTransfer', data);
    });
  });
};
