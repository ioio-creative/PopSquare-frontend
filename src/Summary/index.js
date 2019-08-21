import React, {useState, useEffect} from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import { TweenMax } from 'gsap';
import { RGBA_ASTC_10x10_Format } from 'three';

const Summary = (props) => {
    const [sceneElem, setSceneElem] = useState(null);

    useEffect(()=>{
        let onWindowResize = null;

        if(sceneElem){
            let width = window.innerWidth,
                height = window.innerHeight; 
            let scene, camera, renderer;
            let cube = null,
                plane = null;
            let cubes = [];
            const numOfBoxes = 5;
            const offset = .4;
            const start = new Date();
            const bgColor = 0x0547bd;
            const colors = [0x50feff, 0x41fe93, 0xb1fe39, 0xfef74a, 0xfe4ea5];

            const initScene = () => {
                // camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
                camera = new THREE.OrthographicCamera( width / - 100, width / 100, height / 100, height / - 100, 0.1, 1000 );
                camera.position.x = 10;
                camera.position.y = 10;
                camera.position.z = 10;

                scene = new THREE.Scene();
    
                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setClearColor(0x000000);
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( width, height );
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
                renderer.setAnimationLoop(render);
                sceneElem.appendChild( renderer.domElement );

                new Orbitcontrols( camera, renderer.domElement );

                initLights();
                initGeometry();
            }

            const initLights = () => {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight( 0xffffff, .4 );
                directionalLight.position.set(-5, 6, 4);
                directionalLight.castShadow = true;
                directionalLight.shadowMapWidth = 1024;
                directionalLight.shadowMapHeight = 1024;
                scene.add( directionalLight );

                const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
                scene.add( directionalLightHelper );
            }

            const initGeometry = () => {
                for(let i=0; i<numOfBoxes; i++){
                    addBox(i);
                }

                addGround();
            }

            const addBox = (i) => {
                const boxWidth = 1;
                const boxHeight = 2;
                const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, 3 );
                geometry.translate(0, boxHeight/2, 0);
                const material = new THREE.MeshPhongMaterial({ color: colors[i]  });
                cube = new THREE.Mesh( geometry, material );
                cube.castShadow = true;
                cube.position.x = ((i*boxWidth) + (i*offset)) - (boxWidth*numOfBoxes/2 + ((numOfBoxes-1)*offset/2) - boxWidth/2 );
                cube.scale.set(1, 0.001, 1);
                scene.add( cube );

                cubes.push(cube);
            }

            const addGround = () => {
                const geometry = new THREE.PlaneGeometry(11, 11, 1);
                const material = new THREE.MeshPhongMaterial({ color: bgColor });
                plane = new THREE.Mesh( geometry, material );
                plane.rotation.x = -90 * (Math.PI/180);
                plane.castShadow = true;
                plane.receiveShadow = true;
                scene.add(plane);
            }

            const update = () => {
                const timer = (new Date() - start) * .002;
                for(let i=0; i<numOfBoxes; i++){
                    cubes[i].scale.y = Math.max(0.001, (Math.sin(i+timer) + 1) * .5);
                }
            }

            const render = () => {
                update();
                renderer.render( scene, camera );
            }

            initScene();

            onWindowResize = () => {
                // camera.aspect = window.innerWidth / window.innerHeight;
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