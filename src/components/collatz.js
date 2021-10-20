import * as THREE from "three";
const colors = [0xf96645, 0x32a2ad, 0xa9e2ff];

export default {
	name: "Collatz",
	data() {
		return {
			graph: {},
			strand: {},
			options: {
				limit: window.innerWidth < 576 ? 6000 : 9000,
				spacing: 30,
				directions: {
					odd: 20,
					even: -8,
				},
				origin: {
					x: 0,
					y: 0,
					z: 0,
					angle: 0,
				},
				geometry: {
					tubularSegments: 100,
					radius: 2,
					radialSegments: 5,
				},
				material: {
					color: colors[(Math.random() * colors.length) | 0],
					roughness: 0.5,
					metalness: 0.8,
				},
			},
		};
	},
	mounted() {
		this.initialize();
		this.addLight();

		this.generateGraph();
		this.generateStrand();
		this.generateCoral();
	},
	methods: {
		// Scene Initialization
		initialize() {
			this.$store.dispatch("initialize", {
				target: "canvas",
				cameraPosition: {
					x: 3000,
					y: 1000,
					z: 5000,
				},
			});
			window.addEventListener("resize", this.handleResize);
			this.animate();
		},
		handleResize() {
			this.$store.dispatch("handleResize");
		},
		animate() {
			requestAnimationFrame(this.animate);
			this.$store.dispatch("animate");
		},
		addLight() {
			const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
			directionalLight.position.set(0, 1000, 5000);

			let cameraAngle = 0;
			const radius = 2000;
			directionalLight.animation = () => {
				cameraAngle += 0.005;
				this.$store.dispatch("updateCamera", {
					position: {
						x: radius * Math.cos(cameraAngle),
						y: radius * Math.sin(cameraAngle),
						z: radius * Math.sin(cameraAngle),
					},
					lookAt: {
						x: 1000,
						y: 0,
						z: 2000,
					},
				});
			};

			this.$store.dispatch("addObjectToScene", directionalLight);
		},

		generateNode(node) {
			if (node !== 1 && !(node in this.graph)) {
				const link = node % 2 ? 3 * node + 1 : node / 2;
				this.graph[node] = link;
				this.generateNode(link);
			}
		},

		generateGraph() {
			for (let i = 5; i <= this.options.limit; i++) {
				this.generateNode(i);
			}
		},

		generateStrand() {
			for (let node of Object.keys(this.graph)) {
				if (!(this.graph[node] in this.strand)) {
					this.strand[this.graph[node]] = new Set();
				}
				this.strand[this.graph[node]].add(parseInt(node));
			}
		},

		generateCoral(node = 1, base = this.options.origin, strand = []) {
			if (this.strand[node]) {
				if (this.strand[node].size > 1) {
					this.drawStrand(strand);
					strand = [strand[strand.length - 1]];
				}

				for (let leaf of this.strand[node]) {
					const offsetAngle =
						base.angle +
						(leaf % 2
							? this.options.directions.odd
							: this.options.directions.even);
					const offsetX =
						Math.cos((offsetAngle * Math.PI) / 180) *
							this.options.spacing +
						base.x;
					const offsetY =
						Math.sin((offsetAngle * Math.PI) / 180) *
							this.options.spacing +
						base.y;
					const offsetZ = base.z + 15;

					// Recursive
					this.generateCoral(
						leaf,
						{
							x: offsetX,
							y: offsetY,
							z: offsetZ,
							angle: offsetAngle,
						},
						[
							...strand,
							new THREE.Vector3(offsetX, offsetY, offsetZ),
						]
					);
				}
			} else {
				this.drawStrand(strand);
			}
		},

		drawStrand(strand) {
			if (strand.length > 1) {
				setTimeout(() => {
					const path = new THREE.CatmullRomCurve3(strand);
					const geometry = new THREE.TubeBufferGeometry(
						path,
						this.options.geometry.tubularSegments,
						this.options.geometry.radius,
						this.options.geometry.radialSegments,
						false
					);
					const material = new THREE.MeshStandardMaterial({
						color: this.options.material.color,
						roughness: this.options.material.roughness,
						metalness: this.options.material.metalness,
					});
					const mesh = new THREE.Mesh(geometry, material);
					this.$store.dispatch("addObjectToScene", mesh);
				}, this.$store.getters.getEnvironment.counter);
			}
		},
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.handleResize);
	},
};
