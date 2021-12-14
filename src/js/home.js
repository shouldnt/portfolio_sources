import lerp from './lerp.js'
// commment test Hoang Unique Function Hoang
function  testHoangUniqueFunctionHoang() {
	console.log('testHoangUniqueFunctionHoang');
}

function ThreeScroll() {
	this.init();
	this.initEvent();
}
let _proto = ThreeScroll.prototype;

_proto.init = function() {
	let _this = this;
	
	this.lastTop = this.currentTop = 0;
	this.W = window.innerWidth;
	this.H = window.innerHeight;
	this.$tiles = document.querySelectorAll('.js-three-box');


	this.scene = new THREE.Scene();
	this.initCamera();
	this.initLights();
	this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('scrollCanvas'),
        alpha: true,
    })
	this.renderer.setSize(this.W, this.H)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.tiles = Array.from(this.$tiles).map(($el, i) => new Tile($el, this))
}
_proto.initCamera = function() {
	let _this = this;
	const fov = (180 * (2 * Math.atan(this.H / 2 / 800))) / Math.PI

	this.camera = new THREE.PerspectiveCamera(fov, this.W / this.H, 1, 10000)
	this.camera.position.set(0, 0, 800)
};
_proto.initLights = function() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 2)
    this.scene.add(ambientlight)
};
_proto.initEvent = function() {
	let _this = this;
	window.addEventListener('scroll', function() {
		// _this.currentTop = document.body.scrollTop;
		_this.currentTop = window.pageYOffset;
	});
	// window.addEventListener('resize', function() {
	// 	_this.W = window.innerWidth
	// 	_this.H = window.innerHeight
	// 	_this.camera.aspect = window.innerWidth / window.innerHeight;
	//     _this.camera.updateProjectionMatrix();

	// 	_this.renderer.setSize(_this.W, _this.H)
	// })
}
_proto.update = function() {
	let _this = this;
    requestAnimationFrame(this.update.bind(this))

    this.tiles.forEach((tile) => {
    	let scrollDelta = _this.currentTop - this.lastTop;
        tile.update(scrollDelta);
    })
    this.lastTop = this.currentTop;

    // this.renderer.render(this.scene, this.camera)
}
_proto.setCurrentTop = function(value) {
	this.currentTop = value;
}
export default ThreeScroll;


class Tile {

    constructor($el, scene) {
        this.scene = scene
        this.$els = {
            body: document.body,
            el: $el,
            // link: $el.querySelector('a'),
            text: $el.querySelectorAll('.box__text'),
            textReverse: $el.querySelectorAll('.box__text__reverse'),
            // title: $el.querySelector('.tile__title').innerText,
        }


        this.mainImage = this.$els.el.querySelector('img')
        this.imageTexture = null;
        this.sizes = new THREE.Vector2(0, 0)
        this.offset = new THREE.Vector2(0, 0)

        this.clock = new THREE.Clock()

        this.mouse = new THREE.Vector2(0, 0)

        this.scroll = 0
        this.prevScroll = 0
        this.delta = 0
        this.hasClicked = false
        this.isZoomed = false

        this.loader = new THREE.TextureLoader()
        this.preload(this.mainImage, () => { this.initTile() })
        this.textTranslate = 0;
        this.textSkew = 0;
        this.textReverseTranslate = 0;
        this.imgTranslate = 0;
        // this.preload([this.mainImage.src, this.mainImage.dataset.hover, 'img/shape.jpg'], () => { this.initTile() })

        // this.Scroll = Scrollbar.get(document.querySelector('.scrollarea'))

        this.bindEvent()
    }

    bindEvent() {
        // document.addEventListener('tile:zoom', ({ detail }) => { this.zoom(detail) })


        // window.addEventListener('resize', () => { this.onResize() })
        // window.addEventListener('mousemove', (e) => { this.onMouseMove(e) })

        // this.$els.el.addEventListener('mouseenter', () => { this.onPointerEnter() })
        // this.$els.el.addEventListener('mouseleave', () => { this.onPointerLeave() })
        // this.$els.link.addEventListener('click', (e) => { this.onClick(e) })

        // this.Scroll.addListener((s) => { this.onScroll(s) })

    }

    /* Handlers
    --------------------------------------------------------- */

    onClick(e) {
        // e.preventDefault()

        // if (GOOEY.Layout.isMobile) return

        // if (!this.mesh) return

        // this.hasClicked = true

        // ev('toggleDetail', {
        //     open: true,
        //     target: this,
        // })
    }

    onPointerEnter() {
        this.isHovering = true

        if (this.isZoomed || this.hasClicked || GOOEY.Layout.isMobile) return

        const idx = clamp([...this.$els.el.parentElement.children].indexOf(this.$els.el) + 1, 1, 5)

        if (!this.mesh) return

        TweenMax.to(this.uniforms.u_progressHover, this.duration, {
            value: 1,
            ease: Power2.easeInOut,
        })
    }

