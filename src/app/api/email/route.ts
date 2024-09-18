import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
    const { email, name, message, surname } = await request.json();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_SMTP_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD
        }
    });

    const mailOptions: Mail.Options = {
        from: process.env.GOOGLE_SMTP_EMAIL,
        to: process.env.GOOGLE_SMTP_EMAIL,
        subject: `Message reçu de ${name} ${surname} (${email})`,
        html: `<h1>Voici le message :</h1><p>${message}</p>`
    };

    const sendMailPromise = () =>
        new Promise<string>((resolve, reject) => {
            transport.sendMail(mailOptions, function (err) {
                if (!err) {
                    resolve('Email sent');
                } else {
                    reject(err.message);
                }
            });
        });

    try {
        await sendMailPromise();
        return NextResponse.json({ message: 'Email sent' });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
