// TEST SIMPLE DE MERCADOPAGO
// Ejecutar: node test-mp.js (desde la raíz del proyecto)

import { MercadoPagoConfig, Preference } from "mercadopago"
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

async function testMercadoPago() {
  try {
    console.log('=== TEST MERCADOPAGO ===')
    console.log('Access Token:', process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20) + '...')
    console.log('Public Key:', process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.substring(0, 20) + '...')

    const preference = new Preference(mp)
    
    const testData = {
      items: [{
        id: "1",
        title: "Producto Test",
        quantity: 1,
        unit_price: 1000,
        currency_id: "COP"
      }],
      payer: {
        name: "Test User",
        surname: "Test",
        email: "test@test.com",
        phone: { 
          area_code: "57",
          number: "3001234567" 
        },
        identification: {
          type: "CC",
          number: "12345678"
        },
        address: {
          street_name: "Calle Test",
          street_number: "123",
          zipcode: "12345",
          city: "Bogotá",
        },
      },
      back_urls: {
        success: "https://coamtec.vercel.app/checkout/resultado?status=success",
        failure: "https://coamtec.vercel.app/checkout/resultado?status=failure", 
        pending: "https://coamtec.vercel.app/checkout/resultado?status=pending",
      },
      notification_url: "https://coamtec.vercel.app/api/webhook",
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      shipments: {
        cost: 0,
        mode: "not_specified",
      },
      statement_descriptor: "COAMTEC",
    }

    console.log('Creando preferencia con datos test...')
    const response = await preference.create({ body: testData })
    
    console.log('✅ ÉXITO - Preferencia creada!')
    console.log('ID:', response.id)
    console.log('Init Point:', response.init_point)
    console.log('Status:', response.status)
    
  } catch (error) {
    console.log('❌ ERROR en MercadoPago')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

testMercadoPago()