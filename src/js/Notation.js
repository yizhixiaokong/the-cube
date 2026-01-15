/**
 * Rubik's Cube Standard Notation Parser
 * 
 * Supports standard cube notation:
 * - Basic moves: R, L, U, D, F, B
 * - Modifiers: ' (counter-clockwise), 2 (180 degrees)
 * - Wide turns: Rw/r, Lw/l, Uw/u, Dw/d, Fw/f, Bw/b
 * - Slice moves: M, E, S
 * - Cube rotations: x, y, z
 * 
 * @example
 * const notation = new Notation(game);
 * notation.move("R U R' U'"); // Execute algorithm
 * notation.move("x y2 z'");   // Rotate cube
 */

class Notation {

	constructor( game ) {

		this.game = game;
		this.controls = game.controls;
		this.world = game.world;

		// Move definitions will be generated dynamically based on cube size
		// Cache the last size to regenerate moves when size changes
		this.cachedSize = null;
		this.moves = {};

	}

	/**
	 * Get current cube size
	 * @returns {number} Cube size (2-5)
	 */
	getCubeSize() {

		return this.game.cube.size;

	}

	/**
	 * Generate move mappings based on current cube size
	 * Automatically called before parsing moves
	 */
	generateMoves() {

		const size = this.getCubeSize();

		// Return cached moves if size hasn't changed
		if ( this.cachedSize === size ) return;

		this.cachedSize = size;
		const maxIndex = size - 1;  // e.g., 3x3 -> 0,1,2, max is 2
		const hasMiddle = size % 2 === 1;  // Only odd-sized cubes have a single middle layer
		const middleIndex = hasMiddle ? Math.floor( size / 2 ) : null;

		// Basic face turns - always the outermost layers
		this.moves = {
			'R': { layers: [ maxIndex ], axis: 'x', angle: -Math.PI / 2 },
			'L': { layers: [ 0 ], axis: 'x', angle: Math.PI / 2 },
			'U': { layers: [ maxIndex ], axis: 'y', angle: -Math.PI / 2 },
			'D': { layers: [ 0 ], axis: 'y', angle: Math.PI / 2 },
			'F': { layers: [ maxIndex ], axis: 'z', angle: -Math.PI / 2 },
			'B': { layers: [ 0 ], axis: 'z', angle: Math.PI / 2 },

			// Cube rotations (work for all sizes)
			'x': { type: 'rotation', axis: 'x', angle: -Math.PI / 2 },
			'y': { type: 'rotation', axis: 'y', angle: -Math.PI / 2 },
			'z': { type: 'rotation', axis: 'z', angle: -Math.PI / 2 },
		};

		// Wide turns - outer two layers
		if ( size >= 2 ) {

			// For 2x2, wide turn = whole cube rotation
			if ( size === 2 ) {

				this.moves[ 'r' ] = { type: 'rotation', axis: 'x', angle: -Math.PI / 2 };
				this.moves[ 'l' ] = { type: 'rotation', axis: 'x', angle: Math.PI / 2 };
				this.moves[ 'u' ] = { type: 'rotation', axis: 'y', angle: -Math.PI / 2 };
				this.moves[ 'd' ] = { type: 'rotation', axis: 'y', angle: Math.PI / 2 };
				this.moves[ 'f' ] = { type: 'rotation', axis: 'z', angle: -Math.PI / 2 };
				this.moves[ 'b' ] = { type: 'rotation', axis: 'z', angle: Math.PI / 2 };

			} else {

				// For 3x3+, wide turn = outer + adjacent layer
				this.moves[ 'r' ] = { layers: [ maxIndex - 1, maxIndex ], axis: 'x', angle: -Math.PI / 2 };
				this.moves[ 'l' ] = { layers: [ 0, 1 ], axis: 'x', angle: Math.PI / 2 };
				this.moves[ 'u' ] = { layers: [ maxIndex - 1, maxIndex ], axis: 'y', angle: -Math.PI / 2 };
				this.moves[ 'd' ] = { layers: [ 0, 1 ], axis: 'y', angle: Math.PI / 2 };
				this.moves[ 'f' ] = { layers: [ maxIndex - 1, maxIndex ], axis: 'z', angle: -Math.PI / 2 };
				this.moves[ 'b' ] = { layers: [ 0, 1 ], axis: 'z', angle: Math.PI / 2 };

			}

			// Support both lowercase and uppercase + 'w' notation
			this.moves[ 'Rw' ] = this.moves[ 'r' ];
			this.moves[ 'Lw' ] = this.moves[ 'l' ];
			this.moves[ 'Uw' ] = this.moves[ 'u' ];
			this.moves[ 'Dw' ] = this.moves[ 'd' ];
			this.moves[ 'Fw' ] = this.moves[ 'f' ];
			this.moves[ 'Bw' ] = this.moves[ 'b' ];

		}

		// Slice moves - only for odd-sized cubes (3x3, 5x5, etc.)
		if ( hasMiddle ) {

			this.moves[ 'M' ] = { layers: [ middleIndex ], axis: 'x', angle: Math.PI / 2 };
			this.moves[ 'E' ] = { layers: [ middleIndex ], axis: 'y', angle: Math.PI / 2 };
			this.moves[ 'S' ] = { layers: [ middleIndex ], axis: 'z', angle: -Math.PI / 2 };

		}

		// Log for debugging
		if ( typeof console !== 'undefined' ) {

			console.log( `Notation: Generated moves for ${size}x${size} cube` );

		}

	}

