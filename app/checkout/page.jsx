"use client";

import { useState, useRef, useEffect } from "react";
import { useCarrito } from "../store/carritoStore";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Truck,
  Shield,
  CreditCard,
  Building2,
  Wallet,
  ArrowLeft,
  Package,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";

// Sistema de zonificación para envíos desde Bucaramanga
const ZONAS_ENVIO = {
  // Zona 1: Área metropolitana y Santander (local)
  zona1: {
    departamentos: ["Santander"],
    ciudades: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "Socorro", "San Gil"],
    factor: 1.0,
    tiempoBase: "1 día hábil"
  },
  // Zona 2: Departamentos vecinos
  zona2: {
    departamentos: ["Norte de Santander", "Boyacá", "Cesar"],
    factor: 1.4,
    tiempoBase: "1-2 días hábiles"
  },
  // Zona 3: Centro del país (principales ciudades)
  zona3: {
    departamentos: ["Cundinamarca", "Antioquia", "Caldas", "Risaralda", "Quindío", "Tolima", "Huila"],
    factor: 1.8,
    tiempoBase: "2-3 días hábiles"
  },
  // Zona 4: Costa Atlántica
  zona4: {
    departamentos: ["Atlántico", "Bolívar", "Magdalena", "La Guajira", "Córdoba", "Sucre"],
    factor: 2.2,
    tiempoBase: "2-4 días hábiles"
  },
  // Zona 5: Sur y occidente del país
  zona5: {
    departamentos: ["Valle del Cauca", "Cauca", "Nariño", "Meta", "Casanare"],
    factor: 2.8,
    tiempoBase: "3-5 días hábiles"
  },
  // Zona 6: Regiones apartadas
  zona6: {
    departamentos: ["Chocó", "Amazonas", "Caquetá", "Putumayo", "Arauca", "Guainía", "Guaviare", "Vaupés", "Vichada"],
    factor: 4.0,
    tiempoBase: "5-8 días hábiles"
  }
};

// Función para determinar zona de envío
const obtenerZonaEnvio = (departamento, ciudad) => {
  // Primero verificar si es Bucaramanga mismo (zona especial)
  if (departamento === "Santander" && ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"].includes(ciudad)) {
    return { ...ZONAS_ENVIO.zona1, zona: "zona1", factor: 0.8 }; // Descuento local
  }
  
  // Buscar en qué zona está el departamento
  for (const [zonaKey, zonaData] of Object.entries(ZONAS_ENVIO)) {
    if (zonaData.departamentos.includes(departamento)) {
      return { ...zonaData, zona: zonaKey };
    }
  }
  
  // Por defecto, zona 6 (más cara) para departamentos no clasificados
  return { ...ZONAS_ENVIO.zona6, zona: "zona6" };
};

// Simulación de APIs de empresas de mensajería con precios realistas
const cotizarServientrega = async (origen, destino, departamento, peso, valorDeclarado) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const zonaDestino = obtenerZonaEnvio(departamento, destino);
  const basePrice = 8500; // Precio base más realista
  const weightFactor = Math.ceil(peso / 1000) * 1800;
  const zoneFactor = zonaDestino.factor;
  const insuranceFactor = valorDeclarado > 200000 ? 1.15 : (valorDeclarado > 100000 ? 1.08 : 1);
  
  const precio = Math.round((basePrice * zoneFactor + weightFactor) * insuranceFactor);
  
  return {
    empresa: "Servientrega",
    precio: Math.max(precio, 6500), // Mínimo $6.500
    tiempoEntrega: zonaDestino.tiempoBase,
    confiable: true,
    zona: zonaDestino.zona
  };
};

const cotizarEnvia = async (origen, destino, departamento, peso, valorDeclarado) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const zonaDestino = obtenerZonaEnvio(departamento, destino);
  const basePrice = 7200; // Envía suele ser más económico
  const weightFactor = Math.ceil(peso / 1000) * 1600;
  const zoneFactor = zonaDestino.factor;
  const insuranceFactor = valorDeclarado > 200000 ? 1.12 : (valorDeclarado > 100000 ? 1.06 : 1);
  
  const precio = Math.round((basePrice * zoneFactor + weightFactor) * insuranceFactor);
  
  return {
    empresa: "Envía",
    precio: Math.max(precio, 5800), // Mínimo $5.800
    tiempoEntrega: zonaDestino.tiempoBase,
    confiable: true,
    zona: zonaDestino.zona
  };
};

