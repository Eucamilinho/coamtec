export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/checkout/resultado/"],
      },
    ],
    sitemap: "https://coamtec.com/sitemap.xml",
  };
}
