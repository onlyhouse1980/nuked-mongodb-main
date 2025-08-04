// pages/api/reset-password.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/dbConnect";
import WaterReading from "../../../models/WaterReading";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  console.log("*** RESET PASSWORD API LOGS ***");
  console.log("API call received.");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token, password } = req.body;
  console.log(`Token received: ${token}`);

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken || !decodedToken.userId) {
      return res.status(400).json({ message: "Invalid or malformed token." });
    }
    console.log(`Token successfully decoded. User ID: ${decodedToken.userId}`);

    await dbConnect();

    // Find the user by ID and check if the token and expiration are still valid.
    const user = await WaterReading.findOne({
      _id: decodedToken.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // --- THIS IS THE CRITICAL DEBUGGING POINT ---
    // This log will tell you what the query found.
    console.log("Result of database query for user:", user);

    if (!user) {
      console.log(
        "Password reset query failed. User not found or token expired/invalid."
      );
      return res
        .status(404)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    console.log(
      `User found in DB. Expiration time: ${user.resetPasswordExpires}`
    );

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password successfully reset.");
    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error in reset-password API:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Password reset token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token." });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  } finally {
    console.log("*** END RESET PASSWORD API LOGS ***");
  }
}
