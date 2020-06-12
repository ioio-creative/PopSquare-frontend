import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Matter from 'matter-js';
import gsap from 'gsap';
import axios from 'axios';
import webSocket from 'socket.io-client';
import * as PIXI from 'pixi.js';
import Game from '../Game';
import Promotion, {promoAnim, stopPromoAnim} from '../Promotion';
import './style.scss';
import './pathseg';
import '../Game/style.scss';
import svg1 from './images/pop.svg';
import svg2 from './images/mark.svg';
import svg1_2 from './images/pop2.svg';
import svg2_2 from './images/mark2.svg';
import decomp from 'poly-decomp';
window.decomp = decomp;
// edited by hung, replace all window.innerwidth & window.innerheight to fix value
const [winW, winH] = [1080, 1920];
const Centrepiece = (props) => {
    const gameStarted = useSelector(state => state.gameStarted);

    // const [productData, setProductData] = useState(null);
    const [topProductData, setTopProductData] = useState(null);
    const [topProductIdx, setTopProductIdx] = useState(0);
    // const [trandData, setTrandData] = useState(null);
    const [promoData, setPromoData] = useState(null);

    const sceneElem = useRef(null);
    const tempSceneElem = useRef(null);
    const pick = useRef(null);
    const up = useRef(null);
    const centerpieceElem = useRef(null);
    const ranking = useRef(null);
    const rankingBg = useRef(null);
    const removeSpecificObjectFunc = useRef(null);
    const removeAllObjectsFunc = useRef(null);
    const addObjectFunc = useRef(null);
    const startTimerFunc = useRef(null);
    const stopTimerFunc = useRef(null);
    const preloadImageFunc = useRef(null);
    const getTrendDataFunc = useRef(null);
    const getPromoDataFunc = useRef(null);
    const getRankingDataLthFunc = useRef(null);
    const updateTopProductIdxFunc = useRef(null);
    const getProdctDataFunc = useRef(null);
    const getTopProdctDataFunc = useRef(null);
    
    const [socket,setSocket] = useState(null);


    useEffect(()=>{
        let loaded = false;
        

        const initProductData = (data) => {
            if(!loaded){
                loaded = true;
                // setProductData(data.data);
                console.log(data.data);
                if(data.data) preloadImageFunc.current.preloadImage(data.data);
                getProdctDataFunc.current.getProdctData(data.data);
            }
        }

        const initTopProductData = (data) => {
            console.log('top',data);
            setTopProductData(data);
            getTopProdctDataFunc.current.getTopProdctData(data);
            // getRankingDataLthFunc.current.getRankingDataLth(data.length);
        }

        const whenPickUp = (data) => {
            addObjectFunc.current.addObject(data.productId, data.productName, data.carId);
        }

        const whenPutDown = (data) => {
            removeSpecificObjectFunc.current.removeSpecificObject(data.productId);
        }
        
        // const getTrendData = () => {
        //     if(socket) socket.emit('getTrendData', initTrendData);
        // }
        // getTrendDataFunc.current = {getTrendData};

        // const initTrendData = (data) => {
        //     setTrandData(data); console.log('trend data',data)
        // }
        
        const getPromoData = () => {
            if(socket) socket.emit('getPromotionData', initPromoData);
        }
        getPromoDataFunc.current = {getPromoData};
        
        const initPromoData = (data) => {
            setPromoData(data); console.log('promotion data',data);
            // promoAnim()
        }

        if(socket){
            socket.emit('getTopProduct', initTopProductData);
            socket.on('productData', initProductData);
            socket.on('PICKUP', whenPickUp);
            socket.on('PUTDOWN', whenPutDown);
            // getTrendData()
            getPromoData();
        }else{
            setSocket(webSocket('http://192.168.8.109:8080/'));
        }

        return ()=>{
            if(socket){
                socket.off('topProductData', initTopProductData);
                socket.off('productData', initProductData);
                socket.off('PICKUP', whenPickUp);
                socket.off('PUTDOWN', whenPutDown);
            }
        }
    },[socket])


    useEffect(()=>{
        let app = undefined;
        const objects = [];
        const graphicsArray = [];
        const detailsArray = [];
        const eyesArray = [];
        const shapes = [];
        const colors = ['3e5bb7', 'fa8b43', '498e8b', 'ea7da4', '999999'];
        const eyesTween = [];
        const productDetailsTween = [];
        const popSvgObjects = [];
        const popSvgGraphics = [];
        const popVertexSets = [];
        const markVertexSets = [];
        let started = false;
        let paused = false; // when game started
        let disablePick = false;
        let timeScaleTarget = 1;
        const group = -1;
        let page = 'loading';
        let end = new Date();
        let rankingDataLength = 3; // from data
        const a = {b:0}
        let initialTopProductData = null;
        let tempProductData = null;


        // module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Body = Matter.Body,
            Events = Matter.Events,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Common = Matter.Common,
            // Mouse = Matter.Mouse,
            // MouseConstraint = Matter.MouseConstraint,
            Svg = Matter.Svg,
            Vertices = Matter.Vertices;
        
        const ww = winW,
            wh = winH;



        // create an engine
        const engine = Engine.create();
        
        engine.world.gravity.y = 5;

        // create a renderer
        Render.create({
            // element: tempSceneElem.current,
            engine: engine,
            options:{
                width: ww,
                height: wh,
                wireframes: true,
                background: 'transparent',
                wireframeBackground: 'transparent',
                // showAngleIndicator: true
            }
        });

        const addWalls = () => {
            const params = { isStatic: true, restitution: .5, collisionFilter: { group: group } };
            const top = Bodies.rectangle(ww/2,-100, ww, 200, { ...params });
            const wallLeft = Bodies.rectangle(-100, wh/2, 200, wh, { ...params });
            const wallRight = Bodies.rectangle(ww+100, wh/2, 200, wh, { ...params });
            const ground = Bodies.rectangle(ww/2, wh+100, ww, 200, { ...params });

            World.add(engine.world, [top, wallLeft, wallRight, ground]);
        }
        

        // add mouse control
        // const addMouseEvent = () => {
        //     const mouse = Mouse.create(render.canvas),
        //     mouseConstraint = MouseConstraint.create(engine, {
        //         mouse: mouse,
        //         constraint: {
        //             stiffness: 0.2,
        //             render: {
        //                 visible: false
        //             }
        //         }
        //     });
        //     World.add(engine.world, mouseConstraint);
        // }

        const getTopProdctData = (d) => {
            initialTopProductData = d;
        }
        getTopProdctDataFunc.current = {getTopProdctData}

        const getProdctData = (d) => {
            tempProductData = d;
        }
        getProdctDataFunc.current = {getProdctData}

        const addObject = (_productID, _productName, _cartName) => {
            if(!paused && !disablePick){
                if(!started){
                    started = true;
                    removeAllObjects();
                }
                createObject(_productID, _productName, _cartName);
                pick.current.className = 'text active';
                up.current.className = 'text active';

                const pickedupData = tempProductData.find((el)=>el.productId === _productID);
                setTopProductData((topProductData)=>{
                    return [...topProductData, pickedupData].slice(-3);
                });

                if(centerpieceElem.current.className === 'important'){
                    gsap.set(centerpieceElem.current, {className:''});
                    gsap.to('#promotion #cutline > span', 1, {y:'-100%', ease:'power4.inOut'});
                    gsap.to('#promotion #cutline span span', 1, {y:'100%', ease:'power4.inOut'});
                    gsap.to('#promotion #cutline #cutter', .3, {autoAlpha:0, ease:'power1.inOut'});
                    gsap.to('#promotion #leftbg span', 1, {force3D:true, y:'-100%', ease:'power4.out'});
                    gsap.to('#promotion #rightbg span', 1, {force3D:true, y:'100%', ease:'power4.out'});
                }
            }
        }
        addObjectFunc.current = {addObject};


        const createObject = (_productID = -1, _productName, _cartName) => {
            const num = Math.round(Math.random() * 2);
            let _obj = null;

            if(_cartName === '12' || (_productID === -1 && num === 0)){
                _obj = createShape('circle', colors[0], _productID, _productName, _cartName);
            }
            else if(_cartName === '13' || (_productID === -1 && num === 1)){
                _obj = createShape('triangle', colors[1], _productID, _productName, _cartName);
            }
            else if(_cartName === '14' || (_productID === -1 && num === 2)){
                _obj = createShape('halfCircle', colors[2], _productID, _productName, _cartName);
            }
            else if(_cartName === '15' || (_productID === -1 && num === 2)){
                _obj = createShape('smallCircle', colors[3], _productID, _productName, _cartName);
            }
            else if(_cartName === '16' || (_productID === -1 && num === 2)){
                _obj = createShape('halfCircle', colors[4], _productID, _productName, _cartName);
            }

            _obj.productID = _productID || num;

            objects.push(_obj);
            if(objects.length > 4) removeObject(0);
            if(popSvgObjects.length > 2*2){ removePopObject(0); }

            World.add(engine.world, _obj);
        };


        const createShape = (shape, color, _productID, _productName, _cartName) => {
            const x = ww*.5;//Math.max(ww*.3, Math.min(ww*.7, Math.random() * ww));
            const y = 300;
            const radius = Math.round(Math.random() * 40 + (ww > wh ? wh*.1 : ww*.1));
            const params = { restitution: .5, collisionFilter: { group: 0 } };
            const r = radius * 2;
            let body = null;
            let graphics = null;

            switch(shape){
                case 'circle':
                    body = Bodies.circle(x, y, r, {...params });
                    graphics = createCircleGraphics(shape, r, color);
                    break;
                    
                case 'smallCircle':
                    body = Bodies.circle(x, y, r/2, {...params });
                    graphics = createCircleGraphics(shape, r/1.5, color);
                    break;
                    
                case 'triangle':
                    const vtx = [
                        [r,0],
                        [r*2,r*2],
                        [0, r*2]
                    ]
                    const path = [].concat(vtx[0],vtx[1],vtx[2]);
                    const triangle = Vertices.fromPath(path.join(' '));
                    body = Bodies.fromVertices(x, y, Common.choose([triangle]), {...params}, true);
                    graphics = createTriangleGraphics(shape, path, color);
                    break;

                case 'halfCircle':
                    body = Bodies.rectangle(x, y, r*2, r, { 
                        chamfer: { radius: [r*.99,r*.99,0] },
                        ...params
                    });
                    graphics = createHalfCircleGraphics(shape, r, color);
                    break;

                default:
                    break;
            }
            

            if(_productID === -1)
                createGraphicWithShadow(graphics);
            else{
                createGraphicWithInfo(shape, graphics, _productID, _productName, _cartName);
                addPop();
            }

            return body;
        }

        const createCircleGraphics = (shape, radius, color) => {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            graphics.drawCircle(0, 0, radius);
            graphics.endFill();
            graphics.name = shape;

            return graphics;
        }

        const createHalfCircleGraphics = (shape, radius, color) => {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(`0x${color}`, 1);
            graphics.arc(0, 0, radius, 1 * Math.PI, 2 * Math.PI);
            graphics.endFill();
            graphics.pivot.y = -(radius/2 - radius*.075);
            graphics.name = shape;

            return graphics;
            // createGraphic(graphics);
        }

        const createTriangleGraphics = (shape, vtx, color) => {
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

            graphics.name = shape;

            return graphics;
        }

        const createGraphicWithShadow = (graphics) => {
            const container = new PIXI.Container();
            const graphicsContainer = new PIXI.Container();
            const shadow = graphics.clone();
            shadow.tint = 0x333333;
            shadow.pivot.x = graphics.pivot.x;
            shadow.pivot.y = graphics.pivot.y;
            shadow.x = -20;
            shadow.y = 15;
            
            graphicsContainer.addChild(shadow);
            graphicsContainer.addChild(graphics);
            createEyes(graphicsContainer);
            
            container.addChild(graphicsContainer);
            app.stage.addChild(container);

            // store data
            graphicsArray.push(graphicsContainer);
            detailsArray.push(null);
            shapes.push(container);
        }
        
        const createGraphicWithInfo = (shape, graphics, _productID, _productName, _cartName) => {
            const container = new PIXI.Container();
            const graphicsContainer = new PIXI.Container();
            const detailsContainer = new PIXI.Container();
            let size, textblockwidth;
            if(shape === 'halfCircle'){
                size = graphics.width*.05;
                textblockwidth = graphics.width * .6;
            }else{
                size = graphics.width*.08;
                textblockwidth = graphics.width * .8;
            }
            // const cartName = _cartName;
            const productName = _productName;
            const productID = _productID;
            let tempgraphics = graphics.clone();
            tempgraphics.name = graphics.name;
            detailsContainer.alpha = 0;
            
            graphicsContainer.addChild(graphics);
            createEyes(graphicsContainer);
            createProductName(productName, size, detailsContainer, textblockwidth);
            createProductImage(productID, detailsContainer, tempgraphics);
            // createCartName(cartName, detailsContainer, graphicsContainer);
            
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

        const createEyes = (container) => {
            const eyesContainer = new PIXI.Container();
            const leftEye = new PIXI.Graphics();
            leftEye.beginFill(0x333333, 1);
            leftEye.drawRoundedRect(0, 0, 18, 25, (23)/2);
            leftEye.endFill();
            leftEye.pivot.x = leftEye.width/2;
            leftEye.pivot.y = leftEye.height/2;

            const rightEye = leftEye.clone();
            rightEye.pivot.x = rightEye.width/2;
            rightEye.pivot.y = rightEye.height/2;

            leftEye.x = -23;
            rightEye.x = 23;

            // leftEye.scale.y = 0;
            // rightEye.scale.y = 0;

            const offset = (Math.round(Math.random()*3));
            eyesContainer.y = -container.height/(3 + offset);

            eyesContainer.addChild(leftEye);
            eyesContainer.addChild(rightEye);
            container.addChild(eyesContainer);

            eyesArray.push(eyesContainer);

            const tl = gsap.timeline({delay:Math.random()*6+1, repeat:-1, repeatDelay:Math.random()*7+3});
            tl.to(eyesContainer, 1, {x:`+=${Math.random()*120-60}`, y:`+=${Math.random()*120-30}`, ease:'power3.out'},'s');
            tl.to([leftEye.scale, rightEye.scale], .1, {y:0, ease:'power3.inOut'},1.1);
            tl.to([leftEye.scale, rightEye.scale], .1, {y:1, ease:'power3.inOut'},1.23);
            tl.to([leftEye.scale, rightEye.scale], .1, {y:0, ease:'power3.inOut'},1.33);
            tl.to([leftEye.scale, rightEye.scale], .1, {y:1, ease:'power3.inOut'},1.43);
            tl.to(eyesContainer, 1, {x:`+=${Math.random()*120-60}`, y:`+=${Math.random()*60-60}`, ease:'power2.inout'},1);
            tl.to(eyesContainer, 1, {x:0, y:-container.height/(3 + offset), ease:'power2.inout'},Math.random()*3+5);

            eyesTween.push(tl);
        }

        // const createCartName = (cartName, container, graphicsContainer) => {
        //     const cartContainer = new PIXI.Container();

        //     const style = new PIXI.TextStyle({
        //         align: "center",
        //         fill: "#333333",
        //         fontFamily: "Comic Sans MS",
        //         fontSize: 30,
        //         fontWeight: "bold",
        //         letterSpacing: 1
        //     });
        //     const text = new PIXI.Text(cartName, style);
        //     text.pivot.x = text.width/2;
        //     text.pivot.y = text.height/2;

            
        //     const bg = new PIXI.Graphics();
        //     bg.beginFill(0xffffff, 1);
        //     bg.drawRoundedRect(0, 0, text.width+60, text.height+40, text.height+5);
        //     bg.pivot.x = bg.width/2;
        //     bg.pivot.y = bg.height/2;

        //     cartContainer.addChild(bg);
        //     cartContainer.addChild(text);

        //     cartContainer.x = graphicsContainer.width/3;
        //     cartContainer.y = graphicsContainer.height/3;

        //     container.addChild(cartContainer);
        // }
        
        const createProductName = (productName, size, container, tbw) => {
            // product name
            const style = new PIXI.TextStyle({
                align: "left",
                fill: "white",
                fontFamily: "Inter, Noto Sans TC",
                fontSize: size,
                fontWeight: "bold",
                lineHeight: size,
                letterSpacing: 1,
                wordWrap:true,
                wordWrapWidth:tbw
            });
            const text = new PIXI.Text(productName.en+'\n\n'+productName.zh, style);
            // const textzh = new PIXI.Text(productName.zh, style);
            text.pivot.x = text.width/2;
            text.pivot.y = text.height/2;
            // textzh.pivot.x = textzh.width/2;
            // textzh.pivot.y = -10;
            // text.alpha = 0;
            container.addChild(text);
            // container.addChild(textzh);
        }

        const preloadImage = (images) => {
            for(let i=0; i<images.length; i++){
                app.loader.add(`img_${images[i].productId}`, images[i].productImage, { crossOrigin:true });
            }
            app.loader.load((loader, resources) => {
                console.log(resources)
            });
        }
        preloadImageFunc.current = {preloadImage}

        const createProductImage = (pID, container, graphics) => {
            addImage(app.loader.resources[`img_${pID}`].texture, container, graphics);
        }

        const addImage = (_texture, container, graphics) => {
            const texture = _texture;
            const image = new PIXI.Sprite.from(texture);
            image.anchor.set(0.5);
            image.alpha = 0;

            const ratio = image.height/image.width;

            if(graphics.name === 'halfCircle'){
                image.scale.x = graphics.width/(image.width+(graphics.width-graphics.height)*2);
            }
            else if(graphics.name === 'triangle'){
                image.scale.x = graphics.width/(image.width+600);
            }
            else{
                image.scale.x = graphics.width/(image.width+150);
            }
            image.scale.y = image.width * ratio / image.height;

            container.addChild(image);
        }
        

        const showProductDetails = () => {
            for(let i=0; i<detailsArray.length; i++){
                const detail = detailsArray[i];
                if(detail !== null){
                    const text = detail.children[0];
                    // const textzh = detail.children[1];
                    const image = detail.children[1];
                    
                    gsap.to(eyesArray, .3, {alpha:0, overwrite:true, ease:'power3.inOut'});
                    gsap.to(detailsArray, .3, {alpha:1, overwrite:true, ease:'power3.inOut'});

                    const tl = gsap.timeline({delay:Math.random()*3+1});
                    tl.to(text, .6, {alpha:1, ease:'power3.inOut'},'s');
                    // tl.to(textzh, .6, {alpha:1, ease:'power3.inOut'},'s');
                    tl.to(text, .3, {alpha:0, ease:'power3.inOut'},3);
                    // tl.to(textzh, .3, {alpha:0, ease:'power3.inOut'},3);
                    tl.to(image, .6, {alpha:1, ease:'power3.inOut'},3);

                    productDetailsTween.push(tl);
                }
            }
        }

        
        const preloadSvg = () => {
            axios.get(svg1).then(function (response) {
                const tempDiv = document.createElement('temp');
                tempDiv.innerHTML = response.data;
                const paths = tempDiv.querySelectorAll('path');

                for(let i=0; i<paths.length; i++){
                    popVertexSets.push(Svg.pathToVertices(paths[i], 30));
                }
            });
            axios.get(svg2).then(function (response) {
                const tempDiv = document.createElement('temp');
                tempDiv.innerHTML = response.data;
                const paths = tempDiv.querySelectorAll('path');

                for(let i=0; i<paths.length; i++){
                    markVertexSets.push(Svg.pathToVertices(paths[i], 30));
                }
            });
        }
        
        const addPop = () => {
            const params = { restitution: .5, collisionFilter: { group: 0 } }
            const popObj = Bodies.fromVertices(ww*.45, 300, popVertexSets, params, true)
            const markObj = Bodies.fromVertices(ww*.85, 300, markVertexSets, params, true)

            popSvgObjects.push(popObj);
            popSvgObjects.push(markObj);
            World.add(engine.world, popObj);
            World.add(engine.world, markObj);

            createPopGraphics(svg1_2, 0.485, .45);
            createPopGraphics(svg2_2, 0.5, .47);
        }

        const createPopGraphics = (svg, anchorX, anchorY) => {
            const texture = new PIXI.Texture.from(svg);
            const pop = new PIXI.Sprite(texture);
            pop.anchor.set(anchorX, anchorY);
            popSvgGraphics.push(pop);
            app.stage.addChild(pop);
            
            gsap.set(pop.scale, {x:0, y:0});
            gsap.to(pop.scale, 1, {x:1, y:1, ease:'elastic.out(1, 0.3)'});
        }

        const removeSpecificObject = (pID) => {
            if(!disablePick){
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
        }
        removeSpecificObjectFunc.current = {removeSpecificObject}

        const removeAllObjects = () => {
            for(let i=objects.length-1; i>=0; i--){
                removeObject(i);
            }
            for(let i=popSvgObjects.length/2-1; i>=0; i--){
                removePopObject(i);
            }
        }
        removeAllObjectsFunc.current = {removeAllObjects}

        const removingShapeAnimation = function(i){
            this.tempShapes = graphicsArray[i].children[0].clone();
            this.tempShapes.pivot.x = graphicsArray[i].children[0].pivot.x;
            this.tempShapes.pivot.y = graphicsArray[i].children[0].pivot.y;
            this.tempShapes.x = shapes[i].x;
            this.tempShapes.y = shapes[i].y;
            this.tempShapes.rotation = graphicsArray[i].rotation;

            app.stage.addChild(this.tempShapes);
            gsap.to(this.tempShapes.scale, .3, {x:0, y:0, ease: 'back.in(1.7)',
                onComplete:()=>{
                    app.stage.removeChild(this.tempShapes);
                }
            })
        }

        const removeObject = (i) => {
            Composite.remove(engine.world, objects[i]);
            
            new removingShapeAnimation(i);

            if(eyesTween[i]){
                eyesTween[i].kill();
                eyesTween[i] = null;
                eyesTween.splice(i,1);
            }

            if(productDetailsTween[i]){
                productDetailsTween[i].kill();
                productDetailsTween[i] = null;
                productDetailsTween.splice(i,1);
            }
            
            app.stage.removeChild(shapes[i]);
            
            eyesArray[i].destroy({children: true, texture: false, baseTexture: false});
            graphicsArray[i].destroy({children: true, texture: false, baseTexture: false});
            if(detailsArray[i]) detailsArray[i].destroy({children: true, texture: false, baseTexture: false});
            shapes[i].destroy({children: true, texture: false, baseTexture: false});

            objects[i] = null;
            graphicsArray[i] = null;
            detailsArray[i] = null;
            shapes[i] = null;

            objects.splice(i,1);
            graphicsArray.splice(i,1);
            detailsArray.splice(i,1);
            shapes.splice(i,1);
        }

        const removePopObject = (i) => {
            const idx = i*2;

            if(popSvgObjects[idx]){
                Composite.remove(engine.world, popSvgObjects[idx]);
                Composite.remove(engine.world, popSvgObjects[idx+1]);
            }

            if(popSvgGraphics[idx]){
                app.stage.removeChild(popSvgGraphics[idx]);
                app.stage.removeChild(popSvgGraphics[idx+1]);
            }

            popSvgObjects[idx] = null;
            popSvgObjects[idx+1] = null;
            popSvgGraphics[idx] = null;
            popSvgGraphics[idx+1] = null;

            popSvgObjects.splice(idx+1,1);
            popSvgObjects.splice(idx,1);
            popSvgGraphics.splice(idx+1,1);
            popSvgGraphics.splice(idx,1);
        }

        const reset = () => {
            disablePick = false;
            started = false;
            createObject();
            createObject();
            createObject();
            createObject();
            timeScaleTarget = 1;
            pick.current.className = 'text';
            up.current.className = 'text';
            counter = 0;
            gsap.to(['#pick','#up'], 1, {delay:1, force3D:true, scale:1, stagger:.3, ease:'elastic.out(1, 0.5)'});
            gsap.to('#promotion #cutline span', .3, {y:0, ease:'power4.inOut'});
            gsap.to('#promotion #cutline #cutter', .3, {autoAlpha:1, ease:'power1.inOut'});
            gsap.set('#promotion *:not(.important)',{clearProps:true});
            // getTrendDataFunc.current.getTrendData();
            getPromoDataFunc.current.getPromoData();
        }

        const setTimer = (seconds) => {
            end = new Date();
            end.setSeconds(end.getSeconds() + seconds + 1);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = end - now;
            const seconds = Math.floor( distance % (1000 * 60) / 1000);

            // console.log(seconds);
            if(seconds === 10){
                if(started){
                    if(page === 'loading'){ // end in loading page
                        disablePick = true;
                        page = 'details';
                        explosion();
                        showProductDetails();
                    }
                }
            }
            if(seconds <= 0){
                if(page === 'loading' || page === 'details'){ // end in loading page
                    page = 'ranking';
                    started = false;
                    disablePick = true;
                    // if have propmotion
                    const lth = document.querySelectorAll('#promotion .frame').length;
                    let t = 0;
                    if(lth===1) t = 21;
                    if(lth===2) t = 29;
                    if(lth===3) t = 39;

                    setTimer((rankingDataLength*5)-1 + t);
                    removeAllObjects();
                    rankingAnimtion();
                }
                else if(page === 'ranking'){ // end in ranking page
                    page = 'loading';
                    setTimer(40-1);
                    reset();
                }
            }
        }

        const startTimer = () => {
            reset();
            ranking.current.className = '';
            setTimer(40-1);
            paused = false;
        }
        startTimerFunc.current = {startTimer};

        const stopTimer = () => {
            paused = true;
        }
        stopTimerFunc.current = {stopTimer};


        let doOnce = false;
        let idx = 0;
        let by = 0;
        let counter = 0;
        Events.on(engine, 'beforeUpdate', function(event) {
            const timer = performance.now()/1000;
            counter += 1;

            if(!started && objects.length){
                if(Math.round(timer % 7) === 0){
                    if(!doOnce){
                        doOnce = true;
                        by = 0;
                        idx = Math.round(Math.random() * (objects.length-1));
                    }
                }
                if(timer % 10 > 8){
                    if(doOnce)
                        doOnce = false;
                    by += .7;
                    if(objects[idx])
                        Body.setVelocity(objects[idx], {x: 0, y: -by});
                }
                if(counter >= 60 * 2){
                    const target = objects[Math.round(Math.random() * (objects.length-1))];
                    if(target)
                        Body.setVelocity(target, {x: 0, y: -50});
                    counter = 0;
                }
            }
        })
        Events.on(engine, 'afterUpdate', function() {
            engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 0.05;
        });


        const rankingAnimtion = () => {
            const spans = document.querySelectorAll('#ranking #productName span');
            const divs = document.querySelectorAll('#ranking #list li div');

            ranking.current.className = 'active';

            runRankingAnimation(spans, divs);

            const tl = gsap.timeline();
            tl.to(a, 5, {b:1, repeat:rankingDataLength-1, 
                onRepeat:function(){
                    updateTopProductIdxFunc.current.updateTopProductIdx();
                    runRankingAnimation(spans, divs);
                }
            });
            tl.set(['#pick','#up'], {scale:0});
            tl.set(ranking.current, {className:'active out'},'+=1');
            tl.to('#promotion #cutline #cutter', .3, {autoAlpha:0, ease:'power1.inOut'},'s');
            // if have propmotion
            if(document.querySelectorAll('#promotion .frame').length)
                tl.call(()=>promoAnim(), null, 's');
            tl.set(centerpieceElem.current, {className:'important'},'+=1');
            tl.set(ranking.current, {className:''},'+=1');
            tl.call(()=>setTopProductIdx(0), null);
            tl.call(()=>setTopProductData(initialTopProductData), null);
        }
        // promoAnim()
        const runRankingAnimation = (spans, divs) => {
            rankingIn(spans, divs);
            setTimeout(()=>{
                rankingOut(spans, divs);
            },4000);
        }

        const rankingIn = (spans, divs) => {
            
            // logo
            // gsap.fromTo('#ranking #logo', .6, {scale:0}, {delay:.7, scale: 1, overwrite:true, ease:'elastic.out(1, 0.75)'});

            // image
            gsap.fromTo('#ranking #image', .6, {scale:0}, {delay:1, scale: 1, overwrite:true, ease:'elastic.out(1, 0.75)'});
            
            // shape
            gsap.fromTo('#ranking #shape', .6, {scale:0}, {delay:1.3, scale: 1, overwrite:true, ease:'elastic.out(1, 0.75)'});

            // product name
            gsap.set(spans, {autoAlpha:0,  y:'-50%', overwrite:true});
            const tl = gsap.timeline({delay:.6});
            for(let i=0; i<spans.length; i++){
                const span = spans[i];
                tl.set(span, {autoAlpha:1, overwrite:true}, `-=${i>0?.35:0}`);
                tl.to(span, .6, {force3D:true, y:'0%',ease:'power3.out'}, `-=${i>0?.35:0}`);
            }

            // list text
            gsap.set(divs, {autoAlpha:0, y:'-50%', overwrite:true});
            const tl2 = gsap.timeline({delay:.6});
            for(let i=0; i<divs.length; i++){
                const div = divs[i];
                tl2.set(div, {autoAlpha:1, overwrite:true}, `-=${i>0?.5:0}`);
                tl2.to(div, .6, {force3D:true, y:'0%',ease:'power3.out'}, `-=${i>0?.5:0}`);
            }

            // list bottom line
            gsap.set('#ranking #list li > span', {force3D:true, x:'-100%', overwrite:true});
            gsap.to('#ranking #list li > span', 1, {delay:.3, x:'0%',stagger:.1, ease:'power3.inOut'});

            const tl3 = gsap.timeline({delay:.6});
            tl3.set('#ranking #rateline > span', { x:'-100%'},'_1');
            tl3.set('#ranking #rateline > span span', { x:'100%'},'_1');
            tl3.to('#ranking #rateline span', .8, {force3D:true, x:'0', ease:'none'},'_1');
            tl3.to('#ranking #rateline .point', .8, {force3D:true, scale:1, stagger:.3, ease:'elastic.out(1, 0.3)'},'_1');
        }
        
        const rankingOut = (spans, divs) => {

            // logo
            // gsap.to('#ranking #logo', .6, {scale:0, ease:'back.in(1.75)'});
            
            // image
            gsap.to('#ranking #image', .6, {scale:0, ease:'back.in(1.75)'});
            
            // shape
            gsap.to('#ranking #shape', .6, {scale:0, ease:'back.in(1.75)'});

            // product name
            const tl = gsap.timeline();
            for(let i=0; i<spans.length; i++){
                const span = spans[i];
                tl.to(span, .3, {autoAlpha:0}, 's+=.3');
                tl.to(span, .5, {y:'30%',ease:'power3.in'}, 's');
            }

            // list text
            const tl2 = gsap.timeline();
            for(let i=0; i<divs.length; i++){
                const div = divs[i];
                tl2.to(div, .3, {autoAlpha:0}, 's+=.3');
                tl2.to(div, .5, {y:'30%',ease:'power3.in'}, 's');
            }

            // list bottom line
            gsap.to('#ranking #list li > span', 1, {x:'100%',stagger:.1, ease:'power3.inOut',
                'onComplete':function(){
                    // update data
                }
            });
            
            const tl3 = gsap.timeline();
            tl3.to('#ranking #rateline > span', .6, { x:'100%', ease:'none'},'_1');
            tl3.to('#ranking #rateline > span span', .6, { x:'-100%', ease:'none'},'_1');
            tl3.to('#ranking #rateline .point', .3, {scale:0, stagger:.3, ease:'back.in(2)'},'_1');
        }

        // const getRankingDataLth = (i) => {
        //     rankingDataLength = i;
        // }
        // getRankingDataLthFunc.current = {getRankingDataLth};
        
        const explosion = function() {
            timeScaleTarget = 0.01;
            var bodies = Composite.allBodies(engine.world);
    
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
    
                if (!body.isStatic) {
                    var forceMagnitude = .1 * body.mass;
    
                    Body.applyForce(body, body.position, {
                        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
                        y: -forceMagnitude + Common.random() * -forceMagnitude
                    });
                }
            }
        };


        const initMatter = () => {
            addWalls();
            // addMouseEvent();
            // run the engine
            Engine.run(engine);
            // run the renderer
            // Render.run(render);
        }

        const initPIXI = () => {
            // setTimer(40);
            const update = () => {
                if(!paused){
                    updateTimer();

                    for(let i=0; i<objects.length; i++){
                        const obj = objects[i];

                        shapes[i].x = obj.position.x;
                        shapes[i].y = obj.position.y;
                        graphicsArray[i].rotation = obj.angle;
                        
                        if(obj.position.y > wh+graphicsArray[i].height){
                            removeObject(i);
                        }
                    }

                    for(let i=0; i<popSvgObjects.length; i++){
                        const obj = popSvgObjects[i];
                        popSvgGraphics[i].x = obj.position.x;
                        popSvgGraphics[i].y = obj.position.y;
                        popSvgGraphics[i].rotation = obj.angle;
                    }
                }
            }
            const ticker = PIXI.Ticker.shared;
            ticker.add(() => {
                update();
            });
            
            app = new PIXI.Application({
                width: winW, 
                height: winH,
                // resolution: 1,
                antialias:true,
                autoResize: true,
                transparent: true
            });
            sceneElem.current.prepend(app.view);

            preloadSvg();
        }

        

        
        // handle key down
        const keyDown = (e) => {
            if(!paused){
                // console.log(e.keyCode)
                if(e.keyCode === 8){
                    explosion();
                    showProductDetails();
                    // removeAllObjects();
                    // removeSpecificObject(2);
                }
                else if(e.keyCode === 27){
                    rankingAnimtion();
                }
                else{
                    addObject();
                    addPop();
                }
            }
        }
        
        const onResize = (app) => {
            app.view.style.width = winW+'px';
            app.view.style.height = winH+'px';
            app.resize(winW,winH);
        }

        initMatter();
        initPIXI();
        
        
        // gsap.set('#promotion #cutline span', {y:0});
        const tl = gsap.timeline({repeat:-1});
        tl.to('#promotion #cutline #cutter', .8, {force3D:true, y:'-=28vw', ease:'power2.inOut'},1.3);
        tl.to('#promotion #cutline #cutter', .8, {y:'-=28vw', ease:'power2.inOut'},2.1);
        tl.to('#promotion #cutline #cutter', .8, {y:'-=28vw', ease:'power2.inOut'},2.9);
        tl.to('#promotion #cutline #cutter', .8, {y:'-=28vw', ease:'power2.inOut'},3.7);
        tl.to('#promotion #cutline #cutter', .8, {y:'-=28vw', ease:'power2.inOut'},4.5);
        tl.to('#promotion #cutline #cutter', .8, {y:'-=28vw', ease:'power2.inOut'},5.3);
        
        window.addEventListener('resize',(e)=>onResize(app));
        window.addEventListener("keydown", keyDown);

        return () =>{
            window.removeEventListener('resize',onResize);
            window.removeEventListener("keydown", keyDown);
        }
    },[])

    useEffect(()=>{
        if(gameStarted){
            removeAllObjectsFunc.current.removeAllObjects();
            stopTimerFunc.current.stopTimer();
            setTimeout(()=>{
                stopPromoAnim();
            },1000);
        }
        else{
            startTimerFunc.current.startTimer();
        }
    },[gameStarted]);

    // useEffect(()=>{
    //     console.log(topProductData)
    // },[topProductData])
    const updateTopProductIdx = () => {
        setTopProductIdx(topProductIdx+1);
    }
    updateTopProductIdxFunc.current = {updateTopProductIdx}

    return(
        <div ref={centerpieceElem} id="centerpiece" className="important">
            <div id="wrap">
                <div ref={sceneElem} id="scene"></div>
                <div ref={tempSceneElem} id="tempScene"></div>
                <span ref={pick} id="pick" className="text">Pick</span>
                <span ref={up} id="up" className="text">up</span>
                <div ref={ranking} id="ranking">
                    {/* <div id="logo">
                        <div className="img active" style={{backgroundImage:'url()'}}></div>
                    </div> */}
                    <div id="productName">
                        {/* {
                            topProductData && topProductData[topProductIdx].productName.en.split(' ').map((v,i)=>{
                                return <span key={i} dangerouslySetInnerHTML={{__html: v}}></span>
                            })
                        } */}
                        <span>{ topProductData && topProductData[topProductIdx] && topProductData[topProductIdx].productName.en }</span>
                        <span className="tc">{ topProductData && topProductData[topProductIdx] && topProductData[topProductIdx].productName.zh }</span>
                    </div>
                    <div id="image">
                        <div style={{backgroundImage:`url(${ topProductData && topProductData[topProductIdx] && topProductData[topProductIdx].productImage })`}}></div>
                    </div>
                    <div id="rateline">
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                        <span><span></span></span>
                    </div>
                    <ul id="list">
                        <li>
                            <div className="title">
                                <p>Hottest Item <br/>Ranking</p>
                                <p className="tc">熱門商品排名</p>
                            </div>
                                <div className="value">{ topProductData && topProductData[topProductIdx] && topProductData[topProductIdx].rank }</div>
                            <span></span>
                        </li>
                        <li>
                            <div className="title">
                                <p>Total Pick<br/>Up Time <span>(Daily Update)</span></p>
                                <p className="tc">累積Pick Up 次數 <span>(每天更新一次)</span></p>
                            </div>
                            <div className="value">{ topProductData && topProductData[topProductIdx] && topProductData[topProductIdx].pickupCount }</div>
                            <span></span>
                        </li>
                    </ul>
                    <div ref={rankingBg} id="rankingBg">
                        <div id="wrap"><div id="shape"></div></div>
                    </div>
                </div>
                { <Promotion promoData={promoData} /> }
                <Game />
            </div>
        </div>
    )
}

export default Centrepiece;