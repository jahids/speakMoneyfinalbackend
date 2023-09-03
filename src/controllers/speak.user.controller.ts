import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SpeakUserModel from "../models/USERMODEL";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../utils/ValidateEnv";
// express-session type declare

const secretKey = "jahid404"; // Replace with your secret key
const cookieOptions = {
	httpOnly: true,
	maxAge: 3600000, // 1 hour (time in milliseconds)
};

// const EMAIL = "your_email@gmail.com"; // Replace with your actual email
// const PASSWORD = "your_password"; // Replace with your actual password

export const FeedBackMessage: RequestHandler = (req, res) => {
	const { userEmail } = req.body;

	const config = {
		service: "gmail",
		auth: {
			user: "emonchowdhury942858@gmail.com",
			pass: "xznvtbggvsnqodsx",
		},
	};

	const transporter = nodemailer.createTransport(config);

	const MailGenerator = new Mailgen({
		theme: "default",
		product: {
			name: "Speak Money",
			link: "https://mailgen.js/",
		},
	});

	const response = {
		body: {
			name: "Username: Test",
			intro: "Password: Test",
		},
	};

	const mail = MailGenerator.generate(response);

	const message = {
		from: mail,
		to: userEmail,
		subject: "send mail",
		html: mail,
	};

	transporter
		.sendMail(message)
		.then(() => {
			return res.status(201).json({
				msg: "you should receive an email",
			});
		})
		.catch((error: Error) => {
			return res.status(500).json({ error: error.message });
		});
};

export const signUpsm: RequestHandler = async (req, res) => {
	const { username, email, password, role } = req.body;
	const saltRound = 10;
	try {
		if (!username || !email || !password) {
			return res.json({ message: "Parameters missing" });
		}
		const existingUserName = await SpeakUserModel.findOne({
			username,
		}).exec();
		if (existingUserName) {
			return res.json({ message: "already user name exist" });
		}
		const existingEmail = await SpeakUserModel.findOne({ email }).exec();
		if (existingEmail) {
			return res.json({ message: "already email exist" });
		}
		const passwordHashed = await bcrypt.hash(password, saltRound);
		const newUser = await SpeakUserModel.create({
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

export const loginsm: RequestHandler = async (req, res) => {
	const { username, password } = req.body;
	try {
		if (!username || !password) {
			return res.send("parameter missing");
		}

		const user = await SpeakUserModel.findOne({ username })
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
