// Función para generar slugs SEO-friendly
export function createSlug(nombre, id) {
  if (!nombre) return `producto-${id}`;
  
  const slug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Quitar guiones del inicio y final
  
  return `${slug}-${id}`;
}

// Función para extraer el ID desde un slug
export function getIdFromSlug(slug) {
  if (!slug) return null;
  const matches = slug.match(/-(\d+)$/);
  return matches ? parseInt(matches[1]) : null;
}

// Función para validar que un slug corresponde a un producto
export function validateSlug(expectedSlug, actualNombre, id) {
  const correctSlug = createSlug(actualNombre, id);
  return expectedSlug === correctSlug;
}

// Función helper para generar enlaces de producto
export function getProductUrl(producto) {
  const slug = createSlug(producto.nombre, producto.id);
  return `/productos/${slug}`;
}