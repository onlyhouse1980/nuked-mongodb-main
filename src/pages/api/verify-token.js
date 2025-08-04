import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your_fallback_secret_key";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token's signature and expiration
    const decoded = verify(token, JWT_SECRET);
    const { email } = decoded;

    // --- Step 1: Find the user in your database using the email from the token ---
    // This is a placeholder. You must replace this with your actual database query.
    // const usersCollection = firestore.collection('users');
    // const userSnapshot = await usersCollection.where('email', '==', email).get();
    // if (userSnapshot.empty) {
    //    return res.status(404).json({ message: 'User not found.' });
    // }
    // const userDoc = userSnapshot.docs[0];
    // const user = userDoc.data();

    // --- Step 2: Check if the token in the database matches the provided token ---
    // if (user.passwordResetToken !== token || new Date() > user.passwordResetExpires) {
    //    return res.status(400).json({ message: 'Invalid or expired token.' });
    // }

    // If all checks pass, the token is valid.
    res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    console.error("Token verification error:", error);
    // Handle common JWT errors like 'TokenExpiredError' or 'JsonWebTokenError'
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token has expired." });
    }
    res.status(400).json({ message: "Invalid token." });
  }
}
