import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camilo R.",
    role: "Streamer",
    text: "La calidad de los periféricos es brutal y el envío llegó al día siguiente. Muy recomendado.",
  },
  {
    name: "Laura M.",
    role: "Diseñadora",
    text: "Compré teclado y mouse, ambos impecables. La atención fue rápida y súper clara.",
  },
  {
    name: "Andrés T.",
    role: "Gamer competitivo",
    text: "Por fin una tienda que combina precio justo con productos top. Volveré a comprar.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Lo que dicen nuestros clientes</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Confianza real construida con cada pedido entregado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((item) => (
          <article key={item.name} className="rounded-2xl border-none bg-white dark:bg-zinc-900 p-6 shadow-md shadow-zinc-200/80 hover:shadow-lg transition-shadow duration-300 dark:shadow-none">
            <div className="flex gap-1 text-yellow-500" role="img" aria-label={`Valoración: 5 de 5 estrellas`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="fill-current" aria-hidden="true" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">“{item.text}”</p>
            <footer className="mt-4">
              <p className="font-semibold text-zinc-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.role}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
