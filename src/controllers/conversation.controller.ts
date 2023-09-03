// setconversation

import { RequestHandler } from 'express';
import conversationModel from '../models/conversion';
import UserModel from '../models/user';
import MessageModel from '../models/Messages';

export const SetConversation: RequestHandler = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log(senderId, receiverId);

    const newConversation = new conversationModel({
      members: [senderId, receiverId],
    });
    await newConversation.save();

    res.status(200).send(`conversation created success`);
  } catch (error) {
    console.log(error);
  }
};

export const getConversation: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await conversationModel.find({
      members: { $in: [userId] },
    });

    const receiverIds = await Promise.all(
      conversations.map(async (item, index) => {
        const memberIds: string[] = item?.members || [];
        const receiverId = memberIds.find((id) => id !== userId);
        if (receiverId) {
          const userDetails = await UserModel.findById(receiverId);
          console.log(userDetails);

          const reciverDataStyle = {
            user: {
              reciverId: userDetails?._id,
              email: userDetails?.email,
              fullName: userDetails?.username,
              role: userDetails?.role,
            },
            conversationId: item?._id, // Access the specific conversationId for this conversation object.
          };
          return reciverDataStyle; // Return the reciverDataStyle object.
        }
        return null;
      })
    );

    res.status(200).send(receiverIds);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

// all message controler
// post messae
export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = '' } = req.body;
    console.log('check msg body', req.body);
    if (!senderId || !message) return res.status(200).json('fill the all');

    if (conversationId === 'new' && receiverId) {
      const newConversation = new conversationModel({
        members: [senderId, receiverId],
      });

      await newConversation.save();
      const newMessage = new MessageModel({
        conversationId: newConversation?._id,
        senderId,
        message,
      });
      await newMessage.save();
      res.status(200).send('cretae convo message send successfullly');
    } else if (!conversationId && !receiverId) {
      res.status(200).json('fill the all');
    }

    const newMessage = new MessageModel({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send('message send successfullly');
  } catch (error) {
    console.log(error);
  }
};

// get all msg
export const getMessages: RequestHandler = async (req, res) => {
  try {
    // check msg function
    const checkmsg = async (conversationId: any) => {
      const message = await MessageModel.find({ conversationId });
      const msgUserData = await Promise.all(
        message.map(async (item) => {
          const user = await UserModel.findById(item?.senderId);
          return {
            user: {
              id: user?._id,
              email: user?.email,
              fullName: user?.username,
              role: user?.role,
            },
            message: item?.message,
          };
        })
      );
      res.status(200).send(msgUserData);
    };

    const { conversationId } = req.params;
    if (conversationId === 'new') {
      const checkConversation = await conversationModel.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkmsg(checkConversation[0]?._id);
      } else {
        return res.json([]);
      }
    } else {
      checkmsg(conversationId);
    }
  } catch (error) {
    console.log(error);
  }
};

export const allusers: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await UserModel.find({ _id: { $ne: userId } });
    const userData = await Promise.all(
      users.map(async (item) => {
        return {
          user: {
            email: item?.email,
            fullName: item?.username,
            role: item?.role,
            receiverId: item?._id,
          },
        };
      })
    );
    res.status(200).send(userData);
  } catch (error) {
    console.log(error);
  }
};
