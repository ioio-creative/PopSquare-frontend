import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import CANNON from 'cannon';

const Dropping3d = (props) => {
    const [sceneElem, setSceneElem] = useState(null);

    useEffect(()=>{
        let onWindowResize = null;

        if(sceneElem){
            let width = window.innerWidth,
                height = window.innerHeight; 
            let scene, camera, renderer;
            let world;
            const bgColor = '#0547bd';
            const colors = [0x50feff, 0x41fe93, 0xb1fe39, 0xfef74a, 0xfe4ea5];
            const numOfBoxes = 1;
            const object = [];
            const objectMesh = [];
            let groundCM;
            const startTime = new Date();

            const initScene = () => {
                camera = new THREE.OrthographicCamera( width / - 50, width / 50, height / 50, height / - 50, 0.1, 1000 );
                // camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

                camera.position.z = 100;

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
                
                initLights();
                initPhysics();
                initGeometry();
            }

            const initPhysics = () => {
                world = new CANNON.World();
                world.broadphase = new CANNON.NaiveBroadphase();
                world.gravity.set( 0, -20, 0);
            }

            const initLights = () => {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
                scene.add(ambientLight);

                const pointLight = new THREE.PointLight(0xffffff, 1, 100);
                pointLight.position.set( 20, 20, 0 );
                pointLight.castShadow = true;
                pointLight.shadow.mapSize.width = 2048;
                pointLight.shadow.mapSize.height = 2048;
                scene.add(pointLight);
            }

            const initGeometry = () => {
                addGround();

                for(let i=0; i<numOfBoxes; i++){
                    addObject(i);
                }
            }

            const addObject = (i = Math.round(Math.random()*4)) => {
                if(Math.round(Math.random()*1) === 0)
                    addSphere(i);
                else
                    addBox(i);
            }

            
            const addBox = (i) => {
                const size = 3;
                const x = Math.round(Math.random()*20 -10);
                const y = 20;
                const z = Math.round(Math.random()*20 -10);
                const geometry = new THREE.BoxGeometry( size, size, size );
                const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
                const cube = new THREE.Mesh( geometry, material );
                cube.position.x = x;
                cube.position.y = y;
                cube.castShadow = true;
                cube.receiveShadow = true;
                scene.add(cube);

                const boxCM = new CANNON.Material();
                const boxShape = new CANNON.Box(new CANNON.Vec3( size/2, size/2, size/2));
                const boxBody = new CANNON.Body({ 
                    mass: 5, 
                    shape: boxShape,
                    position: new CANNON.Vec3(x, y, z),
                    material: boxCM
                });
                world.add( boxBody );

                const boxGroundContact = new CANNON.ContactMaterial(groundCM, boxCM, {
                    friction: 0.5,
                    restitution: 0.2
                });
                world.addContactMaterial(boxGroundContact);

                object.push(boxBody);
                objectMesh.push(cube);
            }
            
            const addSphere = (i) => {
                const size = 2;
                const x = Math.round(Math.random()*20 -10);
                const y = 20;
                const z = Math.round(Math.random()*20 -10);
                const geometry = new THREE.SphereGeometry( size, 32, 32 );
                const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
                const sphere = new THREE.Mesh( geometry, material );
                sphere.castShadow = true;
                sphere.receiveShadow = true;
                scene.add(sphere);

                const sphereCM = new CANNON.Material();
                const sphereShape = new CANNON.Sphere(size);
                const sphereBody = new CANNON.Body({ 
                    mass: 5, 
                    shape: sphereShape,
                    position: new CANNON.Vec3(x, y, z),
                    material: sphereCM
                });
                world.add( sphereBody );

                const sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
                    friction: 0.5,
                    restitution: 0.5 
                });
                world.addContactMaterial(sphereGroundContact);
                

                object.push(sphereBody);
                objectMesh.push(sphere);
            }

            const addGround = () => {
                const size = 20;
                const geometry = new THREE.BoxGeometry(size, size, 1);
                const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(bgColor) });
                const plane = new THREE.Mesh( geometry, material );
                plane.position.y = -15;
                plane.rotation.x = -90 * (Math.PI/180);
                plane.castShadow = true;
                plane.receiveShadow = true;
                scene.add(plane);

                groundCM = new CANNON.Material();
                const groundShape = new CANNON.Box(new CANNON.Vec3(size/2,size/2,1/2));
                const groundBody = new CANNON.Body({
                    mass: 0,
                    shape: groundShape,
                    material: groundCM
                });
                groundBody.position.copy(plane.position);
                groundBody.quaternion.copy(plane.quaternion);
                world.add(groundBody);
            }

            const update = () => {
                const timer = (new Date() - startTime) * 0.1;
                world.step( 1 / 60);

                if(Math.round(timer%9) === 0)
                    addObject();

                for (var i = 0, lth = object.length; i < lth; i++){
                    const b = object[i];
                    const m = objectMesh[i];
                
                    if(b){
                        m.position.copy(b.position);
                        m.quaternion.copy(b.quaternion);

                        if(b.position.y < -20){
                            world.remove(b);
                            object.splice(i,1);

                            scene.remove(m);
                            objectMesh.splice(i,1);

                            world.contactmaterials.splice(i,1);
                        }
                    }
                }
            }

            const render = () => {
                update();
                renderer.render( scene, camera );
            }

            document.addEventListener('click',()=>{            
                addObject();
            });
            document.addEventListener('touchstart',()=>{            
                addObject();
            });

            onWindowResize = () => {
                camera.left = -window.innerWidth / 50;
                camera.right = window.innerWidth / 50;
                camera.top = window.innerHeight / 50;
                camera.bottom = -window.innerHeight / 50;
                // camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
            window.addEventListener( 'resize', onWindowResize, false );

            initScene();

            return ()=>{
                if(onWindowResize)
                    window.removeEventListener( 'resize', onWindowResize, false );
            }
        }
    },[sceneElem])

    return <>
        <div ref={(elem)=>{setSceneElem(elem)}} id="scene3d"></div>
    </>
};

export default Dropping3d;