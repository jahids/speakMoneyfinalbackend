import { Router } from 'express';
import {
  SetConversation,
  allusers,
  getConversation,
  getMessages,
  sendMessage,
} from '../controllers/conversation.controller';

const router = Router();

// API endpoint to fetch chat history
router.post('/api/conversation', SetConversation);
router.get('/api/conversation/:userId', getConversation);

// msg route

router.post('/api/message', sendMessage);
router.get('/api/message/:conversationId', getMessages);
// all chat users
router.get('/api/users/:userId', allusers);

export default router;
