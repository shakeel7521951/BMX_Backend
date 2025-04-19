import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// ✅ Setup transporter using Gmail SMTP with App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "bmxadventure8@gmail.com",        // ✅ Your Gmail address
        pass: "yoie uzhf crai ccks"             // ✅ Gmail App Password (generated, not real password)
    },
    secure: true,
    timeout: 10000
});

// ✅ SendMail utility function
const SendMail = async (email, subject, text) => {
    try {
        const mailOptions = {
            from: 'bmxadventure8@gmail.com',     // ✅ Sender email
            to: email,                           // ✅ Receiver email
            subject: subject,
            html: text
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw new Error("Failed to send mail");
    }
};

export default SendMail;
