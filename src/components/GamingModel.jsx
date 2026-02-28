import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

function Model() {
    const { scene } = useGLTF('/images/gaming_model.glb');
    return <primitive object={scene} scale={1.2} position={[0, -1.5, 0]} />;
}

export default function GamingModel() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ff4da6', zIndex: 100, fontWeight: 'bold', textShadow: '0 0 10px rgba(255,0,127,0.5)' }}>Loading 3D Desk...</div>}>
                <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
                    <Model />
                    <Environment preset="city" />
                    <OrbitControls
                        autoRotate
                        autoRotateSpeed={2.0}
                        enableZoom={false}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Canvas>
            </Suspense>
        </div>
    );
}

useGLTF.preload('/images/gaming_model.glb');
