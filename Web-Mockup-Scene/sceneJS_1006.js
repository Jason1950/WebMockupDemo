
    import * as THREE from './build/three.module.js';
    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';

    let camera, scene, renderer;

    const clock = new THREE.Clock();

    let mixer;
    let mixer2;
    let act ;
    let action;
    let animationArray =[];
    let animationTemp = null;
    var canvas;
    let controls;

    let flyState = false;
    let flyTimes = 0;

    let movePositionConsole = false;

    let lastState = false;
    let model_position_x = 0;
    let model_new_position_x = 0;
    let last_model_position_x = 0;

    let startX = 0, startY = 0, endX = 0, endY =0;

    let bgTextureTweenMax ;
    let skytexture;

    const resizePara = 1; //4/5;
    let raycaster = new THREE.Raycaster();
    let currentlyAnimating = false;

    // let man_txt = new THREE.TextureLoader().load('./pics/man.jpg');
    let man_txt = new THREE.TextureLoader().load('./pics/woman2.jpg');
    // let man_txt = new THREE.TextureLoader().load('./pics/gracy.png');
    // let man_txt = new THREE.TextureLoader().load('./pics/female.jpeg');

    man_txt.flipY = true; // we flip the texture so that its the right way up

    const man_mtl = new THREE.MeshPhongMaterial({
    map: man_txt,
    color: 0xffffff,
    skinning: true
    });

    // backgorund
    
    const loaderimg0 = new THREE.TextureLoader();
    const bgTexture = loaderimg0.load('./pics/background.jpg');
    const bgTexture2 = loaderimg0.load('./pics/background2.jpg');
    const bgTexture3 = loaderimg0.load('./pics/background3.jpg');
    const bgTexture4 = loaderimg0.load('./pics/background4.jpg');

    let bgArray = ['bgTexture', 'bgTexture2', 'bgTexture3', 'bgTexture4'];
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
    // loader.load( './3dfile/man_Angry.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="angry";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );
    loader.load( './3dfile/man_hello.fbx', function ( object ) {
        object.animations[ 0 ].name ="hello";
        animationArray.push( object.animations[ 0 ]);            
    } );

    // loader.load( './3dfile/man_ZombieIdle.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="zombie";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );
    loader.load( './3dfile/man_StandToFreehang.fbx', function ( object ) {
        object.animations[ 0 ].name ="standtofreehang";
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

        
        // bgTexture2

        // *************************************************** //
        // *       background function test : TweenMax       * //
        // *************************************************** //
        // var geometry= new THREE.BoxGeometry(20, 20, 20);
        // var material= new THREE.MeshPhongMaterial({ transparent: true, opacity: 0 ,map: cushionsInit, shininess: 10 });
        // var meshtest = new THREE.Mesh(geometry, material);
        // scene.add(meshtest);
        // TweenMax.to(material, 20, { opacity: 1 });
 


 




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

        loader.load( './3dfile/woman2.fbx', function ( object ) {
        // loader.load( './3dfile/man_Jun.fbx', function ( object ) {
        // loader.load( './3dfile/man_Jun2_stand.fbx', function ( object ) {
        // loader.load( './3dfile/man.fbx', function ( object ) {
            // console.log(object.name);
            mixer = new THREE.AnimationMixer( object );
            // console.log(object);
            // action = mixer.clipAction( object.animations[0] );
            // action.play();
            action = mixer.clipAction( animationArray.find(item=>item.name=='idle') );
            action.play();
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl;
                }
            } );
            // object.position.x = 11;
            object.name = "woman";
            
            console.log('object : ',object);
            // scene.add( object );
            group.add( object );
        } );
        // group.rotation.x = 4.3;
        // group.position.y += 330;//2.5*50;
        group.name = "groupMan";
        scene.add( group );





        loader.load( './3dfile/man.fbx', function ( object ) {

            const mantxt = new THREE.TextureLoader().load('./pics/man.jpg');
            // let man_txt = new THREE.TextureLoader().load('./pics/gracy.png');
            // let man_txt = new THREE.TextureLoader().load('./pics/female.jpeg');

            mantxt.flipY = true; // we flip the texture so that its the right way up

            const man_mtl2 = new THREE.MeshPhongMaterial({
            map: mantxt,
            color: 0xffffff,
            skinning: true
            });
            // console.log(object.name);
            mixer = new THREE.AnimationMixer( object );
            // console.log(object);
            // action = mixer.clipAction( object.animations[0] );
            // action.play();
            action = mixer.clipAction( animationArray.find(item=>item.name=='idle') );
            action.play();
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl2;
                }
            } );
            // object.position.x = 11;
            object.name = "man";
            
            console.log('object : ',object);
            
            // scene.add( object );
            group2.add(object);
            // group2.name = "Group2"
            
            // group.add( object );
        } );

        group2.name = "Group2";
        scene.add( group2 );


        let objman = scene.getObjectByName( "Group2" );
        objman.position.x = 110;




        

        
        
        // let object3DMan = scene.getObjectByName( "groupMan" );
        // object3DMan.rotation.z =1.5;
        scene.position.y -= 55;
        console.log(scene);
        
        // ---------------- 綁定 canvas 為 自己指定的element !! --------------- //
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;

        controls = new OrbitControls( camera, renderer.domElement );
        // controls.maxPolarAngle = Math.PI / 2 - 0.11;
        // controls.minPolarAngle = Math.PI / 3 - 0.15;
        controls.maxPolarAngle = 1.4206431444880732;
        controls.minPolarAngle = 1.4206431444880735;
        
        // controls.maxAzimuthAngle = Math.PI *1/4 ;   //from 120 ~ -180 degree 
        // controls.minAzimuthAngle = -Math.PI *2/3 ;
        controls.maxAzimuthAngle = 0; //Math.PI  ;   //from 120 ~ -180 degree 
        controls.minAzimuthAngle = 0  ;

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

    //

    function animate() {
        // canvas.width = 500;
        requestAnimationFrame( animate );

        const delta = clock.getDelta();
        // console.log(mixer2);
        if ( mixer ) mixer.update( delta );

        // if(mixer2){
        //     mixer2.update( delta );
        //     console.log('1');
        // }else if(mixer){
        //     mixer.update( delta );
        // }

        
        // let content = $("#fly-div").html();
        // flyState = (content === 'true');
        // console.log('flyState : ',flyState);
        var object3DMan = scene.getObjectByName( "groupMan" );
        
        if (object3DMan && flyState){
            // object3DMan.updateMatrix();
            if(flyTimes==1)object3DMan.visible = false;
            object3DMan.position.y -= 2.5;
            // object3DMan.rotation.y += 0.081;
            console.log('move 3d model');
            flyTimes += 1;
            if(flyTimes ==120) {
                JanimationPlay('land');
                object3DMan.visible = true; //Invisible
            }
            
            if (flyTimes>140) {
            object3DMan.position.y = 0;
            object3DMan.rotation.y = 0;
            flyState = !flyState;
            // $("#fly-div").html('false');
            flyTimes = 0;
            // main3ButtnClick();
            }
        }
        // console.log(controls.getPolarAngle())
        if(currentlyAnimating) {
            if(movePositionConsole) console.log(object3DMan.children[0].position.x);
            model_new_position_x = object3DMan.children[0].position.x;
        }
        
        if(lastState == !currentlyAnimating && lastState==true ){
            model_position_x += 1;
        }
        lastState = currentlyAnimating
        if (model_position_x>0 && model_position_x<20){
            if (model_position_x == 1) {
                
                // object3DMan.visible = false;
                object3DMan.position.x += model_new_position_x;
                last_model_position_x = object3DMan.position.x
            }
            object3DMan.position.x = last_model_position_x;
            if(movePositionConsole){
                console.log('QQ');
                console.log(object3DMan.children[0].position.x);
            }
            model_position_x +=1;
        }else{
            model_position_x = 0;
            
        }
        
        // stats.update();


        renderer.render( scene, camera );
    }


    // ******************************************** //
    //                                              //
    //                mouse click                   //
    //                                              //
    // ******************************************** //


    
    window.addEventListener('click', e => raycast(e));
    window.addEventListener('touchend', e => raycast(e, true));

    function raycast(e, touch = false) {
    var mouse = {};
    if (touch) {
        mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
        mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    } else {
        mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    }
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects[0]) {
        var object = intersects[0].object;
        console.log(object.name);
        // if (object.name === 'male_casualsuit06Mesh') {
        // if (object.name === 'rp_eric_rigged_001_geo') {
        if (object.name === 'rp_carla_rigged_001_geo') {
            
            // console.log('asd');
        if (!currentlyAnimating) {
            currentlyAnimating = true;
            playOnClick('left');
            // playOnClick('pain');
        }
        }
    }
    }


    // Get a random animation, and play it 
    function playOnClick(name) {
        // let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
        // playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
        console.log('click 3d model');
        // currentlyAnimating = false;
        JanimationPlay(name);
        // console.log(animationArray);
        
    }

    function JanimationPlay(name){
        const fSpeed = 0.1, tSpeed = 0.2;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        console.log(animationArray);
        let action2 = mixer.clipAction( animationArray.find(item=>item.name==name) );
        // action = mixer.clipAction( animationArray[randInt] );

        // action2 : jump for land ; action: stand only
        // action.reset();
        action2.setLoop(THREE.LoopOnce);
        action2.reset();
        action2.play();
        action.crossFadeTo(action2, fSpeed, true);
        setTimeout(function() {
            action2.enabled = true;
            // action2.crossFadeTo(action, tSpeed, true);
            action2.crossFadeTo(action, 0.02, true);
            currentlyAnimating = false;
            console.log('play ...');
            action.reset();
            action.play();
            
            }, action2._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));

        // setTimeout(function() {
        // let object3DMan = scene.getObjectByName( "groupMan" );
        // // if (name=='right' )   object3DMan.position.x -=130;
        // // if (name=='left' )   object3DMan.position.x +=110;
        // // if (name=='right' )   object3DMan.position.x += model_new_position_x;
        // // if (name=='left' )   object3DMan.position.x += model_new_position_x;
        
        // console.log(action2._clip.duration);
        // console.log('end action');

        // action2.enabled = true;
        // action2.crossFadeTo(action, 0.05, true);
        // currentlyAnimating = false;
        // console.log('play ...');
        // action.reset();
        // action.play();
        // },action2._clip.duration*1000-485);
    }


    


    function playModifierAnimation(from, fSpeed, to, tSpeed) {
        to.setLoop(THREE.LoopOnce);
        to.reset();
        to.play();
        from.crossFadeTo(to, fSpeed, true);
        setTimeout(function() {
          from.enabled = true;
          to.crossFadeTo(from, tSpeed, true);
          currentlyAnimating = false;
        }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
      }

    //   let clips = fileAnimations.filter(val => val.name !== 'idle');

    //   possibleAnims = clips.map(val => {
    //     let clip = THREE.AnimationClip.findByName(clips, val.name);
    //     clip.tracks.splice(3, 3);
    //     clip.tracks.splice(9, 3);
    //     clip = mixer.clipAction(clip);
    //     return clip;
    //    }
    //   );

    $("#main3-btn1-return").click(function(){
        // alert("button");
        flyState = true;

    }); 
    $("#main3-btn2-back").click(function(){
        // alert("button");
        let manobject = scene.getObjectByName('groupMan');
        manobject.position.y += 260;//2.5*50;


    }); 

    

    wetherScroll();
    function wetherScroll(){
        
        var body=document.getElementsByTagName("body");
        $(document).bind('touchstart',function(event){
        var touch = event.targetTouches[0];
        //滑動起點的座標
        startX = touch.pageX;
        startY = touch.pageY;
        // console.log("startX:" startX "," "startY:" startY);
        });
        $(document).bind("touchmove",function(event){
        var touch = event.targetTouches[0];
        //手勢滑動時，手勢座標不斷變化，取最後一點的座標為最終的終點座標
            endX = touch.pageX;
            endY = touch.pageY;
            // console.log("endX:", endX, ",", "endY:" ,endY);
        })
        // ac();
        $(document).bind("touchend",function(event){
        var distanceX=endX-startX,
            distanceY=endY - startY;
            // console.log("distanceX:" distanceX "," "distanceY:" distanceY);
            //移動端裝置的螢幕寬度
            var clientHeight = document.documentElement.clientHeight;
            // console.log(clientHeight;*0.2);
            //判斷是否滑動了，而不是螢幕上單擊了
            if(startY!=Math.abs(distanceY)){
    //在滑動的距離超過螢幕高度的20%時，做某種操作
            if(Math.abs(distanceY)>clientHeight*0.2){
    //向下滑實行函式someAction1，向上滑實行函式someAction2
            distanceY <0 ? someAction1():someAction2();
            }
            }
            startX = startY = endX =endY =0;
        })
    }
    function someAction1(){
        console.log('gogogo');
        flyState = true;
        JanimationPlay('standtofreehang');
    }
    function someAction2(){
        console.log('.');
    }


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

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        // z = 90
        if (keyCode == 90) {

            let randBG = Math.floor(Math.random()*bgArray.length);
            let tempTexture = eval(eval(`bgArray[${randBG}]`));
            console.log(tempTexture);
            
            tempTexture.wrapS = THREE.RepeatWrapping;
            tempTexture.repeat.x = - 1;
            let playTime = 1130;
            currentlyAnimating = true;
            playOnClick('right');
            setTimeout(function(){
                currentlyAnimating = true;
                playOnClick('right');
            },playTime    );
            setTimeout(function(){
                currentlyAnimating = true;
                playOnClick('right');
            },playTime*2    );
            setTimeout(function(){
                TweenMax.to(skytexture, 3, { opacity: 0.1 });
                let objectBox = scene.getObjectByName( "boxbg" );
                setTimeout(function() {
                    objectBox.material.map = tempTexture;
                    TweenMax.to(skytexture, 4, { opacity: 1 });
                    currentlyAnimating = true;
                    playOnClick('left');
                }, 3200);
            },playTime*3    );
            setTimeout(function(){
                currentlyAnimating = true;
                playOnClick('left');
            },playTime*4+3200    );
            setTimeout(function(){
                currentlyAnimating = true;
                playOnClick('left');
            },playTime*5+3200     );
            
            
            // cube.position.y += ySpeed;
        } else if (keyCode == 88) {
            currentlyAnimating = true;
            // x = 88
            // cube.position.y -= ySpeed;
            playOnClick('left');
        } else if (keyCode == 67) {
            // c = 67
            playOnClick('jump');
        } else if (keyCode == 86) {
            // v = 86
            playOnClick('hello');
        } else if(keyCode == 65){
            // A = 65
            // TweenMax.to(skytexture, 3, { opacity: 0.1 });
            // let objectBox = scene.getObjectByName( "boxbg" );
            // setTimeout(function() {
            //     objectBox.material.map = bgTexture2;
            //     TweenMax.to(skytexture, 4, { opacity: 1 });
            // }, 2800);
            // currentlyAnimating = true;
            // walkAnimationPlay('right');
            let objectIdle = scene.getObjectByName( "man" );
            objectIdle.rotation.x += 1;
            console.log(objectIdle);
        }
    };


    function walkAnimationPlay(name){
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
            currentlyAnimating = false;
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