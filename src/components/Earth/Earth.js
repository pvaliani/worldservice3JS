import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import world from "../../8k_earth_nightmap.jpeg";
import "./Earth.css";

const Earth = () => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let zoom = 10;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);

    const texture = new THREE.TextureLoader().load(world);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    camera.position.z = zoom;

    // use hex for white to aid rendering
    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(light);

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseDown = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event) => {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      earthMesh.rotation.y += deltaX * 0.01;
      earthMesh.rotation.x += deltaY * 0.01;

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // adjust zoom rate
    const handleWheel = (event) => {
      zoom -= event.deltaY * 0.01;
      camera.position.z = zoom;
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("wheel", handleWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [width, height]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default Earth;
