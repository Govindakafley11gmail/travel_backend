import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // SSL if 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send an email
   * @param fromEmail - sender email (dynamic)
   * @param to - recipient email
   * @param subject - email subject
   * @param html - email HTML content
   */
  async sendMail(fromEmail: string, to?: string, subject?: string, html?: string) {
    try {
      console.log(`📧 Sending email to ${to}...from ${fromEmail}`);
      const info = await this.transporter.sendMail({
        from: `"Booking System" <${fromEmail}>`, // dynamic sender
        to,
        subject,
        html,
      });
      console.log("✅ Email sent:", info.messageId);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
    }
  }
}
