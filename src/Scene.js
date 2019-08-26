import React, { useEffect, useState } from 'react';
import Matter from 'matter-js';
import { TimelineMax, Power4, TweenMax } from 'gsap';
import webSocket from 'socket.io-client';

const Scene = (props) => {
    const [sceneElem, setSceneElem] = useState(null);
    const [bodiesWrap, setBodiesWrap] = useState(null);
    const [socket,setSocket] = useState(null);
    let createBody = null;

    useEffect(()=>{
        const addObject = (message) => {
            console.log(message);
            createBody();
        }

        if(socket){
            socket.emit('getMessage', 'to server');
            socket.on('addObject', addObject);
        }else{
            setSocket(webSocket('http://localhost:3333'));
        }

        return ()=>{
            if(socket){
                socket.off('addObject', addObject);
            }
        }
    },[socket,createBody])


    useEffect(()=>{
        let keyDown = null;
        let animId;
        if(sceneElem){
            let group = 0;
            let objects = [];
            let domBodies = [];
            const colors = ['#8f2d56', '#0496ff', '#006ba6', '#d81159', '#ffbc42'];
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
            
            const w = window.innerWidth,
                h = window.innerHeight;

            // create an engine
            const engine = Engine.create();

            // create a renderer
            const render = Render.create({
                element: sceneElem,
                engine: engine,
                options:{
                    width: w,
                    height: h,
                    wireframes: false,
                    background: '#0547bd'
                }
            });

            const getWidthHeight = (mainBody) => {
                const { min, max } = mainBody.bounds;
                return {
                    width: max.x - min.x,
                    height: max.y - min.y
                }
            }

            const wallLeft = Bodies.rectangle(-30, h/2, 60, h, { isStatic: true,
                collisionFilter: {
                    group: group,
                    mask: group
                }
            });
            const wallRight = Bodies.rectangle(w+30, h/2, 60, h, { isStatic: true,
                collisionFilter: {
                    group: group,
                    mask: group
                }
            });
            const ground = Bodies.rectangle(w/2, h+30, w, 60, { isStatic: true,
                collisionFilter: {
                    group: group,
                    mask: group
                }
            });
            ground.label = 'ground';

            World.add(engine.world, [wallLeft, wallRight, ground]);
            

            // add mouse control
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

            const showContent = () => {
                const tl = new TimelineMax();
                tl.to(engine.timing, 2, {timeScale: .03, ease: 'Expo.easeOut'},'s');
                tl.to('#bodiesWrap .eyesGroup', .6, {autoAlpha: 0, ease:'Power2.easeInOut'},'s');
                tl.to('#bodiesWrap .content', .6, {autoAlpha: 1, ease:'Power2.easeInOut'},'s');
                tl.to('#bodiesWrap .eyesGroup', 1, {autoAlpha: 1, ease:'Power2.easeInOut'},3);
                tl.to('#bodiesWrap .content', 1, {autoAlpha: 0, ease:'Power4.easeInOut'},3);
                tl.to(engine.timing, 1, {timeScale: 1, ease: 'Expo.easeInOut'},3);
            }

            // run the engine
            Engine.run(engine);

            // run the renderer
            Render.run(render);

            
            // add Dom bodies
            const createDomFrom = (mainBody, offsetX=0, offsetY=0) => {
                const { width, height } = getWidthHeight(mainBody);
                const eyeRadius = width*.08;

                const domBody = document.createElement('div');
                domBody.className = 'body';
                domBody.style.width = width+'px';
                domBody.style.height = height+'px';
                domBody.style.position = 'fixed';
                domBody.style.transform = `translate3d(${mainBody.position.x-width/2}px,${mainBody.position.y-height/2}px,0) rotate(${mainBody.angle*(180/Math.PI)}deg)`;

                const eyesGroup = document.createElement('div');
                eyesGroup.className = 'eyesGroup';

                const leftEye = document.createElement('div');
                leftEye.className = 'eye';
                leftEye.style.width = eyeRadius+'px';
                leftEye.style.height = eyeRadius+'px';
                leftEye.style.background = '#fff';
                leftEye.style.position = 'absolute';
                leftEye.style.left = width/2-offsetX-width*.2-eyeRadius/2+'px';
                leftEye.style.top = height/2-offsetY-height*.2+eyeRadius/2+'px';

                const rightEye = document.createElement('div');
                rightEye.className = 'eye';
                rightEye.style.width = eyeRadius+'px';
                rightEye.style.height = eyeRadius+'px';
                rightEye.style.background = '#fff';
                rightEye.style.position = 'absolute';
                rightEye.style.left = width/2-(-offsetX)+width*.2-eyeRadius/2+'px';
                rightEye.style.top = height/2-offsetY-height*.2+eyeRadius/2+'px';

                const product = 'product: 1';
                const category = 'category: 1';
                const information = 'information: 1';

                const content = document.createElement('div');
                content.className = 'content';
                content.innerHTML = `${product}<br/>${category}<br/>${information}`;

                eyesGroup.appendChild(leftEye);
                eyesGroup.appendChild(rightEye);
                domBody.appendChild(eyesGroup);
                domBody.appendChild(content);
                bodiesWrap.appendChild(domBody);

                domBodies.push(domBody);
            
                // animate eyes
                const a = Math.random() * 5;
                const b = Math.random() * 5;
                const c = Math.random() * 10;
                const tl = new TimelineMax({repeat:-1,repeatDelay:c});
                tl.to([leftEye, rightEye],.1,{scaleY:.1,ease:Power4.easeOut},a);
                tl.to([leftEye, rightEye],.1,{scaleY:1, ease:Power4.easeOut});
                tl.to([leftEye, rightEye],.1,{scaleY:.1},a+b);
                tl.to([leftEye, rightEye],.1,{scaleY:1});
            }

            // create body
            createBody = () => {
                const x = Math.max(w*.2, Math.min(w*.8, Math.random() * w));
                const y = 100;
                const radius = 1;//Math.round(Math.random() * (w*.03) + 10);
                let newobj = null;
                const num = Math.round(Math.random() * 3-1);
                const color = colors[Math.round(Math.random()*4)];
                const params = {
                    isStatic: true,
                    restitution: 0.6,
                    collisionFilter: {
                        group: group,
                        mask: group
                    },
                    render:{
                        fillStyle: color
                    }
                }

                if(num === 0){
                    const circle = Bodies.circle(x, y, radius, {...params });
                    newobj = circle;
                }
                else if(num === 1){
                    const box = Bodies.rectangle(x, y, radius, radius, { ...params });
                    newobj = box;
                }
                else{
                    const triangle = Bodies.polygon(x, y, 3, radius,{ ...params, label:'triangle' });
                    // rotate triangle to right angle
                    Body.rotate(triangle, -Math.PI/6);
                    newobj = triangle;
                }
                objects.push(newobj);

                World.add(engine.world, newobj);

                TweenMax.to(newobj, 1, {scale:2, ease:'Linear.easeNone', 
                    onUpdate:()=>{
                        Body.scale(newobj, 1.07,1.07);
                    },
                    onComplete:()=>{
                        Body.setStatic(newobj, false);
                        Body.scale(newobj, 1, 1);
                        const { width, height } = getWidthHeight(newobj);
                        
                        if(newobj.label === 'triangle')
                            createDomFrom(newobj, -width/2*.2, -height/2*.1);
                        else
                            createDomFrom(newobj, -width/2*.1, -height/2*.1);
                    }
                });
            };

            // Events.on(engine, 'beforeUpdate', function() {
            //     var gravity = engine.world.gravity;
            
            //     if (noGravity) {
            //         Body.applyForce(body, {
            //             x: 0,
            //             y: 0
            //         }, {
            //             x: -gravity.x * gravity.scale * body.mass,
            //             y: -gravity.y * gravity.scale * body.mass
            //         });
            //     }
            // });
            
            // remove body
            const removeAllBody = () => {
                group = Body.nextGroup(false);

                // update ground group
                ground.collisionFilter.group = group;
                ground.collisionFilter.mask = group;
                
                wallLeft.collisionFilter.group = group;
                wallLeft.collisionFilter.mask = group;
                
                wallRight.collisionFilter.group = group;
                wallRight.collisionFilter.mask = group;

                // re-add mouse event
                mouseConstraint.collisionFilter.group = group;
                mouseConstraint.collisionFilter.mask = group;
                World.add(engine.world, mouseConstraint);

                // setTimeout(()=>{
                //     removeAllBody();
                //     explosion();
                    // showContent();
                // },5000);
            }

            // handle key down
            keyDown = (e) => {
                if(e){
                    if(e.keyCode === 8){
                        removeAllBody();
                        explosion();
                    }
                    else if(e.keyCode === 13){
                        showContent();
                    }
                    else{
                        createBody();
                    }
                }
                else{
                    createBody();
                }
            }
            document.addEventListener("keydown", keyDown);
            document.addEventListener("touchstart", keyDown);


            // update collision filter first
            removeAllBody();


            // const gravity = engine.world.gravity;
            const loop = ()=>{
                animId = requestAnimationFrame(loop);
                
                for(let i=0; i<objects.length; i++){
                    const body = objects[i];
                    const domBody = domBodies[i];
                    const { width, height } = getWidthHeight(body);
                    let additionalRotation = 0;

                    if(body.label === 'triangle')
                        additionalRotation = (Math.PI/6)*(180/Math.PI);
                    

                    if(domBody)
                        domBody.style.transform = `translate3d(${body.position.x-width/2}px,${body.position.y-height/2}px,0) rotate(${body.angle*(180/Math.PI)+additionalRotation}deg)`;


                    if(body.position.y > h+height){
                        objects.splice(i,1);
                        domBodies.splice(i,1);
                        Composite.remove(engine.world, body);
                        domBody.remove();
                    }
                }
            }
            animId = requestAnimationFrame(loop);
        }
        return () =>{
            if(sceneElem){
                cancelAnimationFrame(animId);
                document.removeEventListener("keydown", keyDown);
                document.removeEventListener("touchstart", keyDown);
            }
        }
    },[sceneElem])

    return <>
        <div ref={(elem)=>{setBodiesWrap(elem)}} id="bodiesWrap"></div>
        <div ref={(elem)=>{setSceneElem(elem)}} id="scene"></div>
    </>
}

export default Scene;