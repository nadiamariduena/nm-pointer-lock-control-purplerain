import React, { Component } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
//
//

/*






  */
class TropicalVoid extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    //
    window.addEventListener("resize", this.handleWindowResize);
  }
  //
  //
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    // right now with the first person control,
    // we dont need this dispose as it s already included inside the three folder, check the read me, in the
    // beginning you will find a copy of the code inside the threejs that I am using.
    // this.controls.dispose();
  }
  /*



  */
  // 1
  sceneSetup = () => {
    this.scene = new THREE.Scene();

    this.light = new THREE.AmbientLight();
    this.scene.add(this.light);

    // ---------------
    // Create a camera
    // ---------------
    //
    // 	Set a Field of View (FOV) of 75 degrees
    // 	Set an Apsect Ratio of the inner width divided by the inner height of the window
    //	Set the 'Near' distance at which the camera will start rendering scene objects to 2
    //	Set the 'Far' (draw distance) at which objects will not be rendered to 1000
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    //
    //
    this.renderer = new THREE.WebGL1Renderer({
      // set the transparency of the scene, otherwise its black
      // alpha: true,
      // will make the edges smooth
      antialias: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //
    this.cameraControlsFirstPerson = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );

    //
    //
    //

    document.body.appendChild(this.renderer.domElement);
    //
    //
    const menuPanel = document.getElementById("menuPanel");
    const startButton = document.getElementById("startButton");
    startButton.addEventListener(
      "click",
      () => {
        this.controls.lock();
      },
      false
    );
    //
    //
    this.controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    //controls.addEventListener('change', () => console.log("Controls Change"))
    this.controls.addEventListener(
      "lock",
      () => (menuPanel.style.display = "none")
    );
    this.controls.addEventListener(
      "unlock",
      () => (menuPanel.style.display = "block")
    );

    //
    //
    //
  };
  //

  /*






  */
  // 2
  addCustomSceneObjects = () => {
    //
    // ---------------------
    //      FLOOR
    // ---------------------
    this.planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    this.plane = new THREE.Mesh(this.planeGeometry, this.material);
    this.plane.rotateX(-Math.PI / 2);
    this.scene.add(this.plane);
    //
    //
    // -------------------
    //    BUILDINGS cubes
    // -------------------

    this.camera.position.y = 1;
    this.camera.position.z = 2;

    //
    const onKeyDown = (event) => {
      switch (event.keyCode) {
        case 87: // w
          this.controls.moveForward(0.25);
          break;
        case 65: // a
          this.controls.moveRight(-0.25);
          break;
        case 83: // s
          this.controls.moveForward(-0.25);
          break;
        case 68: // d
          this.controls.moveRight(0.25);
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown, false);
    //
  };

  /*
  
  
  
  
  
  
  
  
  */

  // 3
  startAnimationLoop = () => {
    //
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    this.renderer.render(this.scene, this.camera);
  };
  /*








  */
  handleWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  /*


  */
  render() {
    return (
      <React.Fragment>
        <div id="menuPanel">
          <button id="startButton">Click to Start</button>
        </div>
      </React.Fragment>
    );
  }
}

export default TropicalVoid;

/*


.bodytesto {
  width: 100vw;
  height: 100vh;

  #menuPanel {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    #startButton {
      height: 50px;
      width: 200px;
      margin: -25px -100px;
      position: relative;
      top: 50%;
      left: 50%;
      font-size: 32px;
      //
      //
      cursor: pointer;
    }
  }
}





*/
