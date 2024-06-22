import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { log } from "three/examples/jsm/nodes/Nodes.js";

const colorCombinations = [
	// { front: 0xff77ff, back: 0x77ff77 }, // Light Magenta and Light Green
	{ front: 0x8a2be2, back: 0x7fff00 }, // Chartreuse and Blue Violet
	{ front: 0xfa5096, back: 0x4ffa58 },
	{ front: 0xfa5837, back: 0x38fab0 },
	{ front: 0x546cba, back: 0xfac432 },
];

/* SECTION - Scene Setup */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

let visibleHeight = 0;
let visibleWidth = 0;

let windowResized = false;
/* window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height; // for Perspective camera
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// Update visible height and width
	visibleHeight = getVisibleHeightAtZDepth(0, camera);
	visibleWidth = getVisibleWidthAtZDepth(0, camera);
	console.log(visibleHeight, visibleWidth);

	windowResized = true;
}); */

/* window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		console.log("go full");
		renderer.domElement.requestFullscreen();
	} else {
		console.log("leave full");
		document.exitFullscreen();
	}
}); */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 10, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera);

/* const aspectRatio = sizes.width / sizes.height;
const fov = 6;
const camera = new THREE.OrthographicCamera(
	-fov * aspectRatio,
	fov * aspectRatio,
	fov,
	-fov,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera); */

/* // Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; */

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*!SECTION */

/* SECTION: Utility Functions */

