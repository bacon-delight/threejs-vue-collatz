import * as THREE from "three";

class Coral {
	constructor(options, scene) {
		this.graph = {};
		this.strand = {};
		this.coral = {};
		this.scene = scene;

		// Compile Options
		this.options = Object.assign(
			{
				limit: 10,
				spacing: 30,
				origin: {
					x: 0,
					y: 0,
					z: 0,
					angle: 0,
				},
				directions: {
					odd: 20,
					even: -8,
				},
				geometry: {
					tubularSegments: 100,
					radius: 2,
					radialSegments: 5,
				},
				material: {
					color: 0xf96645,
					roughness: 0.5,
					metalness: 0.8,
				},
			},
			options
		);

		// Compute & Generate
		this.generateGraph();
		this.generateStrand();
		this.generateCoral();
	}

	// Recursive Node Generation for Graph
	generateNode(node) {
		// if (node !== 1 && !(this.graph.hasOwnProperty(node)))
		if (node !== 1 && !(node in this.graph)) {
			const link = node % 2 ? 3 * node + 1 : node / 2;
			this.graph[node] = link;
			this.generateNode(link);
		}
	}

	// Computes Graph
	generateGraph() {
		for (let i = 5; i <= this.options.limit; i++) {
			this.generateNode(i);
		}
	}

	// Computes Strand
	generateStrand() {
		for (let node of Object.keys(this.graph)) {
			if (!(this.graph[node] in this.strand)) {
				this.strand[this.graph[node]] = new Set();
			}
			this.strand[this.graph[node]].add(parseInt(node));
		}
	}

	// Generate Coral
	generateCoral(node = 1, base = this.options.origin, strand = []) {
		// console.log(node, strand);
		if (this.strand[node]) {
			if (this.strand[node].size > 1) {
				this.drawStrand(strand);
				strand = [strand[strand.length - 1]];
			}

			for (let leaf of this.strand[node]) {
				// Calculate New Coordinates
				const offsetAngle =
					base.angle +
					(leaf % 2
						? this.options.directions.odd
						: this.options.directions.even); // Add base here?
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
						angle: offsetAngle, // Only offset?
					},
					[...strand, new THREE.Vector3(offsetX, offsetY, offsetZ)]
				);
			}
		} else {
			this.drawStrand(strand);
		}
	}

	drawStrand(strand) {
		if (strand.length > 1) {
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
			this.scene.add(mesh);
		}
	}

	// Returns Generated Graph
	getGraph() {
		return this.graph;
	}

	// Returns Generated Strand
	getStrand() {
		return this.strand;
	}
}
