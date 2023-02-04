import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import world from "./8k_earth_nightmap.jpeg";

const Earth = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);

    const texture = new THREE.TextureLoader().load(world);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    camera.position.z = 10;

    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return <div ref={containerRef} />;
};

export default Earth;
