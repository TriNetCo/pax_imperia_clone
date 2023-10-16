import React from 'react';
import { useEffect, useRef, useContext } from 'react';
import {GameDataContext} from '../../app/Context';

const SpaceView = () => {
    const data = useContext(GameDataContext);
    let spaceViewWidget = data.spaceViewWidget;
    let galaxyWidget = data.galaxyWidget;
    let requestId;

    const systemClickHandler = (path) => {
        const systemIndex = path.replace('/systems/', '');
        spaceViewWidget.changeSystem(systemIndex);
        galaxyWidget.changeSystem(systemIndex);
        history.pushState(null, null, '#' + path);
    };

    useEffect(() => {
        (async() => {
            let pathname = window.location.pathname;
            const hashString = window.location.hash;

            if (hashString.includes('#/systems')) {
                pathname = hashString.replace('#/', '/');
            }

            const systemIndex = parseInt(pathname.replace('/systems/', ''));
            const startTime = Date.now();
            await spaceViewWidget.loadWidget(systemIndex, systemClickHandler);
            const deltaTime = Date.now() - startTime;
            console.log(deltaTime + ' ms: spaceViewWidget#loadWidget');
        })();

        return () => {
            spaceViewWidget.detachFromDom();
        };
    });


    return (
        <div
            id="canvas-div"
            style={{ border: 'solid' }}
        />
    );
};

export default SpaceView;
