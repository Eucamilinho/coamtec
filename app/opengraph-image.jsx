import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Coam Tec - Accesorios Gamer Colombia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1020",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(124, 58, 237, 0.25), transparent 35%), radial-gradient(circle at 88% 14%, rgba(0, 229, 255, 0.2), transparent 38%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            COAM
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#22c55e",
              letterSpacing: "-2px",
            }}
          >
            TEC
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Los mejores accesorios gamer de Colombia
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
            fontSize: 20,
            color: "#71717a",
          }}
        >
          <span>🎮 Teclados</span>
          <span>🖱️ Mouse</span>
          <span>🎧 Audífonos</span>
          <span>🎤 Micrófonos</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
