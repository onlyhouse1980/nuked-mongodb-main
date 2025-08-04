// pages/api/login.js

import dbConnect from "../../../lib/dbConnect";
import WaterReading from "../../../models/WaterReading";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  console.log("*** LOGIN API LOGS ***");

  // We only want to handle POST requests for login
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Connect to the database
  try {
    await dbConnect();
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Database connection failed." });
  }

  // Log the received data for debugging
  console.log("Received request body:", req.body);

  const { email, password } = req.body;

  // Validate that both fields are present
  if (!email || !password) {
    console.error("Validation failed: Missing required fields.");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by their email
    const user = await WaterReading.findOne({ email });

    // If no user is found, return a generic error to prevent email enumeration attacks
    if (!user) {
      console.log("Login failed: User not found.");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // CRITICAL FIX: Compare the provided password with the HASHED password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log("Login failed: Incorrect password.");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If authentication is successful, return a success message and a simplified user object
    console.log("Login successful for user:", user.email);
    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    // Catch any errors that occur during the database query or password comparison
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  } finally {
    console.log("*** END LOGIN API LOGS ***");
  }
}
