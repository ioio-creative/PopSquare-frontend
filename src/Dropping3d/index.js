import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Ammo from 'ammo.js';
import { TweenMax } from 'gsap';

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
            // const numOfBoxes = 1;
            const bodies = [];
            // let groundCM;
            const startTime = new Date();
            let collisionConfiguration;
			let dispatcher,
			    broadphase,
			    solver,
                physicsWorld,
                transformAux1;
            const cameraDepth = 15;
            let addObjectTime = new Date(),
                addForceTime = new Date();

            const initScene = () => {
                camera = new THREE.OrthographicCamera( width / - cameraDepth, width / cameraDepth, height / cameraDepth, height / - cameraDepth, 0.1, 1000 );
                // camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

                // camera.position.x = 50;
                // camera.position.y = 50;
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
                
                TweenMax.to(camera.position, 3, {delay:.6, x:50, y:50, ease: 'Power4.easeInOut'});
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
                pointLight.position.set( 20, 50, 0 );
                pointLight.castShadow = true;
                pointLight.shadow.mapSize.width = 2048;
                pointLight.shadow.mapSize.height = 2048;
                scene.add(pointLight);
            }

            const initGeometry = () => {
                createContainer();
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

            const createRigidBody = (threeObject, physicsShape, mass, pos, quat, visible = true) => {
                const transform = new Ammo.btTransform();
				transform.setIdentity();
				transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
				transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
                const motionState = new Ammo.btDefaultMotionState( transform );
                
                const localInertia = new Ammo.btVector3( 0, 0, 0 );
                physicsShape.calculateLocalInertia( mass, localInertia );
                
                const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
                const body = new Ammo.btRigidBody( rbInfo );
                
                threeObject.userData.physicsBody = body;

                if(mass > 0){
                    bodies.push( threeObject );
                
					// Disable deactivation
					body.setActivationState( 4 );
                }
                
                body.setRestitution(.7);
                body.setDamping(0.05,0);


                if(visible)
                    scene.add( threeObject );

                physicsWorld.addRigidBody( body );

                return body;
            }

            
            const addMesh = (i, type) => {
                let size;
                let geometry;
                let shape;
                const x = Math.round(Math.random()*15 - 8);
                const y = 20;
                const z = Math.round(Math.random()*15 - 8);

                if(type === 'sphere'){
                    size = Math.random() * 1.5 + 1.5;
                    geometry = new THREE.SphereGeometry( size, 32, 32 );
                    shape = new Ammo.btSphereShape( size );
                    shape.setMargin( 0.05 );
                }
                else if(type === 'box'){
                    size = Math.random() * 1.5 + 1.5;
                    geometry = new THREE.BoxGeometry( size, size, size );
                    shape = new Ammo.btBoxShape( new Ammo.btVector3( size * 0.5, size * 0.5, size * 0.5 ) );
                    shape.setMargin( 0.05 );
                }
                else if(type === 'cone'){
                    size = Math.random() * 1.5 + 1.5;
                    geometry = new THREE.ConeBufferGeometry( size, size*2, 20, 2 )
					shape = new Ammo.btConeShape( size, size*2 );
                }

                const material = new THREE.MeshPhongMaterial({ color: colors[i%5] });
                const mesh = new THREE.Mesh( geometry, material );
                mesh.position.set(x, y, z);
                mesh.rotation.set(Math.random()* 360 * Math.PI/180, Math.random()* 360 * Math.PI/180, Math.random()* 360 * Math.PI/180);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                
                createRigidBody(mesh, shape, 1, mesh.position, mesh.quaternion);
            }

            const addWall = (size, pos, quat, visible) => {
                const geometry = new THREE.BoxGeometry(size, size, 1);
                const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(bgColor) });
                const plane = new THREE.Mesh( geometry, material );
                plane.position.copy(pos);
                plane.rotation.set(quat.x, quat.y, quat.z);
                if(visible){
                    plane.castShadow = true;
                    plane.receiveShadow = true;
                }


                const shape = new Ammo.btBoxShape( new Ammo.btVector3( size * 0.5, size * 0.5, 1 * 0.5 ) );
                shape.setMargin( 0.05 );
                createRigidBody(plane, shape, 0, plane.position, plane.quaternion, visible);
            }

            const createContainer = () => {
                const size = 20;
                addWall(size, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-90 * (Math.PI/180), 0, 0)); // ground
                // addWall(size, new THREE.Vector3(-size/2, size/2, 0), new THREE.Vector3(0, -90 * (Math.PI/180), 0), false); // left
                // addWall(size, new THREE.Vector3(size/2, size/2, 0), new THREE.Vector3(0, -90 * (Math.PI/180), 0), false); // right
                // addWall(size, new THREE.Vector3(0, size/2, size/2), new THREE.Vector3(0, 0, 0), false); // front
                // addWall(size, new THREE.Vector3(0, size/2, -size/2), new THREE.Vector3(0, 0, 0), false); // back
            }

            const addForce = () => {
                const tbv30 = new Ammo.btVector3();
                for (var i = 0, lth = bodies.length; i < lth; i++){
                    tbv30.setValue(Math.random()*10-5,Math.random()*5+10,Math.random()*10-5);
                    bodies[i].userData.physicsBody.setLinearVelocity(tbv30);
                }
            }

            const update = () => {
                const timer = (new Date() - startTime) * 0.01;
                // Step world
                physicsWorld.stepSimulation( timer, 10 );
                
                if(new Date() - addObjectTime >= .2*1000) {
                    addObject();
                    addObjectTime = new Date();
                }

                if(new Date() - addForceTime >= 5*1000) {
                    addForce();
                    addForceTime = new Date();
                }

                for (var i = 0, lth = bodies.length; i < lth; i++){
                    const objThree = bodies[i];
                    if(objThree){
                        const objPhys = objThree.userData.physicsBody;
                        const ms = objPhys.getMotionState();
                        if(ms){
                            ms.getWorldTransform( transformAux1 );
                            var p = transformAux1.getOrigin();
                            var q = transformAux1.getRotation();
                            objThree.position.set(p.x(), p.y(), p.z());
                            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

                            if(objThree.position.y < -20){
                                physicsWorld.removeRigidBody(objPhys);
                                objThree.geometry.dispose();
                                objThree.material.dispose();
                                scene.remove(objThree);
                                bodies.splice(i,1);
                            }
                        }
                    }
                }

                camera.lookAt(0,0,0);
            }

            const render = () => {
                update();
                renderer.render( scene, camera );
            }

            // document.addEventListener('click',()=>{            
                // addObject();
            // });
            document.addEventListener('touchstart',()=>{            
                addObject();
            });

            onWindowResize = () => {
                camera.left = -window.innerWidth / cameraDepth;
                camera.right = window.innerWidth / cameraDepth;
                camera.top = window.innerHeight / cameraDepth;
                camera.bottom = -window.innerHeight / cameraDepth;
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