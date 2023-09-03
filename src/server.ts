import app from "./app";
import env from "./utils/ValidateEnv";
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import http from "http";

const port = env.PORT;

// database connection

mongoose
	.connect(env.MONGO_CONNECTION_URI)
	.then(() => {
		console.log("databases connnected");
		app.listen(port, () => {
			console.log("server running port on ", port);
		});
	})
	.catch((e) => {
		console.log(e);
	});
