import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://medifor7.netlify.app/",
    credentials: true,
  })
);
app.use(cookieParser());

app.options("*", cors());

app.use("/auth", authRoutes);
app.use("/medicines", medicineRoutes);
app.use("/logs", logRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
