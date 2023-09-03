// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = "jahid404"; // Replace with your secret key

export interface User {
	username: string;
	email: string;
	password: string;
	role: "admin" | "manager" | "student";
}
// Extend Request to include the 'user' property

const verifyToken = (req: any, res: any, next: any) => {
	const token = req.cookies["auth-token"];
	console.log("frontend token", token);
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		// Verify the token using jwt.verify() and the secret key
		const decodedToken = jwt.verify(token, secretKey) as User;

		// If the token is valid, store the user information in the request object
		req.user = decodedToken;

		console.log("--decode token", req.user);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const role = req.user.role;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized" });
	}
};

// export const verifyAdmin  = (req : any, res : any) => {
//   verifyToken(req,res, (error : any) => {
//     console.log("req varify", req.user);

//   })
// };

export default verifyToken;
