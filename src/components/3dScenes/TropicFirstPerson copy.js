import React, { Component } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
//
//
const style = {
  height: 600, // we can control scene size by setting container dimensions
};

let raycaster;

// ss

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
    this.controls.dispose();
  }
  /*



  */
  // 1
  sceneSetup = () => {
    //
    // ----------------
    this.objects = [];
    // //----------------
    // //

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;

    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.vertex = new THREE.Vector3();
    this.color = new THREE.Color();
    // background color scene
    // this.lemonChiffon = "rgb(240, 224, 190)";
    //
    //
    // NEW

    //
    //
    //

    const width = this.eleModelBlOne.clientWidth;
    const height = this.eleModelBlOne.clientHeight;
    //

    //
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
      1,
      1000
    );
    this.camera.position.y = 10;
    //
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff);
    //
    this.renderer = new THREE.WebGL1Renderer({
      // set the transparency of the scene, otherwise its black
      // alpha: true,
      // will make the edges smooth
      antialias: true,
    });
    //
    //
    //

    //
    //renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(width, height);
    // BG color from the scene
    // this.renderer.setClearColor(this.lemonChiffon);
    this.renderer.shadowMap.enabled = true;
    // here you append it to the jsx
    this.eleModelBlOne.appendChild(this.renderer.domElement); // mount using React ref
    // test
    this.blocker.appendChild(this.renderer.domElement);
    //
    //
    //
    //---------------------------
    //     PointerLockControl
    //---------------------------
    // this.controls = new PointerLockControls(this.camera, this.eleModelBlOne);
    this.controls = new PointerLockControls(this.camera, this.eleModelBlOne);
    // Create First Person Controls
    this.scene.add(this.controls.getObject());
    //
    //
    // If i change this to a function () {} it will give me an error
    // vasilis say:
    // this.eleModelBlOne.addEventListener("click", () => {
    //   this.controls.lock();
    // });
    this.eleModelBlOne.addEventListener("click", () => {
      this.controls.lock();
      // it gives you access to raw mouse movement.LOCKS
      // the target of the mouse events to a single element ,
      // eliminates limits on how far mouse movement can go in a single direction,
      // and removes the cursor from view. Good for 1 person 3d games
      // ***
      // So when you are actually moving the mouse across the screen (without displacing,)
      // the pointer has been LOCK to the canvas
      console.log("I clicked");
    });
    //

    this.controls.addEventListener("lock", () => {
      this.eleModelBlOne.style.display = "none";
    });
    //

    this.controls.addEventListener("unlock", () => {
      this.eleModelBlOne.style.display = "block";
    });
    // //

    //
    //
    //
    //
    //-------------------------------
    //             KEYS
    //-------------------------------
    //
    //

    //
    //
    //
    this.onKeyDown = function (event) {
      //event.preventDefault();

      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = true;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = true;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = true;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = true;
          break;

        case "KeyR":
          this.moveUp = true;
          break;
        case "KeyF":
          this.moveDown = true;
          break;
      }
    };

    this.onKeyUp = function (event) {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = false;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = false;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = false;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = false;
          break;

        case "KeyR":
          this.moveUp = false;
          break;
        case "KeyF":
          this.moveDown = false;
          break;
      }
    };
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    //
    //
    //
    //
    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      10
    );
    //
    //
    //
    //
  };
  //

  /*






  */
  // 2
  addCustomSceneObjects = () => {
    //-------------------------------
    //
    //
    // ---------------
    // floor Geometry
    // ---------------

    this.floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    this.floorGeometry.rotateX(-Math.PI / 2);
    //
    //-------------------
    // vertex displacement
    //-------------------
    //
    let position = this.floorGeometry.attributes.position;
    //
    for (let i = 0, l = position.count; i < l; i++) {
      this.vertex.fromBufferAttribute(position, i);
      this.vertex.x += Math.random() * 20 - 10;
      this.vertex.y += Math.random() * 2;
      this.vertex.z += Math.random() * 20 - 10;
      position.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
    }
    // ensure each face has unique vertices  **
    this.floorGeometry = this.floorGeometry.toNonIndexed();
    //
    position = this.floorGeometry.attributes.position;
    //
    //--------------
    // colorsFloor
    //--------------
    const colorsFloor = [];
    //
    // what makes the triangles of the floor have different colors
    for (let i = 0, l = position.count; i < l; i++) {
      // here you are generating random colors HSL
      this.color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      colorsFloor.push(this.color.r, this.color.g, this.color.b);
    }
    //
    this.floorGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsFloor, 3)
    );
    //
    //
    this.floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    //
    //
    // ------------ Here you add to the scene all the ABOVE -----
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.scene.add(this.floor);
    //
    //
    // ---------
    // BOXES GEOMETRY
    // ---------
    // .toNonIndexed();  ensure each face has unique vertices
    this.boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
    //
    position = this.boxGeometry.attributes.position;
    //--------------
    // colors Box
    //--------------
    const colorsBox = [];
    //
    for (let i = 0, l = position.count; i < l; i++) {
      this.color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      colorsBox.push(this.color.r, this.color.g, this.color.b);
    }
    //
    this.boxGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsBox, 3)
    );
    //
    // the 500 correspond to the amount of boxes
    // the material is MeshPhong, apparently its a good material to cast shadows
    for (let i = 0; i < 500; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        flatShading: true,
        vertexColors: true,
        // push a colour per vertex
      });
      boxMaterial.color.setHSL(
        Math.random() * 0.2 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      // ---------
      // BOX
      // ---------
      const box = new THREE.Mesh(this.boxGeometry, boxMaterial);
      box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
      box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

      this.scene.add(box);
      this.objects.push(box);
    }
    //
    //
    //
    //
    //
    //----------------------------------
    //         BLENDER  MODELS
    //----------------------------------
    //

    /*
    
    
    
    
    
    
    */
    //---------------------
    //   Directional Light
    //---------------------
    //
    // //
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.gammaFactor = 2.2;

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(5, -1, 100);

    // position as follow , the light comes from x:-1000, comes from: y and the last comes from : z
    directionalLight.position.set(1000, 1000, 1000);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera = new THREE.OrthographicCamera(
      -100,
      200,
      -200,
      200,
      0.5,
      5000
    );
    // //
    this.scene.add(directionalLight);
    // The light points to the flat ground
    // this.directionalLight.target = this.plane;  //dont add this
    //
    //
    //THIS LIGHT IS ON THE BOTTOM
    //---------------------
    //     spotLight FF5733
    //---------------------
    //
    //
    //
    //
    // With the light you can see the colors you added to each geometry in the materials
    this.spotLight = new THREE.SpotLight(0xffffff, 0.5); //intensity:   0.5);
    // spotLight.position.set( 0 , 10 , 0 );
    this.spotLight.position.set(5, -50, 0); //x, y , z   original (5, -50, 0);
    // (2, 32, 32); with this settings the light will be on the front
    this.spotLight.castShadow = true;
    //
    // this will remove the shadows
    this.spotLight.visible = true;
    //
    this.scene.add(this.spotLight);
    // //
    //
    //
  };

  /*
  
  
  
  
  
  
  
  
  */

  // 3
  startAnimationLoop = () => {
    //
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);

    // Save the current time
    this.time = performance.now();
    //// Are the controls enabled? (Does the browser have pointer lock?)
    if (this.controls.isLocked === true) {
      //
      this.raycaster.ray.origin.copy(this.controls.getObject().position);
      // A ray that emits from an origin in a certain direction.
      this.raycaster.ray.origin.y -= 10;

      this.intersections = this.raycaster.intersectObjects(this.objects);

      this.onObject = this.intersections.length > 0;
      // Create a delta value based on current time
      this.delta = (this.time - this.prevTime) / 1000;
      //
      //
      //
      // Set the velocity.x and velocity.z using the calculated time delta
      this.velocity.x -= this.velocity.x * 10.0 * this.delta;
      this.velocity.z -= this.velocity.z * 10.0 * this.delta;
      // As velocity.y is our "gravity," calculate delta
      this.velocity.y -= 9.8 * 100.0 * this.delta; // 100.0 = mass
      //

      //
      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward)
        this.velocity.z -= this.direction.z * 400.0 * this.delta;
      if (this.moveLeft || this.moveRight)
        this.velocity.x -= this.direction.x * 400.0 * this.delta;
      // ------------------- //

      //              *****
      //              new
      // if (this.controls.moveForward) {
      //   this.velocity.z -= 400.0 * this.delta;
      // }

      // if (this.controls.moveBackward) {
      //   this.velocity.z += 400.0 * this.delta;
      // }

      // if (this.controls.moveLeft) {
      //   this.velocity.x -= 400.0 * this.delta;
      // }

      // if (this.controls.moveRight) {
      //   this.velocity.x += 400.0 * this.delta;
      // }
      // ---------------------------------------

      //
      //              *****
      //

      //
      if (this.onObject === true) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;
      }

      this.controls.moveRight(-this.velocity.x * this.delta);
      this.controls.moveForward(-this.velocity.z * this.delta);
      this.controls.getObject().position.y += this.velocity.y * this.delta; // new behavior
      //
      //
      // Prevent the camera/player from falling out of the 'world'
      if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;

        this.canJump = true;
      }
    }
    //
    //
    this.prevTime = this.time;

    //
    this.renderer.render(this.scene, this.camera);
  };

  /*



  */
  handleWindowResize = () => {
    const width = this.eleModelBlOne.clientWidth;
    const height = this.eleModelBlOne.clientHeight;
    //
    // updated renderer
    this.renderer.setSize(width, height);
    // updated **camera** aspect ratio
    this.camera.aspect = width / height;
    // That is the Three.js optimization: you can group multiple camera changes into a block with only one
    this.camera.updateProjectionMatrix();
  };
  /*


  */
  render() {
    return (
      <div className="scene-oblivion">
        <div className="blocker" ref={(ref) => (this.blocker = ref)}>
          {/* --------------------- */}
          {/* --------------------- */}
          {/* --------------------- */}
          <div
            className="modelBleOne"
            style={style}
            ref={(ref) => (this.eleModelBlOne = ref)}
          >
            <div className="commands">
              <span>Click to play</span>
              <br />
              <br />
              Move: WASD
              <br />
              Jump: SPACE
              <br />
              Look: MOUSE
            </div>
          </div>
          {/* --------------------- */}
          {/* --------------------- */}
        </div>
        {/* --------------------- */}
      </div>
    );
  }
}

