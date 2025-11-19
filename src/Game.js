import * as THREE from 'three';
import { Player } from './Player.js';
import { World } from './World.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
        this.scene.background = new THREE.Color(0xa0a0a0);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 3, 6);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-3, 10, -10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);

        // Game Objects
        this.player = new Player(this.scene);
        this.world = new World(this.scene);

        // State
        this.clock = new THREE.Clock();
        this.isPlaying = false;
        this.isGameOver = false;
        this.score = 0;
        this.speed = 10;

        // Bindings
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('click', () => {
            if (!this.isPlaying && !this.isGameOver) {
                this.reset();
            }
        });

        // UI Elements
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.startScreenElement = document.getElementById('start-screen');
    }

    start() {
        this.animate();
    }

    reset() {
        this.isGameOver = false;
        this.isPlaying = true;
        this.score = 0;
        this.speed = 10;
        this.player.reset();
        this.world.reset();
        this.scoreElement.innerText = 'Score: 0';
        this.gameOverElement.classList.add('hidden');
        this.startScreenElement.classList.add('hidden');
    }

    onKeyDown(event) {
        console.log('Key pressed:', event.code);
        if (!this.isPlaying && !this.isGameOver) {
            if (event.code === 'Space') {
                this.reset();
            }
        } else if (this.isGameOver) {
            if (event.code === 'Space') {
                this.reset();
            }
        } else {
            this.player.onKeyDown(event);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(dt) {
        if (!this.isPlaying || this.isGameOver) return;

        this.speed += dt * 0.1; // Increase speed over time
        this.score += dt * 10;
        this.scoreElement.innerText = `Score: ${Math.floor(this.score)}`;

        this.player.update(dt);
        this.world.update(dt, this.speed);

        // Collision Detection
        const collision = this.world.checkCollision(this.player.mesh);
        if (collision === 'hit') {
            this.gameOver();
        } else if (collision === 'coin') {
            this.score += 100;
            this.scoreElement.innerText = `Score: ${Math.floor(this.score)}`;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const dt = this.clock.getDelta();
        this.update(dt);
        this.renderer.render(this.scene, this.camera);
    }
}
