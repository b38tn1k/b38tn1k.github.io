
class CircleLock extends Grid {
    /**
     * @description initializes member variables and generates a grid of triangles for visualization.
     *
     * @param { array } myColors - 10 colors that will be used to generate triangles in
     * the function.
     *
     * @param { integer } canvasSize - 2D size of the canvas on which the triangulated
     * shape will be rendered, and is used to calculate the size of each cell in the
     * triangular mesh.
     */
    // constructor(myColors, canvasSize, loader) {
    /**
     * @description sets properties and initializes objects for a Canvas class, including
     * `myColors`, `canvasSize`, `numCells`, `cellSize`, `mode`, and `triangles`. It also
     * calls the `generateTriangles()` function.
     *
     * @param { array } myColors - 16 colors of a Mona Lisa image to be generated and
     * displayed on a canvas using this constructor.
     *
     * @param { integer } canvasSize - size of the canvas where the grid will be drawn.
     */
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 20);
        this.originX = this.canvasSize/2;
        this.originY = this.canvasSize/2;
        this.depth = 20;
        let minimum = 0.1 * this.canvasSize;
        let maximum = 1.0 * this.canvasSize;
        this.increment = (maximum - minimum)/this.depth;
        this.levels = []
        for (let i = 0; i < this.depth; i++) {
            this.levels.push({radius: (this.depth-i) * this.increment, rotation: random(-PI, PI) });
        }
        
    }

    // static() {
    //     noFill()
    //     strokeWeight(this.increment/2);
    //     strokeCap(SQUARE);
        
    //     console.log("JHE")
    //     for (let i = 0; i < this.depth; i++) {
    //         if (i % 2 == 0) {
    //             stroke(this.myColors['brickRed']);
    //         } else {
    //             noStroke();
    //             // stroke(this.myColors['teal']);
    //         }
    //         push();
    //         translate(this.originX, this.originY);
    //         rotate(this.levels[i].rotation);
    //         arc(0, 0, this.levels[i].radius, this.levels[i].radius,  -(HALF_PI - radians(15)), -(HALF_PI + radians(15)));
    //         pop();

    //         if (this.levels[i].rotation > 0) {
    //             this.levels[i].rotation -= 0.001;
    //         }

    //         if (this.levels[i].rotation < 0) {
    //             this.levels[i].rotation += 0.001;
    //         }
    //     }
    // }

    static() {
        noFill();
        strokeWeight(this.increment / 2);
        strokeCap(SQUARE);
        
        for (let i = 0; i < this.depth; i++) {
            if (i % 2 == 0) {
                stroke(this.myColors['brickRed']);
            } else {
                noStroke();
            }
            
            push();
            translate(this.originX, this.originY);
            rotate(this.levels[i].rotation);
            
            // Calculate the desired half length of the opposite side
            let desiredOppositeHalfLength = 500; // Adjust as needed
            
            // Use trigonometry to calculate the angle
            let adjacentSide = this.levels[i].radius; // Adjacent side length is half the radius
            let halfTopAngle = atan(desiredOppositeHalfLength / adjacentSide);
            
            // Calculate start and end angles based on the half top angle
            let startAngle = -HALF_PI - halfTopAngle;
            let endAngle = -HALF_PI + halfTopAngle;
            
            arc(0, 0, this.levels[i].radius, this.levels[i].radius, startAngle, endAngle);
            pop();
    
            // Rotate the levels gradually
            if (this.levels[i].rotation > 0) {
                this.levels[i].rotation -= 0.01;
            }
            if (this.levels[i].rotation < 0) {
                this.levels[i].rotation += 0.01;
            }
        }
    }
    
}