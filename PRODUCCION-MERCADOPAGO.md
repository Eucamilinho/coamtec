# 🚀 GUÍA DE TRANSICIÓN A PRODUCCIÓN - MERCADOPAGO

## ✅ PASOS COMPLETADOS
- [x] URLs de producción configuradas (www.coamtec.com)
- [x] Webhook endpoint configurado (/api/webhook)
- [x] Variables de entorno preparadas

## 🔑 PASOS PENDIENTES

### 1. OBTENER CREDENCIALES DE PRODUCCIÓN
1. Ingresa a tu cuenta MercadoPago
2. Ve a **Developers** → **Tus integraciones**
3. Selecciona tu aplicación
4. Ve a **Credenciales de producción**
5. Copia las credenciales reales de producción

### 2. REEMPLAZAR EN .env.local
```env
# Reemplaza las X por tus credenciales reales:
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

### 3. CONFIGURAR WEBHOOK EN MERCADOPAGO
En el panel de MercadoPago:
- URL del webhook: `https://www.coamtec.com/api/webhook`
- Eventos: `payment` (pagos)
- Método: POST

### 4. VERIFICACIONES DE SEGURIDAD
- [ ] Webhook URL es HTTPS
- [ ] Credenciales no están en el código fuente
- [ ] Variables de entorno están en servidor de producción
- [ ] Certificado SSL válido en www.coamtec.com

### 5. PRUEBAS DE PRODUCCIÓN
1. Realizar compra pequeña real
2. Verificar webhook recibido
3. Comprobar actualización de stock
4. Confirmar creación de pedido en Supabase

### 6. DEPLOY A PRODUCCIÓN
```bash
# Si usas Vercel:
vercel --prod

# Agregar variables de entorno en Vercel:
# Dashboard → Settings → Environment Variables
```

## ⚠️ IMPORTANTE
- **NO** commits las credenciales reales al repositorio
- Usa variables de entorno en tu plataforma de deploy
- Mantén las credenciales de sandbox para desarrollo
- Haz backup de la base de datos antes del cambio

## 📋 CHECKLIST FINAL
- [ ] Credenciales de producción configuradas
- [ ] Webhook configurado en MercadoPago
- [ ] Variables de entorno en servidor de producción
- [ ] Prueba de pago real exitosa
- [ ] Monitoreo de errores activado
- [ ] Rollback plan preparado

## 🔧 COMANDOS ÚTILES
```bash
# Verificar variables de entorno
echo $MERCADOPAGO_ACCESS_TOKEN

# Test webhook local (desarrollo)
ngrok http 3000

# Logs de webhook
tail -f /var/log/webhook.log
```

## 📞 SOPORTE
- MercadoPago: https://www.mercadopago.com.co/developers/support
- Documentación: https://www.mercadopago.com.co/developers/docs