import { RequestHandler } from "express";
import UserModel from "../models/user";

 export const getAlluser : RequestHandler = async (req,res,next) => {
    try {
        const user = await UserModel.find({role : "user"})
        return res.json({
            alluser : user
        })
    } catch (error) {
        res.send("server error")
        console.log(error);
    }
}

export const MakeAdmin: RequestHandler = async (req, res, next) => {
    const { role, id } = req?.body;
    try {
      const updateuser = await UserModel.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );
  
      if (!updateuser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      return res.json({
        msg: updateuser,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Error updating user" });
    }
  };