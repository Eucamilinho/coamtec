import { NextResponse } from "next/server";

// API para notificar a Google y Bing de actualizaciones del sitemap
// Llamar después de crear/actualizar productos
export async function POST() {
  const sitemapUrl = "https://coamtec.com/sitemap.xml";
  const results = { google: null, bing: null };

  try {
    // Ping a Google
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const googleRes = await fetch(googleUrl);
    results.google = googleRes.ok ? "success" : "failed";
  } catch (e) {
    results.google = "error";
  }

  try {
    // Ping a Bing
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bingRes = await fetch(bingUrl);
    results.bing = bingRes.ok ? "success" : "failed";
  } catch (e) {
    results.bing = "error";
  }

  return NextResponse.json({ 
    message: "Sitemap ping enviado", 
    results,
    sitemap: sitemapUrl 
  });
}

export async function GET() {
  return NextResponse.json({ 
    info: "POST a esta ruta para notificar a Google/Bing de actualizaciones del sitemap" 
  });
}