const getVisibleHeightAtZDepth = (depth, camera) => {
	// compensate for cameras not positioned at z=0
	const cameraOffset = camera.position.z;
	if (depth < cameraOffset) depth -= cameraOffset;
	else depth += cameraOffset;

	// vertical fov in radians
	const vFOV = (camera.fov * Math.PI) / 180;

	// Math.abs to ensure the result is always positive
	return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const getVisibleWidthAtZDepth = (depth, camera) => {
	const height = getVisibleHeightAtZDepth(depth, camera);
	return height * camera.aspect;
};
/*!SECTION */

/* SECTION - Objects */

visibleHeight = getVisibleHeightAtZDepth(0, camera);
visibleWidth = getVisibleWidthAtZDepth(0, camera);
console.log(visibleHeight, visibleWidth);

const geometry = new THREE.IcosahedronGeometry(1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cubeRight = new THREE.Mesh(geometry, material);
const cubeLeft = new THREE.Mesh(geometry, material);
cubeRight.visible = false;
cubeLeft.visible = false;
scene.add(cubeRight);
scene.add(cubeLeft);

const mergedGeometry = new THREE.IcosahedronGeometry(1.26, 1);
const mergedMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
const mergedMesh = new THREE.Mesh(mergedGeometry, mergedMaterial);
// scene.add(mergedMesh);

const particlesGeometryRight = new THREE.BufferGeometry();
const particlesGeometryLeft = new THREE.BufferGeometry();
const particlesCount = 200;
const posArrayRight = new Float32Array(particlesCount * 3);
const posArrayLeft = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
	posArrayRight[i] = (Math.random() - 0.5) * 4 + cubeRight.position.x;
	posArrayRight[i + 1] = (Math.random() - 0.5) * 4 + cubeRight.position.y;
	posArrayRight[i + 2] = (Math.random() - 0.5) * 4 + cubeRight.position.z;

	posArrayLeft[i] = (Math.random() - 0.5) * 4 + cubeLeft.position.x;
	posArrayLeft[i + 1] = (Math.random() - 0.5) * 4 + cubeLeft.position.y;
	posArrayLeft[i + 2] = (Math.random() - 0.5) * 4 + cubeLeft.position.z;
}

particlesGeometryRight.setAttribute(
	"position",
	new THREE.BufferAttribute(posArrayRight, 3)
);
particlesGeometryLeft.setAttribute(
	"position",
	new THREE.BufferAttribute(posArrayLeft, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
	size: 0.01,
	color: 0xffffff,
});

const particlesMeshRight = new THREE.Points(
	particlesGeometryRight,
	particlesMaterial
);
const particlesMeshLeft = new THREE.Points(
	particlesGeometryLeft,
	particlesMaterial
);

cubeRight.add(particlesMeshRight);
cubeLeft.add(particlesMeshLeft);

const geometries = [];
const count = 50;
for (let i = 0; i < count; i++) {
	if (Math.random() > 0.5) {
		geometries.push(new THREE.IcosahedronGeometry(0.15));
	} else {
		geometries.push(new THREE.ConeGeometry(0.15, 0.15, 3));
	}
}

const materials = [];

for (let i = 0; i < 10; i++) {
	const red = Math.random() * 1;
	const green = Math.random() * 1;
	const blue = Math.random() * 1;

	// Adjust for lighter pastel range (reduce saturation and increase lightness)
	const pastelRed = ((red + 1) % 2) * red * 0.5 + 0.3;
	const pastelGreen = ((green + 1) % 2) * green * 0.5 + 0.3;
	const pastelBlue = ((blue + 1) % 2) * blue * 0.5 + 0.3;

	const color = new THREE.Color(pastelRed, pastelGreen, pastelBlue);
	materials.push(new THREE.MeshPhongMaterial({ color: color }));
}

let objects = [];

geometries.forEach((geometry, index) => {
	const mesh = new THREE.Mesh(geometry, materials[index % 10]);
	mesh.position.x = (Math.random() - 0.5) * 5; // Random x position within -10 to 10
	mesh.position.y = (Math.random() - 0.5) * 5; // Random y position within -10 to 10
	mesh.position.z = (Math.random() - 0.5) * 5; // Random z position within -10 to 10

	objects.push(mesh);

	/* Add half objects for clockwise, and other half for counterclockwise */
	if (index % 2 === 0) {
		cubeRight.add(mesh);
	} else {
		cubeLeft.add(mesh);
	}
});

/*!SECTION */

/* SECTION - Render */

let listener;

function firstRender() {
	// listener = new THREE.AudioListener();
	// camera.add(listener);
	// render();
	animate();
}

/* document.getElementById("startButton").addEventListener("click", (event) => {
	document.getElementById("startScreen").remove();
	// create an AudioListener and add it to the camera
	

	// create a global audio source
	// sound = new THREE.Audio(listener);

	// load a sound and set it as the Audio object's buffer
	// const audioLoader = new THREE.AudioLoader();
	// audioLoader.load("sounds/page-flip.mp3", function (buffer) {
	// 	circles.forEach((circle) => {
	// 		const sound = new THREE.Audio(listener);
	// 		sound.setBuffer(buffer);
	// 		sound.setVolume(0.5);
	// 		circle.add(sound);
	// 	});
	// });
}); */

let circles = [];
let colors =
	colorCombinations[Math.floor(Math.random() * colorCombinations.length)];

function render() {
	circles.forEach((circle) => {
		scene.remove(circle);
		circle.geometry.dispose();
		circle.material.dispose();
		log;
	});
	circles = [];

	const circleRadius = 0.19;
	const circleDiameter = circleRadius * 2;
	const numCirclesWide = Math.floor(visibleWidth / circleDiameter);
	const numCirclesHigh = Math.floor(visibleHeight / circleDiameter);

	// Calculate excess space and spacing between circles
	const totalCircleWidth = numCirclesWide * circleDiameter;
	const excessWidth = visibleWidth - totalCircleWidth;
	const spacingX = excessWidth / (numCirclesWide + 1);

	const totalCircleHeight = numCirclesHigh * circleDiameter;
	const excessHeight = visibleHeight - totalCircleHeight;
	const spacingY = excessHeight / (numCirclesHigh + 1);

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load("sounds/page-flip.mp3", function (buffer) {
		for (let i = 0; i < numCirclesWide; i++) {
			for (let j = 0; j < numCirclesHigh; j++) {
				const geometry = new THREE.CircleGeometry(circleRadius, 32);
				const color = colors.front;
				const material = new THREE.MeshBasicMaterial({
					color: color,
					side: THREE.DoubleSide,
				});
				// const materials = [
				// 	new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red material
				// 	new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green material
				// ];

				const circle = new THREE.Mesh(geometry, material);
				circle.position.x =
					i * (circleDiameter + spacingX) +
					spacingX +
					circleRadius -
					visibleWidth / 2;
				circle.position.y =
					j * (circleDiameter + spacingY) +
					spacingY +
					circleRadius -
					visibleHeight / 2;
				const sound = new THREE.Audio(listener);
				sound.setBuffer(buffer);
				sound.setVolume(0.5);
				circle.add(sound);
				scene.add(circle);
				circles.push(circle);
			}
		}
	});
	renderer.render(scene, camera);
	animate();
}

// let sound;

/*!SECTION */

/* SECTION - Animation */

let mergerHappening = false;
let mergerStarted = false;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const canVibrate = window.navigator.vibrate;

function flip() {
	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(circles);
	// console.log(intersects);

	for (let i = 0; i < intersects.length; i++) {
		if (!intersects[i].object.userData.flipped) {
			intersects[i].object.material.color.set(colors.back);
			intersects[i].object.userData.flipped = true;

			gsap.to(intersects[i].object.rotation, {
				y: Math.PI,
				duration: 0.1,
				overwrite: true,
			});
			const sound = intersects[i].object.children[0];
			if (sound) {
				sound.play();
				if (canVibrate) window.navigator.vibrate(100);
			}
		} /* else {
			intersects[i].object.material.color.set(colors.front);
			intersects[i].object.userData.flipped = false;
			gsap.to(intersects[i].object.rotation, {
				y: 0,
				duration: 0.1,
				overwrite: true,
			});
		} */
	}
}

function flip2() {
	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(circles);
	// console.log(intersects);

	for (let i = 0; i < intersects.length; i++) {
		intersects[i].object.userData.intersecting = true;
	}

	circles.forEach((circle) => {
		if (circle.userData.intersecting) {
			circle.material.color.set(colors.back);
			gsap.to(circle.rotation, {
				y: Math.PI,
				duration: 0.1,
				overwrite: true,
			});
			const sound = circle.children[0];
			if (sound) {
				sound.play();
				// if (canVibrate) window.navigator.vibrate(100);
			}
		} else if (circle.rotation.y !== 0) {
			circle.material.color.set(colors.front);
			gsap.to(circle.rotation, {
				y: 0,
				duration: 0.1,
				overwrite: true,
			});
			const sound = circle.children[0];
			if (sound) {
				sound.play();
				// if (canVibrate) window.navigator.vibrate(100);
			}
		}
		circle.userData.intersecting = false;
	});
}

function reset() {
	colors =
		colorCombinations[Math.floor(Math.random() * colorCombinations.length)];
	circles.forEach((circle) => {
		gsap.to(circle.rotation, {
			y: 0,
			duration: 1.2,
			overwrite: true,
		});

		circle.material.color.set(colors.front);
		circle.userData.flipped = false;
	});
}

window.addEventListener("dblclick", () => {
	reset();
});

/* Based on this http://jsfiddle.net/brettwp/J4djY/*/
function detectDoubleTapClosure() {
	let lastTap = 0;
	let timeout;
	return function detectDoubleTap(event) {
		const curTime = new Date().getTime();
		const tapLen = curTime - lastTap;
		if (tapLen < 400 && tapLen > 0) {
			console.log("Double tapped!");
			reset();
			event.preventDefault();
		} else {
			timeout = setTimeout(() => {
				clearTimeout(timeout);
			}, 400);
		}
		lastTap = curTime;
	};
}

/* Regex test to determine if user is on mobile */
if (
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
) {
	document.body.addEventListener("touchend", detectDoubleTapClosure(), {
		passive: false,
	});
}

function onPointerMove(event) {
	/* calculate pointer position in normalized device coordinates
	(-1 to +1) for both components */

	let x, y;

	if (event.type === "mousemove") {
		x = (event.clientX / window.innerWidth) * 2 - 1;
		y = -(event.clientY / window.innerHeight) * 2 + 1;
	} else if (event.type === "touchmove") {
		const touch = event.touches[0];
		x = (touch.clientX / window.innerWidth) * 2 - 1;
		y = -(touch.clientY / window.innerHeight) * 2 + 1;
	}

	pointer.x = x;
	pointer.y = y;

	flip();

	/* // Create a new vector representing the pointer's position in normalized device coordinates
	const pointerVector = new THREE.Vector3(x, y, 0.5);
	// Transform the pointer coordinates from screen space to 3D space
	pointerVector.unproject(camera);

	// Calculate the direction from the camera to the pointer position
	const directionToPointer = pointerVector.sub(camera.position).normalize();

	// Calculate the distance from the camera to the xy-plane (z=0)
	const distanceToXYPlane = -camera.position.z / directionToPointer.z;

	// Calculate the exact position on the xy-plane where the pointer intersects
	const intersectionPoint = camera.position
		.clone()
		.add(directionToPointer.multiplyScalar(distanceToXYPlane));

	// Set the cube's position to the intersection point
	cube.position.copy(intersectionPoint); */

	// // Use raycasting to determine intersections and flip the intersecting circles
	// const raycaster = new THREE.Raycaster();
	// raycaster.set(cube.position, new THREE.Vector3(0, 0, 1)); // Assuming we need to check intersections in the z-direction
	// circles.forEach((circle) => {
	// 	const intersects = raycaster.intersectObject(circle);
	// 	if (intersects.length > 0) {
	// 		circle.scale.y *= -1; // Flip the circle vertically
	// 	}
	// });
}

function onHandMove(handLandmarks) {
	// console.log(handLandmarks);
	if (!mergerHappening) {
		cubeRight.visible = false;
		cubeLeft.visible = false;

		if (handLandmarks.length > 0) {
			const handOne = handLandmarks[0];
			const handTwo = handLandmarks[1];
			if (handOne) {
				cubeRight.visible = true;
				updateObjectPositionFromHandPosition(handOne, cubeRight);
			}
			if (handTwo) {
				cubeLeft.visible = true;
				updateObjectPositionFromHandPosition(handTwo, cubeLeft);
			}
		}
	}
}

function updateObjectPositionFromHandPosition(handLandmarks, object) {
	const indexMCP = handLandmarks[5];
	// console.log(indexMCP);

	// let liveView = document.getElementById("liveVideoView");
	let adjustedX = indexMCP.x * 2 - 1;
	let adjustedY = -indexMCP.y * 2 + 1;
	// console.log(adjustedX, adjustedY);
	pointer.x = adjustedX;
	pointer.y = adjustedY;

	// Create a new vector representing the pointer's position in normalized device coordinates
	const pointerVector = new THREE.Vector3(pointer.x, pointer.y, 0.5);

	// Transform the pointer coordinates from screen space to 3D space
	pointerVector.unproject(camera);

	// Calculate the direction from the camera to the pointer position
	const directionToPointer = pointerVector.sub(camera.position).normalize();

	// Calculate the distance from the camera to the xy-plane (z=0)
	const distanceToXYPlane = -camera.position.z / directionToPointer.z;

	// Calculate the exact position on the xy-plane where the pointer intersects
	const intersectionPoint = camera.position
		.clone()
		.add(directionToPointer.multiplyScalar(distanceToXYPlane));

	// Set the cube's position to the intersection point
	object.position.copy(intersectionPoint);
}

// window.addEventListener("pointermove", onPointerMove);
// window.addEventListener("mousemove", onPointerMove);
// window.addEventListener("touchmove", onPointerMove);

function initiateMerger() {
	// Calculate the midpoint between cubeRight and cubeLeft
	const midX = (cubeRight.position.x + cubeLeft.position.x) / 2;
	const midY = (cubeRight.position.y + cubeLeft.position.y) / 2;
	const midZ = (cubeRight.position.z + cubeLeft.position.z) / 2;

	// Transfer children from cubeRight and cubeLeft to mergedMesh
	cubeRight.children.forEach((child) => {
		mergedMesh.add(child.clone());
	});
	cubeLeft.children.forEach((child) => {
		mergedMesh.add(child.clone());
	});

	// Set mergedMesh's position to the calculated midpoint
	mergedMesh.position.set(midX, midY, midZ);
	scene.add(mergedMesh);
	mergerStarted = false;
	cubeRight.visible = false;
	cubeLeft.visible = false;
}

/* ANCHOR Animate */
function animate() {
	const animationId = requestAnimationFrame(animate);

	cubeRight.rotation.y += 0.01;
	cubeRight.rotation.x += 0.01;
	cubeLeft.rotation.y += 0.01;
	cubeLeft.rotation.x += 0.01;
	mergedMesh.rotation.y += 0.01;
	mergedMesh.rotation.x += 0.01;

	if (mergerHappening) {
		console.log("merger happening");
		if (mergerStarted) initiateMerger();
	} else {
		const intersects =
			cubeRight.position.distanceTo(cubeLeft.position) <
			cubeRight.geometry.parameters.radius +
				cubeLeft.geometry.parameters.radius;
		if (intersects && cubeLeft.visible && cubeRight.visible) {
			// gsap.to(cubeRight.position, {
			// 	duration: 0.1,
			// 	x: cubeRight.position.x + 0.1,
			// 	yoyo: true,
			// 	repeat: 1,
			// 	// overwrite: true,
			// });
			// gsap.to(cubeLeft.position, {
			// 	duration: 0.1,
			// 	x: cubeLeft.position.x - 0.1,
			// 	yoyo: true,
			// 	repeat: 1,
			// 	// overwrite: true,
			// });
			mergerHappening = true;
			mergerStarted = true;
		}
	}

	// Update controls
	// controls.update();

	// Render the scene
	renderer.render(scene, camera);

	// if (windowResized) {
	// 	windowResized = false;
	// 	cancelAnimationFrame(animationId);
	// 	render();
	// }
}

// Start the animation loop
// animate();

export { firstRender, onHandMove };
