/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />

import './types/three.d.ts';

declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}
