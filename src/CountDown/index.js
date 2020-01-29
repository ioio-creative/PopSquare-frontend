import React, { useEffect, useState, useRef } from 'react';
// import gsap from 'gsap';
// import webSocket from 'socket.io-client';
import * as PIXI from 'pixi.js';
import Pie from './pie';
import Counter from './counter';

const CountDown = (props) => {
    const sceneElem = useRef(null);
    const timerElem = useRef(null);
    const [second, setSecond] = useState();


    useEffect(()=>{
        let app = undefined;
        // const colors = ['8f2d56', '0496ff', '006ba6', 'd81159', 'ffbc42'];
        const sec = 20;
        // const ww = window.innerWidth,
        //     wh = window.innerHeight;


        const initPIXI = () => {

            const ticker = PIXI.Ticker.shared;
            ticker.add(() => {
                update();
            });
            
            app = new PIXI.Application({
                width: window.innerWidth, 
                height: window.innerHeight,
                resolution: window.devicePixelRatio || 1,
                antialias:true,
                autoResize: true,
                transparent: true
            });
            sceneElem.current.prepend(app.view);

            const pie = new Pie(app,sec);
            const timer = new Counter(sec);
            pie.start();
            timer.start();

            const update = () => {
                pie.update();
                setSecond(timer.seconds);
                // timer.update();
            }
        }

        
        const onResize = (app) => {
            app.view.style.width = window.innerWidth+'px';
            app.view.style.height = window.innerHeight+'px';
            app.resize(window.innerWidth,window.innerHeight);
        }

        initPIXI();


        window.addEventListener('resize',(e)=>onResize(app));
        return () =>{
            window.removeEventListener('resize',onResize);
        }
    },[])

    return <>
        <div ref={sceneElem} id="scene" style={{backgroundColor:'#0547bd'}}></div>
        <div ref={timerElem} style={{position:'fixed',top:'50%',left:'60%',fontSize:60,color:'#fff'}}>
            00:<span>{second < 10 ? `0${second}` : second }</span>
        </div>
    </>
}

export default CountDown;