import { Resend } from "resend"

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return Response.json({ error: "Email destinatario requerido" }, { status: 400 })
    }

    // HTML de prueba (idéntico al de confirmación de pedido, pero con datos dummy)
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 32px;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; overflow: hidden;">
          <div style="background: #4ade80; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 2px;">
            COAM TEC
          </div>
          <div style="padding: 32px 24px 24px 24px;">
            <h2 style="color: #4ade80; margin-top: 0;">¡Este es un email de prueba! 🎮</h2>
            <p>Gracias por probar el sistema de emails de <b>Coam Tec</b>.</p>
            <p><b>Número de pedido:</b> #123456</p>
            <h3 style="margin-bottom: 8px;">Resumen de tu compra:</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f1f5f9;">
              <thead>
                <tr style="background: #e0fce4; color: #16a34a;">
                  <th style="padding: 8px 12px; text-align:left;">Producto</th>
                  <th style="padding: 8px 12px; text-align:center;">Cantidad</th>
                  <th style="padding: 8px 12px; text-align:right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">Teclado Mecánico RGB</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">1</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">$25.000</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">Mouse Gamer</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">2</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">$10.000</td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 16px; font-size: 1.1rem;"><b>Total:</b> $45.000</p>
            <p><b>Dirección de envío:</b> Calle Falsa 123, Ciudad</p>
            <p><b>Tiempo estimado de entrega:</b> 3-5 días hábiles</p>
            <p style="margin-top: 24px;">¿Tienes dudas? Responde a este email o visita <a href="https://www.coamtec.com" style="color: #4ade80; text-decoration: underline;">coamtec.com</a></p>
            <p style="margin-top: 16px; color: #64748b; font-size: 0.95rem;">¡Gracias por confiar en nosotros!<br>El equipo de Coam Tec</p>
          </div>
        </div>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "Coam Tec <pedidos@coamtec.com>",
      to: email,
      subject: "¡Este es un email de prueba de Coam Tec! 🎮",
      html,
    })
    return Response.json({ ok: true })
  } catch (error) {
    console.error("Error enviando email de prueba:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
