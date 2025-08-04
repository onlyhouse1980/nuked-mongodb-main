import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

// You will need to install these packages:
// npm install jsonwebtoken nodemailer
import nodemailer from "nodemailer";

// You need to set these environment variables in a .env file.
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret_key";
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@yourdomain.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // --- Step 1: Find the user in your database ---
    // This is a placeholder. You must replace this with your actual database query.
    // Example with Firestore:
    // const usersCollection = firestore.collection('users');
    // const userSnapshot = await usersCollection.where('email', '==', email).get();
    // if (userSnapshot.empty) {
    //   // Do not reveal if the email exists for security reasons.
    //   return res.status(200).json({ message: 'If an account exists with that email, a password reset link has been sent.' });
    // }
    // const userDoc = userSnapshot.docs[0];
    // const user = userDoc.data();

    // For this example, we'll assume the user exists.
    const userExists = true;
    if (!userExists) {
      return res
        .status(200)
        .json({
          message:
            "If an account exists with that email, a password reset link has been sent.",
        });
    }

    // --- Step 2: Generate a secure, time-limited token ---
    // We use JSON Web Tokens (JWT) for a secure, tamper-proof token.
    // The token will contain the user's email and will expire in 1 hour.
    const resetToken = sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    // --- Step 3: Save the token in your database ---
    // This is crucial for verifying the token later.
    // You would save `resetToken` and its expiration time to the user's record.
    // For example:
    // await userDoc.ref.update({
    //   passwordResetToken: resetToken,
    //   passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour from now
    // });

    // --- Step 4: Send the email ---
    // Use Nodemailer to send the email with the reset link.
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like 'SendGrid' or 'SMTP'
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
    });

    // The URL the user will be sent to. This should match the path of your
    // password reset page.
    const resetUrl = `${req.headers.origin}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p>Hello,</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p>You have requested to reset your password. Click on the link below to proceed.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <a href="${resetUrl}">Reset Password</a>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p>This link is valid for 1 hour.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p>If you did not request a password reset, please ignore this email.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
  } catch (error) {
    console.error("Error in forgot password API:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
