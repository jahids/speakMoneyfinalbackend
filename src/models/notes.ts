import { Schema, model } from "mongoose";


interface Note {
    title : string;
    text :  string   
}

const noteSchema = new Schema<Note>({
    title : { type : String, required : true},
    text : {type : String},
}, {timestamps : true});

const NoteModel =  model<Note>("Note",noteSchema)

export default NoteModel;