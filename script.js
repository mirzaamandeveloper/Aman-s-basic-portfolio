// ==========================================
// 3D ANIMATED BACKGROUND WITH MOVING STARS
// ==========================================

let bgScene, bgCamera, bgRenderer;
let bgObjects = [];
let starField = [];
let mouse = { x: 0, y: 0 };
let time = 0;

// Initialize 3D Background
function init3DBackground() {
  const container = document.getElementById("3d-background");
  
  // Scene
  bgScene = new THREE.Scene();
  bgScene.background = new THREE.Color(0x0a0e27);
  bgScene.fog = new THREE.Fog(0x0a0e27, 150, 500);
  
  // Camera
  bgCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  bgCamera.position.z = 50;
  
  // Renderer
  bgRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setPixelRatio(window.devicePixelRatio);
  bgRenderer.shadowMap.enabled = true;
  container.appendChild(bgRenderer.domElement);
  
  // Setup 3D Scene
  createMovingStarfield();
  createBackground3DObjects();
  addBackgroundLighting();
  
  // Event listeners
  document.addEventListener("mousemove", onBackgroundMouseMove);
  window.addEventListener("resize", onBackgroundResize);
  
  // Start animation
  animate3DBackground();
}

// Create Moving Starfield
function createMovingStarfield() {
  const starCount = 300;
  
  for (let i = 0; i < starCount; i++) {
    // Random position across the whole scene
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;
    
    // Random size for depth effect
    const size = Math.random() * 0.8 + 0.2;
    
    // Random speed for parallax effect
    const speed = Math.random() * 0.03 + 0.005;
    
    // Random color (white to blue)
    const colors = [0xffffff, 0xccddff, 0x99ccff, 0x00ffff];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const star = {
      position: { x, y, z },
      size: size,
      speed: speed,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 30 + 10,
      color: color,
      brightness: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    };
    
    starField.push(star);
  }
  
  // Create star geometry and material
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  
  starField.forEach((star, index) => {
    starPositions[index * 3] = star.position.x;
    starPositions[index * 3 + 1] = star.position.y;
    starPositions[index * 3 + 2] = star.position.z;
    
    const r = (star.color >> 16) & 255;
    const g = (star.color >> 8) & 255;
    const b = star.color & 255;
    
    starColors[index * 3] = r / 255;
    starColors[index * 3 + 1] = g / 255;
    starColors[index * 3 + 2] = b / 255;
  });
  
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  bgScene.add(stars);
  
  bgObjects.push({
    mesh: stars,
    isStarfield: true,
    geometry: starGeometry
  });
}

// Create 3D Objects
function createBackground3DObjects() {
  // Create floating pyramids
  for (let i = 0; i < 8; i++) {
    const pyramid = createFloatingPyramid(i);
    bgObjects.push(pyramid);
    bgScene.add(pyramid);
  }
  
  // Create floating cubes
  for (let i = 0; i < 6; i++) {
    const cube = createFloatingCube(i);
    bgObjects.push(cube);
    bgScene.add(cube);
  }
  
  // Create particles
  createParticlesCloud();
}

// Create Floating Pyramid
function createFloatingPyramid(index) {
  const geometry = new THREE.TetrahedronGeometry(2, 0);
  
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    })
  ];
  
  const pyramid = new THREE.Mesh(geometry, materials);
  
  // Random position
  pyramid.position.x = (Math.random() - 0.5) * 200;
  pyramid.position.y = (Math.random() - 0.5) * 200;
  pyramid.position.z = (Math.random() - 0.5) * 200;
  
  // Random rotation
  pyramid.rotation.x = Math.random() * Math.PI;
  pyramid.rotation.y = Math.random() * Math.PI;
  pyramid.rotation.z = Math.random() * Math.PI;
  
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  
  return {
    mesh: pyramid,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    vz: (Math.random() - 0.5) * 0.2,
    rotX: (Math.random() - 0.5) * 0.01,
    rotY: (Math.random() - 0.5) * 0.01,
    rotZ: (Math.random() - 0.5) * 0.01
  };
}

// Create Floating Cube
function createFloatingCube(index) {
  const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
  
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xff0080,
      emissive: 0xff0080,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff6600,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3
    })
  ];
  
  const cube = new THREE.Mesh(geometry, materials);
  
  // Random position
  cube.position.x = (Math.random() - 0.5) * 200;
  cube.position.y = (Math.random() - 0.5) * 200;
  cube.position.z = (Math.random() - 0.5) * 200;
  
  // Random rotation
  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;
  cube.rotation.z = Math.random() * Math.PI;
  
  cube.castShadow = true;
  cube.receiveShadow = true;
  
  return {
    mesh: cube,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    vz: (Math.random() - 0.5) * 0.15,
    rotX: (Math.random() - 0.5) * 0.01,
    rotY: (Math.random() - 0.5) * 0.01,
    rotZ: (Math.random() - 0.5) * 0.01
  };
}

// Create Particles Cloud
function createParticlesCloud() {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
  }
  
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.5,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  
  const points = new THREE.Points(geometry, material);
  bgScene.add(points);
  
  bgObjects.push({
    mesh: points,
    isParticles: true
  });
}

// Add Lighting
function addBackgroundLighting() {
  // Ambient
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  bgScene.add(ambientLight);
  
  // Point lights
  const lights = [
    { pos: [100, 100, 100], color: 0x00ffff },
    { pos: [-100, 100, 100], color: 0xff00ff },
    { pos: [100, -100, 100], color: 0x00ff88 },
    { pos: [-100, -100, 100], color: 0xffff00 }
  ];
  
  lights.forEach(light => {
    const pl = new THREE.PointLight(light.color, 1, 300);
    pl.position.set(...light.pos);
    bgScene.add(pl);
  });
}

// Mouse Move
function onBackgroundMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Resize
function onBackgroundResize() {
  bgCamera.aspect = window.innerWidth / window.innerHeight;
  bgCamera.updateProjectionMatrix();
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate3DBackground() {
  requestAnimationFrame(animate3DBackground);
  
  time += 0.01;
  
  // Update objects
  bgObjects.forEach(obj => {
    if (obj.isStarfield) {
      // Update starfield positions for slow movement
      const positionAttribute = obj.geometry.getAttribute("position");
      const positions = positionAttribute.array;
      
      starField.forEach((star, index) => {
        // Circular movement for each star with slow speed
        star.angle += star.speed;
        
        const newX = Math.cos(star.angle) * star.radius + (mouse.x * 20);
        const newY = Math.sin(star.angle) * star.radius + (mouse.y * 20);
        const newZ = star.position.z + Math.sin(time * 0.5) * 0.5;
        
        positions[index * 3] = newX;
        positions[index * 3 + 1] = newY;
        positions[index * 3 + 2] = newZ;
      });
      
      positionAttribute.needsUpdate = true;
      obj.mesh.rotation.x += 0.0001;
      obj.mesh.rotation.y += 0.0002;
      
    } else if (obj.isParticles) {
      obj.mesh.rotation.x += 0.0001;
      obj.mesh.rotation.y += 0.0002;
    } else {
      const mesh = obj.mesh;
      
      // Movement
      mesh.position.x += obj.vx;
      mesh.position.y += obj.vy;
      mesh.position.z += obj.vz;
      
      // Bouncing
      if (mesh.position.x > 100 || mesh.position.x < -100) obj.vx *= -1;
      if (mesh.position.y > 100 || mesh.position.y < -100) obj.vy *= -1;
      if (mesh.position.z > 100 || mesh.position.z < -100) obj.vz *= -1;
      
      // Rotation
      mesh.rotation.x += obj.rotX + mouse.y * 0.0002;
      mesh.rotation.y += obj.rotY + mouse.x * 0.0002;
      mesh.rotation.z += obj.rotZ;
    }
  });
  
  // Camera movement based on mouse
  bgCamera.position.x = mouse.x * 10;
  bgCamera.position.y = mouse.y * 10;
  
  bgRenderer.render(bgScene, bgCamera);
}

// Initialize 3D Background on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init3DBackground);
} else {
  init3DBackground();
}

// ==========================================
// PYRAMID & CUBE IN HERO
// ==========================================

let scene, camera, renderer, pyramid, cube, audioContext, oscillator;
let heroMouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

// Initialize Three.js Scene
function initThreeJS() {
  const container = document.getElementById("threejs-container");
  if (!container) return;
  
  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e27);
  
  // Camera Setup
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;
  
  // Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  
  // Create 3D Objects
  createHeroPyramid();
  createHeroCube();
  
  // Add Lighting
  addHeroLights();
  
  // Event Listeners
  document.addEventListener("mousemove", onHeroMouseMove);
  window.addEventListener("click", playSound);
  window.addEventListener("resize", onHeroWindowResize);
  
  // Start Animation
  animateHero();
}

// Create 3D Pyramid
function createHeroPyramid() {
  const geometry = new THREE.TetrahedronGeometry(1, 0);
  
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    })
  ];
  
  pyramid = new THREE.Mesh(geometry, materials);
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  pyramid.position.x = -1.5;
  scene.add(pyramid);
  
  const glowGeometry = new THREE.TetrahedronGeometry(1.1, 0);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
  });
  
  const pyramidGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  pyramid.add(pyramidGlow);
}

// Create 3D Cube
function createHeroCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xff0080,
      emissive: 0xff0080,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff6600,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.2
    })
  ];
  
  cube = new THREE.Mesh(geometry, materials);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.x = 1.5;
  scene.add(cube);
  
  const glowGeometry = new THREE.BoxGeometry(1.15, 1.15, 1.15);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
  });
  
  const cubeGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  cube.add(cubeGlow);
}

// Add Lighting
function addHeroLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const pointLights = [
    { pos: [5, 5, 5], color: 0x00ffff },
    { pos: [-5, 5, 5], color: 0xff00ff },
    { pos: [5, -5, 5], color: 0x00ff88 },
    { pos: [-5, -5, 5], color: 0xffff00 },
    { pos: [0, 0, 5], color: 0xff0080 }
  ];
  
  pointLights.forEach(light => {
    const pl = new THREE.PointLight(light.color, 1.5, 100);
    pl.position.set(...light.pos);
    pl.castShadow = true;
    scene.add(pl);
  });
}

// Hero Mouse Movement
function onHeroMouseMove(event) {
  heroMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  heroMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  targetRotation.x = heroMouse.y * Math.PI;
  targetRotation.y = heroMouse.x * Math.PI;
}

// Play Sound
function playSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 200 + Math.random() * 600;
  oscillator.type = "sine";
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Hero Window Resize
function onHeroWindowResize() {
  const container = document.getElementById("threejs-container");
  if (!container) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Hero Animation
function animateHero() {
  requestAnimationFrame(animateHero);
  
  if (pyramid) {
    pyramid.rotation.x += (targetRotation.x - pyramid.rotation.x) * 0.1;
    pyramid.rotation.y += (targetRotation.y - pyramid.rotation.y) * 0.1;
    pyramid.rotation.z += 0.001;
  }
  
  if (cube) {
    cube.rotation.x += heroMouse.y * 0.015;
    cube.rotation.y += heroMouse.x * 0.015;
    cube.rotation.z += 0.002;
    cube.position.y = Math.sin(Date.now() * 0.001) * 0.3;
  }
  
  renderer.render(scene, camera);
}

// Initialize Hero on Page Load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThreeJS);
} else {
  initThreeJS();
}

// ==========================================
// SCROLL ANIMATIONS FOR OTHER SECTIONS
// ==========================================

const sections = document.querySelectorAll(".section");

window.addEventListener("scroll", () => {
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
    }
  });
});

sections.forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = "translateY(50px)";
  sec.style.transition = "0.8s ease";
});