	/**
	 * Parse a single move notation
	 * @param {string} notation - Move notation (e.g., "R", "U'", "F2", "2R", "3Rw")
	 * @returns {Object} Parsed move object
	 */
	parseMove( notation ) {

		// Ensure moves are generated for current cube size
		this.generateMoves();

		notation = notation.trim();
		if ( ! notation ) return null;

		const size = this.getCubeSize();

		// Try to parse numeric layer notation (e.g., "2R", "3Rw", "2-3r")
		// Format: [number]Face[w][modifier]
		// Examples: 2R, 3Rw', 2-3r2
		const numericMatch = notation.match( /^(\d+)([RLUDFBrludfb]w?)(.*)$/ );
		
		if ( numericMatch ) {

			const numLayers = parseInt( numericMatch[1] );
			const faceChar = numericMatch[2];
			const modifier = numericMatch[3];

			// Validate layer count
			if ( numLayers < 2 || numLayers > size ) {

				console.warn( `Invalid layer count ${numLayers} for ${size}x${size} cube (must be 2-${size})` );
				return null;

			}

			// Parse the base face and determine if it's wide turn notation
			let baseFace = faceChar[0].toUpperCase();
			const isWide = faceChar.toLowerCase() === faceChar || faceChar.includes( 'w' );
			
			// Validate face
			if ( ! 'RLUDFB'.includes( baseFace ) ) {

				console.warn( `Invalid face in notation: ${notation}` );
				return null;

			}

			// Determine axis and direction
			const axisMap = { 'R': 'x', 'L': 'x', 'U': 'y', 'D': 'y', 'F': 'z', 'B': 'z' };
			const axis = axisMap[ baseFace ];

			// Determine base angle (clockwise for each face)
			const angleMap = {
				'R': -Math.PI / 2, 'L': Math.PI / 2,
				'U': -Math.PI / 2, 'D': Math.PI / 2,
				'F': -Math.PI / 2, 'B': Math.PI / 2
			};
			let angle = angleMap[ baseFace ];

			// Determine which layers to turn
			let layers = [];
			const maxIndex = size - 1;

			if ( 'RUF'.includes( baseFace ) ) {

				// Right/Up/Front - count from the right/top/front
				for ( let i = 0; i < numLayers; i++ ) {

					layers.push( maxIndex - i );

				}
				layers.reverse(); // Keep in ascending order

			} else {

				// Left/Down/Back - count from the left/bottom/back
				for ( let i = 0; i < numLayers; i++ ) {

					layers.push( i );

				}

			}

			// Parse modifiers
			let repetitions = 1;
			if ( modifier.includes( '2' ) ) {

				repetitions = 2;

			} else if ( modifier.includes( "'" ) ) {

				angle = -angle;

			}

			return {
				base: numLayers + faceChar,
				axis: axis,
				angle: angle,
				layers: layers,
				type: 'layer',
				repetitions: repetitions
			};

		}

		// Standard notation (no numeric prefix)
		let base = notation[0];
		let modifier = '';
		let moveData = null;

		// Check for wide turn notation (e.g., "Rw")
		if ( notation.length > 1 && notation[1] === 'w' ) {

			base = notation.slice( 0, 2 );
			modifier = notation.slice( 2 );

		} else {

			// Check lowercase for wide turns
			if ( notation[0] === notation[0].toLowerCase() && 'rludfb'.includes( notation[0] ) ) {

				base = notation[0];

			}

			modifier = notation.slice( 1 );

		}

		moveData = this.moves[ base ];

		if ( ! moveData ) {

			const size = this.getCubeSize();
			
			// Special check for slice moves on even-sized cubes
			if ( 'MES'.includes( base ) && size % 2 === 0 ) {

				console.warn( `Slice move "${base}" is not supported on ${size}x${size} cube (even-sized cubes have no single middle layer)` );
				return null;

			}

			console.warn( `Invalid notation: ${notation}` );
			return null;

		}

		// Parse modifiers: ' (prime/inverse) or 2 (double)
		let angle = moveData.angle;
		let repetitions = 1;

		if ( modifier.includes( '2' ) ) {

			repetitions = 2;

		} else if ( modifier.includes( "'" ) ) {

			angle = -angle;  // Reverse direction

		}

		return {
			base: base,
			axis: moveData.axis,
			angle: angle,
			layers: moveData.layers,
			type: moveData.type || 'layer',
			repetitions: repetitions
		};

	}

