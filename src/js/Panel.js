import {
    Vector2,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    WebGLRenderer,
    PlaneBufferGeometry,
    ShaderMaterial,
    Mesh,
    TextureLoader,
    Color
} from 'three';
import gsap from 'gsap';
import ScrollBar from 'smooth-scrollbar';

const Lerp = (v0, v1, t) => {
    return v0*(1-t)+v1*t;
}
function Panel(el,textEl, scene) {
    this.el = el;
    this.textEl = textEl;
    this.sizes = new Vector2();
    this.offset = new Vector2();
    this.shift = -100;
    this.textSkew = 0;
    this.textTranslate = 0;

    this.scene = scene;


    let imgSrc = this.el.querySelector('img').getAttribute('src');
    new TextureLoader().load(imgSrc, (texture) => {
        this.texture = texture;
        this.el.classList.add('is-loaded');
        this.init();
    })

}

Panel.prototype.init = function() {

    this.getBound();
    this.uniforms = {
        texture: { value: this.texture },
        hasTexture: { value: 1 },
        scale: { value: 0 },
        shift: { value: 0 },
        opacity: { value: 1 },
        color: { value: new Color("white") }
    }

    this.geometry = new PlaneBufferGeometry(1, 1, 32, 32);


    this.material = new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `uniform float scale;
        uniform float shift;
        varying vec2 vUv;
        void main() {
          vec3 pos = position;
          pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 6.0) * 0.125);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
        }`,
        fragmentShader: `uniform sampler2D texture;
        uniform float hasTexture;
        uniform float shift;
        uniform float scale;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          float angle = 1.55;
          vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
          vec2 offset = shift / 9.0 * vec2(cos(angle), sin(angle));
          vec4 cr = texture2D(texture, p + offset);
          vec4 cga = texture2D(texture, p);
          vec4 cb = texture2D(texture, p - offset);
          if (hasTexture == 1.0) gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
          else gl_FragColor = vec4(color, opacity);
        }`,
        transparent: true,
        defines: {
            PI: Math.PI,
            PR: window.devicePixelRatio.toFixed(1),
        },
    })

    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.x = this.offset.x
    this.mesh.position.y = this.offset.y

    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    this.scene.add(this.mesh);
}

Panel.prototype.getBound = function() {
    const { width, height, left, top } = this.el.getBoundingClientRect()

    if (!this.sizes.equals(new Vector2(width, height))) {
        this.sizes.set(width, height)
    }

    if (!this.offset.equals(new Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
    }
}

Panel.prototype.demoTest = function() {
    this.el.innerHTML = this.offset.x + '--' + this.offset.y;
}
Panel.prototype.move = function() {
    if (!this.mesh) return
    this.getBound();

    gsap.set(this.mesh.position, {
        x: this.offset.x,
        y: this.offset.y,
    })

    // gsap.to(this.mesh.scale, 0.3, {
    //     x: this.sizes.x - this.delta,
    //     y: this.sizes.y - this.delta,
    //     z: 1,
    // })
}
Panel.prototype.update = function(shift = 0) {

    this.move();
    let currentShift = this.uniforms.shift.value;

    this.uniforms.shift.value = Lerp(currentShift, shift / this.shift, 0.1);
    this.textSkew = Lerp(this.textSkew, shift / 1.5, 0.1);
    this.textTranslate = Lerp(this.textTranslate, shift, 0.1);

    // gsap.set(this.textEl, {
    //     y: Math.abs(this.textTranslate),
    //     skewY: this.textSkew / 10,
    //     skewX: this.textSkew * 1.5
    // })

}

const perspective = 800;
function Stage(canvas) {
    this.canvas = canvas;
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.domPanels = document.querySelectorAll('.project-item');

    this.startScene();

}

Stage.prototype.startScene = function() {
    this.scene = window.scene = new Scene()
    this.initCamera()
    this.initLights()

    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
    })
    this.renderer.setSize(this.W, this.H)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.tiles = Array.from(this.domPanels).map((domPanel, i) => {
        let panel = domPanel.querySelector('.panel');
        let textEl = domPanel.querySelector('.project-detail');
        return new Panel(panel, textEl, this.scene);
    });

    this.Scroll = ScrollBar.get(document.querySelector('.scrollarea'));
    this.last = this.Scroll.offset.y;

    this.update()

}


Stage.prototype.initCamera = function() {
    const fov = (180 * (2 * Math.atan(this.H / 2 / perspective))) / Math.PI

    this.camera = new PerspectiveCamera(fov, this.W / this.H, 1, 10000)
    this.camera.position.set(0, 0, perspective)
}

Stage.prototype.initLights = function() {
    const ambientlight = new AmbientLight(0xffffff, 2)
    this.scene.add(ambientlight)
}

Stage.prototype.update = function() {
    requestAnimationFrame(this.update.bind(this))
    let scrollOffset = this.Scroll.offset.y;

    let shift = this.Scroll.offset.y - this.last;
    this.last = this.Scroll.offset.y;
    this.tiles.forEach((tile) => {
        tile.update(shift);
    })

    this.renderer.render(this.scene, this.camera)
}


export default Stage;


