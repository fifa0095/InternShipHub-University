const bcrypt = require("bcryptjs");
const { z } = require("zod");
const User = require("../models/User");
const crypto = require("crypto"); // This should be available in Node.js by default
const { SignJWT } = require('jose-node-cjs-runtime/jwt/sign');


// Validation Schemas
const schemaRegister = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

const schemaLogin = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});
 
// Register User
exports.register = async (req, res) => {
    try {
        const validatedFields = schemaRegister.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({ error: validatedFields.error.errors[0].message });
        }

        const { name, email, password } = validatedFields.data;

        // Check if email is already registered
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            type: "user",
        });

        await newUser.save();

        return res.status(201).json({ success: "User registered successfully" });

    } catch (e) {
        console.error("Registration error:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Login User
exports.login = async (req, res) => {
    try {
        const validatedFields = schemaLogin.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({ error: validatedFields.error.errors[0].message });
        }

        const { email, password } = validatedFields.data;

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const userToken = await new SignJWT({
            userId: user._id.toString(),
            email: user.email,
            userName: user.name,
            type: user.type,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(crypto.createSecretKey(Buffer.from(process.env.JWT_SECRET), 'utf-8'));  // Using the built-in crypto module for the secret key

        return res.status(200).json({
            success: "Logged in successfully",
            token: userToken,
        });

    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.getResume = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({ error: "Missing uid parameter" });
        }

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.resume);
    } catch (error) {

        res.status(500).json({ message: error.message });
        
    }

};

exports.getUserdata = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({ error: "Missing uid parameter" });
        }

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {

        res.status(500).json({ message: error.message });
        
    }

};

exports.editUser = async (req, res) => {
    try {
      const allowedFields = ['name', 'email', 'password'];
      const updates = {};
  
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
  
      if (req.body.password) {
        const { old_password, password: newPassword } = req.body;
  
        if (!old_password) {
          return res.status(400).json({ error: 'Old password is required to change password' });
        }
  
 
        const isMatch = await bcrypt.compare(old_password, newPassword);
        if (!isMatch) {
          return res.status(400).json({ error: 'Old password is incorrect' });
        }
  
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(newPassword, salt);
      }
  
      if (updates.email) {
        updates.email = updates.email.toLowerCase();
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.body._id, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userToken = await new SignJWT({
        userId: updatedUser._id.toString(),
        email: updatedUser.email,
        userName: updatedUser.name,
        type: updatedUser.type,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(crypto.createSecretKey(Buffer.from(process.env.JWT_SECRET), 'utf-8'));  // Using the built-in crypto module for the secret key

        return res.status(200).json({
            success: "Updated User Infomation successfully",
            token: userToken,
        });

    } catch (error) {
      console.error("Edit user error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };