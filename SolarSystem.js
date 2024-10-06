import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let sun, planets = [];
let speed = 1;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 50);

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets with textures
    addPlanet('mercury', 0.5, 10, 'textures/mercury.jpg');
    addPlanet('venus', 0.9, 15, 'textures/venus.jpg');
    addPlanet('earth', 1, 20, 'textures/earth.jpg');
    addPlanet('mars', 0.7, 25, 'textures/mars.jpg');
    addPlanet('jupiter', 4, 30, 'textures/jupiter.jpg');
    addPlanet('saturn', 2, 31, 'textures/saturn.jpg');
    addPlanet('uranus', 1.7, 31, 'textures/uranus.jpg');
    addPlanet('neptune', 1.7, 32, 'textures/neptune.jpg');

    window.addEventListener('resize', onWindowResize, false);

    // UI controls
    document.getElementById('speed').addEventListener('input', (event) => {
        speed = event.target.value;
    });
}

function addPlanet(name, size, distance, texturePath) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const texture = new THREE.TextureLoader().load(texturePath);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);

    planet.position.x = distance;
    scene.add(planet);

    planets.push({ name: name, mesh: planet, distance: distance });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate and orbit planets
    planets.forEach(planet => {
        planet.mesh.rotation.y += 0.01 * speed;
        planet.mesh.position.x = planet.distance * Math.cos(Date.now() * 0.001 / planet.distance * speed);
        planet.mesh.position.z = planet.distance * Math.sin(Date.now() * 0.001 / planet.distance * speed);
    });

    renderer.render(scene, camera);
    controls.update();
}
