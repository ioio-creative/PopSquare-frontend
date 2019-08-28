import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Ammo from 'ammo.js';
// import CANNON from 'cannon';
// import CannonDebugRenderer from './CannonDebugRenderer';

const Dropping3d = (props) => {
    const [sceneElem, setSceneElem] = useState(null);

    useEffect(()=>{
        let onWindowResize = null;

        if(sceneElem){
            let width = window.innerWidth,
                height = window.innerHeight; 
            let scene, camera, renderer;
            const bgColor = '#0547bd';
            const colors = [0x50feff, 0x41fe93, 0xb1fe39, 0xfef74a, 0xfe4ea5];
            const numOfBoxes = 1;
            const bodies = [];
            // let groundCM;
            const startTime = new Date();
            let collisionConfiguration;
			let dispatcher;
			let broadphase;
			let solver;
            let physicsWorld,
                transformAux1;
            // let cannonDebugRenderer;

            const initScene = () => {
                camera = new THREE.OrthographicCamera( width / - 30, width / 30, height / 30, height / - 30, 0.1, 1000 );
                // camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

                camera.position.x = 50;
                camera.position.y = 50;
                camera.position.z = 50;

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

                // cannonDebugRenderer = new CannonDebugRenderer(scene, world);
            }

            const initPhysics = () => {
                // Physics configuration

				collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
				dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
				broadphase = new Ammo.btDbvtBroadphase();
				solver = new Ammo.btSequentialImpulseConstraintSolver();
				physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
                physicsWorld.setGravity( new Ammo.btVector3( 0, -1, 0 ) );
                transformAux1 = new Ammo.btTransform();
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
                const idx = Math.round(Math.random()*2);
                if(idx === 0)
                    addMesh(i,'sphere');
                else if(idx === 1)
                    addMesh(i,'box');
                else if(idx === 2)
                    addMesh(i,'cone');
            }

            const createRigidBody = (threeObject, physicsShape, mass, pos, quat) => {
                var transform = new Ammo.btTransform();
				transform.setIdentity();
				transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
				transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
                var motionState = new Ammo.btDefaultMotionState( transform );
                
                var localInertia = new Ammo.btVector3( 0, 0, 0 );
                physicsShape.calculateLocalInertia( mass, localInertia );
                
                var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
                var body = new Ammo.btRigidBody( rbInfo );
                
                threeObject.userData.physicsBody = body;

                if(mass > 0){
					bodies.push( threeObject );

					// Disable deactivation
					body.setActivationState( 4 );
				}

                scene.add( threeObject );
                physicsWorld.addRigidBody( body );
console.log(physicsWorld);
                return body;
            }

            
            const addMesh = (i, type) => {
                let size;
                let geometry;
                let shape;
                const x = Math.round(Math.random()*20 -10);
                const y = 5;
                const z = Math.round(Math.random()*20 -10);

                if(type === 'sphere'){
                    size = 2;
                    geometry = new THREE.SphereGeometry( size, 32, 32 );
                    shape = new Ammo.btSphereShape( size );
                    shape.setMargin( 0.05 );
                }
                else if(type === 'box'){
                    size = 3;
                    geometry = new THREE.BoxGeometry( size, size, size );
                    shape = new Ammo.btBoxShape( new Ammo.btVector3( size * 0.5, size * 0.5, size * 0.5 ) );
                    shape.setMargin( 0.05 );
                }
                else if(type === 'cone'){
                    size = 2;
                    geometry = new THREE.ConeBufferGeometry( size, size*2, 20, 2 )
					shape = new Ammo.btConeShape( size, size*2 );
                }

                const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
                const mesh = new THREE.Mesh( geometry, material );
                mesh.position.x = x;
                mesh.position.y = 10;
                mesh.position.z = z;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                
                
                createRigidBody(mesh, shape, 1, mesh.position, mesh.quaternion);

                // bodies.push(mesh);
                // objPhys.push(boxBody);
            }
            
            // const addSphere = (i) => {
            //     const size = 2;
            //     const x = Math.round(Math.random()*20 -10);
            //     const y = 20;
            //     const z = Math.round(Math.random()*20 -10);
            //     const geometry = new THREE.SphereGeometry( size, 32, 32 );
            //     const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
            //     const sphere = new THREE.Mesh( geometry, material );
            //     sphere.castShadow = true;
            //     sphere.receiveShadow = true;
            //     scene.add(sphere);

            //     const sphereCM = new CANNON.Material();
            //     const sphereShape = new CANNON.Sphere(size);
            //     const sphereBody = new CANNON.Body({ 
            //         mass: 5, 
            //         shape: sphereShape,
            //         position: new CANNON.Vec3(x, y, z),
            //         material: sphereCM
            //     });
            //     world.add( sphereBody );

            //     const sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
            //         friction: 0.5,
            //         restitution: 0.5 
            //     });
            //     world.addContactMaterial(sphereGroundContact);
                

            //     object.push(sphereBody);
            //     bodies.push(sphere);
            // }

            const addGround = () => {
                const size = 20;
                const geometry = new THREE.BoxGeometry(size, size, 1);
                const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(bgColor) });
                const plane = new THREE.Mesh( geometry, material );
                // plane.position.y = -15;
                plane.rotation.x = -90 * (Math.PI/180);
                plane.castShadow = true;
                plane.receiveShadow = true;
                scene.add(plane);


                const shape = new Ammo.btBoxShape( new Ammo.btVector3( size * 0.5, size * 0.5, 1 * 0.5 ) );
                shape.setMargin( 0.05 );
                createRigidBody(plane, shape, 0, plane.position, plane.quaternion);
            }

            const update = () => {
                const timer = (new Date() - startTime) * 0.1;
                // Step world
                physicsWorld.stepSimulation( timer, 10 );
                

                // cannonDebugRenderer.update();
                // if(Math.round(timer%9) === 0)
                //     addObject();

                for (var i = 0, lth = bodies.length; i < lth; i++){
                    const objThree = bodies[i];
                    const objPhys = objThree.userData.physicsBody;
                    const ms = objPhys.getMotionState();
                    if(ms){
                        ms.getWorldTransform( transformAux1 );
						var p = transformAux1.getOrigin();
						var q = transformAux1.getRotation();
                        objThree.position.set(p.x(), p.y(), p.z());
                        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

                //         if(b.position.y < -20){
                //             world.remove(b);
                //             object.splice(i,1);

                //             scene.remove(m);
                //             objThree.splice(i,1);

                //             world.contactmaterials.splice(i,1);
                //         }
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
                camera.left = -window.innerWidth / 30;
                camera.right = window.innerWidth / 30;
                camera.top = window.innerHeight / 30;
                camera.bottom = -window.innerHeight / 30;
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