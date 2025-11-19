import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2; // Seconds

        // Ground
        const geometry = new THREE.PlaneGeometry(20, 1000);
        const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, depthWrite: false });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // Grid Helper for visual speed reference
        this.grid = new THREE.GridHelper(20, 20, 0xffffff, 0x555555);
        this.grid.position.y = 0.01;
        this.grid.position.z = -25;
        this.grid.scale.z = 5;
        this.scene.add(this.grid);
    }

    reset() {
        this.obstacles.forEach(obs => {
            this.scene.remove(obs);
        });
        this.obstacles = [];
        this.spawnTimer = 0;
    }



    spawnObstacle() {
        const type = Math.random();
        let mesh;

        if (type < 0.2) {
            // Train (20% chance)
            const geometry = new THREE.BoxGeometry(2, 3, 10);
            const material = new THREE.MeshPhongMaterial({ color: 0xcc0000 }); // Red Train
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 1.5;
            mesh.userData = { type: 'train' };
        } else if (type < 0.7) {
            // Coin (50% chance)
            const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
            const material = new THREE.MeshPhongMaterial({ color: 0xffd700 }); // Gold
            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = 1;
            mesh.userData = { type: 'coin' };
        } else {
            // Regular Obstacle (30% chance)
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.5;
            mesh.userData = { type: 'obstacle' };
        }

        // Random Lane
        const lanes = [-2, 0, 2];
        const lane = lanes[Math.floor(Math.random() * lanes.length)];

        mesh.position.x = lane;
        mesh.position.z = -50; // Spawn far ahead
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);
        this.obstacles.push(mesh);
    }

    update(dt, speed) {
        // Move Grid to simulate speed
        this.grid.position.z += speed * dt;
        if (this.grid.position.z > 0) {
            this.grid.position.z = -25;
        }

        // Spawn Obstacles
        this.spawnTimer += dt;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            // Decrease interval slightly to make it harder
            if (this.spawnInterval > 0.5) this.spawnInterval -= 0.01;
        }

        // Move Obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.position.z += speed * dt;

            // Rotate Coins
            if (obs.userData.type === 'coin') {
                obs.rotation.z += dt * 5;
            }

            // Remove if behind camera
            if (obs.position.z > 10) {
                this.scene.remove(obs);
                this.obstacles.splice(i, 1);
            }
        }
    }

    checkCollision(playerMesh) {
        playerMesh.updateMatrixWorld(true);
        const playerBox = new THREE.Box3().setFromObject(playerMesh);

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.updateMatrixWorld(true);
            const obsBox = new THREE.Box3().setFromObject(obs);

            if (playerBox.intersectsBox(obsBox)) {
                if (obs.userData.type === 'coin') {
                    // Coin Collected
                    this.scene.remove(obs);
                    this.obstacles.splice(i, 1);
                    return 'coin';
                } else {
                    // Hit Obstacle
                    return 'hit';
                }
            }
        }
        return false;
    }
}
