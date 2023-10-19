import { Actor } from "./actor.js";

export class ColonyActor extends Actor {

    constructor(websocket, gameStateInterface) {
        super(websocket, gameStateInterface);
    }

    handle(action) {
        switch(action.name) {
            case "spawnShip":
                this.spawnShip(action);
                break;
            case "colonize":
                this.create(action);
                break;
            case "destroy":
                this.destroy(action);
                break;
            case "update":
                this.update(action);
                break;
        }
    }

    async spawnShip(action) {
        // unpack globals
        const galaxy = this.gameStateInterface.galaxy
        const spaceViewLoader = this.gameStateInterface.spaceViewWidget.spaceViewAnimator.spaceViewLoader;

        const ship = galaxy.spawnShip(action.data.shipConfig);

        spaceViewLoader.loadOutline(ship);
        await spaceViewLoader.loadShip(ship);
        ship.setLoadAttributes(ship.object3d);
        spaceViewLoader.scene.add(ship.object3d);
    }

}