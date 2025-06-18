import express from "express";
import sendResponse from "../helper/sendResponse.js";
import authorization from "../middlewares/authtication.js";
import User from "../models/user.js";

const router = express.Router();

router.put("/updateUser", authorization, async (req, res) => {
  try {
    const { phone, address, DOB, city, country } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { phone, address, DOB, city, country },
      { new: true }
    ).exec();

    if (!user) {
      return sendResponse(res, 404, null, true, "User not found");
    }

    sendResponse(res, 200, user, false, "User updated successfully");
  } catch (err) {
    sendResponse(res, 500, null, true, err.message);
  }
});

router.get("/getUser", async (req, res) => {
  try {
    const user = await User.find();
    sendResponse(res, 200, user, false, "Users fetched successfully");
  } catch (err) {
    sendResponse(res, 500, null, true, err.message);
  }
});

export default router;
