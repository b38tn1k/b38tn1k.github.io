class NetworkGraph {
    /**
     * @description sets properties and initializes members of a class, including `myColors`,
     * `canvasSize`, `numCells`, `cellSize`, `mode`, `modifier`, `nodes`, and `links`.
     * 
     * @param { array } myColors - 14 colors used to display the grid.
     * 
     * @param { number } canvasSize - 2D coordinate space where the maze will be drawn,
     * and is used to calculate the size of each cell in the maze.
     */
    constructor(myColors, canvasSize) {
        this.myColors = myColors;
        this.numCells = 14;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
        this.nodes = [];
        this.links = [];
        this.generateNodes(3);
    }

    /**
     * @description recursively creates a tree structure by generating central and child
     * nodes. It pushes central and linked node arrays to the `nodes` and `links` arrays,
     * respectively, at each level of recursion.
     * 
     * @param { number } numLevels - number of levels deep into the tree that the function
     * should generate nodes and links at.
     */
    generateNodes(numLevels) {
        // Calculate the center of the canvas
        const centerX = this.canvasSize / 2;
        const centerY = this.canvasSize / 2;
    
        // Create the central node
        let centralNode = { x: centerX, y: centerY };
        this.nodes.push(centralNode);
        this.links.push([])
    
        // Recursively generate child nodes
        this.generateChildNodes(centralNode, numLevels, 5, 3);
    }
    
    /**
     * @description recursively creates radial child nodes for a given parent node based
     * on specified levels and radius, calculating the angle between each child node and
     * the parent node.
     * 
     * @param { object } parentNode - 3D node that serves as the root or parent of the
     * tree, to which the child nodes are generated and linked.
     * 
     * @param { integer } levels - level of depth at which the radial child nodes should
     * be generated, with a value of 0 indicating no generation takes place.
     * 
     * @param { integer } radialNodes - number of child nodes to generate radially around
     * the parent node at each level of recursion in the function.
     * 
     * @returns { any } a list of nodes and links between them, recursively generated for
     * each radial child node.
     */
    generateChildNodes(parentNode, levels, radialNodes) {
        if (levels <= 0) return;
    
        // Calculate the angle between each radial child node
        const angleIncrement = (2 * Math.PI) / radialNodes;
    
        // Generate radial child nodes
        for (let i = 0; i < radialNodes; i++) {
            const angle = i * angleIncrement;
            const x = parentNode.x + Math.cos(angle) * this.cellSize * 2;
            const y = parentNode.y + Math.sin(angle) * this.cellSize * 2;
            const newNode = { x, y };
            this.nodes.push(newNode);
            this.links.push([this.nodes.indexOf(parentNode), this.nodes.indexOf(newNode)]);
            // Recursively generate child nodes for each radial child
            this.generateChildNodes(newNode, levels - 1, radialNodes);
        }
    }
    

    /**
     * @description is a generic draw function that takes no arguments and performs
     * different actions based on its mode variable, which can take values from 0 to 3.
     */
    draw() {
        noStroke();
        switch (this.mode) {
            case 0:
                break;
            case 1:
                this.static();
                break;
            case 2:
                this.in();
                break;
            case 3:
                this.out();
                break;
            default:
                break;
        }
    }

    /**
     * @description modifies the `static` and `modifier` properties, and sets `mode` to
     * 1 when `modifier` is greater than or equal to 1.
     */
    in() {
        this.static();
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
            // setTimeout(() => {frameRate(1);}, 1000);
        }
    }

    /**
     * @description decreases the modifier value by 0.1 and sets the mode to 0 when the
     * modifier is below or equal to 0.
     */
    out() {
        this.static();
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
    }

    /**
     * @description generates high-quality documentation for code by drawing a network
     * graph with nodes and connections, using brush strokes and fill colors to represent
     * various elements.
     */
    static() {
        stroke(myColors["brickRed"]);
        strokeWeight(this.modifier * 4);
        for (let i = 0; i < this.links.length; i++) {
            for (let j = 0; j < this.links[i].length; j++) {
                line(this.nodes[i].x, this.nodes[i].y, this.nodes[this.links[i][j]].x, this.nodes[this.links[i][j]].y); // Draw connection
            }
        }
        noStroke();
        for (let node of this.nodes) {
            fill(myColors["brickRed"]);
            let d = dist(node.x, node.y, this.canvasSize / 2, this.canvasSize / 2);
            let outerRadius = map(d, 0, this.canvasSize / 2, (this.cellSize * 0.75) / 2, (this.cellSize * 0.25) / 2);
            ellipse(node.x, node.y, this.modifier * outerRadius * 2); // Draw node
            fill(myColors["teal"]);
            let innerRadius = map(d, 0, this.canvasSize / 2, outerRadius * 0.3, outerRadius * 0.9);
            ellipse(node.x, node.y, this.modifier * innerRadius * 2); // Draw node
        }
    }
}
