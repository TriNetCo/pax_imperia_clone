import { GalaxyDrawer } from './galaxyDrawer.js';
import { GalaxyDomManager } from './galaxyDomManager.js';
import { packData } from '../../models/helpers.js';
import { Galaxy } from '../../models/galaxy.js';
import * as THREE from 'three';

export class GalaxyWidget {

    galaxyDrawer;
    galaxyDomManager;
    canvas;
    systemClickHandler;

    constructor(config, galaxy) {
        this.c = config;
        this.mouse = { x: 0, y: 0 };
        this.galaxy = galaxy;
        this.gameClock = new THREE.Clock();

        if (typeof (window) !== 'undefined') {  // These globals break tests hard...
            // window.systemsData = this.galaxy.systems;
            window.gameClock = window.gameClock ? window.gameClock : this.gameClock;
        }

        if (!this.gameClock.running) {
            this.gameClock.start();
        }
    }

    beginGame(canvas, systemClickHandler) {
        this.canvas = canvas;
        this.systemClickHandler = systemClickHandler;
        let c = this.c;

        canvas.width = c.canvasWidth;
        canvas.height = c.canvasHeight;
        let cx = canvas.getContext("2d");

        let systemNameLabel = document.getElementById("system-name");
        this.galaxyDrawer = new GalaxyDrawer({
            cx: cx,
            galaxy: this.galaxy,
            systemNameLabel: systemNameLabel,
            mouse: this.mouse
        });
        this.galaxyDomManager = new GalaxyDomManager(
            cx,
            this.galaxy,
            this.galaxyDrawer,
            systemClickHandler,
            this.mouse)
        this.galaxyDomManager.attachDomEventsToCode();
    }

    exportGalaxyDataToJson() {
        const systemsJson = JSON.stringify(this.galaxy.systems);
        return systemsJson;
    }

    importGalaxyData(systemsJson) {
        let canvas = this.canvas;
        let systemClickHandler = this.systemClickHandler;

        this.galaxy = new Galaxy(null, systemsJson);

        if (this.canvas === undefined) return;  // Keep this for a unit testing hack so I wouldn't have to mock the browser's jazz

        let cx = canvas.getContext("2d");
        this.detachFromDom();

        let systemNameLabel = document.getElementById("system-name");
        this.galaxyDrawer = new GalaxyDrawer({
            cx: cx,
            galaxy: this.galaxy,
            systemNameLabel: systemNameLabel,
            mouse: this.mouse
        });
        this.galaxyDomManager = new GalaxyDomManager(
            cx,
            this.galaxy,
            this.galaxyDrawer,
            systemClickHandler,
            this.mouse);
        this.galaxyDomManager.attachDomEventsToCode();
    }

    draw() {
        this.galaxyDrawer.drawLoop();
    }

    detachFromDom() {
        this.galaxyDomManager.detachFromDom();
    }

}
