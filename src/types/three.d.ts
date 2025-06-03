
import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
      sphereGeometry: ReactThreeFiber.Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    }
  }
}
