-- SQL para crear la tabla producto_destacado en Supabase
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Crear la tabla
CREATE TABLE IF NOT EXISTS public.producto_destacado (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  imagen_destacada TEXT,
  tagline TEXT,
  caracteristicas TEXT[],
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_producto_destacado_producto_id ON public.producto_destacado(producto_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.producto_destacado ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Permitir lectura publica" ON public.producto_destacado
  FOR SELECT USING (true);

-- Política para permitir escritura solo a usuarios autenticados
CREATE POLICY "Permitir escritura a usuarios autenticados" ON public.producto_destacado
  FOR ALL USING (auth.role() = 'authenticated');

-- Comentar la tabla
COMMENT ON TABLE public.producto_destacado IS 'Almacena la configuracion del producto destacado en la pagina principal';
