// pages/api/signup.js
import dbConnect from "../../../lib/dbConnect";
import WaterReading from "../../../models/WaterReading";
import bcrypt from "bcryptjs"; // Import the hashing library

export default async function handler(req, res) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // Connect to the database
  try {
    await dbConnect();
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Database connection error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Database connection failed." });
  }

  // Log the received data for debugging
  console.log("Received request body:", req.body);

  const { email, password, lastName } = req.body;

  // Validate that all required fields are present
  if (!email || !lastName || !password) {
    console.error("Validation failed: Missing required fields.");
    return res.status(400).json({
      success: false,
      message: "Email, last name, and password are required",
    });
  }

  try {
    // Check if a user with this email already exists
    const existingUser = await WaterReading.findOne({ email });
    if (existingUser) {
      console.log("Signup failed: Email already exists.");
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please login instead.",
      });
    }

    // CRITICAL FIX: Hash the password before saving it to the database.
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new user in the database
    const newUser = await WaterReading.create({
      email,
      password: hashedPassword, // Store the hashed password, not the plaintext one
      last_name: lastName, // Use the field name from your schema
    });

    console.log("New user created successfully:", newUser);

    // Return the new user object as part of the success response
    return res.status(201).json({
      success: true,
      message: "User created and logged in successfully!",
      user: {
        id: newUser._id,
        email: newUser.email,
        lastName: newUser.last_name,
      },
    });
  } catch (error) {
    console.error("Error during user creation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during user creation.",
      error: error.message,
    });
  }
}
