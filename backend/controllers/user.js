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

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const userToken = await new SignJWT({
            userId: user._id.toString(),
            email: user.email,
            userName: user.name,
            isPremium: user.isPremium,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(crypto.createSecretKey(Buffer.from(process.env.JWT_SECRET), 'utf-8'));  // Using the built-in crypto module for the secret key

        return res.status(200).send(userToken);

    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
