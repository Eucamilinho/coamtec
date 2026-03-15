"use client";

import { Truck, ShieldCheck, CreditCard, Headset } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Envío express",
    description: "Entregas en Bucaramanga y área metropolitana el mismo día.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía real",
    description: "Productos 100% originales con respaldo y soporte postventa.",
  },
  {
    icon: CreditCard,
    title: "Pago contraentrega",
    description: "Paga cuando recibas tu pedido. Sin riesgos, sin preocupaciones.",
  },
  {
    icon: Headset,
    title: "Atención personal",
    description: "Te asesoramos por WhatsApp para elegir el producto ideal.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="w-full bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            Beneficios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            ¿Por qué comprar en Coam Tec?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Experiencia premium de principio a fin
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div 
              key={title}
              className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300"
            >
              {/* Icono */}
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                <Icon size={18} className="text-zinc-600 dark:text-zinc-400" />
              </div>
              
              {/* Texto */}
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
