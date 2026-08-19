"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_GLB = "/festipeques/card.glb";
const CARD_ATLAS = "/festipeques/card-atlas.webp";
const STRAP_TEX = "/festipeques/lanyard-strap.png";
/** Punto de la credencial donde engancha la cuerda (anclaje del joint esférico). */
const RING_ANCHOR = 1.5;
/** Cuánto se mete la cinta dentro del enganche para que no se vea el corte. */
const CLIP_TUCK = 0.11;

useGLTF.preload(CARD_GLB);
useTexture.preload(CARD_ATLAS);
useTexture.preload(STRAP_TEX);

const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
};

type PointerCaptureHolder = {
  setPointerCapture?: (id: number) => void;
  releasePointerCapture?: (id: number) => void;
};

type PointerCapture = { holder: PointerCaptureHolder; pointerId: number };

function Band({ isMobile, anchorFraction }: { isMobile: boolean; anchorFraction: number }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const j1Lerped = useRef(new THREE.Vector3());
  const j2Lerped = useRef(new THREE.Vector3());

  const vec = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const ring = useRef(new THREE.Vector3());
  const cardUp = useRef(new THREE.Vector3());
  const cardQuat = useRef(new THREE.Quaternion());

  const { nodes, materials } = useGLTF(CARD_GLB);
  const [atlas, strap] = useTexture([CARD_ATLAS, STRAP_TEX], ([cardMap, bandMap]) => {
    cardMap.colorSpace = THREE.SRGBColorSpace;
    cardMap.flipY = false;
    cardMap.anisotropy = 16;
    cardMap.wrapS = cardMap.wrapT = THREE.ClampToEdgeWrapping;
    bandMap.colorSpace = THREE.SRGBColorSpace;
    bandMap.wrapS = bandMap.wrapT = THREE.RepeatWrapping;
    bandMap.anisotropy = 8;
  });
  const strapRepeat = useMemo(() => new THREE.Vector2(-4, 1), []);
  const strapResolution = useMemo(() => new THREE.Vector2(1000, 1600), []);

  // El canvas puede ocupar toda la pantalla: el cordón se cuelga de la fracción
  // horizontal pedida para que el pase quede donde lo espera la maqueta.
  const viewportWidth = useThree((state) => state.viewport.width);
  const anchorX = (anchorFraction * 2 - 1) * (viewportWidth / 2);

  const cardMesh = nodes.card as THREE.Mesh;
  const clipMesh = nodes.clip as THREE.Mesh;
  const clampMesh = nodes.clamp as THREE.Mesh;

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  }, []);

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);
  const captured = useRef<PointerCapture | null>(null);

  const grabPointer = (e: ThreeEvent<PointerEvent>) => {
    const holder = e.target as unknown as PointerCaptureHolder;
    holder.setPointerCapture?.(e.pointerId);
    captured.current = { holder, pointerId: e.pointerId };
  };

  // Se libera siempre el mismo elemento que capturó: si queda capturado, se
  // traga el clic siguiente (por ejemplo el del botón del home).
  const releasePointer = useCallback(() => {
    const capture = captured.current;
    if (!capture) return;
    capture.holder.releasePointerCapture?.(capture.pointerId);
    captured.current = null;
  }, []);

  useEffect(() => {
    if (!dragged) return;
    const end = () => {
      releasePointer();
      drag(false);
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragged, releasePointer]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) {
      return;
    }

    if (dragged) {
      vec.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.current.copy(vec.current).sub(state.camera.position).normalize();
      vec.current.add(dir.current.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.current.x - dragged.x,
        y: vec.current.y - dragged.y,
        z: vec.current.z - dragged.z,
      });
    }

    if (!j1Lerped.current.lengthSq()) j1Lerped.current.copy(j1.current.translation());
    if (!j2Lerped.current.lengthSq()) j2Lerped.current.copy(j2.current.translation());

    const d1 = Math.max(0.1, Math.min(1, j1Lerped.current.distanceTo(j1.current.translation())));
    const d2 = Math.max(0.1, Math.min(1, j2Lerped.current.distanceTo(j2.current.translation())));
    j1Lerped.current.lerp(j1.current.translation(), delta * (10 + d1 * 40));
    j2Lerped.current.lerp(j2.current.translation(), delta * (10 + d2 * 40));

    // La cinta termina en la argolla de la credencial, no en el último nudo de
    // la cuerda: así entra siempre alineada al enganche aunque el pase se
    // incline, y la punta queda tapada por el mosquetón.
    const cardRot = card.current.rotation();
    cardQuat.current.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    cardUp.current.set(0, 1, 0).applyQuaternion(cardQuat.current);
    const cardPos = card.current.translation();
    ring.current
      .set(cardPos.x, cardPos.y, cardPos.z)
      .addScaledVector(cardUp.current, RING_ANCHOR);

    curve.points[0].copy(ring.current).addScaledVector(cardUp.current, -CLIP_TUCK);
    curve.points[1].copy(ring.current);
    curve.points[2].copy(j2Lerped.current);
    curve.points[3].copy(j1Lerped.current);
    curve.points[4].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 24 : 48));
    band.current.material.resolution.set(state.size.width, state.size.height);

    ang.current.copy(card.current.angvel());
    rot.current.copy(card.current.rotation());
    card.current.setAngvel(
      { x: ang.current.x, y: ang.current.y - rot.current.y * 0.25, z: ang.current.z },
      true,
    );
  });

  return (
    <>
      <group position={[anchorX, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation();
              releasePointer();
              drag(false);
            }}
            onPointerCancel={() => {
              releasePointer();
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              grabPointer(e);
              if (!card.current) return;
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.current.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={cardMesh.geometry}>
              <meshPhysicalMaterial
                map={atlas}
                clearcoat={isMobile ? 0.35 : 1}
                clearcoatRoughness={0.12}
                roughness={0.28}
                metalness={0.08}
                ior={1.49}
                reflectivity={0.5}
              />
            </mesh>
            <mesh
              geometry={clipMesh.geometry}
              material={materials.metal}
              material-roughness={0.22}
              material-metalness={1}
            />
            <mesh
              geometry={clampMesh.geometry}
              material={materials.metal}
              material-roughness={0.28}
              material-metalness={1}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} frustumCulled={false} renderOrder={-1}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: strapResolution }]}
          color="white"
          depthTest={false}
          depthWrite={false}
          lineWidth={1}
          sizeAttenuation={1}
          useMap={1}
          map={strap}
          repeat={strapRepeat}
          resolution={strapResolution}
        />
      </mesh>
    </>
  );
}