const cotizarInterrapidisimo = async (origen, destino, departamento, peso, valorDeclarado) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const zonaDestino = obtenerZonaEnvio(departamento, destino);
  const basePrice = 9800; // Más caro pero más rápido
  const weightFactor = Math.ceil(peso / 1000) * 2000;
  const zoneFactor = zonaDestino.factor * 0.85; // Descuento por velocidad
  const insuranceFactor = valorDeclarado > 200000 ? 1.18 : (valorDeclarado > 100000 ? 1.10 : 1);
  
  const precio = Math.round((basePrice * zoneFactor + weightFactor) * insuranceFactor);
  
  // Ajustar tiempo de entrega (más rápido)
  let tiempoAjustado = zonaDestino.tiempoBase;
  if (zonaDestino.zona === "zona2" || zonaDestino.zona === "zona3") {
    tiempoAjustado = "1-2 días hábiles";
  } else if (zonaDestino.zona === "zona4" || zonaDestino.zona === "zona5") {
    tiempoAjustado = "2-3 días hábiles";
  }
  
  return {
    empresa: "Interrapidísimo",
    precio: Math.max(precio, 7500), // Mínimo $7.500
    tiempoEntrega: tiempoAjustado,
    confiable: true,
    zona: zonaDestino.zona
  };
};

