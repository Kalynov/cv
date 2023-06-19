import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry, TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from "three";

type TFont = {
  [key: string]: string; 
}

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})

export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef | undefined;

  //* Cube Properties

  @Input() public rotationSpeedX: number = 0.01;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 200;

  @Input() public texture: string = "/assets/texture.jpg";


  //* Stage Properties

  @Input() public cameraZ: number = 400;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;
  textGeo: any;
  height = 100;
  curveSegments = 4;
  bevelThickness = 2;
  bevelSize= 1.5;
  bevelEnabled = true;
  text = "this is my CV";
  textMesh1!: THREE.Mesh<any, any>;
  group: any;
  hover = 1;
  cameraTarget!: THREE.Vector3;
  materials!: THREE.MeshPhongMaterial[];

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(2, 2, 2);
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;
  private font!: TextGeometryParameters['font'] ;

  private fontName = 'optimer' ;
  private fontWeight =  'bold';

  /**
   *Animate the cube
   *
   * @private
   * @memberof CubeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000)
    this.scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

    //*Camera
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
    this.camera.position.set( 0, 400, 700 );
		this.cameraTarget = new THREE.Vector3( 0, 150, 0 );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
				dirLight.position.set( 0, 0, 1 ).normalize();
				this.scene.add( dirLight );

				const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
				pointLight.color.setHSL( Math.random(), 1, 0.5 );
				pointLight.position.set( 0, 100, 90 );
				this.scene.add( pointLight );

				this.materials = [
					new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
					new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
				];

    this.group = new THREE.Group();
    this.group.position.y = 100;

    this.scene.add( this.group );

    this.loadFont();

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry( 10000, 10000 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    );
    plane.position.y = 100;
    plane.rotation.x = - Math.PI / 2;
    this.scene.add( plane );


    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: this.canvas } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    let component: CubeComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.camera.lookAt( component.cameraTarget );
      component.renderer.clear();
      component.renderer.render(component.scene, component.camera);
    }());

  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof CubeComponent
 */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  createText() {

    this.textGeo = new TextGeometry( this.text, {
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelEnabled: this.bevelEnabled

    } );

    this.textGeo.computeBoundingBox();

    const centerOffset = - 0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );

    this.textMesh1 = new THREE.Mesh( this.textGeo, this.material );

    this.textMesh1.position.x = centerOffset;
    this.textMesh1.position.y = this.hover;
    this.textMesh1.position.z = 0;

    this.textMesh1.rotation.x = 0;
    this.textMesh1.rotation.y = Math.PI * 2;

    this.group.add( this.textMesh1 );

  }

  refreshText() {

    this.group.remove( this.textMesh1 );

    if ( ! this.text ) return;

    this.createText();

  }

  

  private loadFont() {

    const loader = new FontLoader();
    loader.load( 'assets/fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json', ( response: TextGeometryParameters["font"] ) => {

      this.font = response;

      this.refreshText();

    } );

  }

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    //this.startRenderingLoop();
  }

}