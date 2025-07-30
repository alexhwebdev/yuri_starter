import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import {Fn, vec4} from "three/tsl"


export default class Sketch {
  constructor(options) {
    this.container = options.dom
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xeeeeee, 1)
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000)
    this.camera.position.set(0, 0, 2)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.time = 0
    this.isPlaying = true

    const THREE_PATH = `https://unpkg.com/three@${THREE.REVISION}/build/three.module.js`
    this.dracoLoader = new DRACOLoader( new THREE.LoadingManager() ).setDecoderPath(`${THREE_PATH}/examples/jsm/libs/draco/gltf/`);
    this.glTFLoader = new GLTFLoader()
    this.glTFLoader.setDRACOLoader(this.dracoLoader)
    this.addObjects()
    this.setupResize()
    this.render()
  }
  setUpSettings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.01).onChange((val) => {})
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4(this.width, this.height, 1, 1) }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: false
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

  render() {
    if (!this.isPlaying) return
    this.time += 0.05
    this.material.uniforms.time.value = this.time

    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({
  dom: document.getElementById('container')
})
