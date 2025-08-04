// pages/api/forgot-password.js

// You must install these packages first:
// npm install resend jsonwebtoken

import { Resend } from "resend";
import jwt from "jsonwebtoken";

// ================================================================
// IMPORTANT: Configure your environment variables in a .env.local file
// These values should NEVER be hard-coded directly in your files.
// .env.local should look like this:
// RESEND_API_KEY=re_YOUR_SECRET_API_KEY
// NEXTAUTH_SECRET=your_long_and_random_jwt_secret
// RESEND_FROM_EMAIL=onboarding@resend.dev  <-- Replace with your verified domain
// YOUR_APP_DOMAIN=https://your-app-domain.com
// ================================================================

// Initialize Resend with your API key from the environment variables.
const resend = new Resend(process.env.RESEND_API_KEY);

// Use a secure, long, and random secret for signing JWTs.
// This secret is used to create and verify the password reset token.
const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || "a_fallback_secret_for_development_only";

// The email address you have verified with Resend.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const APP_DOMAIN = process.env.YOUR_APP_DOMAIN;

export default async function handler(req, res) {
  // Only allow POST requests to this API endpoint.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract the email from the request body.
  const { email } = req.body;

  // Basic validation. In a real app, you would also check if the email
  // exists in your database to prevent sending emails to non-existent accounts.
  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    // --- Step 1: Generate a secure password reset token ---
    // The token contains the user's email and expires in 1 hour.
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    // --- Step 2: Construct the full password reset URL ---
    // This URL will be sent in the email.
    // It's crucial to use your application's domain here.
    const resetUrl = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

    // --- Step 3: Send the email using the Resend API ---
    // This is the core logic for dispatching the email.
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You have requested a password reset for your account. Please click the link below to reset your password. This link is valid for one hour.</p>
        <p><a href="${resetUrl}" style="color:#ffffff; background-color:#4F46E5; padding:12px 24px; border-radius:6px; text-decoration:none;">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br>
        <p>Thank you,</p>
        <p>Your App Team</p>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      // It's generally better not to reveal email server issues to the user for security.
      // A generic success message prevents malicious users from probing for valid emails.
      return res.status(500).json({
        message: "An email has been sent if the email address is valid.",
      });
    }

    // --- Step 4: Respond to the client ---
    // Even on success, it's good practice to send a generic message to prevent
    // an attacker from knowing if an email exists in your system.
    res.status(200).json({
      message: "An email has been sent if the email address is valid.",
    });
  } catch (error) {
    console.error("API processing error:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
}
