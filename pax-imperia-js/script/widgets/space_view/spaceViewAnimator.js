// import * as THREE from '/node_modules/three/build/three.module.js';
import * as THREE from 'three';

export class SpaceViewAnimator {

    constructor(config, clientObjects, system) {
        this.c = config;
        this.clientObjects = clientObjects;
        this.system = system;
        // debugger;

        this.scene = clientObjects.scene;
        this.selectionSprite = clientObjects.selectionSprite;
        this.renderer = clientObjects.renderer;
        this.camera = clientObjects.camera;
        this.cx = clientObjects.cx;
        this.mouse = clientObjects.mouse;

        this.clock = new THREE.Clock();
    }

    drawLoop() {
        // Redraw everything 60 times a second
        // this.drawBackground();
        this.animate();
    }

    drawBackground() {
        let cx = this.cx;
        cx.fillStyle = "Black";
        cx.fillRect(0, 0, cx.canvas.width, cx.canvas.height);
    }

    async animate() {
        this.resetCamera()
        this.updateObjects()
        this.renderer.render( this.scene, this.camera );
    }

    resetCamera() {
        // Reset camera in real time
        //////////////////////////////

        let distance =  parseFloat( this.clientObjects.distanceSlider.value );

        // cameraPivot.rotation.set(xRotation, yRotation, 0.0);
        this.cameraPivot.rotation.set(-0.6, 0.05, -3);

        this.cameraPivot.position.set(0, 0, distance);
        this.camera.lookAt( this.scene.position );

        this.headLamp.position.set(0, 0, distance);
        // headLamp.lookAt(this.scene.position);

        this.camera.updateProjectionMatrix();
    }

    updateObjects() {
        // update ship position with slider bars
        // slider bars disabled
        // let xPosition = this.clientObjects.xSlider.value; // -1.5
        // let yPosition = this.clientObjects.ySlider.value; // 2.6
        // let zPosition = this.clientObjects.zSlider.value; // 6
        // this.system.ships[0].object3d.position.set(xPosition, yPosition, zPosition);
        // ship.rotation.set(0.7, -1.6, 0.4);

        // seconds since clock reset
        let deltaTime = this.clock.getDelta();
        // seconds since clock started (avoiding getElapsedTime() which resets clock)
        let elapsedTime = this.clock.elapsedTime;

        // TODO: use elapsedTime instead of deltaTime
        this.selectionSprite.update(deltaTime);

        for (const star of this.system['stars']) {
            star.update(elapsedTime);
        }

        for (const planet of this.system['planets']) {
            planet.update(elapsedTime);
        }

    }

    async populateScene() {
        const scene = this.scene;
        const system = await this.system;

        // Add Lights

        // var light = new THREE.DirectionalLight( 0xffffff, 1 );
        // light.position.set(22, 22, 25);
        // light.lookAt(0,0,0);
        // scene.add( light );

        // light = new THREE.DirectionalLight( 0xffffff, 1 );
        // light.position.set(2, 2, 5);
        // light.lookAt(0,0,0);
        // scene.add( light );

        var sunLight = new THREE.PointLight(new THREE.Color(), 1.25, 1000);
        scene.add(sunLight);

        this.headLamp = new THREE.DirectionalLight( 0xffffff, 1 );
        this.headLamp.position.set(22, 22, 25);
        scene.add( this.headLamp );

        //var ambientLight = new THREE.AmbientLight( 0xffffff, 0.05 );
        //scene.add( ambientLight );

        // Add Camera

        let camera = this.camera;
        scene.add(camera);

        var cameraLight = new THREE.PointLight(new THREE.Color(), .5, 10000);
        scene.add(cameraLight);
        camera.add(cameraLight);

        this.cameraPivot = new THREE.Group();
        camera.position.set(0, 0, 50);
        camera.lookAt( scene.position );
        this.cameraPivot.add(camera);
        scene.add(this.cameraPivot);

        // Load Models

        await system.load(scene);

        for (const wormhole of this.system['wormholes']) {
            wormhole.addWormholeText(scene);
        }


    }

}