	/**
	 * Parse an algorithm (sequence of moves)
	 * @param {string} algorithm - Space-separated moves (e.g., "R U R' U'")
	 * @returns {Array} Array of parsed moves
	 */
	parseAlgorithm( algorithm ) {

		const moves = algorithm.trim().split( /\s+/ );
		return moves.map( move => this.parseMove( move ) ).filter( m => m !== null );

	}

	/**
	 * Execute a single parsed move
	 * @param {Object} parsedMove - Parsed move object
	 * @param {Function} callback - Callback when move completes
	 */
	executeMove( parsedMove, callback ) {

		if ( ! parsedMove ) {

			if ( callback ) callback();
			return;

		}

		// Handle cube rotations
		if ( parsedMove.type === 'rotation' ) {

			const rotation = {
				axis: parsedMove.axis,
				angle: parsedMove.angle * parsedMove.repetitions
			};

			this.controls.rotateCube( rotation, callback );
			return;

		}

		// Handle layer moves
		const executeSingleLayer = ( layerIndex, done ) => {

			const rotation = {
				axis: parsedMove.axis,
				angle: parsedMove.angle,
				position: layerIndex
			};

			this.controls.rotateLayer( rotation, false, done );

		};

		// Execute moves for each layer
		const layers = parsedMove.layers;
		let layerIndex = 0;
		let rep = 0;

		const executeNext = () => {

			if ( rep >= parsedMove.repetitions ) {

				if ( callback ) callback();
				return;

			}

			if ( layerIndex >= layers.length ) {

				layerIndex = 0;
				rep++;
				executeNext();
				return;

			}

			executeSingleLayer( layers[ layerIndex ], () => {

				layerIndex++;
				executeNext();

			} );

		};

		executeNext();

	}

	/**
	 * Execute an algorithm (sequence of moves)
	 * @param {string|Array} algorithm - Algorithm string or array of parsed moves
	 * @param {Function} callback - Callback when all moves complete
	 */
	move( algorithm, callback ) {

		const moves = typeof algorithm === 'string' 
			? this.parseAlgorithm( algorithm )
			: algorithm;

		if ( moves.length === 0 ) {

			if ( callback ) callback();
			return;

		}

		let index = 0;

		const executeNext = () => {

			if ( index >= moves.length ) {

				if ( callback ) callback();
				return;

			}

			this.executeMove( moves[ index ], () => {

				index++;
				executeNext();

			} );

		};

		executeNext();

	}

	/**
	 * Get the inverse of a move notation
	 * @param {string} notation - Move notation
	 * @returns {string} Inverse notation
	 */
	inverse( notation ) {

		const parsed = this.parseMove( notation );
		if ( ! parsed ) return '';

		let result = parsed.base;

		if ( parsed.repetitions === 2 ) {

			result += '2';  // F2 inverse is F2

		} else if ( notation.includes( "'" ) ) {

			// Remove prime
			result = result.replace( "'", '' );

		} else {

			result += "'";  // Add prime

		}

		return result;

	}

	/**
	 * Get the inverse of an algorithm
	 * @param {string} algorithm - Algorithm string
	 * @returns {string} Inverse algorithm
	 */
	inverseAlgorithm( algorithm ) {

		const moves = algorithm.trim().split( /\s+/ ).reverse();
		return moves.map( move => this.inverse( move ) ).join( ' ' );

	}

}

export { Notation };
