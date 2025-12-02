import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  },
});


export async function sendVerificationEmail(email: string, otp: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      }
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #023430;">Welcome to FranGo!</h2>
        <p>Thank you for registering. Please use the OTP below to verify your account:</p>
        <h3 style="color: #023430; background-color: #f0f0f0; display: inline-block; padding: 8px 12px; border-radius: 5px;">${otp}</h3>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>Your OTP is  : ${ otp}<strong>5 minutes</strong>.</p>
        <p style="margin-top:20px; font-size: 12px; color: #666;">
          Do not share this OTP with anyone. If you did not request this, please ignore this email.
        </p>
        <hr/>
        <p style="font-size: 12px; color: #666;">FranGo Team</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}`,
      html:htmlContent
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.error("Error sending email", error);
    return false;
  }
}