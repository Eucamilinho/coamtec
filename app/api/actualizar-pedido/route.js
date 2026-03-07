
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { preferenceId, status } = await request.json()
    console.log("Actualizando pedido:", preferenceId, status)

    const estado =
      status === "approved" || status === "success" ? "pagado" :
      status === "rejected" || status === "failure" ? "rechazado" :
      "pendiente"

    // Actualizar estado del pedido
    const { data, error } = await supabase
      .from("pedidos")
      .update({
        mp_status: status,
        estado,
      })
      .eq("mp_payment_id", preferenceId)
      .select()

    if (error) throw error



    // Si fue pagado, restar stock de cada producto
    if (estado === "pagado" && data?.[0]?.items) {
      const pedido = data[0];
      const items = pedido.items;
      for (const item of items) {
        // Obtener stock actual
        const { data: producto } = await supabase
          .from("productos")
          .select("stock")
          .eq("id", item.id)
          .single()

        if (producto) {
          const nuevoStock = Math.max(0, producto.stock - item.cantidad)
          await supabase
            .from("productos")
            .update({ stock: nuevoStock })
            .eq("id", item.id)
        }
      }

      // Notificación a Telegram (no interrumpe el flujo si falla)
      try {
        const nombre = pedido.nombre || "";
        const total = pedido.total || 0;
        const ciudad = pedido.ciudad || "";
        const direccion = pedido.direccion_envio || "";
        const metodoEnvio = pedido.metodo_envio || "";
        const productos = items.map(item => `• *${item.nombre}* x${item.cantidad}`).join("\n");
        const mensaje = `🛒 *Nuevo pago confirmado en Coam Tec!*\n\n👤 *Cliente:* ${nombre}\n💰 *Total:* $${total.toLocaleString("es-AR")}\n🏙️ *Ciudad:* ${ciudad}\n🏠 *Dirección:* ${direccion}\n📦 *Envío:* ${metodoEnvio}\n\n*Productos:*\n${productos}`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: mensaje,
            parse_mode: "Markdown"
          })
        });
      } catch (telegramError) {
        // Silencioso, no interrumpe el flujo
      }

      // Enviar email de confirmación al cliente usando Resend
      try {
        // Obtener email y datos del pedido
        const emailCliente = pedido.email;
        const numeroPedido = pedido.id;
        const direccionEnvio = pedido.direccion_envio || "";
        const total = pedido.total || 0;
        // Renderizar lista de productos
        const productosHtml = items.map(item => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.nombre}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">${item.cantidad}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">$${item.precio.toLocaleString("es-AR")}</td>
          </tr>
        `).join("");

        const html = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 32px;">
            <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; overflow: hidden;">
              <div style="background: #4ade80; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 2px;">
                COAM TEC
              </div>
              <div style="padding: 32px 24px 24px 24px;">
                <h2 style="color: #4ade80; margin-top: 0;">¡Tu pedido fue confirmado! 🎮</h2>
                <p>Gracias por comprar en <b>Coam Tec</b>. Tu pedido ha sido recibido y está siendo procesado.</p>
                <p><b>Número de pedido:</b> #${numeroPedido}</p>
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
                    ${productosHtml}
                  </tbody>
                </table>
                <p style="margin-top: 16px; font-size: 1.1rem;"><b>Total:</b> $${total.toLocaleString("es-AR")}</p>
                <p><b>Dirección de envío:</b> ${direccionEnvio}</p>
                <p><b>Tiempo estimado de entrega:</b> 3-5 días hábiles</p>
                <p style="margin-top: 24px;">¿Tienes dudas? Responde a este email o visita <a href="https://www.coamtec.com" style="color: #4ade80; text-decoration: underline;">coamtec.com</a></p>
                <p style="margin-top: 16px; color: #64748b; font-size: 0.95rem;">¡Gracias por confiar en nosotros!<br>El equipo de Coam Tec</p>
              </div>
            </div>
          </div>
        `;

        if (emailCliente) {
          await resend.emails.send({
            from: "Coam Tec <pedidos@coamtec.com>",
            to: emailCliente,
            subject: "¡Tu pedido en Coam Tec fue confirmado! 🎮",
            html,
          });
        }
      } catch (emailError) {
        console.error("Error enviando email de confirmación:", emailError);
        // No romper el flujo principal
      }
    }

    console.log("Resultado:", data, error)
    return Response.json({ ok: true, data })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}