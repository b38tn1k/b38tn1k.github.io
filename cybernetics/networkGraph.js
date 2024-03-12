class NetworkGraph {
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

    in() {
        this.static();
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
            // setTimeout(() => {frameRate(1);}, 1000);
        }
    }

    out() {
        this.static();
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
    }

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
