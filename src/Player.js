import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;

        // Player Group
        this.mesh = new THREE.Group();
        this.scene.add(this.mesh);

        // Materials
        const skinMat = new THREE.MeshPhongMaterial({ color: 0xffccaa }); // Skin
        const shirtMat = new THREE.MeshPhongMaterial({ color: 0x3366ff }); // Blue Shirt
        const pantsMat = new THREE.MeshPhongMaterial({ color: 0x1e3c72 }); // Blue Jeans
        const capMat = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red Cap

        // Body
        const bodyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.3);
        this.body = new THREE.Mesh(bodyGeo, shirtMat);
        this.body.position.y = 0.7;
        this.body.castShadow = true;
        this.mesh.add(this.body);

        // Head
        const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        this.head = new THREE.Mesh(headGeo, skinMat);
        this.head.position.y = 1.2;
        this.head.castShadow = true;
        this.mesh.add(this.head);

        // Cap
        const capGeo = new THREE.BoxGeometry(0.42, 0.1, 0.5);
        this.cap = new THREE.Mesh(capGeo, capMat);
        this.cap.position.y = 1.4;
        this.cap.position.z = 0.05; // Peak forward
        this.cap.castShadow = true;
        this.mesh.add(this.cap);

        // Legs
        const legGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);

        this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
        this.leftLeg.position.set(-0.15, 0.3, 0);
        this.leftLeg.castShadow = true;
        this.mesh.add(this.leftLeg);

        this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
        this.rightLeg.position.set(0.15, 0.3, 0);
        this.rightLeg.castShadow = true;
        this.mesh.add(this.rightLeg);

        // Movement State
        this.lanes = [-2, 0, 2]; // Left, Center, Right
        this.currentLane = 1; // Start in Center
        this.targetX = 0;

        // Jump State
        this.isJumping = false;
        this.verticalVelocity = 0;
        this.gravity = -20;
        this.jumpForce = 8;
        this.groundY = 0; // Adjusted for group position

        // Animation State
        this.runTime = 0;
    }

    reset() {
        this.currentLane = 1;
        this.targetX = 0;
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.verticalVelocity = 0;
        this.isJumping = false;
        this.runTime = 0;
    }

    onKeyDown(event) {
        if (event.code === 'ArrowLeft') {
            if (this.currentLane > 0) {
                this.currentLane--;
            }
        } else if (event.code === 'ArrowRight') {
            if (this.currentLane < 2) {
                this.currentLane++;
            }
        } else if (event.code === 'ArrowUp' || event.code === 'Space') {
            if (!this.isJumping) {
                this.verticalVelocity = this.jumpForce;
                this.isJumping = true;
            }
        }

        this.targetX = this.lanes[this.currentLane];
    }

    update(dt) {
        // Horizontal Movement (Lerp for smoothness)
        this.mesh.position.x += (this.targetX - this.mesh.position.x) * 10 * dt;

        // Vertical Movement (Gravity)
        this.mesh.position.y += this.verticalVelocity * dt;
        this.verticalVelocity += this.gravity * dt;

        // Ground Collision
        if (this.mesh.position.y <= this.groundY) {
            this.mesh.position.y = this.groundY;
            this.verticalVelocity = 0;
            this.isJumping = false;
        }

        // Running Animation
        if (!this.isJumping) {
            this.runTime += dt * 10;
            this.leftLeg.rotation.x = Math.sin(this.runTime) * 0.5;
            this.rightLeg.rotation.x = Math.sin(this.runTime + Math.PI) * 0.5;
        } else {
            // Freeze legs when jumping
            this.leftLeg.rotation.x = 0.5;
            this.rightLeg.rotation.x = -0.5;
        }
    }
}
