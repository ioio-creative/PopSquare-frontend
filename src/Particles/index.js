import React, { useEffect, useRef } from 'react';
import ParticlesAnim from '../Game/particles';
import '../Game/style.scss';

const Particles = () => {
    const shapesWrapElem = useRef(null);

    useEffect(()=>{
        const particlesAnim = new ParticlesAnim(shapesWrapElem.current);
        particlesAnim.start();
    },[]);

    return (
        <div id="game" style={{backgroundColor:'#3e5bb7',transform:'none'}}>
            <div className="center">
                <div ref={shapesWrapElem} id="shapesWrap"></div>
            </div>
        </div>
    )
}

export default Particles;