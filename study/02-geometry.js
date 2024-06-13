import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        // 렌더러 생성 코드. antialias 로 매끄러운 3차원 Object를 계단현상 없이 렌더링.
        const renderer = new THREE.WebGLRenderer({ antialias : true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); //renderer.domElement는 canvas 타입의 dom 객체이다.
        this._renderer = renderer;

        // Scene 객체 생성 및 필드화.
        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupMedel();
        this._setupControls(); // OrbitControls 클래스를 사용하기 위한 메서드

        window.onresize = this.resize.bind(this);
        this.resize(); //생성자에서 무조건 한번 호출해주고 있음. 최초 창크기 설정.

        // 3차원 그래픽 장면을 만들어주는 메서드
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        // OrbitControls 객체를 생성할때는 '카메라 객체'와 마우스 이벤트를 받는 'DOM 요소'가 필요함.
        new OrbitControls(this._camera, this._divContainer);
    }

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
        const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
        const cube = new THREE.Mesh(geometry, fillMaterial);

        const lineMeterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), lineMeterial); //와이어 프레임 형태 지오메트리로 표현.

        //오브젝트를 묶는 group
        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

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

        //자동 회전 주석
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}