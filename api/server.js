import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import { Otp } from "./otpSchema.js";
import cors from "cors";
dotenv.config();
const app = express();
const uri = process.env.MONGO_URI;

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["POST"],
    credentials: true,
  })
);

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendOtpToEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification 🚀",
    html: `<h2>Verify OTP to access Account</h2><p><b>Your OTP is:</b> ${otp}</p>`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    const otp = generateOtp();

    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOtpToEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await Otp.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "OTP not found or expired" });

    if (user.otp === otp) {
      await Otp.deleteOne({ email });
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
});

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { dbName: "Otp_Verification" });
    console.log("✅ Database Connected");
  } catch (error) {
    console.log("❌ Error connecting DB:", error);
  }
};

await connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
