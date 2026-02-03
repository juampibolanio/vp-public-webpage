export const prerender = false;
import { sendContactEmail } from '../../services/email.service.js';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;

        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return new Response(
                JSON.stringify({ message: "Todos los campos son obligatorios." }), 
                { 
                    status: 400,
                    headers: { "Content-Type": "application/json" } 
                }
            );
        }

        if (message.trim().length < 10) {
            return new Response(
                JSON.stringify({ message: "El mensaje debe tener al menos 10 caracteres." }), 
                { 
                    status: 400,
                    headers: { "Content-Type": "application/json" } 
                }
            );
        }

        await sendContactEmail({ name, email, subject, message });

        return new Response(
            JSON.stringify({ message: "¡Mail enviado con éxito!" }), 
            { 
                status: 200,
                headers: { "Content-Type": "application/json" } 
            }
        );

    } catch (error) {
        console.error("Error en API de contacto:", error.message);
        return new Response(
            JSON.stringify({ message: "Hubo un problema técnico al enviar el correo." }), 
            { 
                status: 500,
                headers: { "Content-Type": "application/json" } 
            }
        );
    }
};