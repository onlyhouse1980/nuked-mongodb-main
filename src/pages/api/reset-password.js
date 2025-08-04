import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// You will need to install these packages:
// npm install jsonwebtoken bcryptjs
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret_key";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    const { email } = decoded;

    // --- Step 1: Find the user and verify the token in your database ---
    // As in the previous API, you need to find the user by the email from the token.
    // You must also verify the token's validity against the one stored in the database.
    // This is a placeholder.
    const userExists = true;
    const storedTokenIsValid = true;

    if (!userExists || !storedTokenIsValid) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // --- Step 2: Hash the new password and update the user's record ---
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Replace this with your database update logic.
    // For example:
    // await userDoc.ref.update({
    //    password: hashedPassword,
    //    passwordResetToken: null, // Invalidate the token after use
    //    passwordResetExpires: null,
    // });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Password reset error:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
}
