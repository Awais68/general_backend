import sendResponse from "../helper/sendResponse.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";

export default async function authorization(req, res, next) {
  try {
    const bearerToken = req?.headers?.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      return sendResponse(res, 403, null, true, "No token provided or invalid format");
    }

    const token = bearerToken.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.AUTH_SECRET);
    } catch (error) {
      return sendResponse(res, 403, null, true, "Invalid or expired token");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return sendResponse(res, 403, null, true, "User Not Found");
    }

    req.user = decoded;
    return next();
  } catch (err) {
    return sendResponse(res, 500, null, true, "An unexpected error occurred");
  }
}
