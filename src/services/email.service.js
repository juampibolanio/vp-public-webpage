import nodemailer from 'nodemailer';

export const sendContactEmail = async (data) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error("El formato del correo electrónico no es válido.");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: import.meta.env.EMAIL_USER,
            pass: import.meta.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
    from: data.email,
    to: 'vivirplenamente2014@gmail.com',
    subject: `Web Contacto - ${data.subject}: ${data.name}`,
    html: `
        <div style="font-family: sans-serif; border: 1px solid #ee7923; padding: 20px; border-radius: 10px;">
            <h2 style="color: #ee7923;">Nuevo mensaje de Vivir Plenamente</h2>
            <p><strong>De:</strong> ${data.name} (${data.email})</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
    `,
    };

    return await transporter.sendMail(mailOptions);
};


