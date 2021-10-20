import Vue from "vue";
import Vuex from "vuex";

import _ from "lodash";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		scene: new THREE.Scene(),
		camera: null,
		renderer: null,
		control: null,

		// Environment
		environment: {
			counter: 0,
			objects: [],
		},

		// Extras
		ambientLight: null,
		directionalLight: null,
	},
	mutations: {
		initializeCamera(state, position) {
			state.camera = new THREE.PerspectiveCamera(
				50,
				window.innerWidth / window.innerHeight,
				0.01,
				100000
			);
			state.camera.position.set(position.x, position.y, position.z);
			state.camera.lookAt(new THREE.Vector3());
		},
		initializeRenderer(state, target) {
			state.renderer = new THREE.WebGLRenderer({ antialias: true });
			state.renderer.setSize(window.innerWidth, window.innerHeight);
			state.renderer.setPixelRatio(window.devicePixelRatio);
			state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			document
				.getElementById(target)
				.appendChild(state.renderer.domElement);
		},
		initializeLights(state) {
			state.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
			state.scene.add(state.ambientLight);
		},
		initializeOrbitControls(state) {
			state.control = new OrbitControls(
				state.camera,
				state.renderer.domElement
			);
			state.control.update();
		},

		// Scene and Environment
		addObjectToScene(state, object) {
			state.scene.add(object);
			state.environment.objects.push(object);
		},

		updateCameraPostion(state, position) {
			state.camera.position.x = position.x;
			state.camera.position.y = position.y;
			state.camera.position.z = position.z;
		},

		updateCameraLookAt(state, lookAt) {
			state.camera.lookAt(
				new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)
			);
		},

		// Events
		handleResize(state) {
			state.camera.aspect = window.innerWidth / window.innerHeight;
			state.camera.updateProjectionMatrix();
			state.renderer.setSize(window.innerWidth, window.innerHeight);
			state.renderer.setPixelRatio(window.devicePixelRatio);
		},

		// Render Updates
		updateRendering(state) {
			state.environment.counter += 0.1;

			// Execute Animations
			_.forEach(state.environment.objects, (object) => {
				if (object.animation) {
					object.animation();
				}
			});
			state.renderer.render(state.scene, state.camera);
		},
	},
	actions: {
		initialize(context, settings) {
			context.commit("initializeCamera", settings.cameraPosition);
			context.commit("initializeRenderer", settings.target);
			context.commit("initializeLights");
			context.commit("initializeOrbitControls");
		},
		handleResize(context) {
			context.commit("handleResize");
		},
		animate(context) {
			context.commit("updateRendering");
		},
		addObjectToScene(context, object) {
			context.commit("addObjectToScene", object);
		},
		updateCamera(context, settings) {
			context.commit("updateCameraPostion", settings.position);
			settings.lookAt
				? context.commit("updateCameraLookAt", settings.lookAt)
				: false;
		},
	},
	getters: {
		getScene(state) {
			return state.scene;
		},
		getCamera(state) {
			return state.camera;
		},
		getEnvironment(state) {
			return state.environment;
		},
	},
});
