"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

interface Canvas3DProps {
  productColor?: string;
}

export default function Canvas3D({ productColor = "#d4d4d8" }: Canvas3DProps) {
  // Use a smooth spring transition for the material color
  const { color } = useSpring({
    color: productColor,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <div className="w-full h-full bg-transparent flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Animated mesh with smooth color transitions */}
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <animated.meshStandardMaterial color={color as any} wireframe />
        </mesh>
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
