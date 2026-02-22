/**
 * Game3DScreen — Three.js based 3D memory game.
 * Each card IS its own 3D geometry (cube, sphere, or cylinder).
 * Example: 4 pairs = 8 individual 3D objects in the scene.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createHUD, updateHUD } from '../components/HUD.js';

// ---- Texture helpers ----

function createEmojiTexture(emoji, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dark semi-transparent background
    ctx.fillStyle = 'rgba(5, 4, 16, 0.7)';
    ctx.fillRect(0, 0, size, size);

    // Glow circle behind emoji
    const grd = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.35);
    grd.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    grd.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);

    // Emoji — smaller but crisp
    ctx.font = `${size * 0.3}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillText(emoji, size / 2, size / 2);
    // Double pass for brightness
    ctx.shadowBlur = 10;
    ctx.fillText(emoji, size / 2, size / 2);

    return new THREE.CanvasTexture(canvas);
}

function createBackTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#5a30d9');
    grad.addColorStop(1, '#00c8e0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.font = `${size * 0.3}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.4;
    ctx.fillText('🧠', size / 2, size / 2);
    return new THREE.CanvasTexture(canvas);
}

function createGlowTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d2a2a';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, size - 20, size - 20);
    return new THREE.CanvasTexture(canvas);
}

// ---- Create 3D geometry for a single card ----

function createCardGeometry(shapeType) {
    switch (shapeType) {
        case 'sphere':
            return new THREE.SphereGeometry(0.85, 32, 32);
        case 'cylinder':
            return new THREE.CylinderGeometry(0.65, 0.65, 1.1, 32);
        default: // cube
            return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }
}

// Create glowing wireframe edges for the geometry
function createEdgeOutline(geo, shapeType) {
    const edges = new THREE.EdgesGeometry(geo, shapeType === 'sphere' ? 15 : undefined);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.8,
    });
    return new THREE.LineSegments(edges, lineMat);
}

// ---- Grid layout for N objects ----

function computeGridPositions(total) {
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    const spacing = 2.8;
    const positions = [];

    for (let i = 0; i < total; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacing;
        const y = ((rows - 1) / 2 - row) * spacing;
        positions.push(new THREE.Vector3(x, y, 0));
    }

    return { positions, cols, rows };
}

// ====== Main export ======

export function createGame3DScreen({ engine, shape, onQuit }) {
    const screen = document.createElement('div');
    screen.classList.add('screen-game');

    // HUD
    const hud = createHUD();
    screen.appendChild(hud);

    // 3D Container
    const container = document.createElement('div');
    container.id = 'game-3d-container';
    container.style.cssText = 'width:100%; max-width:750px; aspect-ratio:1/1; margin:0 auto; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--clr-border); background:#050410;';
    screen.appendChild(container);

    // Pause overlay
    const pauseOverlay = document.createElement('div');
    pauseOverlay.className = 'overlay';
    pauseOverlay.id = 'pause-overlay-3d';
    pauseOverlay.innerHTML = `
    <div class="modal">
      <h2>⏸️ Paused</h2>
      <p>Take a breather!</p>
      <div class="modal-actions">
        <button class="btn btn-primary" id="pause-resume-3d">▶️ Resume</button>
        <button class="btn btn-secondary" id="pause-quit-3d">🚪 Quit</button>
      </div>
    </div>
  `;
    screen.appendChild(pauseOverlay);

    // Level Complete overlay
    const levelOverlay = document.createElement('div');
    levelOverlay.className = 'overlay';
    levelOverlay.id = 'level-overlay-3d';
    levelOverlay.innerHTML = `
    <div class="modal">
      <h2>🎉 Level Complete!</h2>
      <p id="level-complete-msg-3d">Great job!</p>
      <div class="modal-actions">
        <button class="btn btn-primary btn-lg" id="next-level-btn-3d">➡️ Next Level</button>
      </div>
    </div>
  `;
    screen.appendChild(levelOverlay);

    // Info
    const info = document.createElement('p');
    info.style.cssText = 'text-align:center; color:var(--clr-text-muted); font-size:var(--fs-sm); margin-top:var(--sp-sm);';
    info.textContent = '🖱️ Drag to rotate · Click a shape to flip it';
    screen.appendChild(info);

    // Three.js variables
    let scene, camera, renderer, controls, raycaster, mouse;
    let cardMeshes = [];
    let animationId;
    const backTex = createBackTexture();
    const glowTex = createGlowTexture();

    // Track pointer for click-vs-drag detection
    let pointerDownPos = null;

    function init() {
        const rect = container.getBoundingClientRect();
        const width = rect.width || 500;
        const height = rect.height || 500;

        scene = new THREE.Scene();
        scene.background = new THREE.Color('#020108');

        // No fog — let the stars be visible
        // scene.fog removed for galaxy visibility

        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.8;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enableZoom = true;
        controls.minDistance = 3;
        controls.maxDistance = 20;

        // Lights — high contrast, objects must pop
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 8, 5);
        scene.add(dirLight);
        const fillLight = new THREE.DirectionalLight(0xeeeeff, 0.6);
        fillLight.position.set(-4, 5, -3);
        scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0x00e5ff, 0.8);
        rimLight.position.set(0, -3, 5);
        scene.add(rimLight);
        const backLight = new THREE.PointLight(0x6c3cff, 1.0, 30);
        backLight.position.set(-5, -5, -5);
        scene.add(backLight);
        const accentLight = new THREE.PointLight(0x00e5ff, 0.8, 25);
        accentLight.position.set(5, 4, 7);
        scene.add(accentLight);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Use pointerdown/pointerup to reliably detect clicks vs OrbitControls drags
        renderer.domElement.addEventListener('pointerdown', (e) => {
            pointerDownPos = { x: e.clientX, y: e.clientY };
        });
        renderer.domElement.addEventListener('pointerup', (e) => {
            if (!pointerDownPos) return;
            const dx = e.clientX - pointerDownPos.x;
            const dy = e.clientY - pointerDownPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            pointerDownPos = null;
            // Only treat as click if pointer barely moved (< 5px)
            if (dist < 5) {
                onCanvasClick(e);
            }
        });

        buildGalaxy();
        buildCards();
        fitCameraToGrid();
        animate();
    }

    function buildCards() {
        // Clear existing
        cardMeshes.forEach(m => {
            scene.remove(m);
            if (m.geometry) m.geometry.dispose();
            if (m.material) {
                if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
                else m.material.dispose();
            }
        });
        cardMeshes = [];

        const cards = engine.cards;
        const total = cards.length;
        const { positions } = computeGridPositions(total);

        for (let i = 0; i < total; i++) {
            const card = cards[i];
            const geo = createCardGeometry(shape);
            const emojiTex = createEmojiTexture(card.emoji);

            // Material: glass for cube/sphere, standard for cylinder
            let mat;
            if (shape === 'cylinder') {
                mat = new THREE.MeshStandardMaterial({
                    map: backTex.clone(),
                    roughness: 0.35,
                    metalness: 0.15,
                });
            } else {
                mat = new THREE.MeshPhysicalMaterial({
                    map: backTex.clone(),
                    roughness: 0.1,
                    metalness: 0.1,
                    transmission: 0.3,
                    thickness: 2.0,
                    ior: 1.5,
                    transparent: true,
                    opacity: 0.95,
                    envMapIntensity: 2.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.05,
                    reflectivity: 0.8,
                });
            }

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(positions[i]);

            // Add neon wireframe outline
            const outline = createEdgeOutline(geo, shape);
            mesh.add(outline);

            // Store state
            mesh.userData = {
                cardIndex: i,
                emojiTex,
                backTex: backTex.clone(),
                isShowingEmoji: false,
                targetRotation: 0,
                currentRotation: 0,
                outline,
            };

            scene.add(mesh);
            cardMeshes.push(mesh);
        }
    }

    function fitCameraToGrid() {
        const total = engine.cards.length;
        const cols = Math.ceil(Math.sqrt(total));
        const rows = Math.ceil(total / cols);
        const maxDim = Math.max(cols, rows) * 2.8;
        camera.position.set(0, 0, maxDim * 1.05 + 3.5);
        controls.target.set(0, 0, 0);
        controls.update();
    }

    function onCanvasClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        // Check main meshes AND children (wireframe outlines)
        const intersects = raycaster.intersectObjects(cardMeshes, true);

        if (intersects.length > 0) {
            // Walk up to find the mesh that has cardIndex
            let hit = intersects[0].object;
            while (hit && hit.userData.cardIndex === undefined && hit.parent) {
                hit = hit.parent;
            }
            if (hit && hit.userData.cardIndex !== undefined) {
                engine.flipCard(hit.userData.cardIndex);
            }
        }
    }

    // ---- Galaxy starfield background ----
    function buildGalaxy() {
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        // Color palette for nebula-like variety
        const palette = [
            new THREE.Color(0xffffff),   // white
            new THREE.Color(0xaaccff),   // blue-white
            new THREE.Color(0x6c3cff),   // purple
            new THREE.Color(0x00e5ff),   // cyan
            new THREE.Color(0xff6eb4),   // pink
            new THREE.Color(0xffe066),   // gold
        ];

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Random position in a large sphere
            const radius = 30 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random star color from palette
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random size
            sizes[i] = 0.3 + Math.random() * 1.5;
        }

        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starMat = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
        });

        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // Nebula cloud — large semi-transparent sphere with color
        const nebulaColors = [0x6c3cff, 0x00e5ff, 0xff3399];
        for (let n = 0; n < 3; n++) {
            const nebulaGeo = new THREE.SphereGeometry(15 + Math.random() * 20, 16, 16);
            const nebulaMat = new THREE.MeshBasicMaterial({
                color: nebulaColors[n],
                transparent: true,
                opacity: 0.02 + Math.random() * 0.03,
                side: THREE.BackSide,
            });
            const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
            nebula.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            scene.add(nebula);
        }
    }

    function updateCardVisuals() {
        engine.cards.forEach((card, i) => {
            const mesh = cardMeshes[i];
            if (!mesh) return;

            const ud = mesh.userData;

            if (card.isFlipped || card.isMatched) {
                // Show emoji — rotate to reveal
                if (!ud.isShowingEmoji) {
                    mesh.material.map = ud.emojiTex;
                    mesh.material.needsUpdate = true;
                    ud.isShowingEmoji = true;
                    ud.targetRotation = Math.PI;
                }
                if (card.isMatched) {
                    mesh.material.emissive = new THREE.Color(0x00e5ff);
                    mesh.material.emissiveIntensity = 0.35;
                }
            } else {
                // Show back
                if (ud.isShowingEmoji) {
                    mesh.material.map = ud.backTex;
                    mesh.material.needsUpdate = true;
                    ud.isShowingEmoji = false;
                    ud.targetRotation = 0;
                }
                mesh.material.emissive = new THREE.Color(0x000000);
                mesh.material.emissiveIntensity = 0;
            }
        });
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        // Smooth rotation animation
        cardMeshes.forEach((mesh) => {
            const ud = mesh.userData;
            const diff = ud.targetRotation - ud.currentRotation;
            if (Math.abs(diff) > 0.01) {
                ud.currentRotation += diff * 0.12;
                mesh.rotation.y = ud.currentRotation;
            }
        });

        // Slow ambient rotation for unflipped cards
        const time = Date.now() * 0.001;
        cardMeshes.forEach((mesh, i) => {
            const card = engine.cards[i];
            if (!card.isFlipped && !card.isMatched) {
                mesh.rotation.x = Math.sin(time * 0.5 + i * 0.3) * 0.08;
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    // ---- Engine callbacks ----

    engine.onStateChange = (state) => {
        updateHUD(state);
        updateCardVisuals();
    };

    engine.onLevelComplete = (level, score) => {
        const msg = screen.querySelector('#level-complete-msg-3d');
        msg.textContent = `Level ${level} cleared! Score: ${score.toLocaleString()}`;
        levelOverlay.classList.add('active');
    };

    // Pause
    screen.querySelector('#hud-pause').addEventListener('click', () => {
        engine.pause();
        pauseOverlay.classList.add('active');
    });

    screen.querySelector('#pause-resume-3d').addEventListener('click', () => {
        engine.resume();
        pauseOverlay.classList.remove('active');
    });

    screen.querySelector('#pause-quit-3d').addEventListener('click', () => {
        cleanup();
        onQuit();
    });

    // Next level
    screen.querySelector('#next-level-btn-3d').addEventListener('click', () => {
        levelOverlay.classList.remove('active');
        engine.nextLevel();
        buildCards();
        fitCameraToGrid();
        engine.startAfterPreview(() => { });
    });

    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer?.dispose();
        controls?.dispose();
    }

    // Initial HUD
    updateHUD({
        level: engine.level,
        score: engine.score,
        lives: engine.lives,
        timeRemaining: 0,
    });

    // Delayed init
    setTimeout(() => {
        init();
        engine.startAfterPreview(() => { });
        updateCardVisuals();
    }, 100);

    return screen;
}
