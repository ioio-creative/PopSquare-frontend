import React, {useState, useEffect} from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import { TimelineMax } from 'gsap';
import * as dat from 'dat.gui';

const Summary = (props) => {
    const [sceneElem, setSceneElem] = useState(null);

    useEffect(()=>{
        let onWindowResize = null;

        if(sceneElem){
            let width = window.innerWidth,
                height = window.innerHeight; 
            let scene, camera, renderer;
            const cubes = [],
                cubesGroup = [];
            const numOfBoxes = 10;
            const boxThickness = .5;
            const boxWidth = 3;
            const boxHeight = 2;
            const startTime = new Date();
            const bgColor = '#0547bd';
            const colors = [0x50feff, 0x41fe93, 0xb1fe39, 0xfef74a, 0xfe4ea5];
            const allMesh = new THREE.Group();
            let canStart = false;
            // const waveWidth = 3;
            // let waveScale = 0;
            const options = {
                boxOffset: 0,
                waveWidth: 3,
                waveScale: 0
            }

            const initScene = () => {
                // camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
                camera = new THREE.OrthographicCamera( width / - 100, width / 100, height / 100, height / - 100, 0.1, 1000 );
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 20;

                scene = new THREE.Scene();
    
                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setClearColor(0x000000);
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( width, height );
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                renderer.setAnimationLoop(render);
                sceneElem.appendChild( renderer.domElement );

                new Orbitcontrols( camera, renderer.domElement );

                initGUI();
                initLights();
                initGeometry();
                initAnimation();
            }

            const initGUI = () => {
                const gui = new dat.GUI();
                gui.add(options, 'boxOffset',0, 1).name('Boxes offset');
                gui.add(options, 'waveWidth',1, 10).name('Wave Width');
                gui.add(options, 'waveScale',0, 10).step(.1).name('Wave Scale').listen();
            }

            const initAnimation = () => {
                const tl = new TimelineMax();
                for(let i=0; i<numOfBoxes; i++){
                    tl.to(cubes[i].scale, 1.6, {z: 1, ease: 'Power4.easeOut'},i*.08);
                }
                tl.to(allMesh.rotation, 1.6, {x:35* Math.PI/180, ease: 'Power4.easeInOut'},'s-=1.1');
                tl.to(allMesh.rotation, 1.6, {y:-45 * Math.PI/180, ease: 'Power4.easeInOut', 
                    onComplete:()=>{
                        canStart = true;
                    }
                },'s-=1.1');
                tl.to(options, 1.6, {waveScale:.5, ease: 'Power2.easeOut'});
            }

            const initLights = () => {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
                allMesh.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight( 0xffffff, .4 );
                directionalLight.position.set(-5, 6, 4);
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = 1024;
                directionalLight.shadow.mapSize.height = 1024;
                allMesh.add( directionalLight );

                // const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
                // allMesh.add( directionalLightHelper );
            }

            const initGeometry = () => {
                for(let i=0; i<numOfBoxes; i++){
                    addBox(i);
                }

                addGround();

                scene.add(allMesh);
                allMesh.rotation.x = 90 * Math.PI/180;
            }

            const createTexture = (i,t,w) => {
                const text = ['Blue','GreenBlue','Green','Yellow','Red'];
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const fontsize = ctx.canvas.height*.7;
                ctx.canvas.width = Math.round(341.333 * w); //1024
                ctx.canvas.height = ctx.canvas.width * (t/w); //170
                ctx.font = 'bold '+ fontsize +"px Arial";
                ctx.textAlign = "right"; 
                ctx.textBaseline = "middle";
                ctx.fillStyle = 'white';
                ctx.fillText(text[i%5], ctx.canvas.width-ctx.canvas.height*.3, ctx.canvas.height/2);

                return canvas;
            }

            const addBox = (i) => {
                const independentGroup = new THREE.Group();
                const geometry = new THREE.BoxGeometry( boxThickness, boxHeight, boxWidth );
                geometry.translate(0, boxHeight/2, 0);
                const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
                const cube = new THREE.Mesh( geometry, material );
                cube.castShadow = true;
                cube.scale.set(1, 0.001, 0.0001);

                // add text
                const textGeometry = new THREE.PlaneGeometry(boxThickness, boxWidth, 1);
                const textMaterial = new THREE.MeshBasicMaterial({ 
                    map: new THREE.CanvasTexture(createTexture(i,boxThickness,boxWidth)), 
                    wireframe:false, 
                    transparent: true
                });
                textMaterial.blending = THREE.CustomBlending;
                textMaterial.blendSrc = THREE.OneFactor;
                textMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;
                textMaterial.map.rotation = 90 * Math.PI/180;
                textMaterial.map.center.set(.5,.5);
                const text = new THREE.Mesh( textGeometry, textMaterial );
                text.rotation.x = -90 * Math.PI/180;
                text.position.y = 0.001;
                text.position.z = boxWidth;

                // independentGroup.position.x = ((i*boxThickness) + (i*boxOffset)) - (boxThickness*numOfBoxes/2 + ((numOfBoxes-1)*boxOffset/2) - boxThickness/2 );
                independentGroup.add(cube);
                independentGroup.add(text);

                allMesh.add(independentGroup);
                
                // cubes array
                cubesGroup.push(independentGroup);
                cubes.push(cube);
            }

            const addGround = () => {
                const geometry = new THREE.PlaneGeometry(50, 50, 1);
                const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(bgColor) });
                const plane = new THREE.Mesh( geometry, material );
                plane.rotation.x = -90 * (Math.PI/180);
                plane.castShadow = true;
                plane.receiveShadow = true;
                allMesh.add(plane);
            }

            const update = () => {
                if(canStart){
                    const timer = (new Date() - startTime) * .002;
                    for(let i=0; i<numOfBoxes; i++){
                        cubes[i].scale.y += (Math.max(0.001, ((Math.sin(timer-i / options.waveWidth) + 1)) * .5 * options.waveScale) - cubes[i].scale.y) * .1;                                            
                    }
                }

                // gui
                for(let i=0; i<numOfBoxes; i++){
                    cubesGroup[i].position.x = ((i*boxThickness) + (i*options.boxOffset)) - (boxThickness*numOfBoxes/2 + ((numOfBoxes-1)*options.boxOffset/2) - boxThickness/2 );
                }

                camera.lookAt(0,0,0);
            }

            const render = () => {
                update();
                renderer.render( scene, camera );
            }

            initScene();

            onWindowResize = () => {
                camera.left = -window.innerWidth / 100;
                camera.right = window.innerWidth / 100;
                camera.top = window.innerHeight / 100;
                camera.bottom = -window.innerHeight / 100;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
            window.addEventListener( 'resize', onWindowResize, false );
        }
        return () => {
            if(onWindowResize)
                window.removeEventListener( 'resize', onWindowResize, false );
        }
    },[sceneElem]);

    return <>
        <div ref={(elem)=>{setSceneElem(elem)}} id="scene3d"></div>
    </>
}

export default Summary;