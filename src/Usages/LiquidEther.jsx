import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
  className = '',
  style = {}
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Helper: Palette Texture ---
    function makePaletteTexture(stops) {
      const arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      const data = new Uint8Array(arr.length * 4);
      arr.forEach((color, i) => {
        const c = new THREE.Color(color);
        data[i * 4] = c.r * 255;
        data[i * 4 + 1] = c.g * 255;
        data[i * 4 + 2] = c.b * 255;
        data[i * 4 + 3] = 255;
      });
      const tex = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // --- Core Classes (Common, Mouse, Simulation, etc.) ---
    // You can copy all the classes from your current LiquidEther code here:
    // CommonClass, MouseClass, AutoDriver, ShaderPass, Advection, ExternalForce,
    // Viscous, Divergence, Poisson, Pressure, Simulation, Output, WebGLManager
    // ...for brevity, I won't repeat all 700+ lines here
    // Just merge them inside this useEffect as you have in your current code

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    });
    webglRef.current = webgl;

    webgl.start();

    const resizeObserver = new ResizeObserver(() => {
      webglRef.current?.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      webglRef.current?.dispose();
    };
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    colors,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden w-full h-full touch-none ${className}`}
      style={style}
    />
  );
}
