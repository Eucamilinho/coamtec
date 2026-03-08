import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req) {
  try {
    const body = await req.json();
    const { pedido } = body;
    if (!pedido) {
      return NextResponse.json({ error: 'Faltan datos del pedido' }, { status: 400 });
    }

    // 1. Enviar correo al cliente
    const emailHtml = `
      <div style="font-family: sans-serif; color: #222;">
        <h2>¡Gracias por tu pedido en Coam Tec!</h2>
        <p>Hemos recibido tu pedido con pago contraentrega. Nos pondremos en contacto contigo para coordinar el envío y la entrega.</p>
        <h3>Resumen del pedido:</h3>
        <ul>
          ${pedido.items.map(item => `<li>${item.nombre} x${item.cantidad}</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
        <p><strong>Dirección:</strong> ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento}</p>
        <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
        <p>Pronto te contactaremos para coordinar la entrega. ¡Gracias por confiar en nosotros!</p>
      </div>
    `;
    await resend.emails.send({
      from: 'Coam Tec <notificaciones@coamtec.com>',
      to: pedido.email,
      subject: '¡Pedido recibido! Pronto te contactaremos para coordinar el envío',
      html: emailHtml
    });

    // 2. Enviar mensaje a Telegram admin
    const telegramMsg = `🛒 *Nuevo pedido contraentrega*\n\n*Nombre:* ${pedido.nombre}\n*Teléfono:* ${pedido.telefono}\n*Email:* ${pedido.email}\n*Dirección:* ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento}\n*Productos:*\n${pedido.items.map(item => `- ${item.nombre} x${item.cantidad}`).join('\n')}\n*Total:* $${pedido.total.toLocaleString()}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMsg,
        parse_mode: 'Markdown'
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando notificaciones contraentrega:', error);
    return NextResponse.json({ error: 'Error enviando notificaciones' }, { status: 500 });
  }
}
