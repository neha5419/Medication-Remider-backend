import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();
// Create Medicine
router.post("/add", async (req, res) => {
  const { name, dosage, scheduleTime, userId } = req.body;
  try {
    const medicine = await prisma.medicine.create({
      data: {
        name,
        dosage,
        scheduleTime: new Date(scheduleTime),
        userId,
      },
    });
    res.status(201).json({ message: "Medicine added successfully", medicine });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding medicine", details: error.message });
  }
});

// Get Medicines for a User
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const medicines = await prisma.medicine.findMany({
      where: { userId: parseInt(userId) },
    });
    res.status(200).json({ medicines });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching medicines", details: error.message });
  }
});

// Delete Medicine
router.delete("/:medicineId", async (req, res) => {
  const { medicineId } = req.params;
  try {
    await prisma.medicine.delete({ where: { id: parseInt(medicineId) } });
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting medicine", details: error.message });
  }
});

export default router;
