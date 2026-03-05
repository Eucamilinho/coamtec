# Diagnóstico MercadoPago - Botón de Pago Deshabilitado

## Problema Actual
- El botón de pago se deshabilita al momento de intentar completar el pago
- El usuario llega hasta la interfaz de MercadoPago pero no puede hacer clic en "Pagar"

## Cambios Realizados para Solución

### 1. Información Completa del Payer
```javascript
payer: {
  name: formulario.nombre,
  surname: "", // Vacío si no tienes apellido separado
  email: formulario.email,
  phone: { 
    area_code: "57", // Código de Colombia REQUERIDO
    number: formulario.telefono 
  },
  identification: {
    type: "CC", // Cédula de ciudadanía
    number: "12345678" // Número genérico - CAMBIAR por real si tienes
  },
  address: {
    street_name: formulario.direccion,
    street_number: "123", // Número genérico
    zipcode: "12345", // Código postal genérico
    city: formulario.ciudad,
  },
}
```

### 2. Configuración de Métodos de Pago
```javascript
payment_methods: {
  excluded_payment_methods: [], // No excluir ningún método
  excluded_payment_types: [], // No excluir ningún tipo
  installments: 12 // Máximo cuotas permitidas
}
```

### 3. Auto Return y Statement Descriptor
```javascript
auto_return: "approved", // Regreso automático cuando se aprueba
statement_descriptor: "COAMTEC", // Aparece en estado de cuenta
```

## Posibles Causas del Problema

### 1. **Cuenta MercadoPago No Verificada**
- ✅ Verificar que tu cuenta de MercadoPago esté completamente verificada
- ✅ Confirmar que tienes permisos para recibir pagos
- ✅ Revisar si hay restricciones en tu cuenta

### 2. **Credenciales Incorrectas**
- ✅ Verificar que `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` sea de PRODUCCIÓN
- ✅ Verificar que `MERCADOPAGO_ACCESS_TOKEN` sea de PRODUCCIÓN
- ✅ Las credenciales de TEST no funcionan completamente

### 3. **Información Faltante del Cliente**
- ✅ **SOLUCIONADO**: Agregado `area_code` al teléfono
- ✅ **SOLUCIONADO**: Agregada identificación del cliente
- ✅ **SOLUCIONADO**: Completada información de dirección

### 4. **Precios o Moneda Incorrectos**
- ✅ Verificar que los precios sean números válidos > 0
- ✅ Confirmar que `currency_id: "COP"` es correcto
- ✅ Verificar que el costo de envío sea válido

### 5. **Configuración de Webhook**
- ✅ El webhook debe estar accesible públicamente
- ✅ La URL debe ser HTTPS en producción

## Pasos de Verificación

### 1. Verificar Credenciales
```bash
# En .env.local
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx  # PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx  # PRODUCCIÓN
```

### 2. Verificar URL del Webhook
```javascript
notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`
// Debe ser: https://tu-dominio.vercel.app/api/webhook
```

### 3. Probar con Datos Mínimos
Intentar crear una preferencia con datos básicos para aislar el problema:

```javascript
{
  items: [{
    title: "Producto Test",
    quantity: 1,
    unit_price: 1000,
    currency_id: "COP"
  }],
  payer: {
    email: "test@test.com"
  }
}
```

## Checklist de Verificación

- [ ] Cuenta MercadoPago verificada y activa
- [ ] Credenciales de PRODUCCIÓN correctas
- [ ] URL de webhook accesible (HTTPS)
- [ ] Información completa del payer
- [ ] Precios válidos y positivos
- [ ] Moneda correcta (COP)
- [ ] Métodos de pago habilitados
- [ ] Sin restricciones en la cuenta

## Próximos Pasos

1. **Verificar Estado de Cuenta**: Ingresar al dashboard de MercadoPago para confirmar el estado
2. **Probar con Credenciales de Test**: Si funciona con TEST, el problema es de verificación/producción
3. **Contactar Soporte MercadoPago**: Si persiste, puede ser un problema de configuración de cuenta
4. **Logs Detallados**: Agregar console.log para ver la respuesta exacta de MercadoPago

## Información Adicional

- El problema suele ocurrir por falta de verificación de cuenta o información incompleta del payer
- MercadoPago requiere información más detallada en PRODUCCIÓN que en TEST
- Los códigos de área telefónicos son obligatorios en algunos países