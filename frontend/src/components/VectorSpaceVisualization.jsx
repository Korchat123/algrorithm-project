import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { rankSemanticResults, semanticSearchData } from '../utils/algorithmData.js';

export function VectorSpaceVisualization({ queryIndex = 0, customQuery = null, highlightedId = null }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef({ isPressed: false, x: 0, y: 0, rotX: 0, rotY: 0 });
  const pointsRef = useRef(null);
  const [info, setInfo] = useState({ query: '', results: [] });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Determine which query/embedding to use
    let queryEmbedding;
    let queryText;

    if (customQuery) {
      queryText = customQuery.text;
      queryEmbedding = customQuery.embedding;
      const results = rankSemanticResults(queryEmbedding);
      setInfo({ query: queryText, results });
    } else {
      const query = semanticSearchData.queries[queryIndex % semanticSearchData.queries.length];
      queryEmbedding = query.embedding;
      queryText = query.text;
      setInfo({ query: queryText, results: query.results });
    }

    const currentResults = customQuery
      ? rankSemanticResults(queryEmbedding)
      : semanticSearchData.queries[queryIndex % semanticSearchData.queries.length].results;
    const nearestIds = new Set(currentResults.map(r => r.documentId));

    // Project to 3D
    const projectTo3D = (vector) => {
      const x = vector[0] * 3 - vector[1] * 2 + vector[4] * 0.5 - vector[6] * 0.5;
      const y = vector[1] * 3 - vector[0] * 1.5 + vector[5] * 1 - vector[3] * 0.5;
      const z = vector[2] * 3 - vector[4] * 1.5 + vector[6] * 1 + vector[7] * 0.5;
      const scale = 3 / Math.sqrt(x * x + y * y + z * z + 1);
      return [x * scale, y * scale, z * scale];
    };

    const projectedData = semanticSearchData.data.map(item => ({
      ...item,
      pos: projectTo3D(item.embedding),
    }));
    const projectedQuery = projectTo3D(queryEmbedding);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(6, 6, 6);
    const cubeMaterial = new THREE.LineBasicMaterial({ color: 0x374151 });
    const cube = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeometry), cubeMaterial);
    scene.add(cube);

    // Data points
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(projectedData.flatMap(d => d.pos));
    const colors = new Float32Array(projectedData.length * 3);

    projectedData.forEach((item, i) => {
      const isHighlighted = highlightedId === item.id;
      const isNearest = nearestIds.has(item.id);

      if (isHighlighted) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      } else if (isNearest) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 1;
      }
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);
    pointsRef.current = points;

    // Query point
    const queryGeometry = new THREE.BufferGeometry();
    queryGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(projectedQuery), 3)
    );
    const queryMaterial = new THREE.PointsMaterial({
      color: 0xff4444,
      size: 0.35,
      sizeAttenuation: true,
    });
    const queryPoint = new THREE.Points(queryGeometry, queryMaterial);
    scene.add(queryPoint);

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    currentResults.forEach(result => {
      const doc = projectedData.find(d => d.id === result.documentId);
      if (doc) {
        linePositions.push(
          projectedQuery[0],
          projectedQuery[1],
          projectedQuery[2],
          doc.pos[0],
          doc.pos[1],
          doc.pos[2]
        );
      }
    });
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.3,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Mouse controls
    const state = controlsRef.current;
    const onMouseDown = (e) => {
      state.isPressed = true;
      state.x = e.clientX;
      state.y = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!state.isPressed) return;
      const dx = (e.clientX - state.x) * 0.005;
      const dy = (e.clientY - state.y) * 0.005;
      state.rotY += dx;
      state.rotX += dy;
      state.x = e.clientX;
      state.y = e.clientY;
    };

    const onMouseUp = () => {
      state.isPressed = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const currentDist = camera.position.length();
      const newDist = currentDist + (e.deltaY > 0 ? 0.5 : -0.5);
      const clampedDist = Math.max(3, Math.min(30, newDist));
      const scale = clampedDist / currentDist;
      camera.position.multiplyScalar(scale);
    };

    const onDoubleClick = () => {
      state.rotX = 0;
      state.rotY = 0;
      camera.position.set(8, 6, 8);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('dblclick', onDoubleClick);

    // Animation loop
    let animationId;
    const animate = () => {
      const dist = camera.position.length();
      const x = dist * Math.sin(state.rotY) * Math.cos(state.rotX);
      const y = dist * Math.sin(state.rotX);
      const z = dist * Math.cos(state.rotY) * Math.cos(state.rotX);
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('dblclick', onDoubleClick);
      try {
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      } catch {
        // Canvas already detached.
      }
      renderer.dispose();
      geometry.dispose();
      queryGeometry.dispose();
      lineGeometry.dispose();
      pointsMaterial.dispose();
      queryMaterial.dispose();
      lineMaterial.dispose();
      cubeMaterial.dispose();
    };
  }, [queryIndex, customQuery, highlightedId]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #374151',
          marginBottom: '16px',
          touchAction: 'none',
        }}
      />
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #d8ded2',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <p style={{ color: '#52615b', fontSize: '12px', margin: '0 0 8px 0' }}>
          CONTROLS: Left drag to rotate • Scroll to zoom • Double-click to reset
        </p>
        <h3 style={{ color: '#14231f', margin: '0 0 12px 0' }}>
          Query: <span style={{ color: '#1f6f58' }}>{info.query}</span>
        </h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {info.results.map((result, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#52615b', fontSize: '14px' }}>
                {idx + 1}. {result.text}
              </span>
              <span
                style={{
                  color: '#1f6f58',
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {(result.similarity * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
