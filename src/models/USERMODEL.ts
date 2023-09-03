import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true, select: false },
	role: { type: String, enum: ["admin", "user", "prouser"] },
});

type User = InferSchemaType<typeof userSchema>;

const SpeakUser = model<User>("SpeakUser", userSchema);
export default SpeakUser;
