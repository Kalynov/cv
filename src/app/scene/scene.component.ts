import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { About } from '../objects/about/about';
import { Text3D } from '../objects/text3D/text3D';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef | undefined;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  cameraTarget!: THREE.Vector3;
  materials!: THREE.MeshPhongMaterial[];
  group: any;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof SceneComponent
   */
   private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000)

    //*Camera
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 2000 );
    this.camera.position.set( 0, 300, 1900 );
		this.cameraTarget = new THREE.Vector3( 0, 150, 150 );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    dirLight.position.set( 0, 1, 0 );
    this.scene.add( dirLight );

    const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.color.setHSL( Math.random(), 1, 0.5 );
    pointLight.position.set( 0, 400, 110 );
    this.scene.add( pointLight );

    this.materials = [
      new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
      new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];

    this.group = new THREE.Group();
    this.group.position.y = 100;

    this.scene.add( this.group );

    let about = new About();

    about.loadFont().then((mesh) => {
      if (mesh != null) {
        this.group.add( mesh );
      }
    })


    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: this.canvas } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    let component: SceneComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.camera.lookAt( component.cameraTarget );
      component.renderer.clear();
      component.renderer.render(component.scene, component.camera);
    }());

  }

  ngAfterViewInit() {
    this.createScene();
  }

}
