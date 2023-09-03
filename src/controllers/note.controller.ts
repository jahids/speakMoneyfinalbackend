import { RequestHandler } from "express"
import NoteModel from "../models/notes"


export const  getNotes : RequestHandler = async (req, res, next)=> {
    try {
       const data = await NoteModel.find({}).exec();
         res.status(200).json({
           data : "show all data",
           c : data
         })
    } catch (error) {
       next(error)
    }
   }

   export const createNote : RequestHandler =  async(req, res, next) => {
    const {title, text} = req.body
    try {
        const createNewData = await NoteModel.create({
            title : title,
            text : text
        })
        res.status(201).json({
            message : "new data created",
            data : createNewData
        })
    } catch (error) {
        
    }
   }

 export const singleNote : RequestHandler = async (req, res, next) => {
    const {id} = req.params
    try {
        const singleData = await NoteModel.findById(id);
        res.status(200).json(singleData)
    } catch (e) {
        console.log(e);
    }
 }


 export const updatedNote :RequestHandler = async(req, res, next) => {
   const {id} = req.params;
   const {title, text} = req.body;
    try {
        const NewupdateNote = {
            title : title,
            text : text
        }
        const updated = await NoteModel.findByIdAndUpdate(id,NewupdateNote )
        res.json({
            data : updated,
            message  : "data updated"
        })
    } catch (error) {
        console.log(error);
        res.json("server error")
        
    }
 }

 export const deleteNote : RequestHandler = async (req, res, next) => {
    const {id} = req.params
   try {
      const deletedData = await NoteModel.findByIdAndDelete(id)
      res.status(200).json({
        message : "delete successfully",
        data : deleteNote
      })
   } catch (error) {
    console.log(error);
    res.json("server error")
   }
 }