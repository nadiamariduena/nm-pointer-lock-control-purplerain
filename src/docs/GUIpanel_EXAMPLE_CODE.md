```javascript
//
// https://threejs.org/examples/?q=subd#webgl_modifier_subdivision

/*
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js webgl - modifier - Subdivisions using Loop Subdivision Scheme</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<link type="text/css" rel="stylesheet" href="main.css">
		<style>
			body {
				background-color: #f0f0f0;
				color: #444;
			}
			a {
				color: #08f;
			}
		</style>
	</head>
	<body>
		<div id="info">
			<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - subdivision modifier<br/ >
			Original Geometry: <span id="original-vertex-count"></span> vertices and <span id="original-face-count"></span> faces<br/ >
			Smooth Geometry: <span id="smooth-vertex-count"></span> vertices and <span id="smooth-face-count"></span> faces<br/ >
		</div>

		<script type="module">

			import * as THREE from '../build/three.module.js';

			import Stats from './jsm/libs/stats.module.js';

			import { GUI } from './jsm/libs/dat.gui.module.js';
			import { OrbitControls } from './jsm/controls/OrbitControls.js';
			import { SubdivisionModifier } from './jsm/modifiers/SubdivisionModifier.js';

			let camera, scene, renderer, stats, smoothMesh, wireframe;

			const smoothMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: true } );
			const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, opacity: 0.15, transparent: true } );

			const faceIndices = [ 'a', 'b', 'c' ];

			const params = {
				subdivisions: 2
			};

			init();

			function init() {

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 500 );
				camera.position.z = 100;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );

				const light = new THREE.PointLight( 0xffffff, 1.5 );
				light.position.set( 1000, 1000, 2000 );
				scene.add( light );

				const loader = new THREE.BufferGeometryLoader();
				loader.load( 'models/json/WaltHeadLo_buffergeometry.json', function ( bufferGeometry ) {

					// converting to legacy THREE.Geometry because SubdivisionModifier only returns THREE.Geometry

					const geometry = new THREE.Geometry().fromBufferGeometry( bufferGeometry );
					geometry.mergeVertices();

					const material = new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe: true } );
					const mesh = new THREE.Mesh( bufferGeometry, material );
					scene.add( mesh );

					const gui = new GUI();

					gui.add( params, 'subdivisions', 0, 3 ).step( 1 ).onChange( function ( subdivisions ) {

						subdivide( geometry, subdivisions );

					} );

					//

					subdivide( geometry, params.subdivisions );
					animate();

				} );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				stats = new Stats();
				document.body.appendChild( stats.dom );

				//

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 50;
				controls.maxDistance = 400;

				window.addEventListener( 'resize', onWindowResize, false );

				//

				smoothMesh = new THREE.Mesh( undefined, smoothMaterial );
				wireframe = new THREE.Mesh( undefined, wireframeMaterial );
				scene.add( smoothMesh, wireframe );

			}

			function subdivide( geometry, subdivisions ) {

				const modifier = new SubdivisionModifier( subdivisions );

				const smoothGeometry = modifier.modify( geometry );

				// colorify faces

				for ( let i = 0; i < smoothGeometry.faces.length; i ++ ) {

					const face = smoothGeometry.faces[ i ];

					for ( let j = 0; j < 3; j ++ ) {

						const vertexIndex = face[ faceIndices[ j ] ];
						const vertex = smoothGeometry.vertices[ vertexIndex ];

						const hue = ( vertex.y / 200 ) + 0.5;
						const color = new THREE.Color().setHSL( hue, 1, 0.5 );
						face.vertexColors[ j ] = color;

					}

				}

				// convert to THREE.BufferGeometry

				if ( smoothMesh.geometry ) smoothMesh.geometry.dispose();

				smoothMesh.geometry = new THREE.BufferGeometry().fromGeometry( smoothGeometry );
				wireframe.geometry = smoothMesh.geometry;

				//

				updateUI( geometry, smoothGeometry );

			}

			function updateUI( originalGeometry, smoothGeometry ) {

				document.getElementById( 'original-vertex-count' ).textContent = originalGeometry.vertices.length;
				document.getElementById( 'original-face-count' ).textContent = originalGeometry.faces.length;

				document.getElementById( 'smooth-vertex-count' ).textContent = smoothGeometry.vertices.length;
				document.getElementById( 'smooth-face-count' ).textContent = smoothGeometry.faces.length;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				renderer.render( scene, camera );

			}

		</script>

	</body>
</html>
*/
```
