import * as THREE from "three";
import { TextGeometry, TextGeometryParameters } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export class Text3D  {

    private font!: TextGeometryParameters['font'] ;
    public texture: string = "/assets/texture.jpg";
    private fontName = 'optimer' ;
    private fontWeight =  'bold'; 
    private textGeo?: TextGeometry;
    textMesh1: THREE.Mesh<any, any> | undefined;
    height = 5;
    curveSegments = 4;
    bevelThickness = 2;
    bevelSize= 1.5;
    bevelEnabled = true;
    size = 25;
    text: string;
    hover = 1;
    private loader = new THREE.TextureLoader();
    private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });


    
    constructor(text: string) {
        this.text = text;
    }

    loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new FontLoader();
            loader.load( 'assets/fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json', ( response: TextGeometryParameters["font"] ) => {
                this.font = response;
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
                if (this.textGeo.boundingBox && this.textGeo.boundingBox) {
                    const centerOffset = - 0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );

                    this.textMesh1 = new THREE.Mesh( this.textGeo, this.material );

                    this.textMesh1.position.x = centerOffset;
                    this.textMesh1.position.y = this.hover;
                    this.textMesh1.position.z = 0;

                    this.textMesh1.rotation.x = 0;
                    this.textMesh1.rotation.y = Math.PI * 2;
                    resolve(this.textMesh1)
                }
                reject(null);
            });
        })
        
    }
    
}
