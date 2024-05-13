import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveSecretKey } from "../../lib/cache-data";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
    },
});

async function sendMail(email: string) {
    const secretKey = Math.random().toString(36);
    console.log("email: ", email);
    await saveSecretKey(email, secretKey);
    const mail = {
        from: process.env.AUTH_USER,
        to: email,
        subject: `[NextPoker] Confirmation Code`,
        html: `
        <h1>This is Your secret code.</h1>
        <div>${secretKey}</div>
        <br/>
        <p>From NextPoker</p>
        `,
    };
    return await transporter.sendMail(mail);
}

export async function POST(req: Request) {
    const { email } = await req.json();
    const isSended = await sendMail(email);
    if (isSended) {
        return NextResponse.json(
            {
                message: "mail is sended.",
            },
            { status: 201 }
        );
    }
    return NextResponse.json(
        {
            message: "mail send failure",
        },
        { status: 401 }
    );
}
