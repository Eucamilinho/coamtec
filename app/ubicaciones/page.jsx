import { Truck, MapPin, Clock, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "Cobertura y Envíos | Teclados Gamer Bucaramanga - Coam Tec",
  description: "Coam Tec atiende Bucaramanga, Bogotá, Medellín, Cali y toda Colombia. Teclados gamer, mouse gaming y accesorios con envío rápido a tu ciudad.",
  keywords: [
    "teclados bucaramanga",
    "mouse gamer bogotá", 
    "accesorios gaming medellín",
    "periféricos gamer cali",
    "envío colombia gaming",
    "tienda gamer bucaramanga",
    "teclados mecánicos colombia",
    "gaming santander"
  ],
  openGraph: {
    title: "Cobertura Colombia - Teclados Gamer Bucaramanga | Coam Tec",
    description: "Envíos de accesorios gamer a Bucaramanga, Bogotá, Medellín y toda Colombia. Los mejores teclados y mouse gaming.",
    url: "https://coamtec.com/ubicaciones"
  },
  alternates: {
    canonical: "/ubicaciones"
  }
};

const ciudadesPrincipales = [
  {
    ciudad: "Bucaramanga",
    region: "Santander", 
    tiempoEnvio: "1-2 días",
    destacado: true,
    descripcion: "Nuestra base de operaciones. Teclados gamer, mouse mecánicos y audífonos gaming con entrega express en el área metropolitana.",
    productos: ["Teclados mecánicos", "Mouse gamer", "Audífonos gaming", "Micrófonos"]
  },
  {
    ciudad: "Bogotá",
    region: "Cundinamarca",
    tiempoEnvio: "2-3 días", 
    descripcion: "Capital colombiana. Gran selección de accesorios gaming con envío rápido para gamers bogotanos.",
    productos: ["Periféricos RGB", "Teclados inalámbricos", "Mouse ergonómicos"]
  },
  {
    ciudad: "Medellín", 
    region: "Antioquia",
    tiempoEnvio: "2-4 días",
    descripcion: "Ciudad de la eterna primavera. Accesorios gamer premium para la comunidad gaming paisa.",
    productos: ["Teclados premium", "Setup completos", "Accesorios RGB"]
  },
  {
    ciudad: "Cali",
    region: "Valle del Cauca", 
    tiempoEnvio: "3-4 días",
    descripcion: "Sucursal del Valle. Equipos gaming profesionales para competidores caleños.",
    productos: ["Teclados competitivos", "Mouse esports", "Headsets pro"]
  },
  {
    ciudad: "Barranquilla",
    region: "Atlántico",
    tiempoEnvio: "3-5 días", 
    descripcion: "Puerta de oro de Colombia. Accesorios gaming con envío seguro a la costa caribeña.",
    productos: ["Teclados resistentes", "Mouse durables", "Cooling pads"]
  }
];

const coberturaNacional = [
  "Cartagena", "Santa Marta", "Pereira", "Manizales", "Armenia", "Ibagué", 
  "Pasto", "Neiva", "Villavicencio", "Montería", "Valledupar", "Sincelejo",
  "Popayán", "Tunja", "Florencia", "Riohacha", "Quibdó", "Mocoa"
];

export default function UbicacionesPage() {
  const schemaLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://coamtec.com/#organization",
    name: "Coam Tec",
    image: "https://coamtec.com/logo.svg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bucaramanga",
      addressLocality: "Bucaramanga", 
      addressRegion: "Santander",
      addressCountry: "CO"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.119349,
      longitude: -73.1227416
    },
    telephone: "+57-300-000-0000",
    url: "https://coamtec.com",
    priceRange: "$$",
    category: "Tienda de Accesorios Gaming",
    areaServed: ciudadesPrincipales.map(c => ({
      "@type": "City",
      name: c.ciudad + ", " + c.region
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }}
      />
      
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-500 to-green-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="block">Teclados Gamer en</span>  
                <span className="block text-black">Bucaramanga y toda Colombia</span>
              </h1>
              <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Desde Bucaramanga llevamos los mejores accesorios gaming a toda Colombia. 
                Teclados mecánicos, mouse gamer y más con envío rápido a tu ciudad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-green-100">
                  <MapPin size={20} />
                  <span>Base: Bucaramanga, Santander</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <Truck size={20} />
                  <span>Envío a toda Colombia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ciudades Principales */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                Cobertura en Principales Ciudades
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Llevamos accesorios gaming premium a las principales ciudades de Colombia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ciudadesPrincipales.map((ciudad, index) => (
                <div 
                  key={ciudad.ciudad}
                  className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    ciudad.destacado 
                      ? 'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-700' 
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {ciudad.destacado && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white mb-4">
                      <MapPin size={12} className="mr-1" />
                      Base Principal
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {ciudad.ciudad}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    {ciudad.region}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                    <Clock size={16} />
                    <span className="text-sm font-medium">Envío: {ciudad.tiempoEnvio}</span>
                  </div>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                    {ciudad.descripcion}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                      Productos destacados:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {ciudad.productos.map((producto) => (
                        <span 
                          key={producto}
                          className="inline-block px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                        >
                          {producto}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cobertura Nacional */}
        <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                También Llegamos a Más Ciudades
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Cobertura nacional completa para accesorios gaming
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {coberturaNacional.map((ciudad) => (
                <div 
                  key={ciudad}
                  className="text-center p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {ciudad}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                ¿No ves tu ciudad? ¡Contáctanos! Hacemos envíos a toda Colombia
              </p>
            </div>
          </div>
        </section>

        {/* Información de Envíos */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                Información de Envíos
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                      Envío Express Bucaramanga
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Entrega en 1-2 días hábiles dentro del área metropolitana de Bucaramanga
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                      Cobertura Nacional
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Llegamos a más de 1000 municipios en toda Colombia con transportadoras confiables
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                      Soporte Local
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Atención personalizada desde Bucaramanga para resolver todas tus dudas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                      Seguimiento Completo
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Rastrea tu pedido en tiempo real desde Bucaramanga hasta tu ciudad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}