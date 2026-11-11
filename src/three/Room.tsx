import { ContactShadows } from '@react-three/drei'
import { useMemo } from 'react'
import {
  createPlankFloorTexture,
  createSubwayTileTexture,
  createWallTexture,
  createWoodTexture,
} from './textures'

export default function Room() {
  const floorTexture = useMemo(() => {
    const t = createPlankFloorTexture('#b4835a', '#7f5433')
    t.repeat.set(4, 4)
    return t
  }, [])
  const wallTexture = useMemo(() => createWallTexture('#eee6d6'), [])
  const trimTexture = useMemo(() => createWoodTexture('#8a7355', '#6b5940'), [])
  const tileTexture = useMemo(() => {
    const t = createSubwayTileTexture()
    t.repeat.set(5, 2)
    return t
  }, [])

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={floorTexture} roughness={0.45} metalness={0.04} />
      </mesh>

      {/* soft contact shadows under furniture for grounding */}
      <ContactShadows position={[0, 0.012, -1]} opacity={0.55} scale={9} blur={2.2} far={2.5} resolution={512} />

      {/* ceiling */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#faf6ec" roughness={0.95} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 1.5, -5]} receiveShadow castShadow>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshStandardMaterial map={wallTexture} roughness={0.85} />
      </mesh>

      {/* subway tile backsplash behind the stove */}
      <mesh position={[0, 1.08, -4.88]} receiveShadow>
        <planeGeometry args={[3.2, 1.2]} />
        <meshStandardMaterial map={tileTexture} roughness={0.35} metalness={0.02} />
      </mesh>

      {/* crown molding along the ceiling line */}
      <mesh position={[0, 2.9, -4.85]} castShadow>
        <boxGeometry args={[10, 0.14, 0.14]} />
        <meshStandardMaterial color="#f3ecd9" roughness={0.6} />
      </mesh>
      <mesh position={[-4.85, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[10, 0.14, 0.14]} />
        <meshStandardMaterial color="#f3ecd9" roughness={0.6} />
      </mesh>
      <mesh position={[4.85, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[10, 0.14, 0.14]} />
        <meshStandardMaterial color="#f3ecd9" roughness={0.6} />
      </mesh>

      {/* left wall */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshStandardMaterial map={wallTexture} roughness={0.85} />
      </mesh>

      {/* right wall */}
      <mesh position={[5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshStandardMaterial map={wallTexture} roughness={0.85} />
      </mesh>

      {/* window on the right wall, bringing in daylight */}
      <group position={[4.87, 1.65, 0.5]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[1.7, 1.3, 0.05]} />
          <meshStandardMaterial color="#6b5940" roughness={0.6} />
        </mesh>
        <mesh position={[-0.04, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.45, 1.05]} />
          <meshStandardMaterial
            color="#bfe3f7"
            emissive="#bfe3f7"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        <pointLight position={[-0.3, 0, 0]} intensity={0.5} color="#eaf6ff" distance={5} decay={2} />
      </group>

      {/* baseboard trim */}
      <mesh position={[0, 0.08, -4.9]} castShadow>
        <boxGeometry args={[9.9, 0.16, 0.05]} />
        <meshStandardMaterial map={trimTexture} roughness={0.7} />
      </mesh>
      <mesh position={[-4.9, 0.08, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[9.9, 0.16, 0.05]} />
        <meshStandardMaterial map={trimTexture} roughness={0.7} />
      </mesh>
      <mesh position={[4.9, 0.08, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[9.9, 0.16, 0.05]} />
        <meshStandardMaterial map={trimTexture} roughness={0.7} />
      </mesh>

      {/* pendant lights hanging over the island */}
      {[-0.75, 0, 0.75].map((x) => (
        <group key={x} position={[x, 0, -1]}>
          <mesh position={[0, 2.97, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 2.45, 0]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial
              color="#f6efd9"
              emissive="#ffdfa0"
              emissiveIntensity={0.25}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
          <pointLight position={[0, 2.4, 0]} intensity={0.45} distance={3.2} decay={2} color="#ffdfa6" />
        </group>
      ))}

      {/* decorative crate near entrance */}
      <group position={[-4.1, 0, 3.6]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.7, 0.9]} />
          <meshStandardMaterial map={trimTexture} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.4} />
        </mesh>
        <mesh position={[0.2, 0.68, 0.1]} castShadow>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
