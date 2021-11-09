
    import * as THREE from './build/three.module.js';
    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';
    import { TGALoader } from './jsm/loaders/TGALoader.js';

    // *** webgl variable *** //
    let camera, scene, renderer;
    const clock = new THREE.Clock();
    let mixer;
    let b_mixer;
    let w_mixer;
    let action;
    let w_action;
    let b_action;
    let animationArray =[];
    var canvas;
    let controls;
    let skytexture;

    const pointer = new THREE.Vector2();

    let notebookState = false;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    const resizePara = 1; //4/5;


    // *** fly animation state *** //
    let flyState = false;
    let flyTimes = 0;


    // *** move position state  *** //
    let movePositionConsole = [false, false];
    let lastState = [false,false];
    let model_position_count = [0,0];
    let modelNewPositionArray = [0,0];
    let modelLastPositionArray = [0,0];
    let currentlyAnimating = [false,false];

    const loader = new FBXLoader();
    loader.load( './3dfile/man_Idle.fbx', function ( object ) {
        object.animations[ 0 ].name ="idle";
        animationArray.push( object.animations[ 0 ]);     
    } );


    init();
    animate();

    function init() {

        canvas = document.getElementById("main3-canvas");
        console.log(canvas);

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( 100, 300, 350 );

        scene = new THREE.Scene();

        const BACKGROUND_COLOR = 0xf1f1f1;
        scene.background = new THREE.Color( 0xf5c1bd );
        // scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        

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

        const mesh = new THREE.Mesh( new THREE.BoxGeometry( 50, 50 ,50), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } ) );
        mesh.name = 'showcase';
        mesh.position.y += 25;
        scene.add( mesh );


        const mesh2 = new THREE.Mesh( new THREE.BoxGeometry( 50, 50 ,50), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true } ) );
        mesh2.name = 'showcase2';
        mesh2.position.y += 25;
        mesh2.position.x += 100;
        scene.add( mesh2 );


        const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add( grid );

        
        const group = new THREE.Group();
        const group2 = new THREE.Group();
        const group3 = new THREE.Group();
        const group4 = new THREE.Group();

        
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
            console.log('action : ', action);
            
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl;
                }
            } );
            object.scale.multiplyScalar(0.65); 
            
            console.log(object.name);
            // scene.add( object );
            group.add( object );
        } );


        group.name = "groupMan";
        scene.add( group );

        let tempObject2 = scene.getObjectByName( "groupMan" );
        tempObject2.position.z += 130;
        tempObject2.position.x -= 50;




        loader.load( './3dfile/Lowpoly_Notebook_2.fbx', function ( object ) {

            const txt = new THREE.TextureLoader().load('./3dfile/textures/Lowpoly_Laptop_2.jpg');
            txt.flipY = true; // we flip the texture so that its the right way up
            const mtl = new THREE.MeshPhongMaterial({
                map: txt,
                color: 0xffffff,
                skinning: true
            });
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = mtl;
                }
            } );
            object.scale.multiplyScalar(0.1); 
            object.rotation.y = Math.PI / 2;
            object.position.y += 55;
            object.name = 'notebook'
            console.log('object.name :',object.name);
            group2.add(object);
            // scene.add( object );
        } );

        group2.name = 'notebook'
        scene.add( group2 );



        loader.load( './3dfile/Rock3.fbx', function ( object ) {

            const txt = new THREE.TextureLoader().load('./3dfile/Rock-Texture-Surface.jpg');
            txt.flipY = true; // we flip the texture so that its the right way up
            const mtl = new THREE.MeshPhongMaterial({
                map: txt,
                color: 0xffffff,
                skinning: true
            });
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = mtl;
                }
            } );
            object.scale.multiplyScalar(0.1); 

            object.rotation.y = Math.PI / 2;
            object.position.y += 55;
            object.position.x += 100;
            object.name = 'rock-inside'
            console.log('object.name :',object.name);
            group3.add(object);

        } );

        group3.name = 'rock'
        scene.add( group3 );



        let tempObject = scene.getObjectByName( "rock" );
        console.log(tempObject.children[0]);


        loader.load( './3dfile/Balus02.fbx', function ( object ) {


            b_mixer = new THREE.AnimationMixer( object );
            console.log('b_mixer : ', b_mixer);
            b_action = b_mixer.clipAction( object.animations[0] );
            // b_action = b_mixer.clipAction( animationArray.find(item=>item.name=='idle')  );
            console.log('b_action : ', b_action);
            console.log(' object.animations[0]: ',  object.animations)
            b_action._loopCount=1;
            // b_action.time=0.5;
            // b_action.timeScale *=500000;
            b_action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // child.material = man_mtl;
                }
            } );
            object.scale.multiplyScalar(0.65);    
            console.log(object.name);

            group4.add( object );
        } );

        // group.rotation.x = 4.3;
        // group.position.y += 330;//2.5*50;
        group4.name = "bailu1";
        scene.add( group4 );

        let tempObjectBalus = scene.getObjectByName( "bailu1" );
        // tempObject2.position.z += 130;
        tempObjectBalus.position.y += 200;





        
        
        console.log(scene);
        
        // ---------------- 綁定 canvas 為 自己指定的element !! --------------- //
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;


        // **** controls 畫面縮放控制 **** //
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
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', onPointerMove );

        
        
        
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
    }

    function animate() {
        
        notebookState = false;
        moveMouseDisplay()


        let tempObject = scene.getObjectByName( "notebook" );
        
        if(tempObject) {
            // if(tempObject.children[0]) console.log(tempObject.children[0].position)
            tempObject.rotation.y -= 0.01;}

        let tempObject2 = scene.getObjectByName( "rock" );
        if(tempObject2.children[0]) tempObject2.children[0].rotation.y -= 0.01;
        // console.log('123')

        let tempObjectMan = scene.getObjectByName( "groupMan" );
        // if(tempObjectMan.children[0]) console.log(tempObjectMan.position)
        if(tempObjectMan && tempObject.children[0]){
            const dep = distanceCal(tempObjectMan,tempObject.children[0]);
            // console.log('dep : ',dep);
            if (dep<65){
                $("#notebook-info").css( { display: "block" } );
                $("#close-div").css( { display: "flex" } );
            }
        }

        if(tempObjectMan && tempObject2.children[0]){
            const dep = distanceCal(tempObjectMan,tempObject2.children[0]);
            // console.log('dep : ',dep);
            if (dep<65){
                $("#rock-info").css( { display: "block" } );
                $("#close-div").css( { display: "flex" } );
            }
        }

        const delta = clock.getDelta();
        const delta2 = clock.getDelta();
        if ( mixer ) {
            // console.log('mixer : ', mixer);
            mixer.update( delta );}
        if (b_mixer) {
            // console.log('b_mixer',b_mixer);
            b_mixer.update( delta2 *3000);
            // b_action.pause();
            // console.log('delta20', delta2);
            // console.log('b_action : ', b_action);

        }
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    $("#close-div").click(function(){
        // alert("button");
        // flyState = true;
        $("#close-div").css( { display: "none" } );
        $("#notebook-info").css( { display: "none" } );
    }); 


    function distanceCal(objectA,objectB){
        // objectA.position.x - objectB.position.x
        const p1 = objectA.position;
        const p2 = objectB.position;
        let dep = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.z - p2.z), 2));
        return dep;

    }


    function onPointerMove( event ) {

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function onDocumentMouseDown( event ) {
        
        event.preventDefault();
    
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        // console.log('camera', camera);
        // console.log('mouse', mouse);
        raycaster.setFromCamera( mouse, camera );
    
        var intersects = raycaster.intersectObjects( scene.children,true ); 
    
        if ( intersects.length > 0 ) {
            console.log('object name :', intersects[0].object.name);
            if(intersects[0].object.name == "Lowpoly_Notebook") notebookState = true;
            if(intersects[0].object.name != "Lowpoly_Notebook") notebookState = false;
            // intersects[0].object.callback();
            console.log(notebookState);
            if (intersects[0].object.name == "Lowpoly_Notebook") $("#notebook-info").css( { display: "block" } );
            if (intersects[0].object.name == "showcase") $("#notebook-info").css( { display: "none" } );
            


        }
    
    }

    function moveMouseDisplay(){
        raycaster.setFromCamera( pointer, camera );
        var intersects = raycaster.intersectObjects( scene.children,true ); 
        $("#notebook-info").css( { display: "none" } );
            $("#rock-info").css( { display: "none" } );
            $("#close-div").css( { display: "none" } );
        if ( intersects.length > 0 ) {
            
            if(intersects[0].object.name == "Lowpoly_Notebook") 
            {notebookState = true;
            $("#notebook-info").css( { display: "block" } );
                $("#close-div").css( { display: "flex" } );}
            if(intersects[0].object.name == "Cube") 
            {notebookState = true;
            $("#rock-info").css( { display: "block" } );
                $("#close-div").css( { display: "flex" } );}
        }
    }

    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        // console.log('key : ', keyCode);
        if (keyCode == 90) {   
            // ******* z = 90 ********* //
            console.log('z: 90');

        } else if (keyCode == 88) {     
            // ******* x = 88 ********* //
            console.log('x: 88');
            
            
        }else if (keyCode == 39) {     
            // ******* >> = 39 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.rotation.y += Math.PI / 2 /9;
            console.log('tempObject2: ',tempObject2);

        }else if (keyCode == 37) {     
            // ******* << = 37 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.rotation.y -= Math.PI / 2 /9;
            
        }else if (keyCode == 87) {     
            // ******* w = 87 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.position.z -= 5;
            
        }else if (keyCode == 83) {     
            // ******* s = 83 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.position.z += 5;
            
        }else if (keyCode == 65) {     
            // ******* a = 65 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.position.x -= 5;
            
        }else if (keyCode == 68) {     
            // ******* d = 68 ********* //
            let tempObject2 = scene.getObjectByName( "groupMan" );
            tempObject2.position.x += 5;

            
        }
    }









    // ******************************************************* //
    //                                                         //
    //             Keyboard action functions ! !               //
    //                                                         //
    // ******************************************************* //
    
    function onDocumentKeyDown22(event) {
        var keyCode = event.which;
        // console.log('key : ', keyCode);
        if (keyCode == 90) {   
            // ******* z = 90 ********* //
            walkGoAndBack();

        } else if (keyCode == 88) {     
            // ******* x = 88 ********* //
            animationPlay(action, 'left');
            
        } else if (keyCode == 67) {
            // ******* c = 67 ********* //
            animationPlay(action, 'jump');

        } else if (keyCode == 86) {
            // ******* v = 86 ********* //
            animationPlay(action, 'rokoko01');
            // animationPlay(action, 'hello');

        } else if (keyCode == 83) {
            // ******* s = 83 ********* //
            // animationPlay(action, 'hello');
            walkGoOutTest('right');
            walkGoOutTest2('right');

        } else if(keyCode == 65){
            // ******* A = 65 ********* //
            // *** bg tweenMax change *** //
            tweenMaxBackGround();

            // *** woman and man go together *** //
            animationPlay(action, 'right');
            setTimeout(()=>{
                animationPlay(w_action, 'right');
            },300)
            
            let object3DWoman = scene.getObjectByName( "groupWoman" );
            console.log('object3DWoman : ', object3DWoman);
            console.log('children : ', object3DWoman.children[0]);
            
            
        }
    };

    function startAction(modelMixer, name){
        let next = modelMixer.clipAction( animationArray.find(item=>item.name==name) );
        let orig = modelMixer._actions[0];
        next.reset();
        next.play();
        orig.crossFadeTo(next, fSpeed, false);
    }

    function endAction(modelMixer, name){
        let next = modelMixer.clipAction( animationArray.find(item=>item.name==name) );
        let orig = modelMixer._actions[0];
        next.enabled = true;
        next.crossFadeTo(orig, tSpeed, true);
        orig.reset();
        orig.play();
        console.log('Action play done ...');
    }

    
    function walkGoOutTest(name){
        const fSpeed = 0.08, tSpeed = 0.5;
        let object3DWoman = scene.getObjectByName( "groupWoman" );
        // console.log(animationArray);
        let action2 = w_mixer.clipAction( animationArray.find(item=>item.name==name) );
        // action2.setLoop(THREE.LoopOnce);
        action2.reset();
        w_action.reset();
        action2.play();
        // console.log(action2.isRunning());
        w_action.crossFadeTo(action2, fSpeed, false);
        setTimeout(function() {
            object3DWoman.position.x += object3DWoman.children[0].position.x;
            setTimeout(function() {
                object3DWoman.position.x += object3DWoman.children[0].position.x;
                action2.enabled = false;
                action2.crossFadeTo(w_action, tSpeed, false);
                console.log('woman play ...');
                w_action.reset();
                w_action.play();

                // *** go back *** //
                setTimeout(function(){
                    let action3 = w_mixer.clipAction( animationArray.find(item=>item.name=='left') );
                    // action2.setLoop(THREE.LoopOnce);
                    action3.reset();
                    action3.play();
                    // console.log(action2.isRunning());
                    w_action.crossFadeTo(action3, fSpeed, false);
                    setTimeout(function() {
                        object3DWoman.position.x += object3DWoman.children[0].position.x;
                    
                        setTimeout(function() {
                            object3DWoman.position.x += object3DWoman.children[0].position.x;
                        
                            action3.enabled = false;
                            action3.crossFadeTo(w_action, tSpeed, false);
                            console.log('woman play ...');
                            w_action.reset();
                            w_action.play();
            
                        },action3._clip.duration*1000);
                    },action3._clip.duration*1000-20);


                },2000);

            },action2._clip.duration*1000-10)
        },action2._clip.duration*1000-10)
    }


    function walkGoOutTest2(name){
        const fSpeed = 0.08, tSpeed = 0.5;
        let object3DWoman = scene.getObjectByName( "groupWoman" );
        let object3DMan = scene.getObjectByName( "groupMan" );
        // console.log(animationArray);
        let action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        // action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action.reset();
        action2.play();
        // console.log(action2.isRunning());
        action.crossFadeTo(action2, fSpeed, false);
        setTimeout(function() {
            object3DMan.position.x += object3DMan.children[0].position.x;
            setTimeout(function() {
                object3DMan.position.x += object3DMan.children[0].position.x;
                action2.enabled = false;
                action2.crossFadeTo(action, tSpeed, false);
                console.log('woman play ...');
                action.reset();
                action.play();

                // *** go back *** //
                setTimeout(function(){
                    let action3 = w_mixer.clipAction( animationArray.find(item=>item.name=='left') );
                    // action2.setLoop(THREE.LoopOnce);
                    action3.reset();
                    action3.play();
                    // console.log(action2.isRunning());
                    action.crossFadeTo(action3, fSpeed, false);
                    setTimeout(function() {
                        object3DMan.position.x += object3DMan.children[0].position.x;
                    
                        setTimeout(function() {
                            object3DMan.position.x += object3DMan.children[0].position.x;
                        
                            action3.enabled = false;
                            action3.crossFadeTo(action, tSpeed, false);
                            console.log('woman play ...');
                            action.reset();
                            action.play();
            
                        },action3._clip.duration*1000);
                    },action3._clip.duration*1000-20);


                },2000);

            },action2._clip.duration*1000-10)
        },action2._clip.duration*1000-10)
    }


    // ******************************************************* //
    //                                                         //
    //         All animations fadein/out functions             //
    //                                                         //
    // ******************************************************* //

    function animationPlay(orinAnimat, nextAnimatName){
        const fSpeed = 0.2, tSpeed = 0.3;
        let number = 0;
        let nextAnimat;
        if(orinAnimat==w_action) {
            number=1;
            nextAnimat = w_mixer.clipAction( animationArray.find(item=>item.name==nextAnimatName) );
        }else{   
            nextAnimat = mixer.clipAction( animationArray.find(item=>item.name==nextAnimatName) );
            // console.log('mixer : ', mixer);
            // console.log('animat : ', nextAnimat);
        }
        currentlyAnimating[number] = true;
        nextAnimat.setLoop(THREE.LoopOnce);
        nextAnimat.reset();
        nextAnimat.play();
        orinAnimat.crossFadeTo(nextAnimat, fSpeed, true);
        setTimeout(()=>{
            nextAnimat.enabled = true;
            nextAnimat.crossFadeTo(orinAnimat, tSpeed, true);
            
            currentlyAnimating[number] = false;
            console.log('play ...',number);
            orinAnimat.reset();
            orinAnimat.play();
            }, nextAnimat._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000)
        );
    }


    // ******************************************************* //
    //                                                         //
    //             Fly to land down animation                  //
    //                                                         //
    // ******************************************************* //
    
    function flyAnimationPlay(flyModel){
        if (flyModel && flyState){
            // object3DMan.updateMatrix();
            if(flyTimes==1)flyModel.visible = false;
            flyModel.position.y -= 2.5;
            console.log('move 3d model');
            flyTimes += 1;
            if(flyTimes ==120) {
                // JanimationPlay('land');
                // *** action is Specify model animation *** // 
                // *** , and land is next play animation *** //
                animationPlay(action, 'land');
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

    // ******************************************************* //
    //                                                         //
    //      *** Old ***   go and back function                 //
    //                                                         //
    // ******************************************************* //
    
    function walkGoAndBack() {
        let playTime = 1400;
        let delayTime = 300;

        // *** first right *** //
        animationPlay(action, 'right');
        setTimeout(function(){
            animationPlay(w_action, 'right');
        },delayTime    );
        

        // *** second right *** //
        setTimeout(function(){
            animationPlay(action, 'right');
            setTimeout(function(){
                animationPlay(w_action, 'right');
            },delayTime  );
        },playTime  );

        
        // *** third right *** //
        setTimeout(function(){
            animationPlay(action, 'right');
            setTimeout(function(){
                animationPlay(w_action, 'right');
            },delayTime );
        },playTime*2 );

        
        // *** fourth turn back and change background *** //
        setTimeout(function(){
            // **** 背景 fade out **** //
            TweenMax.to(skytexture, 3, { opacity: 0.1 });
            setTimeout(function() {
                // **** 背景 fade in **** //
                changSkyTexture();
                TweenMax.to(skytexture, 3, { opacity: 1 });
                animationPlay(w_action,'left');
                setTimeout(function(){
                    animationPlay(action,'left');
                },delayTime );
            }, 3200);
        },playTime*3    );


        // *** fiveth *** //
        setTimeout(function(){
            animationPlay(w_action,'left');
            setTimeout(function(){
                animationPlay(action,'left');
            },delayTime );
        },playTime*4+3200    );


        // *** sixth *** //
        setTimeout(function(){
            animationPlay(w_action,'left');
            setTimeout(function(){
                animationPlay(action,'left');
            },delayTime );
        },playTime*5+3200     );
    }


    // ******************************************************* //
    //                   *** Old ***                           //
    //             model  Position  Move  Fix                  //
    //                                                         //
    // ******************************************************* //

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
    
    
    // ******************************************************* //
    //                                                         //
    //                back ground chang funciton               //
    //                                                         //
    // ******************************************************* //

    function changSkyTexture(){
        let objectBox = scene.getObjectByName( "boxbg" );
        console.log(objectBox.material.map.uuid);
        bgArray.forEach((value,index)=>console.log(index,value.uuid));

        let randBG = Math.floor(Math.random()*bgArray.length);
        let tempTexture = eval(`bgArray[${randBG}]`);
        
        while(tempTexture.uuid == objectBox.material.map.uuid){
            randBG = Math.floor(Math.random()*bgArray.length);
            tempTexture = eval(`bgArray[${randBG}]`);
            console.log('repeat texture !');
        }
        tempTexture.wrapS = THREE.RepeatWrapping;
        tempTexture.repeat.x = - 1;
        objectBox.material.map = tempTexture;
    }

    function tweenMaxBackGround(){
        // **** 背景 fade out **** //
        TweenMax.to(skytexture, 2.6, { opacity: 0.1 });
        setTimeout(function() {
            // **** 背景 fade in **** //
            changSkyTexture();
            TweenMax.to(skytexture, 3, { opacity: 1 });
        }, 2600);
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
                currentlyAnimating[1] = false;
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