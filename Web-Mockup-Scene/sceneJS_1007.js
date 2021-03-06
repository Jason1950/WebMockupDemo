
    import * as THREE from './build/three.module.js';
    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';

    // *** webgl variable *** //
    let camera, scene, renderer;
    const clock = new THREE.Clock();
    let mixer;
    let w_mixer;
    let action;
    let w_action;
    let animationArray =[];
    var canvas;
    let controls;
    let skytexture;
    const resizePara = 1; //4/5;


    // *** fly animation state *** //
    let flyState = false;
    let flyTimes = 0;


    // *** move position state  *** //
    let movePositionConsole = [false,true];
    let lastState = [false,false];
    let model_position_count = [0,0];
    let modelNewPositionArray = [0,0];
    let modelLastPositionArray = [0,0];
    let currentlyAnimating = [false,false];




    // backgorund img load    
    const loaderimg0 = new THREE.TextureLoader();
    const bgTexture = loaderimg0.load('./pics/background.jpg');
    const bgTexture2 = loaderimg0.load('./pics/background2.jpg');
    const bgTexture3 = loaderimg0.load('./pics/background3.jpg');
    const bgTexture4 = loaderimg0.load('./pics/background4.jpg');
    let bgArray = [bgTexture, bgTexture2, bgTexture3, bgTexture4];

    // model
    const loader = new FBXLoader();
    loader.load( './3dfile/man_Dying.fbx', function ( object ) {
        object.animations[ 0 ].name ="die";
        animationArray.push( object.animations[ 0 ]);            
    } );

    loader.load( './3dfile/man_Idle.fbx', function ( object ) {
        object.animations[ 0 ].name ="idle";
        animationArray.push( object.animations[ 0 ]);     
    } );
    loader.load( './3dfile/man_Idle.fbx', function ( object ) {
        object.animations[ 0 ].name ="w_idle";
        animationArray.push( object.animations[ 0 ]);     

    } );
    loader.load( './3dfile/man_hello.fbx', function ( object ) {
        object.animations[ 0 ].name ="hello";
        animationArray.push( object.animations[ 0 ]);            
    } );

    loader.load( './3dfile/man_jump2.fbx', function ( object ) {
    // loader.load( './3dfile/man_JoyfulJump.fbx', function ( object ) {
        object.animations[ 0 ].name ="jump";
        animationArray.push( object.animations[ 0 ]);            
    } );
    loader.load( './3dfile/man_left3.fbx', function ( object ) {
        object.animations[ 0 ].name ="left";
        animationArray.push( object.animations[ 0 ]);            
    } );
    
    loader.load( './3dfile/man_Pain.fbx', function ( object ) {
        object.animations[ 0 ].name ="pain";
        animationArray.push( object.animations[ 0 ]);            
    } );
    loader.load( './3dfile/man_Landing.fbx', function ( object ) {
        object.animations[ 0 ].name ="land";
        animationArray.push( object.animations[ 0 ]);            
    } );
    // loader.load( './3dfile/woman_right.fbx', function ( object ) {
    loader.load( './3dfile/man_right2.fbx', function ( object ) {
        object.animations[ 0 ].name ="right";
        animationArray.push( object.animations[ 0 ]);            
    } );

    let cushionsInit = new THREE.TextureLoader().load('./pics/wood3.jpg');
    // let cushionsInit = new THREE.TextureLoader().load('./pics/wood.jpg');
    cushionsInit.repeat.set(20,1,1);
    cushionsInit.wrapS = cushionsInit.wrapT = THREE.RepeatWrapping;
    // object11.material = new THREE.MeshPhongMaterial({map: cushionsInit, shininess: 10 })
                
    

    init();
    animate();

    function init() {

        canvas = document.getElementById("main3-canvas");
        console.log(canvas);

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( 100, 300, 350 );

        scene = new THREE.Scene();

        const BACKGROUND_COLOR = 0xf1f1f1;
        // scene.background = new THREE.Color( 0xf5c1bd );
        // scene.background = new THREE.Color( 0xa0a0a0 );
        // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        
        // Set background
        const canvasAspect = canvas.clientWidth / canvas.clientHeight;
        const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
        const aspect = imageAspect / canvasAspect;
        
        bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
        bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
        
        bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
        bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
        // scene.background = bgTexture;


        
        let skyboxGeo = new THREE.BoxGeometry(2000, 900, 1000);
        skytexture = new THREE.MeshBasicMaterial(
            {   map: bgTexture, 
                side: THREE.BackSide,
                transparent: true, 
                opacity: 1 });
        let skybox = new THREE.Mesh(skyboxGeo, skytexture );
        skybox.name = "boxbg";
        scene.add(skybox);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 200, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 200, 100 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = - 100;
        dirLight.shadow.camera.left = - 120;
        dirLight.shadow.camera.right = 120;
        scene.add( dirLight );

        // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

        // ground
        // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 200 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } ) );
        const mesh = new THREE.Mesh( new THREE.BoxGeometry(2000, 150,5), new THREE.MeshPhongMaterial( {map: cushionsInit, shininess: 10 } ) );
        
        
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.position.y -= 4;
        scene.add( mesh );

        const grid = new THREE.GridHelper( 200, 2, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        // scene.add( grid );

        
        const group = new THREE.Group();
        const group2 = new THREE.Group();


        loader.load( './3dfile/man.fbx', function ( object ) {
            // **** texture loading **** //
            const man_txt = new THREE.TextureLoader().load('./pics/man.jpg');
            man_txt.flipY = true; // we flip the texture so that its the right way up
            const man_mtl = new THREE.MeshPhongMaterial({
                map: man_txt,
                color: 0xffffff,
                skinning: true
            });

            mixer = new THREE.AnimationMixer( object );
            // action = mixer.clipAction( object.animations[0] );
            console.log(animationArray);
            action = mixer.clipAction( animationArray.find(item=>item.name=='idle') );
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl;
                }
            } );

            console.log(object.name);
            // scene.add( object );
            group.add( object );
        } );

        // group.rotation.x = 4.3;
        // group.position.y += 330;//2.5*50;
        group.name = "groupMan";
        scene.add( group );





        loader.load( './3dfile/woman2.fbx', function ( object ) {

            const womantxt = new THREE.TextureLoader().load('./pics/woman2.jpg');
            womantxt.flipY = true; // we flip the texture so that its the right way up
            const woman_mtl = new THREE.MeshPhongMaterial({
                map: womantxt,
                color: 0xffffff,
                skinning: true
            });
            // console.log(object.name);
            w_mixer = new THREE.AnimationMixer( object );
            // action = mixer.clipAction( object.animations[0] );
            w_action = w_mixer.clipAction( animationArray.find(item=>item.name=='w_idle') );
            w_action.play();
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = woman_mtl;
                }
            } );

            console.log(object.name);
            group2.add(object);
            // scene.add( object );
        } );

        
        group2.name = "groupWoman";
        scene.add( group2 );


        let objman = scene.getObjectByName( "groupWoman" );
        objman.position.x = 110;

        scene.position.y -= 55;
        console.log(scene);
        
        // ---------------- ?????? canvas ??? ???????????????element !! --------------- //
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;


        // **** controls ?????????????????? **** //
        controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = 1.4206431444880732; // Math.PI / 2 - 0.11;
        controls.minPolarAngle = 1.4206431444880735; // Math.PI / 3 - 0.15;
        controls.maxAzimuthAngle = 0;     // Math.PI  ;   // from 120 ~ -180 degree 
        controls.minAzimuthAngle = 0  ;   // -Math.PI *2/3 ;
        controls.enableZoom = false;
        controls.dampingFactor = 0.1;
        // controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        // controls.autoRotateSpeed = 0.2; // 30
        controls.target.set( 0, 100, 0 );
        controls.update();
        window.addEventListener( 'resize', onWindowResize );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
    }

    function animate() {

        const delta = clock.getDelta();
        const flyModel = scene.getObjectByName( "groupMan" );

        requestAnimationFrame( animate );

        if ( mixer ) mixer.update( delta );
        if (w_mixer) w_mixer.update(delta);

        flyAnimationPlay(flyModel);
        modelPositionMoveFix();

        renderer.render( scene, camera );
    }


    function modelPositionMoveFix(){

        var object3DMan = scene.getObjectByName( "groupMan" );
        var object3DWoman = scene.getObjectByName( "groupWoman" );

        // *** add play animation position updating *** //
        if(currentlyAnimating[0]) {
            if(movePositionConsole[0]) console.log(object3DMan.children[0].position.x);
            modelNewPositionArray[0] = object3DMan.children[0].position.x;
        }
        // *** add play animation position updating *** //
        if(currentlyAnimating[1]){
            if(movePositionConsole[1]) console.log(object3DWoman.children[0].position.x);
            modelNewPositionArray[1] = object3DWoman.children[0].position.x;
        }
        
        if(lastState[0] == !currentlyAnimating[0] && lastState[0]==true ){
            model_position_count[0] += 1;
        }

        if(lastState[1] == !currentlyAnimating[1] && lastState[1]==true ){
            model_position_count[1] += 1;
        }

        lastState[0] = currentlyAnimating[0];
        lastState[1] = currentlyAnimating[1];
        
        if (model_position_count[0]>0 && model_position_count[0]<20){
            if (model_position_count[0] == 1) {         
                object3DMan.position.x += modelNewPositionArray[0];
                modelLastPositionArray[0] =  object3DMan.position.x;
            }
            object3DMan.position.x = modelLastPositionArray[0];
            if(movePositionConsole[0]) console.log('Man~',object3DMan.children[0].position.x);
            model_position_count[0] +=1;
        }else{
            model_position_count[0] = 0;
        }


        if (model_position_count[1]>0 && model_position_count[1]<20){
            if (model_position_count[1] == 1) {
                object3DWoman.position.x += modelNewPositionArray[1];
                modelLastPositionArray[1] =  object3DWoman.position.x;
            }
            object3DWoman.position.x = modelLastPositionArray[1];
            if(movePositionConsole[1]) console.log('Woman!',object3DWoman.children[0].position.x);
            model_position_count[1] +=1;
        }else{
            model_position_count[1] = 0;
        }

    }


    

    function JanimationPlay(name){
        
        const fSpeed = 0.01, tSpeed = 0.01;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        // console.log(animationArray);
        let action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        action.crossFadeTo(action2, fSpeed, true);
        setTimeout(function() {
            action2.enabled = true;
            // action2.crossFadeTo(action, tSpeed, true);
            action2.crossFadeTo(action, tSpeed, true);
            currentlyAnimating[0] = false;
            console.log('play ...');
            action.reset();
            action.play();
            }, action2._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }
    

    function WanimationPlay(name){
        const fSpeed = 0.08, tSpeed = 0.5;
        let object3DWoman = scene.getObjectByName( "groupWoman" );

        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        console.log(animationArray);
        let action2 = w_mixer.clipAction( animationArray.find(item=>item.name==name) );
        
        
        // action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        console.log(action2.isRunning());

        w_action.crossFadeTo(action2, fSpeed, false);
        setTimeout(function() {
            // action2.stop();
            // currentlyAnimating[1] = false;

            object3DWoman.position.x += object3DWoman.children[0].position.x;
            setTimeout(function() {
                // action2.stop();
                // currentlyAnimating[1] = false;
    
                object3DWoman.position.x += object3DWoman.children[0].position.x;
                action2.enabled = true;
            // action2.crossFadeTo(action, tSpeed, true);
                action2.crossFadeTo(w_action, tSpeed, true);
                // currentlyAnimating[1] = false;
                console.log('woman play ...');
                w_action.reset();
                w_action.play();

            },action2._clip.duration*1000-10)
        },action2._clip.duration*1000-10)

        // action2.clamWhenFinished = true;

        // setTimeout(function() {
        //     action2.enabled = true;
        //     // action2.crossFadeTo(action, tSpeed, true);
        //     action2.crossFadeTo(w_action, tSpeed, true);
        //     currentlyAnimating[1] = false;
        //     console.log('woman play ...');
        //     w_action.reset();
        //     w_action.play();
        //     }, action2._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }

    function flyAnimationPlay(flyModel){
        if (flyModel && flyState){
            // object3DMan.updateMatrix();
            if(flyTimes==1)flyModel.visible = false;
            flyModel.position.y -= 2.5;
            console.log('move 3d model');
            flyTimes += 1;
            if(flyTimes ==120) {
                JanimationPlay('land');
                flyModel.visible = true; //Invisible
            }
            if (flyTimes>140) {
            flyModel.position.y = 0;
            flyModel.rotation.y = 0;
            flyState = !flyState;
            flyTimes = 0;
            // main3ButtnClick();
            }
        }
    }

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        
        if (keyCode == 90) {   
            // ******* z = 90 ********* //

            walkGoAndBack();

        } else if (keyCode == 88) {     
            // ******* x = 88 ********* //

            currentlyAnimating[0] = true;
            JanimationPlay('left');
        } else if (keyCode == 67) {
            // ******* c = 67 ********* //
            
            currentlyAnimating[0] = true;
            JanimationPlay('jump');

        } else if (keyCode == 86) {
            // ******* v = 86 ********* //

            currentlyAnimating[0] = true;
            JanimationPlay('hello');

        } else if(keyCode == 65){
            // ******* A = 65 ********* //

            let objectBox = scene.getObjectByName( "boxbg" );
            console.log(objectBox.material.map.uuid);
            bgArray.forEach((value,index)=>console.log(index,value.uuid));
            // currentlyAnimating[1] = true;
            WanimationPlay('right');
        }
    };

    function walkGoAndBack() {
        let playTime = 1400;
        let delayTime = 300;
        let objectBox = scene.getObjectByName( "boxbg" );
        
        let randBG = Math.floor(Math.random()*bgArray.length);
        let tempTexture = eval(`bgArray[${randBG}]`);
        
        while(tempTexture.uuid == objectBox.material.map.uuid){
            let randBG = Math.floor(Math.random()*bgArray.length);
            tempTexture = eval(`bgArray[${randBG}]`);
            console.log('repeat texture !');
        }
        tempTexture.wrapS = THREE.RepeatWrapping;
        tempTexture.repeat.x = - 1;

        
        
        // *** first right *** //
        currentlyAnimating[0] = true;
        JanimationPlay('right');

        setTimeout(function(){
            currentlyAnimating[1] = true;
            WanimationPlay('right');
        },delayTime    );
        

        // *** second right *** //
        setTimeout(function(){
            currentlyAnimating[0] = true;
            JanimationPlay('right');
        },playTime    );

        setTimeout(function(){
            currentlyAnimating[1] = true;
            WanimationPlay('right');
        },delayTime + playTime   );


        // *** third right *** //
        setTimeout(function(){
            currentlyAnimating[0] = true;
            JanimationPlay('right');
        },playTime*2    );

        setTimeout(function(){
            currentlyAnimating[1] = true;
            WanimationPlay('right');
        },delayTime + playTime*2   );



        setTimeout(function(){
            // **** ??????fade out **** //
            TweenMax.to(skytexture, 3, { opacity: 0.1 });
            let objectBox = scene.getObjectByName( "boxbg" );
            
            setTimeout(function() {
                // **** ??????fade in **** //
                objectBox.material.map = tempTexture;
                TweenMax.to(skytexture, 4, { opacity: 1 });

                currentlyAnimating[1] = true;
                WanimationPlay('left');
                

                setTimeout(function(){
                    currentlyAnimating[0] = true;
                    JanimationPlay('left');
                    
                },delayTime );


            }, 3200);
        },playTime*3    );


        setTimeout(function(){
            currentlyAnimating[1] = true;
            WanimationPlay('left');

            setTimeout(function(){
                currentlyAnimating[0] = true;
                JanimationPlay('left');
            },delayTime );

        },playTime*4+3200    );

        setTimeout(function(){
            currentlyAnimating[1] = true;
            WanimationPlay('left');

            setTimeout(function(){
                currentlyAnimating[0] = true;
                JanimationPlay('left');
            },delayTime );
        },playTime*5+3200     );
    }





     // ******************************************************* //
    //                                                         //
    //                Web Socket settings                      //
    //                                                         //
    // ******************************************************* //

    let ws = new WebSocket("wss://itri-router-sstc.ngrok.io");
    ws.onopen = () => {
        console.log("open connection");
    };
    ws.onclose = () => {
        console.log("close connection");
    };
    ws.onmessage = (event) => {
        if(event.data=='action') flyState = true;
        
        if(event.data=='back'){
            let manobject = scene.getObjectByName('groupMan');
            manobject.position.y += 260;//2.5*50;
        }
        console.log(event);

    };

    


    // ******************************************************* //
    //                                                         //
    //                button back function                     //
    //                                                         //
    // ******************************************************* //

    $("#main3-btn1-return").click(function(){
        // alert("button");
        flyState = true;

    }); 
    $("#main3-btn2-back").click(function(){
        // alert("button");
        let manobject = scene.getObjectByName('groupMan');
        manobject.position.y += 260;//2.5*50;
    }); 


    // ******************************************** //
    //                                              //
    //                test animation                //
    //                                              //
    // ******************************************** //

    function testAnimationPlay(name){
        const fSpeed = 0.1, tSpeed = 0.2;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        console.log(animationArray);
        let action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        // action = mixer.clipAction( animationArray[randInt] );
        let action3 = mixer.clipAction( animationArray.find(item=>item.name=='right') );
        // action2 : jump for land ; action: stand only
        // action.reset();
        action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        action.crossFadeTo(action2, fSpeed, true);
        setTimeout(function() {
            currentlyAnimating[0] = false;
            action2.enabled = true;
            // action2.crossFadeTo(action, tSpeed, true);
            action2.crossFadeTo(action, 0.02, true);
            
            console.log('play ...');
            action.reset();
            action.play();
            // setTimeout(function(){
            //     currentlyAnimating = false;
            // },action2._clip.duration-200);
            }, action2._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }

    // ******************************************** //
    //                                              //
    //                mouse click                   //
    //                                              //
    // ******************************************** //

    // window.addEventListener('touchend', e => raycast(e, true));
    // window.addEventListener('click', e => raycast(e));
    // function raycast(e, touch = false) {
    // var mouse = {};
    // if (touch) {
    //     mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
    //     mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    // } else {
    //     mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    //     mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    // }
    // // update the picking ray with the camera and mouse position
    // raycaster.setFromCamera(mouse, camera);
    // // calculate objects intersecting the picking ray
    // var intersects = raycaster.intersectObjects(scene.children, true);
    // if (intersects[0]) {
    //     var object = intersects[0].object;
    //     // if (object.name === 'male_casualsuit06Mesh') {
    //     // if (object.name === 'rp_eric_rigged_001_geo') {
    //     if (object.name === 'rp_carla_rigged_001_geo') {
    //     if (!currentlyAnimating) {
    //         currentlyAnimating = true;
    //         console.log('click 3d model');
    //         JanimationPlay('left');
    //     }
    //     }
    // }
    // }



    // ******************************************************* //
    //                                                         //
    //                Animation play setting                   //
    //                                                         //
    // ******************************************************* //

    //   let clips = fileAnimations.filter(val => val.name !== 'idle');

    //   possibleAnims = clips.map(val => {
    //     let clip = THREE.AnimationClip.findByName(clips, val.name);
    //     clip.tracks.splice(3, 3);
    //     clip.tracks.splice(9, 3);
    //     clip = mixer.clipAction(clip);
    //     return clip;
    //    }
    //   );

    // function playModifierAnimation(from, fSpeed, to, tSpeed) {
    //     to.setLoop(THREE.LoopOnce);
    //     to.reset();
    //     to.play();
    //     from.crossFadeTo(to, fSpeed, true);
    //     setTimeout(function() {
    //       from.enabled = true;
    //       to.crossFadeTo(from, tSpeed, true);
    //       currentlyAnimating = false;
    //     }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    //   }



    // ******************************************************* //
    //                                                         //
    //                TweenMax Sample code                     //
    //                                                         //
    // ******************************************************* //

    // TweenMax.to(skytexture, 3, { opacity: 0.1 });
    // let objectBox = scene.getObjectByName( "boxbg" );
    // setTimeout(function() {
    //     objectBox.material.map = bgTexture2;
    //     TweenMax.to(skytexture, 4, { opacity: 1 });
    // }, 2800);