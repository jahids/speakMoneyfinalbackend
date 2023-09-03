import express from "express";
import "dotenv/config";
import noteRoute from "./routes/note.route";
import cors from "cors";
import userRoute from "./routes/user.route";
// import env from "./utils/ValidateEnv";
import cookieParser from "cookie-parser";
import adminroute from "./routes/Admin.route";
import autheticauser from "./utils/VarifyToken";
import conversationRoute from "./routes/conversation.route";
import smroute from "./routes/speak.user.route";
import speakTransaction from "./routes/Transaction.route";
const app = express();
// import { createServer } from "http";
//import { Server, Socket } from "socket.io";

// const httpServer = createServer();
// Pass the HTTP server to the Socket.IO server
// const io = new Server(httpServer, {
// 	cors: {
// 		origin: "*",
// 	},
// });

// interface socketusers {
// 	id: string;
// 	socketId: string;
// }

// socket

// let users: socketusers[] = [];
// io.on('connection', (socket: Socket) => {
//   socket.on('addUser', (data) => {
//     const existuser = users.find((item) => item.id === data);

//     if (!existuser) {
//       const user: socketusers = { id: data, socketId: socket.id };
//       users.push(user);
//       io.emit('getUsers', users);
//     }
//     console.log('user connected', data);
//   });

//   socket.on('sendMessage', ({ conversationId, senderId, message, receiverId }) => {
//     // online aca ki nah recervier id check
//     console.log('socket peramitar rcv', receiverId);
//     const receiver = users.find((item) => item.id === receiverId);
//     console.log('reciver', receiver, 'users', users);
//     if (receiver) {
//       io.to(receiver.socketId).emit('getMessage', {
//         conversationId,
//         senderId,
//         message,
//         receiverId,
//       });
//     }
//   });

//   // disconnect code
//   socket.on('disconnect', () => {
//     users.filter((item) => item.socketId !== socket.id);
//     io.emit('getUsers', users);
//   });
// });

// socket

app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true, // Allow credentials (cookies)
	})
);

app.use(express.json());
app.use("/", speakTransaction);
app.use("/", smroute);

app.use("/c", conversationRoute);
app.use("/", userRoute);
app.use(autheticauser);
app.use("/api/notes", noteRoute);
app.use("/", adminroute);

// app.use((req, res, next) => {
//   next(Error('endpoint not found'));
// });

// httpServer.listen(8080, () => {
//   console.log(`Server listening on port 8080`);
// });

export default app;
