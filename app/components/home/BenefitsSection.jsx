import { ShieldCheck, Truck, Headset, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Despachamos en tiempo récord para que recibas tu pedido sin esperas.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía real",
    description: "Productos originales y respaldo postventa con atención humana.",
  },
  {
    icon: CreditCard,
    title: "Pago seguro",
    description: "Checkout confiable con múltiples medios de pago y protección.",
  },
  {
    icon: Headset,
    title: "Soporte experto",
    description: "Te ayudamos a elegir el producto ideal para tu setup.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">¿Por qué comprar en Coam Tec?</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Experiencia premium de principio a fin, sin complicaciones.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border-none bg-white dark:bg-zinc-950 p-6 shadow-md shadow-zinc-200/80 hover:shadow-lg transition-shadow duration-300 dark:shadow-none">
              <Icon className="text-blue-600 dark:text-green-400" size={20} aria-hidden="true" />
              <h3 className="mt-4 font-bold text-zinc-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
