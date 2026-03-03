"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Environment } from "@react-three/drei";

// URL del modelo en Supabase Storage
const MODEL_URL = "https://lraxahespfbnnelztrjg.supabase.co/storage/v1/object/public/assets/pato.glb";

// Modelo GLB con movimiento suave
function Model() {
  const groupRef = useRef();
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotación más suave y lenta
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={1.2} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Teclado3D({ className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[150px] ${className}`}>
      {isVisible && (
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{ position: [0, 2, 5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "default"
            }}
            style={{ background: "transparent" }}
          >
            {/* Iluminación suave */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 2, -5]} intensity={0.3} />
            
            <Model />
            
            {/* Environment para reflexiones realistas */}
            <Environment preset="studio" environmentIntensity={0.4} />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
