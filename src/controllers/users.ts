import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";

// express-session type declare

const secretKey = "jahid404"; // Replace with your secret key
const cookieOptions = {
	httpOnly: true,
	maxAge: 3600000, // 1 hour (time in milliseconds)
};

export const signUp: RequestHandler = async (req, res) => {
	const { username, email, password, role } = req.body;
	const saltRound = 10;
	try {
		if (!username || !email || !password) {
			return res.json({ message: "Parameters missing" });
		}
		const existingUserName = await UserModel.findOne({ username }).exec();
		if (existingUserName) {
			return res.json({ message: "already user name exist" });
		}
		const existingEmail = await UserModel.findOne({ email }).exec();
		if (existingEmail) {
			return res.json({ message: "already email exist" });
		}

		const passwordHashed = await bcrypt.hash(password, saltRound);

		const newUser = await UserModel.create({
			username: username,
			email: email,
			password: passwordHashed,
			role: role,
		});

		// Generate JWT
		const token = jwt.sign({ userId: newUser._id, username }, secretKey, {
			expiresIn: "1h", // Set the token expiration time (1 hour)
		});
		res.cookie("auth-token", token, cookieOptions);
		// Return the token in the response
		return res.json({
			message: "User created successfully",
			data: newUser,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.send("server error");
	}
};

export const login: RequestHandler = async (req, res) => {
	const { username, password } = req.body;
	try {
		if (!username || !password) {
			return res.send("parameter missing");
		}

		const user = await UserModel.findOne({ username })
			.select("+password +email +role")
			.exec();
		// res.send(user)

		if (!user) {
			return res.send("invalid cred");
		}

		const passwoordMatch = await bcrypt.compare(password, user.password);
		if (!passwoordMatch) {
			return res.send(" password wrong");
		}

		// Generate JWT
		const token = jwt.sign(
			{ id: user._id, username: user.username, role: user.role },
			secretKey,
			{
				expiresIn: "1h", // Set the token expiration time (1 hour)
			}
		);

		// Set the JWT as an HTTP cookie
		res.cookie("auth-token", token, cookieOptions);
		return res.status(200).json({
			message: "successfully login",
			data: user,
			token: token,
		});
	} catch (error) {
		console.log();
	}
};

export const logout: RequestHandler = (req, res) => {
	res.clearCookie("auth-token");
	return res.json({ message: "Logout successful" });
};
