import express from "express";
import bcrypt from "bcrypt";
import sendResponse from "../helper/sendResponse.js";
import Joi from "joi";
import User from "../models/user.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const router = express.Router();

const Registerschema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  father_name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(3).required(),
});

const loginschema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(3).required(),
});

router.get("/user", async (req, res) => {
  sendResponse(res, 201, User, false, "User Get Successfully");
});
router.post("/signup", async (req, res) => {
  try {
    const { error, value } = Registerschema.validate(req.body);
    if (error) {
      return sendResponse(res, 403, null, true, error.message);
    }

    const checkUserInDB = await User.findOne({ email: value.email });
    if (checkUserInDB) {
      return sendResponse(res, 403, null, true, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(value.password, 12);
    const newUser = new User({ ...value, password: hashedPassword });
    await newUser.save();

    sendResponse(res, 201, newUser, false, "User is successfully registered");
  } catch (err) {
    console.error("Error =>", err);
    sendResponse(res, 500, null, true, "An unexpected error occurred");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginschema.validate(req.body);
    if (error) {
      return sendResponse(res, 403, null, true, error.message);
    }

    const user = await User.findOne({ email: value.email }).lean();
    if (!user) {
      return sendResponse(res, 403, null, true, "User is not registered");
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 403, null, true, "Invalid credentials");
    }

    const { password, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, process.env.AUTH_SECRET, {
      expiresIn: "1d",
    });

    sendResponse(
      res,
      200,
      { user: userWithoutPassword, token },
      false,
      "User is successfully logged in"
    );
  } catch (err) {
    console.error("Error =>", err);
    sendResponse(res, 500, null, true, "An unexpected error occurred");
  }
});

export default router;
