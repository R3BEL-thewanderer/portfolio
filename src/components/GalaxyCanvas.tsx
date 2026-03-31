import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GalaxyCanvas() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene Setup ──────────────────────────────────────────
    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      canvas: mount,
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 1);

    // ── Galaxy Particles ──────────────────────────────────────
    const STAR_COUNT = isMobile ? 3000 : 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);

    const colorPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#a8d8ff"),
      new THREE.Color("#ffd6a5"),
      new THREE.Color("#c8b1ff"),
      new THREE.Color("#ffc4e1"),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      // Spread stars in a deep, elongated 3D tunnel
      positions[i * 3 + 0] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40; // deeper z for long scroll

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // ── Circular star texture ─────────────────────────────────
    const canvas2d = document.createElement("canvas");
    canvas2d.width = 64;
    canvas2d.height = 64;
    const ctx = canvas2d.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(canvas2d);

    const material = new THREE.PointsMaterial({
      size: 0.05,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // ── Nebula / Dust Clouds ──────────────────────────────────
    const nebulaCount = isMobile ? 400 : 800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCol = new Float32Array(nebulaCount * 3);

    const nebulaColors = [
      new THREE.Color("#1a0533"),
      new THREE.Color("#0d1b4b"),
      new THREE.Color("#0a2540"),
      new THREE.Color("#220033"),
      new THREE.Color("#0f0028"),
    ];

    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const nc = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      nebulaCol[i * 3 + 0] = nc.r;
      nebulaCol[i * 3 + 1] = nc.g;
      nebulaCol[i * 3 + 2] = nc.b;
    }

    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebulaCol, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebula);

    // ── Scroll-driven 3D camera flight (full page) ───────────
    let currentZ = 3;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetZ = 3;
    let targetRotX = 0;
    let targetRotY = 0;

    const getScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return docHeight > 0 ? scrollTop / docHeight : 0;
    };

    const handleScroll = () => {
      const progress = getScrollProgress();

      // Camera flies forward through the entire star field as you scroll
      // From z=3 at top to z=-25 at bottom — deep flight through space
      targetZ = 3 - progress * 28;

      // Gentle tilting that changes as you scroll through
      targetRotX = Math.sin(progress * Math.PI) * 0.25;
      targetRotY = Math.cos(progress * Math.PI * 0.5) * 0.15;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Mouse parallax ────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Resize ────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation Loop ────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth lerp for all camera values
      const lerpFactor = 0.04;
      currentZ += (targetZ - currentZ) * lerpFactor;
      currentRotX += (targetRotX + mouseY * 0.2 - currentRotX) * lerpFactor;
      currentRotY += (targetRotY + mouseX * 0.2 - currentRotY) * lerpFactor;

      camera.position.z = currentZ;
      camera.rotation.x = currentRotX;
      camera.rotation.y = currentRotY;

      // Slow galaxy rotation — makes it feel alive
      stars.rotation.y = elapsed * 0.012;
      stars.rotation.x = elapsed * 0.004;
      nebula.rotation.y = elapsed * 0.006;

      renderer.render(scene, camera);
    };

    animate();

    // Fire initial scroll calculation
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      starTexture.dispose();
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
