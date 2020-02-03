import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
// import webSocket from 'socket.io-client';
// import { Redirect } from 'react-router-dom';
import * as PIXI from 'pixi.js';
import decomp from 'poly-decomp';
window.decomp = decomp;

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
        let detailsArray = [];
        const shapes = [];
        const colors = ['3e5bb7', 'fa8b43', '498e8b', 'ea7da4'];
        // module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Common = Matter.Common,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Vertices = Matter.Vertices;
        
        const ww = window.innerWidth,
            wh = window.innerHeight;

        let seconds = 30;
        const end = new Date();
        end.setSeconds(end.getSeconds() + seconds + 1);

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
            const params = { isStatic: true, restitution: .8 };
            const wallLeft = Bodies.rectangle(-30, wh/2, 60, wh, { ...params });
            const wallRight = Bodies.rectangle(ww+30, wh/2, 60, wh, { ...params });
            const ground = Bodies.rectangle(ww/2, wh+30, ww, 60, { ...params });
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
            const radius = Math.round(Math.random() * 30 + 70);
            const num = Math.round(Math.random() * 2);
            const params = { restitution: .8 };
            let newobj = null;

            if(num === 0){
                const r = radius * 2;
                newobj = Bodies.circle(x, y, r, {...params });
                createCircle(r);
            }
            else if(num === 1){
                const r = radius * 2;
                const vtx = [
                    [r,0],
                    [r*2,r*2],
                    [0, r*2]
                ]
                const path = [].concat(vtx[0],vtx[1],vtx[2]);
                const triangle = Vertices.fromPath(path.join(' '));
                newobj = Bodies.fromVertices(x, y, Common.choose([triangle]), {...params}, true);
                createTriangle(path);
            }
            else if(num === 2){
                const r = radius * 2;
                newobj = Bodies.rectangle(x, y, r*2, r, { 
                    chamfer: { radius: [r*.99,r*.99,0] }
                });
                createHalfCircle(r);
            }

            const id = Math.round(Math.random()*2);
            newobj.productID = id;
            objects.push(newobj);

            World.add(engine.world, newobj);
        };

        const createCircle = (radius) => {
            const color = colors[Math.round(Math.random()*(colors.length-1))];
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            graphics.drawCircle(0, 0, radius);
            graphics.endFill();

            graphics.name = 'circle';

            createGraphic(graphics);
        }

        const createHalfCircle = (radius) => {
            const color = colors[Math.round(Math.random()*(colors.length-1))];
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            graphics.arc(0, 0, radius, 1 * Math.PI, 2 * Math.PI);
            graphics.endFill();

            graphics.pivot.y = -(radius/2 - radius*.075);
            
            graphics.name = 'halfcircle';

            createGraphic(graphics);
        }

        const createTriangle = (vtx) => {
            const color = colors[Math.round(Math.random()*(colors.length-1))];
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            for(let v=0; v<vtx.length; v+=2){
                v === 0 ?
                    graphics.moveTo(vtx[v], vtx[v+1]) 
                : 
                    graphics.lineTo(vtx[v], vtx[v+1]);
            }
            graphics.closePath();
            graphics.endFill();

            graphics.pivot.x = graphics.width/2;
            graphics.pivot.y = graphics.height/1.5;

            graphics.name = 'triangle';

            createGraphic(graphics);
        }
        
        const createGraphic = (graphics) => {
            const container = new PIXI.Container();
            const graphicsContainer = new PIXI.Container();
            const detailsContainer = new PIXI.Container();
            const size = graphics.width*.1;
            const cartName = '';
            const productName = '';
            const productID = 1;
            let tempgraphics = graphics.clone();
            tempgraphics.name = graphics.name;
            
            graphicsContainer.addChild(graphics);
            createCartName(cartName, detailsContainer);
            createProductName(productName, size, detailsContainer);
            createProductImage(productID, 'https://as1.ftcdn.net/jpg/02/12/43/28/500_F_212432820_Zf6CaVMwOXFIylDOEDqNqzURaYa7CHHc.jpg', detailsContainer, tempgraphics);
            
            container.addChild(graphicsContainer);
            container.addChild(detailsContainer);
            app.stage.addChild(container);

            // store data
            graphicsArray.push(graphicsContainer);
            detailsArray.push(detailsContainer);
            shapes.push(container);

            gsap.set(graphics.scale, {x:0, y:0});
            gsap.to(graphics.scale, .6, {x:1, y:1, ease:'elastic.out(1, 0.6)'});

            tempgraphics = null;
        }

        const createCartName = (cartName, container) => {
            // cart name

            // container.addChild();
        }
        
        const createProductName = (productName, size, container) => {
            // product name
            const style = new PIXI.TextStyle({
                align: "center",
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: size,
                fontWeight: "bold",
                letterSpacing: 1
            });
            const text = new PIXI.Text('Product\nName', style);
            text.pivot.x = text.width/2;
            text.pivot.y = text.height/2;
            text.alpha = 0;
            container.addChild(text);
        }

        const createProductImage = (pID, url, container, graphics) => {
            if(!app.loader.resources[`img_${pID}`]){
                app.loader.add(`img_${pID}`,url);
                app.loader.load((loader, resources) => {
                    addImage(resources[`img_${pID}`].texture, container, graphics);
                });
            }
            else{
                addImage(app.loader.resources[`img_${pID}`].texture, container, graphics);
            }
        }

        const addImage = (_texture, container, graphics) => {
            const texture = _texture;
            const image = new PIXI.Sprite.from(texture);
            image.anchor.set(0.5);
            image.alpha = 0;

            const ratio = image.height/image.width;

            if(image.width > graphics.width){
                if(graphics.name === 'halfcircle'){
                    image.scale.x = graphics.width/(image.width+(graphics.width-graphics.height)*3);
                }
                else if(graphics.name === 'triangle'){
                    image.scale.x = graphics.width/(image.width+600);
                }
                else{
                    image.scale.x = graphics.width/(image.width+150);
                }
                image.scale.y = image.width * ratio / image.height;
            }

            container.addChild(image);
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

        const removeAllObjects = () => {
            for(let i=objects.length-1; i>=0; i--){
                removeObject(i);
            }
        }

        const removeObject = (i) => {
            Composite.remove(engine.world, objects[i]);

            while(graphicsArray[i].children[0]){
                graphicsArray[i].removeChild(graphicsArray[i].children[0])
            }
            while(detailsArray[i].children[0]){
                detailsArray[i].removeChild(detailsArray[i].children[0])
            }
            while(shapes[i].children[0]){
                shapes[i].removeChild(shapes[i].children[0])
            }

            app.stage.removeChild(shapes[i]);
            objects.splice(i,1);
            graphicsArray.splice(i,1);
            detailsArray.splice(i,1);
            shapes.splice(i,1);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = end - now;
            seconds = Math.floor( distance % (1000 * 60) / 1000);

            // console.log(seconds);
            if(seconds === 0){
                console.log('end');
                showProductDetails();
            }
        }

        const showProductDetails = () => {

        }

        const initMatter = () => {
            addWalls();
            addMouseEvent();
            // run the engine
            Engine.run(engine);
            // run the renderer
            // Render.run(render);
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
                if(seconds > 0) updateTimer();

                for(let i=0; i<objects.length; i++){
                    const obj = objects[i];

                    shapes[i].x = obj.position.x;
                    shapes[i].y = obj.position.y;
                    graphicsArray[i].rotation = obj.angle;
                    
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
                removeAllObjects();
                // removeSpecificObject(2);
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
        <div ref={sceneElem} id="scene" style={{backgroundColor:'#fac05d'}}></div>
        <div ref={tempSceneElem} id="tempScene" style={{position:'fixed',top:0,pointerEvent:'none'}}></div>
    </>
}

export default Dropping2d;