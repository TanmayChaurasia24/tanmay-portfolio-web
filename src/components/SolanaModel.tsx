
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const SolanaLogo = () => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        {/* Main purple sphere */}
        <Sphere args={[1, 32, 32]} scale={1}>
          <MeshDistortMaterial 
            color="#9945FF" 
            attach="material" 
            distort={0.4} 
            speed={2} 
            roughness={0.1} 
            metalness={0.8}
          />
        </Sphere>
        
        {/* Smaller blue sphere */}
        <Sphere args={[0.5, 32, 32]} position={[1.2, 0.5, 0]}>
          <MeshDistortMaterial 
            color="#14F195" 
            attach="material" 
            distort={0.2} 
            speed={3} 
            roughness={0.3}
          />
        </Sphere>
        
        {/* Even smaller green sphere */}
        <Sphere args={[0.3, 32, 32]} position={[-1, -0.7, 0.5]}>
          <MeshDistortMaterial 
            color="#00C2FF" 
            attach="material" 
            distort={0.4} 
            speed={4} 
            roughness={0.2}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

const SolanaModel = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <SolanaLogo />
    </Canvas>
  );
};

export default SolanaModel;
