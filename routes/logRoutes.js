import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// Create Log
router.post("/log", async (req, res) => {
  const { status, userId, medicineId } = req.body;
  try {
    const log = await prisma.acknowledgmentLog.create({
      data: {
        status,
        userId,
        medicineId,
      },
    });
    res
      .status(201)
      .json({ message: "Acknowledgment logged successfully", log });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error logging acknowledgment", details: error.message });
  }
});

//Get all medicines depending upon certain user
router.get("/admin", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const logs = await prisma.acknowledgmentLog.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        medicine: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

export default router;