function StudioLights({ isMobile }: { isMobile: boolean }) {
  return (
    <Environment blur={0.7} frames={1} resolution={isMobile ? 256 : 512}>
      <Lightformer
        intensity={2}
        color="white"
        position={[0, -1, 5]}
        rotation={[0, 0, Math.PI / 3]}
        scale={[100, 0.1, 1]}
      />
      <Lightformer
        intensity={3}
        color="white"
        position={[-1, -1, 1]}
        rotation={[0, 0, Math.PI / 3]}
        scale={[100, 0.1, 1]}
      />
      <Lightformer
        intensity={3}
        color="white"
        position={[1, 1, 1]}
        rotation={[0, 0, Math.PI / 3]}
        scale={[100, 0.1, 1]}
      />
      <Lightformer
        intensity={10}
        color="white"
        position={[-10, 0, 14]}
        rotation={[0, Math.PI / 2, Math.PI / 3]}
        scale={[100, 10, 1]}
      />
    </Environment>
  );
}

export default function FestiLanyard({ fullBleed }: { fullBleed: boolean }) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // A pantalla completa los eventos se escuchan en el documento: así el pase se
  // puede arrastrar por toda la página sin que el canvas tape los enlaces.
  return (
    <Canvas
      className="home-launch__canvas"
      camera={{ position: [0, 0, 13], fov: 20 }}
      eventSource={fullBleed && typeof document !== "undefined" ? document.body : undefined}
      eventPrefix={fullBleed ? "client" : "offset"}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#000000"), 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ touchAction: "none" }}
    >
      <ambientLight intensity={Math.PI * 0.35} />
      <Suspense fallback={null}>
        <StudioLights isMobile={isMobile} />
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60} interpolate>
          <Band isMobile={isMobile} anchorFraction={fullBleed ? 0.7 : 0.5} />
        </Physics>
        <ContactShadows
          position={[0, -3.35, 0]}
          opacity={0.32}
          scale={14}
          blur={2.6}
          far={7}
        />
      </Suspense>
    </Canvas>
  );
}
