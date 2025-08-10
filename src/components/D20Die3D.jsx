
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Vertices and faces for a D20 (icosahedron)
function D20Geometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  return geometry;
}


// D20 face centers (approximate, for text placement)
const D20_FACE_CENTERS = [
  [0, 0.934, 0.357], [0.934, 0.357, 0], [0.577, 0.934, 0], [0.934, -0.357, 0], [0.577, -0.934, 0],
  [0, -0.934, 0.357], [-0.934, -0.357, 0], [-0.577, -0.934, 0], [-0.934, 0.357, 0], [-0.577, 0.934, 0],
  [0, 0.934, -0.357], [0.934, 0.357, 0], [0.577, 0.934, 0], [0.934, -0.357, 0], [0.577, -0.934, 0],
  [0, -0.934, -0.357], [-0.934, -0.357, 0], [-0.577, -0.934, 0], [-0.934, 0.357, 0], [-0.577, 0.934, 0],
];

function D20Mesh({ rolling, value, onRollEnd }) {
  const mesh = useRef();
  const [rollTime, setRollTime] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  // Start rolling when prop changes
  useEffect(() => {
    if (rolling) {
      setIsRolling(true);
      setRollTime(0);
    }
  }, [rolling]);

  // Precompute a random spin axis and amount for each roll
  const spinAxis = useRef([Math.random(), Math.random(), Math.random()]);
  const spinAmount = useRef(Math.PI * (4 + Math.random() * 2)); // 4-6 full spins
  const [finalRotation, setFinalRotation] = useState([0, 0, 0]);

  useEffect(() => {
    if (rolling) {
      // Pick a new random axis and spin amount for each roll
      spinAxis.current = [Math.random(), Math.random(), Math.random()];
      spinAmount.current = Math.PI * (4 + Math.random() * 2);
      setFinalRotation([0, 0, 0]);
    }
  }, [rolling, value]);

  useFrame((state, delta) => {
    if (isRolling && mesh.current) {
      setRollTime(t => {
        const next = t + delta;
        // Animate: spin on a random axis
        if (next < 2.1) {
          const progress = next / 2.1;
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 2);
          const angle = spinAmount.current * eased;
          const [ax, ay, az] = spinAxis.current;
          mesh.current.rotation.set(ax * angle, ay * angle, az * angle);
        } else {
          // Snap to a final orientation (simulate landing)
          // For simplicity, just face a random orientation (could be improved to match value)
          mesh.current.rotation.set(finalRotation[0], finalRotation[1], finalRotation[2]);
          setIsRolling(false);
          if (onRollEnd) onRollEnd();
        }
        return next;
      });
    }
    // On roll end, snap to a random orientation (could be improved to match value)
    if (!isRolling && mesh.current && finalRotation[0] === 0 && finalRotation[1] === 0 && finalRotation[2] === 0) {
      // Pick a random orientation for now
      const rx = Math.random() * Math.PI * 2;
      const ry = Math.random() * Math.PI * 2;
      const rz = Math.random() * Math.PI * 2;
      mesh.current.rotation.set(rx, ry, rz);
      setFinalRotation([rx, ry, rz]);
    }
  });
  // D20 face numbers (1-20), mapped to face centers
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#fffbe9" metalness={0.3} roughness={0.5} />
      {/* Edges for fantasy look */}
      <edgesGeometry attach="geometry" args={[new THREE.IcosahedronGeometry(1, 0)]} />
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 0)]} />
        <lineBasicMaterial color="#bfa76f" linewidth={2} />
      </lineSegments>
      {/* Numbers on faces */}
      {numbers.map((n, i) => (
        <Text
          key={n}
          position={D20_FACE_CENTERS[i % D20_FACE_CENTERS.length].map(v => v * 1.18)}
          fontSize={0.28}
          color="#7c5e2a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#fffbe9"
        >
          {n}
        </Text>
      ))}
    </mesh>
  );
}

export default function D20Die3D({ rolling, value, onRollEnd }) {
  return (
    <div style={{ width: 140, height: 140 }}>
      <Canvas camera={{ position: [0, 0, 3.5] }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={0.7} />
        <D20Mesh rolling={rolling} value={value} onRollEnd={onRollEnd} />
      </Canvas>
    </div>
  );
}
