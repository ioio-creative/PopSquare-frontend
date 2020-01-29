import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
// import gsap from 'gsap';
// import webSocket from 'socket.io-client';
// import { Redirect } from 'react-router-dom';
import * as PIXI from 'pixi.js';


const Dropping2d = (props) => {
    const sceneElem = useRef(null);
    const tempSceneElem = useRef(null);
    // const [socket,setSocket] = useState(null);


    // useEffect(()=>{
    //     const addObject = (message) => {
    //         console.log(message);
    //         createObject();
    //     }

    //     if(socket){
    //         socket.emit('changePage', 'Redirect to summary page');
    //         socket.on('changePage', (message)=>{ 
    //             setTimeout(()=>{
    //                 console.log(message); 
    //                 // setIsRedirect(true);
    //             },3000);
    //         });

    //         socket.on('addObject', addObject);
    //     }else{
    //         setSocket(webSocket('http://localhost:3333'));
    //     }

    //     return ()=>{
    //         if(socket){
    //             socket.off('addObject', addObject);
    //         }
    //     }
    // },[socket,createObject])


    useEffect(()=>{
        let app = undefined;
        // let keyDown = null;
        let objects = [];
        let graphicsArray = [];
        const colors = ['8f2d56', '0496ff', '006ba6', 'd81159', 'ffbc42'];
        // module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Common = Matter.Common,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;
        
        const ww = window.innerWidth,
            wh = window.innerHeight;

        // create an engine
        const engine = Engine.create();

        // create a renderer
        const render = Render.create({
            element: tempSceneElem.current,
            engine: engine,
            options:{
                width: ww,
                height: wh,
                wireframes: true,
                background: 'transparent',
                wireframeBackground: 'transparent',
                showAngleIndicator: true
            }
        });

        const addWalls = () => {
            const wallLeft = Bodies.rectangle(-30, wh/2, 60, wh, { isStatic: true });
            const wallRight = Bodies.rectangle(ww+30, wh/2, 60, wh, { isStatic: true });
            const ground = Bodies.rectangle(ww/2, wh+30, ww, 60, { isStatic: true });
            ground.label = 'ground';

            World.add(engine.world, [wallLeft, wallRight, ground]);
        }
        

        // add mouse control
        const addMouseEvent = () => {
            const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
            World.add(engine.world, mouseConstraint);
        }


        var explosion = function() {
            var bodies = Composite.allBodies(engine.world);
    
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
    
                if (!body.isStatic) {
                    var forceMagnitude = .02 * body.mass;
    
                    Body.applyForce(body, body.position, {
                        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
                        y: -forceMagnitude + Common.random() * -forceMagnitude
                    });
                }
            }
        };


        // create body
        const createObject = () => {
            const x = Math.max(ww*.2, Math.min(ww*.8, Math.random() * ww));
            const y = 100;
            const radius = Math.round(Math.random() * (ww*.03) + 10);
            let newobj = null;
            // const num = Math.round(Math.random() * 3-1);
            const params = {
                restitution: 0.6,
            }

            // if(num === 0){
                const circle = Bodies.circle(x, y, radius, {...params });
                newobj = circle;
            // }
            // else if(num === 1){
                // const box = Bodies.rectangle(x, y, radius, radius, { ...params });
                // newobj = box;
            // }
            // else{
            //     const triangle = Bodies.polygon(x, y, 3, radius,{ ...params, label:'triangle' });
            //     // rotate triangle to right angle
            //     Body.rotate(triangle, -Math.PI/6);
            //     newobj = triangle;
            // }
            
            newobj.productID = Math.round(Math.random()*2);
            objects.push(newobj);


            World.add(engine.world, newobj);

            createGraphic(radius);
        };

        const createGraphic = (radius) => {
            const color = colors[Math.round(Math.random()*4)];
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            graphics.drawCircle(0, 0, radius);
            graphics.endFill();

            app.stage.addChild(graphics);

            graphicsArray.push(graphics);
        }

        const removeSpecificObject = (pID) => {
            let needToBeRemoved = [];
            for(let i=0; i<objects.length; i++){
                const obj = objects[i];
                if(obj.productID === pID){
                    needToBeRemoved.push(i);
                }
            }

            for(let i=needToBeRemoved.length-1; i>=0; i--){
                const p = needToBeRemoved[i];
                removeObject(p);
            }

            needToBeRemoved = undefined;
        }

        const removeObject = (i) => {
            Composite.remove(engine.world, objects[i]);
            app.stage.removeChild(graphicsArray[i]);
            objects.splice(i,1);
            graphicsArray.splice(i,1);
        }


        const initMatter = () => {
            addWalls();
            addMouseEvent();
            // run the engine
            Engine.run(engine);
            // run the renderer
            Render.run(render);
        }

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

            const update = () => {
                // console.log(objects)
                for(let i=0; i<objects.length; i++){
                    const obj = objects[i];
                    graphicsArray[i].x = obj.position.x;
                    graphicsArray[i].y = obj.position.y;
                    
                    if(obj.position.y > wh+graphicsArray[i].height){
                        removeObject(i);
                    }
                }
            }
        }
        
        // handle key down
        const keyDown = (e) => {
            if(e.keyCode === 8){
                // explosion();
                removeSpecificObject(2);
            }
            else{
                createObject();
            }
        }
        
        const onResize = (app) => {
            app.view.style.width = window.innerWidth+'px';
            app.view.style.height = window.innerHeight+'px';
            app.resize(window.innerWidth,window.innerHeight);
        }

        initMatter();
        initPIXI();



        // const loop = ()=>{
        //     animId = requestAnimationFrame(loop);

        //     for(let i=0; i<objects.length; i++){
        //         const body = objects[i];
        //         const domBody = domBodies[i];
        //         const { width, height } = getWidthHeight(body);
        //         let additionalRotation = 0;

        //         if(body.label === 'triangle')
        //             additionalRotation = (Math.PI/6)*(180/Math.PI);
                

        //         if(domBody)
        //             domBody.style.transform = `translate3d(${body.position.x-width/2}px,${body.position.y-height/2}px,0) rotate(${body.angle*(180/Math.PI)+additionalRotation}deg)`;


        //         if(body.position.y > h+height){
        //             objects.splice(i,1);
        //             domBodies.splice(i,1);
        //             Composite.remove(engine.world, body);
        //             domBody.remove();
        //         }
        //     }
        // }
        
        window.addEventListener('resize',(e)=>onResize(app));
        window.addEventListener("keydown", keyDown);

        return () =>{
            window.removeEventListener('resize',onResize);
            window.removeEventListener("keydown", keyDown);
        }
    },[])

    return <>
        <div ref={sceneElem} id="scene" style={{backgroundColor:'#0547bd'}}></div>
        <div ref={tempSceneElem} id="tempScene" style={{position:'fixed',top:0,pointerEvent:'none'}}></div>
    </>
}

export default Dropping2d;