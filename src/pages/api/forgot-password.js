// pages/api/forgot-password.js

import { Resend } from "resend";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/dbConnect";
import WaterReading from "../../../models/WaterReading";

// ================================================================
// IMPORTANT: Double-check that these environment variables are defined
// in your .env.local file at the root of your project.
// RESEND_API_KEY=re_YOUR_SECRET_API_KEY
// JWT_SECRET=your_long_and_random_jwt_secret
// RESEND_FROM_EMAIL=onboarding@resend.dev
// YOUR_APP_DOMAIN=http://localhost:3000
// ================================================================

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const APP_DOMAIN = process.env.YOUR_APP_DOMAIN;

export default async function handler(req, res) {
  console.log("*** FORGOT PASSWORD API LOGS ***");
  console.log("API call received.");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    console.log("Attempting to connect to the database...");
    await dbConnect();
    console.log("Successfully connected to the database.");

    console.log(`Searching for user with email: ${email}`);

    // Find the user by email.
    const user = await WaterReading.findOne({ email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(200).json({
        message:
          "A password reset email has been sent if a user with that email exists.",
      });
    }

    console.log(`User found: ${user.email}`);

    // Generate a secure JWT token. We use the user's ID as the payload.
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("JWT token created.");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    console.log("Attempting to save the user document with new token...");
    await user.save();
    console.log("User document successfully saved.");

    console.log(`Saved token value: ${user.resetPasswordToken}`);
    console.log(`Saved expiration date: ${user.resetPasswordExpires}`);

    if (!APP_DOMAIN) {
      console.error("Error: YOUR_APP_DOMAIN is not defined in .env.local");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const resetUrl = `${APP_DOMAIN}/reset-password?token=${resetToken}`;
    console.log(`Reset URL being sent: ${resetUrl}`);

    console.log("Attempting to send email with Resend...");
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Password Reset Request",
      html: `
                                                                                                                                                                                                    <p>Hello ${user.last_name},</p>
                                                                                                                                                                                                            <p>You have requested a password reset. Please click the link below to reset your password:</p>
                                                                                                                                                                                                                    <p><a href="${resetUrl}" style="color:#ffffff; background-color:#4F46E5; padding:12px 24px; border-radius:6px; text-decoration:none;">Reset Password</a></p>
                                                                                                                                                                                                                            <p>This link is valid for one hour. If you did not request this, please ignore this email.</p>
                                                                                                                                                                                                                                  `,
    });
    console.log("Email sent successfully.");

    res.status(200).json({
      message:
        "A password reset email has been sent if a user with that email exists.",
    });
  } catch (error) {
    console.error("Caught an error in forgot-password API:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  } finally {
    console.log("*** END FORGOT PASSWORD API LOGS ***");
  }
}
