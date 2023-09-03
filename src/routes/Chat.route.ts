import { Router } from 'express';
import { getChatHistory } from '../controllers/chat.controller';

const router = Router();

// API endpoint to fetch chat history
router.get('/api/chat-history', getChatHistory);

export default router;
