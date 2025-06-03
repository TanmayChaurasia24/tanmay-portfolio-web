
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const SolanaLogo = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef}>
        {/* Main purple sphere */}
        <Sphere args={[1, 32, 32]} scale={1}>
          <MeshDistortMaterial 
            color="#9945FF" 
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
            distort={0.2} 
            speed={3} 
            roughness={0.3}
          />
        </Sphere>
        
        {/* Even smaller green sphere */}
        <Sphere args={[0.3, 32, 32]} position={[-1, -0.7, 0.5]}>
          <MeshDistortMaterial 
            color="#00C2FF" 
            distort={0.4} 
            speed={4} 
            roughness={0.2}
          />
        </Sphere>
      </group>
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