    onPointerLeave() {
        if (!this.mesh || this.isZoomed || this.hasClicked || GOOEY.Layout.isMobile) return

        TweenMax.to(this.uniforms.u_progressHover, this.duration, {
            value: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.isHovering = false
            },
        })
    }

    onResize() {
    	this.setSize();
        this.getBounds()

        if (!this.mesh) return

        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    	console.log(this.mesh.scale, this.sizes);
        // this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
        this.mesh.position.x = this.offset.x
        this.mesh.position.y = this.offset.y
    }

    // onScroll({ offset, limit }) {
    //     this.scroll = offset.x / limit.x
    // }

    // onMouseMove(event) {
    //     if (this.isZoomed || this.hasClicked || GOOEY.Layout.isMobile) return

    //     TweenMax.to(this.mouse, 0.5, {
    //         x: event.clientX,
    //         y: event.clientY,
    //     })
    // }


    /* Actions
    --------------------------------------------------------- */

    initTile() {
		let _this = this;
		
		this.setSize();
        this.getBounds()

        this.uniforms = {
	        texture: { value: _this.imageTexture },
	        hasTexture: { value: 1.0 },
	        scale: { value: 0.3 },
	        shift: { value: 0 },
	        opacity: { value: 1 },
	        color: { value: new THREE.Color("white") }
        }

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

        this.material = new THREE.ShaderMaterial({
            vertexShader: `uniform float scale;
		      uniform float shift;
		      varying vec2 vUv;
		      void main() {
		        vec3 pos = position;
		        pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 5.0) * 0.125);
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
		        // vec2 offset = shift / 4.0 * vec2(cos(angle), sin(angle));
		        vec2 offset = vec2(0.0, 0.0);
		        vec4 cr = texture2D(texture, p + offset);
		        vec4 cga = texture2D(texture, p);
		        vec4 cb = texture2D(texture, p - offset);
		        if (hasTexture == 1.0) gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
		        else gl_FragColor = vec4(color, opacity);
		      }`,
		      uniforms: this.uniforms
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.position.x = this.offset.x
        this.mesh.position.y = this.offset.y

        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

        this.scene.scene.add(this.mesh)

        this.mainImage.classList.add('is-loaded')
    }

    move() {
        if (!this.mesh ) return
        this.getBounds()

        TweenMax.to(this.mesh.position,0.1, {
            x: this.offset.x,
            y: this.offset.y,
        })

        
    }
    textTransform() {
    	let _this = this;
    	TweenMax.to(this.$els.text,0.2, {
    		y: this.textTranslate,
    		skewY: this.textSkew
    	}, 1)
    	TweenMax.to(this.$els.textReverse, 0.5, {
    		y: this.textReverseTranslate,
    	})
    	TweenMax.to(this.mainImage, 0.5, {
    		y: this.imgTranslate,
    	})
    }

    update(scrollDelta) {
        // this.delta = Math.abs((this.scroll - this.prevScroll) * 2000)
        // if (!this.mesh) return
        // this.move()
    	this.textTransform();

        this.prevScroll = this.scroll 


    	this.uniforms.shift.value = lerp(this.uniforms.shift.value, scrollDelta / 400, 0.1);
    	if(Math.abs(this.uniforms.shift.value) < 0.00001) {
    		this.uniforms.shift.value = 0;
    	}
		
		this.imgTranslate = lerp(this.imgTranslate, scrollDelta * 5 , 0.1);

    	this.textTranslate = lerp(this.textTranslate, scrollDelta * 2, 0.1);
    	this.textReverseTranslate = Math.abs(lerp(this.textTranslate, -scrollDelta * 3, 0.1));
    	this.textSkew = lerp(this.textSkew, -scrollDelta / 10, 0.1);
    	if(Math.abs(this.imgTranslate) < 0.00001) {
    		this.imgTranslate = 0;
    	}
    	if(Math.abs(this.textTranslate) < 0.00001) {
    		this.textTranslate = 0;
    	}
    	if(Math.abs(this.textSkew) < 0.00001) {
    		this.textSkew = 0;
    	}
    	if(Math.abs(this.textReverseTranslate) < 0.00001) {
    		this.textReverseTranslate = 0;
    	}


    }

    
	setSize() {
		const { width, height, left, top } = this.mainImage.getBoundingClientRect()

        if (!this.sizes.equals(new THREE.Vector2(width, height))) {
            this.sizes.set(width, height)
        }
	}
    getBounds() {
        const { width, height, left, top } = this.mainImage.getBoundingClientRect()

        if (!this.offset.equals(new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
        	// TweenMax.to(this.offset, 0.2, {
        	// 	x: left - window.innerWidth / 2 + width / 2,
        	// 	y: -top + window.innerHeight / 2 - height / 2
        	// })
            this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
        }
    }

    preload($el, allImagesLoadedCallback) {
        const image = this.loader.load($el.src, allImagesLoadedCallback)
        image.center.set(0.5, 0.5)
        this.imageTexture = image;
    }

}
