import React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { DataContext } from "../../index";
import { useHistory } from 'react-router-dom';

const Galaxy = () => {
    const history = useHistory();
    let ref = useRef();
    const data = useContext(DataContext);

    useEffect(() => {
        let galaxyWidget = data.galaxyWidget;
        let canvas = ref.current;

        const systemClickHandler = (path) => {
            history.push(path);
        }

        galaxyWidget.beginGame(canvas, systemClickHandler);

        let requestId;
        const render = () => {
            galaxyWidget.draw();
            requestId = requestAnimationFrame(render);
        }
        render();

        return () => {
            cancelAnimationFrame(requestId);
            galaxyWidget.detachFromDom();
        }
    });


    return (
        <canvas
            ref={ref}
            id="galaxy-canvas-large"
            style={{ border: 'solid' }}
        />
    );
};

export default Galaxy;