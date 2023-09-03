import { InferSchemaType, Schema, model } from "mongoose";

const transactionScema = new Schema({
	userid: { type: String, required: true },
	amount: { type: Number, required: true },
	category: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, required: true },
});

type User = InferSchemaType<typeof transactionScema>;

const TransactionModel = model<User>("transactions", transactionScema);
export default TransactionModel;