export default TropicalVoid;

/*



// PHONE Portrait & Landscape
@media screen and(min-width: 320px) and(max-width:480px) {
}
// ---------------
// PHONE Portrait (all big mobile versions)
@media screen and(min-width: 320px) {
  .container-section-scene-home {
    padding: 5em 0em 0 0em;
    display: grid;
    grid-gap: 0em;
    grid-template-columns: repeat(auto-fit, minmax(260px));
    background-color: #f7f7f7; //
    //-----------------------------
    // SECTION IMAGE WHITE AND FLAG
    //
    .scene-threejs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      .wrapper-flag-scene-threejs {
        width: 80vw;
        // ---------------------
        .wrapper-scene-oblivion {
          background-color: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;

          .scene-oblivion {
            width: 100%;
            height: 80vh;
            max-width: 1000px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            //
            position: relative;
            .blocker {
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              .modelBleOne {
                width: 100%;
                height: 100%;
                margin: 0;
                text-align: center;
                max-width: 800px;
                overflow: hidden;
                position: absolute;
                background: rgba(255, 0, 0, 0.527);
                //
                //
                cursor: pointer;
              }
            }
          }
        }
        // -----------------
        // -----------------
        // -----------------
        // -----------------
        .scene-description-home {
          background-color: #f7f7f7;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          .wrapper-scene-description-home {
            padding: 15vh 0 10vh 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            .h3-text-img-home {
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              color: #131313;
              font-size: 2.8vh;
              text-align: right;
            }
            p {
              width: 80%;
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              // color: #eeedeb;
              color: #131313;
              font-size: 2.8vh;
              text-align: left;
              letter-spacing: 2px;
            }
          }
        }
      }
      // -------------------------------
      // -------------------------------
    }
  }
}
// ---------------
// PHONE Landscape (100% content, really small devices)
// ---------------
@media screen and(max-width: 480px) {
  .container-section-scene-home {
    padding: 5em 0em 0 0em;
    display: grid;
    grid-gap: 0em;
    grid-template-columns: repeat(auto-fit, minmax(260px));
    background-color: #f7f7f7; //
    //-----------------------------
    // SECTION IMAGE WHITE AND FLAG
    //
    .scene-threejs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      .wrapper-flag-scene-threejs {
        width: 80vw;

        // ---------------------
        .wrapper-scene-oblivion {
          background-color: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;
          .scene-oblivion {
            width: 100%;
            height: 80vh;
            max-width: 1000px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            .modelBleOne {
              width: 100%;
              height: 100%;
              margin: 0;
              text-align: center;
              max-width: 800px;
              overflow: hidden;
            }
          }
        }
        // -----------------
        // -----------------
        // -----------------
        // -----------------
        .scene-description-home {
          // background-color: #eeedeb;
          background-color: #f7f7f7;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          .wrapper-scene-description-home {
            padding: 15vh 0 10vh 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            .h3-text-img-home {
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              color: #131313;
              font-size: 2.6vh;
              text-align: right;
            }
            p {
              width: 80%;
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              // color: #eeedeb;
              color: #131313;
              font-size: 2.4vh;
              text-align: left;
              letter-spacing: 2px;
            }
          }
        }
      }
      // -------------------------------
      // -------------------------------
    }
  }
}
// ---------------
// ---------------
//
// TABLET Portrait & Landscape
@media screen and(min-width: 768px) and(max-width:1024px) {
}

// ---------------
// TABLET Portrait
@media screen and(min-width: 768px) {
}
// ---------------
// TABLET Landscape
@media screen and(min-width:1024px) {
}

// ---------------
// ---------------
// Desktop
@media screen and(min-width:1224px) {
  .container-section-scene-home {
    padding: 5em 0em 0 0em;
    display: grid;
    grid-gap: 0em;
    grid-template-columns: repeat(auto-fit, minmax(260px));
    background-color: #f7f7f7; //
    //-----------------------------
    // SECTION IMAGE WHITE AND FLAG
    //
    .scene-threejs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      .wrapper-flag-scene-threejs {
        width: 80vw;

        // ---------------------
        .wrapper-scene-oblivion {
          background-color: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;

          .scene-oblivion {
            width: 100%;
            height: 80vh;
            max-width: 1000px;
            overflow: hidden;

            display: flex;
            align-items: center;
            justify-content: center;

            .blocker {
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              .modelBleOne {
                width: 100%;
                height: 100%;
                margin: 0;
                text-align: center;
                max-width: 1000px;
                overflow: hidden;
                position: absolute;
                background: rgba(255, 0, 0, 0.527);

                display: flex;
                align-items: center;
                justify-content: center;
                //
                //
                cursor: pointer;
              }
            }
          }
        }
        // -----------------
        // -----------------
        // -----------------
        // -----------------
        .scene-description-home {
          background-color: #f7f7f7;
          // background-color: #eeedeb;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          .wrapper-scene-description-home {
            padding: 15vh 0 10vh 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            .h3-text-img-home {
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              color: #131313;
              font-size: 2.8vh;
              text-align: right;
            }
            p {
              width: 70%;
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              // color: #eeedeb;
              color: #131313;
              font-size: 2.8vh;
              text-align: left;
              letter-spacing: 2px;
            }
          }
        }
      }
      // -------------------------------
      // -------------------------------
    }
  }
}
// ---------------
// LARGE Desktop
@media screen and(min-width:1824px) {
  .container-section-scene-home {
    padding: 5em 0em 0 0em;
    display: grid;
    grid-gap: 0em;
    grid-template-columns: repeat(auto-fit, minmax(260px));
    background-color: #f7f7f7; //
    //-----------------------------
    // SECTION IMAGE WHITE AND FLAG
    //
    .scene-threejs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      .wrapper-flag-scene-threejs {
        width: 80vw;

        // ---------------------
        .wrapper-scene-oblivion {
          background-color: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;

          .scene-oblivion {
            width: 100%;
            height: 80vh;
            max-width: 1400px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            .modelBleOne {
              width: 100%;
              height: 100%;
              margin: 0;
              text-align: center;
              max-width: 1300px;
              overflow: hidden;
            }
          }
        }
        // -----------------
        // -----------------
        // -----------------
        // -----------------
        .scene-description-home {
          padding: 0vh 2vw 0vh 2vw;
          // background-color: #eeedeb;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .wrapper-scene-description-home {
            padding: 15vh 0 10vh 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            .h3-text-img-home {
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              color: #131313;
              font-size: 2.8vh;
              text-align: right;
            }
            p {
              width: 70%;
              margin: 0 1vh 0 1vh;
              text-transform: uppercase;
              font-family: "Ubuntu-Regular";
              // color: #eeedeb;
              color: #131313;
              font-size: 2.8vh;
              text-align: left;
              letter-spacing: 2px;
            }
          }
        }
      }
      // -------------------------------
      // -------------------------------
    }
  }
}





*/
