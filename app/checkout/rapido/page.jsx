"use client"

import { useState, useEffect } from "react"
import { useCompraRapida } from "../../store/compraRapidaStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Lock, Truck, Shield, CreditCard, Building2, Wallet, ArrowRight, CheckCircle } from "lucide-react"
import { supabase } from "../../lib/supabase"

// Datos de Colombia
const DEPARTAMENTOS_CIUDADES = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Turbo", "Rionegro", "Sabaneta"],
  "Arauca": ["Arauca", "Tame", "Saravena"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga"],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá"],
  "Caldas": ["Manizales", "Villamaría", "La Dorada", "Chinchiná"],
  "Caquetá": ["Florencia", "San Vicente del Caguán"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva"],
  "Cauca": ["Popayán", "Santander de Quilichao"],
  "Cesar": ["Valledupar", "Aguachica", "Bosconia"],
  "Chocó": ["Quibdó", "Istmina"],
  "Córdoba": ["Montería", "Cereté", "Sahagún"],
  "Cundinamarca": ["Bogotá", "Soacha", "Girardot", "Zipaquirá", "Fusagasugá", "Chía", "Facatativá"],
  "Guainía": ["Inírida"],
  "Guaviare": ["San José del Guaviare"],
  "Huila": ["Neiva", "Pitalito", "Garzón"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación"],
  "Meta": ["Villavicencio", "Acacías", "Granada"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario"],
  "Putumayo": ["Mocoa", "Puerto Asís"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil", "Socorro", "Barbosa", "Málaga"],
  "Sucre": ["Sincelejo", "Corozal"],
  "Tolima": ["Ibagué", "Espinal", "Melgar"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago"],
  "Vaupés": ["Mitú"],
  "Vichada": ["Puerto Carreño"]
}

// Zonas de envío desde Bucaramanga
const ZONAS_ENVIO = {
  zona1: {
    nombre: "Zona 1 - Área Metropolitana",
    ciudades: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"],
    precio: 8000,
    tiempo: "1-2 días"
  },
  zona2: {
    nombre: "Zona 2 - Santander",
    ciudades: ["Barrancabermeja", "San Gil", "Socorro", "Barbosa", "Málaga"],
    precio: 12000,
    tiempo: "2-3 días"
  },
  zona3: {
    nombre: "Zona 3 - Ciudades Principales",
    ciudades: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
    precio: 15000,
    tiempo: "3-4 días"
  },
  zona4: {
    nombre: "Zona 4 - Capitales Departamentales",
    ciudades: ["Ibagué", "Pereira", "Manizales", "Armenia", "Neiva", "Pasto", "Cúcuta", "Valledupar", "Montería", "Sincelejo", "Santa Marta"],
    precio: 18000,
    tiempo: "4-5 días"
  },
  zona5: {
    nombre: "Zona 5 - Ciudades Intermedias",
    ciudades: ["Villavicencio", "Tunja", "Popayán", "Florencia", "Yopal", "Mocoa", "Arauca", "Quibdó", "Riohacha"],
    precio: 22000,
    tiempo: "5-6 días"
  },
  zona6: {
    nombre: "Zona 6 - Municipios Apartados",
    ciudades: [], // Todas las demás ciudades
    precio: 28000,
    tiempo: "6-8 días"
  }
}

// Componente SearchableSelect
function SearchableSelect({ label, value, onChange, options, placeholder, required }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-zinc-500 text-sm font-medium">{label} {required && "*"}</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition w-full"
        />
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option)
                      setSearch("")
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition text-sm"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-zinc-400 text-sm">No se encontraron resultados</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CheckoutRapido() {
  const { items, limpiar, actualizarCantidad } = useCompraRapida()
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [cotizacionEnvio, setCotizacionEnvio] = useState(null)
  
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    referencia: "",
    metodoPago: "",
  })

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const costoEnvio = cotizacionEnvio?.precio || 0
  const total = subtotal + costoEnvio

  // Obtener zona de envío cuando cambia la ciudad
  useEffect(() => {
    if (formulario.ciudad) {
      const zona = Object.entries(ZONAS_ENVIO).find(([key, zona]) => {
        if (key === 'zona6') return true // zona6 es para todas las demás ciudades
        return zona.ciudades.includes(formulario.ciudad)
      })
      
      if (zona) {
        setCotizacionEnvio({
          zona: zona[0],
          ...zona[1]
        })
      }
    } else {
      setCotizacionEnvio(null)
    }
  }, [formulario.ciudad])

  // Verificar si contraentrega está disponible
  const contraentregaDisponible = ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'].includes(formulario.ciudad)

  const handleChange = (field, value) => {
    setFormulario({ ...formulario, [field]: value })
  }

  const handleSubmit = async () => {
    setCargando(true)
    setError("")
    
    try {
      // Validaciones
      if (!formulario.nombre || !formulario.email || !formulario.telefono || !formulario.ciudad || !formulario.direccion || !formulario.metodoPago) {
        setError("Por favor completa todos los campos obligatorios")
        setCargando(false)
        return
      }

      // Validar stock actual antes de proceder
      console.log("Validando stock antes del pago...");
      const stockErrors = [];
      
      for (const item of items) {
        const { data: producto, error } = await supabase
          .from('productos')
          .select('stock, nombre')
          .eq('id', item.id)
          .single();
          
        if (error) {
          console.error('Error obteniendo producto:', error);
          continue;
        }
        
        if (!producto) {
          stockErrors.push(`Producto "${item.nombre}" no encontrado`);
          continue;
        }
        
        if (producto.stock < item.cantidad) {
          stockErrors.push({
            id: item.id,
            nombre: producto.nombre,
            disponible: producto.stock,
            solicitado: item.cantidad
          });
        }
      }
      
      // Si hay errores de stock, mostrar alerta
      if (stockErrors.length > 0) {
        const problemas = stockErrors.map(error => {
          if (typeof error === 'string') return error;
          return `${error.nombre}: quieres ${error.solicitado}, solo quedan ${error.disponible} disponibles`;
        }).join('\n');
        
        const accion = confirm(
          `⚠️ PROBLEMA DE STOCK:\n\n${problemas}\n\n` +
          `¿Quieres ajustar automáticamente la cantidad a la disponible?\n\n` +
          `• OK: Ajustar cantidad automáticamente\n` +
          `• Cancelar: Cancelar compra`
        );
        
        if (accion) {
          // Para compra rápida, ajustamos la cantidad del único item
          const error = stockErrors[0];
          if (error.disponible > 0) {
            // Actualizar la cantidad en el store
            actualizarCantidad(error.id, error.disponible);
            alert(`✅ Cantidad ajustada a ${error.disponible} unidades disponibles.`);
          } else {
            setError("Producto agotado. No se puede completar la compra.");
            setCargando(false);
            return;
          }
        } else {
          setCargando(false);
          return;
        }
      }

      // Si es contraentrega, crear pedido y redirigir al resultado
      if (formulario.metodoPago === 'contraentrega') {
        const pedidoData = {
          nombre: formulario.nombre,
          email: formulario.email,
          telefono: formulario.telefono,
          departamento: formulario.departamento,
          ciudad: formulario.ciudad,
          direccion: formulario.direccion,
          referencia: formulario.referencia,
          metodo_pago: formulario.metodoPago,
          proveedor_envio: cotizacionEnvio?.empresa || 'Envío estándar',
          costo_envio: costoEnvio,
          tiempo_entrega: cotizacionEnvio?.tiempo || '6-8 días',
          zona_envio: cotizacionEnvio?.zona || 'zona6',
          subtotal,
          total,
          items,
          estado: 'pagado' // Contraentrega se considera pagado inmediatamente
        };
        
        const { data: pedido, error: errorPedido } = await supabase
          .from('pedidos')
          .insert([pedidoData])
          .select()
          .single();
        
        if (errorPedido) {
          console.error('Error al crear pedido:', errorPedido);
          setError("Error al procesar el pedido. Intenta de nuevo.");
          setCargando(false);
          return;
        }

        // Actualizar stock para contraentrega
        try {
          const stockResponse = await fetch('/api/actualizar-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
          });
          
          const stockResult = await stockResponse.json();
          console.log('Resultado actualización stock:', stockResult);
          
          if (!stockResult.success) {
            console.warn('Algunos productos no pudieron actualizar stock:', stockResult.errores);
          }
        } catch (stockError) {
          console.error('Error actualizando stock:', stockError);
          // No fallar el pedido si hay error de stock
        }

        limpiar();
        router.push(`/checkout/resultado?status=contraentrega&id=${pedido.id}`);
        return;
      }

      // Para otros métodos de pago (tarjetas y PSE), crear preferencia de MercadoPago
      const response = await fetch('/api/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          formulario: {
            ...formulario,
            envioSeleccionado: cotizacionEnvio
          },
          subtotal,
          envio: costoEnvio,
          total
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }
      
      const data = await response.json();
      
      if (data.url) {
        // Redirigir a MercadoPago
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error) {
      console.error("Error procesando pedido:", error);
      setError("Error al procesar el pedido: " + error.message);
    } finally {
      setCargando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white mb-4">No hay productos</h1>
          <Link href="/productos" className="text-green-400 hover:underline">Ver productos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex items-center gap-2 mb-4">
          <Link href="/productos" className="text-zinc-400 hover:text-green-400 transition text-sm">
            Productos
          </Link>
          <ChevronRight size={14} className="text-zinc-400" />
          <span className="text-zinc-400 text-sm">Compra rápida</span>
        </div>

        <h1 className="text-4xl font-black mb-10">
          Compra <span className="text-green-400">rápida</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulario */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Información del cliente */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center">1</span>
                Información de contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-500 text-sm font-medium">Nombre completo *</label>
                  <input
                    value={formulario.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Juan Pérez"
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-500 text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    value={formulario.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="juan@email.com"
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-zinc-500 text-sm font-medium">Teléfono / WhatsApp *</label>
                  <input
                    value={formulario.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    placeholder="3001234567"
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center">2</span>
                Dirección de envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Departamento"
                  value={formulario.departamento}
                  onChange={(value) => {
                    handleChange("departamento", value)
                    handleChange("ciudad", "")
                  }}
                  options={Object.keys(DEPARTAMENTOS_CIUDADES)}
                  placeholder="Selecciona departamento"
                  required
                />
                <SearchableSelect
                  label="Ciudad"
                  value={formulario.ciudad}
                  onChange={(value) => handleChange("ciudad", value)}
                  options={formulario.departamento ? DEPARTAMENTOS_CIUDADES[formulario.departamento] || [] : []}
                  placeholder="Selecciona ciudad"
                  required
                />
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-zinc-500 text-sm font-medium">Dirección *</label>
                  <input
                    value={formulario.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    placeholder="Calle 45 # 32 - 15"
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-zinc-500 text-sm font-medium">Referencia</label>
                  <textarea
                    value={formulario.referencia}
                    onChange={(e) => handleChange("referencia", e.target.value)}
                    placeholder="Apto 301, edificio azul, portón negro..."
                    rows={3}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition resize-none"
                  />
                </div>
              </div>

              {/* Cotización de envío */}
              {cotizacionEnvio && (
                <div className="mt-4 p-4 bg-green-400/5 border border-green-400/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={16} className="text-green-400" />
                    <span className="font-medium text-zinc-800 dark:text-white text-sm">
                      {cotizacionEnvio.nombre}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 space-y-1">
                    <p>Costo de envío: <span className="text-green-400 font-bold">${cotizacionEnvio.precio.toLocaleString()}</span></p>
                    <p>Tiempo estimado: {cotizacionEnvio.tiempo}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center">3</span>
                Método de pago
              </h2>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  formulario.metodoPago === "tarjeta"
                    ? "border-green-400 bg-green-400/5"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={formulario.metodoPago === "tarjeta"}
                    onChange={(e) => handleChange("metodoPago", e.target.value)}
                    className="accent-green-400"
                  />
                  <CreditCard size={20} className="text-green-400" />
                  <div>
                    <p className="text-zinc-800 dark:text-white font-medium text-sm">Tarjeta débito / crédito</p>
                    <p className="text-zinc-500 text-xs">Visa, Mastercard, Amex</p>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  formulario.metodoPago === "pse"
                    ? "border-green-400 bg-green-400/5"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="pse"
                    checked={formulario.metodoPago === "pse"}
                    onChange={(e) => handleChange("metodoPago", e.target.value)}
                    className="accent-green-400"
                  />
                  <Building2 size={20} className="text-green-400" />
                  <div>
                    <p className="text-zinc-800 dark:text-white font-medium text-sm">PSE</p>
                    <p className="text-zinc-500 text-xs">Débito desde tu banco</p>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  !contraentregaDisponible
                    ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-700"
                    : formulario.metodoPago === "contraentrega"
                    ? "border-green-400 bg-green-400/5"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="contraentrega"
                    checked={formulario.metodoPago === "contraentrega"}
                    onChange={(e) => handleChange("metodoPago", e.target.value)}
                    disabled={!contraentregaDisponible}
                    className="accent-green-400"
                  />
                  <Wallet size={20} className="text-green-400" />
                  <div>
                    <p className="text-zinc-800 dark:text-white font-medium text-sm">Contra entrega</p>
                    <p className="text-zinc-500 text-xs">
                      {contraentregaDisponible 
                        ? "Paga cuando recibas el producto" 
                        : "Solo disponible en Bucaramanga, Floridablanca, Girón y Piedecuesta"
                      }
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Resumen móvil (visible solo en móvil) */}
            <div className="lg:hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-zinc-800 dark:text-white">Total del pedido</h3>
                <span className="text-2xl font-black text-green-400">${total.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal ({items.length} producto{items.length !== 1 ? 's' : ''})</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Envío</span>
                  <span>{costoEnvio > 0 ? `$${costoEnvio.toLocaleString()}` : 'Calculando...'}</span>
                </div>
              </div>
            </div>

            {/* Botón de finalizar */}
            <button
              onClick={handleSubmit}
              disabled={cargando || !formulario.nombre || !formulario.email || !formulario.telefono || !formulario.ciudad || !formulario.direccion || !formulario.metodoPago}
              className="bg-green-400 text-black font-black px-8 py-4 rounded-xl hover:bg-green-300 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              <Lock size={20} />
              {cargando ? "Procesando pedido..." : `Confirmar pedido - $${total.toLocaleString()}`}
              {!cargando && <ArrowRight size={20} />}
            </button>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Resumen lateral */}
          <div className="hidden lg:block">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-zinc-800 dark:text-white mb-4">Resumen del pedido</h3>
              
              {/* Productos */}
              <div className="flex flex-col gap-3 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800" 
                      />
                      <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {item.cantidad}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-800 dark:text-white text-sm font-medium truncate mb-1">
                        {item.nombre}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        ${item.precio.toLocaleString()} × {item.cantidad}
                      </p>
                    </div>
                    <p className="text-green-400 font-bold text-sm flex-shrink-0">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotales */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-4">
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>Subtotal ({items.length} producto{items.length !== 1 ? 's' : ''})</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>Envío</span>
                  <span>{costoEnvio > 0 ? `$${costoEnvio.toLocaleString()}` : 'Calculando...'}</span>
                </div>
                {cotizacionEnvio && (
                  <p className="text-xs text-zinc-400 mb-2">
                    {cotizacionEnvio.nombre} • {cotizacionEnvio.tiempo}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-800 dark:text-white font-bold">Total</span>
                  <span className="text-2xl font-black text-green-400">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Garantías */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Lock size={12} className="text-green-400" />
                  <span>Pago 100% seguro con SSL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Truck size={12} className="text-green-400" />
                  <span>Envío a todo Colombia</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Shield size={12} className="text-green-400" />
                  <span>Garantía en todos los productos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <CheckCircle size={12} className="text-green-400" />
                  <span>Soporte técnico incluido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}