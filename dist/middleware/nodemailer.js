"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailService {
    transporter;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
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
    async sendMail(fromEmail, to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Booking System" <${fromEmail}>`, // dynamic sender
                to,
                subject,
                html,
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.MailService = MailService;
//# sourceMappingURL=nodemailer.js.map