// Componente SearchableSelect
function SearchableSelect({ options, value, onChange, placeholder, disabled, error, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name: label.toLowerCase(), value: option } });
    setIsOpen(false);
    setSearch("");
  };

  const displayValue = value || placeholder;

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-pointer transition flex items-center justify-between ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-green-400 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-500'
        } ${
          error ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
        }`}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Buscar ${label.toLowerCase()}...`}
              className="flex-1 outline-none bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <span className={value ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}>
            {displayValue}
          </span>
        )}
        <ChevronDown 
          size={16} 
          className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer transition hover:bg-zinc-50 dark:hover:bg-zinc-700 ${
                  value === option ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'
                }`}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-zinc-500 text-center">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Ciudades donde está disponible contraentrega
const CIUDADES_CONTRAENTREGA = ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"];

// Datos de departamentos y ciudades de Colombia
const DEPARTAMENTOS_CIUDADES = {
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "Socorro", "San Gil"],
  "Cundinamarca": ["Bogotá", "Soacha", "Facatativá", "Chía", "Zipaquirá", "Fusagasugá", "Girardot"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Sabaneta", "Apartadó", "Turbo"],
  "Valle del Cauca": ["Cali", "Palmira", "Tuluá", "Cartago", "Buga", "Jamundí", "Yumbo"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"],
  "Norte de Santander": ["Cúcuta", "Villa del Rosario", "Los Patios", "Pamplona", "Ocaña"],
  "Córdoba": ["Montería", "Lorica", "Cereté", "Sahagún", "Planeta Rica"],
  "Sucre": ["Sincelejo", "Corozal", "Sampués", "San Marcos", "Tolú"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Zona Bananera", "Aracataca"],
  "La Guajira": ["Riohacha", "Maicao", "Valledupar", "Fonseca", "San Juan del Cesar"],
  "Cesar": ["Valledupar", "Aguachica", "Bosconia", "Codazzi", "La Jagua de Ibirico"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda", "Chaparral"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "Caldas": ["Manizales", "Villamaría", "Chinchiná", "La Dorada", "Riosucio"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Quimbaya"],
  "Meta": ["Villavicencio", "Acacías", "Granada", "San Martín", "Puerto López"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva", "Monterrey", "Tauramena"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres", "Samaniego"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "La Montañita", "Curillo"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Orito", "Valle del Guamuez"],
  "Amazonas": ["Leticia", "Puerto Nariño", "La Chorrera"],
  "Arauca": ["Arauca", "Saravena", "Tame", "Fortul"],
  "Chocó": ["Quibdó", "Istmina", "Condoto", "Acandí"],
  "Guainía": ["Inírida", "Barranco Minas"],
  "Guaviare": ["San José del Guaviare", "Calamar"],
  "Vaupés": ["Mitú", "Carurú"],
  "Vichada": ["Puerto Carreño", "La Primavera"]
};

export default function Checkout() {
  const { items, vaciarCarrito, actualizarCantidad, eliminarDelCarrito } = useCarrito();
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    referencia: "",
    metodoPago: "contraentrega",
  });

  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);
  const [opcionesEnvio, setOpcionesEnvio] = useState([]);
  const [cotizandoEnvio, setCotizandoEnvio] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
  const router = useRouter();

  // Función para calcular peso total del pedido
  const calcularPesoTotal = (items) => {
    return items.reduce((total, item) => {
      // Usar peso real del producto si está disponible, sino usar estimado
      const pesoProducto = item.peso && item.peso > 0 ? parseInt(item.peso) : 500; // 500g por defecto
      return total + (pesoProducto * item.cantidad);
    }, 0);
  };

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envio = 0; // TEMPORAL: Envío gratis para pruebas de pago
  const total = subtotal + envio;
  
  // Verificar si contraentrega está disponible para la ciudad seleccionada
  const contraentregaDisponible = CIUDADES_CONTRAENTREGA.includes(formulario.ciudad);
  
  // Función para cotizar envío con todas las empresas
  const cotizarEnvios = async (ciudad, departamento) => {
    if (!ciudad || !departamento) return;
    
    setCotizandoEnvio(true);
    setOpcionesEnvio([]);
    setEnvioSeleccionado(null);
    
    try {
      const pesoTotal = calcularPesoTotal(items);
      const valorDeclarado = subtotal;
      const origen = "Bucaramanga"; // Ciudad origen de la tienda
      const destino = ciudad;
      
      // Cotizar con todas las empresas en paralelo
      const [servientrega, envia, interrapidisimo] = await Promise.all([
        cotizarServientrega(origen, destino, departamento, pesoTotal, valorDeclarado),
        cotizarEnvia(origen, destino, departamento, pesoTotal, valorDeclarado),
        cotizarInterrapidisimo(origen, destino, departamento, pesoTotal, valorDeclarado)
      ]);
      
      const opciones = [servientrega, envia, interrapidisimo]
        .filter(opcion => opcion.confiable)
        .sort((a, b) => a.precio - b.precio); // Ordenar por precio
      
      setOpcionesEnvio(opciones);
      
      // Auto-seleccionar la opción más económica si hay opciones disponibles
      if (opciones.length > 0) {
        setEnvioSeleccionado(opciones[0]);
      }
      
    } catch (error) {
      console.error('Error cotizando envíos:', error);
      // Fallback a precio fijo si falla la cotización
      const fallback = {
        empresa: "Envío estándar",
        precio: subtotal >= 150000 ? 0 : 15000,
        tiempoEntrega: "3-5 días hábiles",
        confiable: true
      };
      setOpcionesEnvio([fallback]);
      setEnvioSeleccionado(fallback);
    } finally {
      setCotizandoEnvio(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si se cambia el departamento, actualizar las ciudades y limpiar la ciudad seleccionada
    if (name === "departamento") {
      setCiudadesDisponibles(DEPARTAMENTOS_CIUDADES[value] || []);
      setFormulario(prev => ({ ...prev, departamento: value, ciudad: "", metodoPago: "transferencia" }));
    }
    // Si se cambia la ciudad, verificar si contraentrega está disponible
    else if (name === "ciudad") {
      const contraentregaDisponible = CIUDADES_CONTRAENTREGA.includes(value);
      setFormulario(prev => ({
        ...prev,
        ciudad: value,
        metodoPago: !contraentregaDisponible && prev.metodoPago === "contraentrega" ? "transferencia" : prev.metodoPago
      }));      
      // Cotizar envío cuando se selecciona la ciudad
      cotizarEnvios(value, formulario.departamento);      
      // Cotizar envío cuando se selecciona la ciudad
      cotizarEnvios(value, formulario.departamento);
    }
    else {
      setFormulario({ ...formulario, [name]: value });
    }
    
    // Limpiar error del campo al empezar a escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "Nombre requerido";
    if (!formulario.email.trim()) nuevosErrores.email = "Email requerido";
    if (!formulario.telefono.trim()) nuevosErrores.telefono = "Teléfono requerido";
    if (!formulario.departamento.trim()) nuevosErrores.departamento = "Departamento requerido";
    if (!formulario.ciudad.trim()) nuevosErrores.ciudad = "Ciudad requerida";
    if (!formulario.direccion.trim()) nuevosErrores.direccion = "Dirección requerida";
    
    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formulario.email && !emailRegex.test(formulario.email)) {
      nuevosErrores.email = "Email inválido";
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarPedido = async () => {
    if (!validarFormulario()) return;
    
    setCargando(true);
    
    try {
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
      
      // Si hay errores de stock, mostrar alerta con opciones
      if (stockErrors.length > 0) {
        const problemas = stockErrors.map(error => {
          if (typeof error === 'string') return error;
          return `${error.nombre}: tienes ${error.solicitado} en carrito, solo quedan ${error.disponible} disponibles`;
        }).join('\n');
        
        const accion = confirm(
          `⚠️ PROBLEMA DE STOCK:\n\n${problemas}\n\n` +
          `¿Quieres ajustar automáticamente las cantidades a las disponibles?\n\n` +
          `• OK: Ajustar cantidades automáticamente\n` +
          `• Cancelar: Ir al carrito para ajustar manualmente`
        );
        
        if (accion) {
          // Ajustar cantidades automáticamente
          for (const error of stockErrors) {
            if (typeof error === 'object') {
              if (error.disponible > 0) {
                actualizarCantidad(error.id, error.disponible);
              } else {
                eliminarDelCarrito(error.id);
              }
            }
          }
          
          alert('✅ Cantidades ajustadas. Puedes proceder con el pago.');
          setCargando(false);
          return;
        } else {
          // Redirigir al carrito
          router.push('/carrito');
          setCargando(false);
          return;
        }
      }
      
      // Si es contraentrega, solo crear pedido y redirigir
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
          proveedor_envio: envioSeleccionado ? envioSeleccionado.empresa : 'Envío estándar',
          costo_envio: envio,
          tiempo_entrega: envioSeleccionado ? envioSeleccionado.tiempoEntrega : '3-5 días hábiles',
          zona_envio: envioSeleccionado ? envioSeleccionado.zona : 'zona3',
          subtotal,
          total,
          items,
          estado: 'pagado' // Contraentrega se considera pagado inmediatamente
        };
        
        const { error } = await supabase
          .from('pedidos')
          .insert([pedidoData]);
        
        if (error) throw error;

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
        
        vaciarCarrito();
        router.push("/checkout/resultado?status=contraentrega");
        return;
      }
      
      // Para tarjetas y PSE, usar MercadoPago
      const response = await fetch('/api/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          formulario: {
            ...formulario,
            envioSeleccionado
          },
          subtotal,
          envio,
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
      alert("Error al procesar el pedido: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Package size={64} className="mx-auto mb-6 text-zinc-300 dark:text-zinc-600" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Agrega productos para continuar con el checkout
          </p>
          <Link 
            href="/productos"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/carrito"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              Finalizar pedido
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Completa tu información para procesar el envío
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información personal */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone size={20} className="text-green-500" />
                Información de contacto
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errores.nombre ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errores.email ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errores.email && (
                    <p className="text-red-500 text-sm mt-1">{errores.email}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                    placeholder="3001234567"
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errores.telefono ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errores.telefono && (
                    <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-green-500" />
                Dirección de envío
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Departamento *
                  </label>
                  <SearchableSelect
                    label="Departamento"
                    options={Object.keys(DEPARTAMENTOS_CIUDADES)}
                    value={formulario.departamento}
                    onChange={handleChange}
                    placeholder="Selecciona un departamento"
                    error={errores.departamento}
                  />
                  {errores.departamento && (
                    <p className="text-red-500 text-sm mt-1">{errores.departamento}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Ciudad *
                  </label>
                  <SearchableSelect
                    label="Ciudad"
                    options={ciudadesDisponibles}
                    value={formulario.ciudad}
                    onChange={handleChange}
                    placeholder={formulario.departamento ? "Selecciona una ciudad" : "Primero selecciona un departamento"}
                    disabled={!formulario.departamento}
                    error={errores.ciudad}
                  />
                  {errores.ciudad && (
                    <p className="text-red-500 text-sm mt-1">{errores.ciudad}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formulario.direccion}
                    onChange={handleChange}
                    placeholder="Calle 45 # 32-15, Apartamento 301"
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      errores.direccion ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errores.direccion && (
                    <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Referencia o indicaciones adicionales
                  </label>
                  <textarea
                    name="referencia"
                    value={formulario.referencia}
                    onChange={handleChange}
                    placeholder="Ej: Casa blanca con portón verde, timbre amarillo"
                    rows={3}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Opciones de envío */}
            {formulario.ciudad && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-green-500" />
                  Opciones de envío
                </h2>
                
                {cotizandoEnvio ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Cotizando envío con Servientrega, Envía e Interrapidísimo...</span>
                    </div>
                  </div>
                ) : opcionesEnvio.length > 0 ? (
                  <div className="space-y-3">
                    {opcionesEnvio.map((opcion, index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                          envioSeleccionado?.empresa === opcion.empresa
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="envio"
                          checked={envioSeleccionado?.empresa === opcion.empresa}
                          onChange={() => setEnvioSeleccionado(opcion)}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {opcion.empresa}
                            </p>
                            {index === 0 && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                                Más económico
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Entrega: {opcion.tiempoEntrega}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {opcion.precio === 0 ? '¡Gratis!' : `$${opcion.precio.toLocaleString()}`}
                          </p>
                          {opcion.precio > 0 && subtotal >= 150000 && (
                            <p className="text-xs text-green-600 dark:text-green-400">Envío gratis aplicado</p>
                          )}
                        </div>
                      </label>
                    ))}
                    
                    <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div>
                          <p><strong>Peso estimado:</strong> {(calcularPesoTotal(items) / 1000).toFixed(1)} kg</p>
                          <p><strong>Valor declarado:</strong> ${subtotal.toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong>Origen:</strong> Bucaramanga, Santander</p>
                          <p><strong>Destino:</strong> {formulario.ciudad}, {formulario.departamento}</p>
                        </div>
                      </div>
                      
                      {envioSeleccionado?.zona && (
                        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              envioSeleccionado.zona === 'zona1' ? 'bg-green-500' :
                              envioSeleccionado.zona === 'zona2' ? 'bg-blue-500' :
                              envioSeleccionado.zona === 'zona3' ? 'bg-yellow-500' :
                              envioSeleccionado.zona === 'zona4' ? 'bg-orange-500' :
                              envioSeleccionado.zona === 'zona5' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {
                                envioSeleccionado.zona === 'zona1' ? 'Zona Local' :
                                envioSeleccionado.zona === 'zona2' ? 'Zona Regional' :
                                envioSeleccionado.zona === 'zona3' ? 'Zona Nacional' :
                                envioSeleccionado.zona === 'zona4' ? 'Zona Costa' :
                                envioSeleccionado.zona === 'zona5' ? 'Zona Sur/Occidente' :
                                'Zona Especial'
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : formulario.ciudad ? (
                  <div className="text-center py-6 text-zinc-500">
                    <Truck size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No se pudieron cargar opciones de envío</p>
                    <button
                      onClick={() => cotizarEnvios(formulario.ciudad, formulario.departamento)}
                      className="mt-2 text-green-500 hover:text-green-600 text-sm"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Método de pago */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-green-500" />
                Método de pago
              </h2>
              
              <div className="space-y-3">
                {contraentregaDisponible ? (
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                    formulario.metodoPago === "contraentrega" 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="contraentrega"
                      checked={formulario.metodoPago === "contraentrega"}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-500 focus:ring-green-500"
                    />
                    <Wallet size={20} className="text-zinc-600 dark:text-zinc-400" />
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-white">Contraentrega</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Paga cuando recibas tu pedido</p>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                      Recomendado
                    </span>
                  </label>
                ) : (
                  <div className="p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl opacity-50">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        disabled
                        className="w-4 h-4 text-zinc-300"
                      />
                      <Wallet size={20} className="text-zinc-400" />
                      <div className="flex-1">
                        <p className="font-medium text-zinc-500">Contraentrega</p>
                        <p className="text-sm text-zinc-400">Solo disponible en Bucaramanga, Floridablanca, Girón y Piedecuesta</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                  formulario.metodoPago === "transferencia" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={formulario.metodoPago === "transferencia"}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-500 focus:ring-green-500"
                  />
                  <Building2 size={20} className="text-zinc-600 dark:text-zinc-400" />
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-white">Transferencia bancaria</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Consigna o transferencia a nuestra cuenta</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                Resumen del pedido
              </h2>
              
              {/* Lista de productos */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Subtotal ({items.reduce((acc, i) => acc + i.cantidad, 0)} productos)
                  </span>
                  <span className="text-zinc-900 dark:text-white">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Envío</span>
                  <div className="text-right">
                    <span className={`${envio === 0 ? 'text-green-500 font-semibold' : 'text-zinc-900 dark:text-white'}`}>
                      {envio === 0 ? '¡Gratis!' : `$${envio.toLocaleString()}`}
                    </span>
                    {envioSeleccionado && (
                      <p className="text-xs text-zinc-500">
                        {envioSeleccionado.empresa}
                      </p>
                    )}
                  </div>
                </div>
                
                {subtotal >= 150000 && (
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Envío gratis por compra mayor a $150.000
                  </div>
                )}
                
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-semibold">
                  <span className="text-zinc-900 dark:text-white">Total</span>
                  <span className="text-lg text-green-500">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Botón de confirmar pedido */}
              <button
                onClick={procesarPedido}
                disabled={cargando}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                  cargando
                    ? 'bg-zinc-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {cargando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Confirmar pedido
                  </>
                )}
              </button>
              
              {/* Garantías */}
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <Shield size={12} className="text-green-500" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <Truck size={12} className="text-green-500" />
                  <span>Envío a toda Colombia</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <Package size={12} className="text-green-500" />
                  <span>Garantía en todos los productos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
