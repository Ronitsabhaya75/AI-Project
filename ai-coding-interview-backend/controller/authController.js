const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db.one(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    console.log("User registered successfully:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};


const loginUser = async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      // Find user in database
      const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
  
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      console.log("User logged in successfully:", user.email);
  
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  };
  

const getProfile = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {  // Ensure req.user is properly set
          return res.status(401).json({ error: "Unauthorized. Token is missing or invalid." });
      }

      const user = await pool.query("SELECT id, email FROM users WHERE id = $1", [req.user.id]);

      if (user.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Profile retrieved successfully", user: user.rows[0] });
  } catch (err) {
      console.error("❌ Error retrieving profile:", err);
      res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { signupUser, loginUser, getProfile };
