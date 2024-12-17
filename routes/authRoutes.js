import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

router.use(cookieParser());

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role = "PATIENT" } = req.body;

  try {
    const authenticatedUser = req.user;

    if (role === "SUPER_ADMIN" && authenticatedUser?.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ message: "Only a Super Admin can create another Super Admin" });
    }

    const passwordHash = await bcrypt.hash(password, 6);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    return res
      .status(200)
      .json({ message: "User successfully registered!", newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Forget Password Route
router.patch("/forget-pass", async (req, res) => {
  const { email, newPass } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const passwordHash = await bcrypt.hash(newPass, 6);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return res
      .status(200)
      .json({ message: "Password changed successfully", updatedUser });
  } catch (error) {
    console.error("Forget Password Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Middleware to Check Role Authorization
function roleAssign(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
}

// Assign Role Route
router.patch("/role-assign", roleAssign, async (req, res) => {
  const { email, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
    });

    return res
      .status(200)
      .json({ message: "Role set successfully", updatedUser });
  } catch (error) {
    console.error("Role Assign Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
