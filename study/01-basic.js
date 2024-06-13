import * as THREE from '../build/three.module.js';

class App {
    constructor() {
        // divContatiner 상수에 div요소 저장.
        const divContainer = document.querySelector("#webgl-container");
        // 해당 클래스에 필드에 정의함 : 다른 메서드에서 참조할 수 있도록 하기 위함.
        this._divContainer = divContainer;

        // 렌더러 생성 코드. antialias 로 매끄러운 3차원 Object를 계단현상 없이 렌더링.
        const renderer = new THREE.WebGLRenderer({ antialias : true });
        // 윈도우 devicePixcelRatio 값 얻어와서 설정.
        renderer.setPixelRatio(window.devicePixelRatio);
        // 자식으로 renderer 추가.
        divContainer.appendChild(renderer.domElement); //renderer.domElement는 canvas 타입의 dom 객체이다.
        // 해당 클래스에 필드에 정의함.
        this._renderer = renderer;

        // Scene 객체 생성 및 필드화.
        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupMedel();

        // 창 크기 변경시. 렌더러나 카메라는 크기에 맞게 속성값을 재설정이 필요함.
        // resize 이벤트에 resize 메서드를 지정할때 bind를 사용해서 지정하는데,
        // 그 이유는 resize 메서드 안에 this가 가르키는 객체가 이벤트 객체가 아닌 
        // 이 App 클래스의 객체가 되도록 하기 위해서이다.
        window.onresize = this.resize.bind(this);
        this.resize(); //생성자에서 무조건 한번 호출해주고 있음. 최초 창크기 설정.

        // 해당 api를 호출하며 넘겨주는데
        // 3차원 그래픽 장면을 만들어주는 메서드
        // bind를 통해서 넘겨주는 이유는
        // render 메서드 코드 안에서 쓰이는 this가 App클래스를 가르키기 위함.
        requestAnimationFrame(this.render.bind(this));
    }

    // 가로세로 크기를 얻어와 카메라 객체에 이용함. 카메라 위치.
    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 2;
        this._camera = camera;
    }

    //광원 생성시 광원 색상과 광원의 세기값 필요.
    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 1, 4); //광원 위치를 설정.
        this._scene.add(light);
    }

    //Mash 생성하는 모델
    _setupMedel(){
        const geometry = new THREE.BoxGeometry(1, 1, 1); //가로, 세로, 깊이 인자 값
        const material = new THREE.MeshPhongMaterial({ color: 0x44a88 }); // 파란색 계열 재질 설정.

        const cube = new THREE.Mesh(geometry, material); // Mesh 생성

        this._scene.add(cube);
        this._cube = cube;
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    // time 단위는 밀리초로 애니메이션에 활용
    render(time) {
        // 카메라 시점으로 렌더링
        this._renderer.render(this._scene, this._camera);
        // update는 속성값 변경하는 메서드
        this.update(time);
        // 무한으로 반복으로 적당한 시점에 호출됨.
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        // 이 time 값은 requestAnimationFrame 함수가 render 함수에 전달해 주는 값이다.
        time *= 0.001; // second unit을 밀리초로 변경
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}