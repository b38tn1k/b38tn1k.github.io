class Pong {
  constructor() {
    this.paddleWidth = 10;
    this.paddleHeight = 80;
    this.paddleSpeed = 5;
    this.ballSize = 10;
    this.ballSpeed = 3;
    this.paddleY = height / 2 - this.paddleHeight / 2;
    this.ballX = width / 2;
    this.ballY = height / 2;
    this.ballSpeedX = random([-1, 1]) * this.ballSpeed;
    this.ballSpeedY = random([-1, 1]) * this.ballSpeed;
  }

  draw() {
    background(0);

    // Update paddle position based on ball position
    if (this.ballY < this.paddleY + this.paddleHeight / 2) {
      this.paddleY -= this.paddleSpeed;
    } else {
      this.paddleY += this.paddleSpeed;
    }

    // Move ball
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Check collision with walls
    if (this.ballY < 0 || this.ballY > height - this.ballSize) {
      this.ballSpeedY *= -1;
    }

    // Check collision with paddle
    if (
      this.ballX < this.paddleWidth &&
      this.ballY > this.paddleY &&
      this.ballY < this.paddleY + this.paddleHeight
    ) {
      this.ballSpeedX *= -1;
    }

    // Draw paddle
    fill(255);
    rect(0, this.paddleY, this.paddleWidth, this.paddleHeight);

    // Draw ball
    ellipse(this.ballX, this.ballY, this.ballSize, this.ballSize);
  }
}

let pong;

function setup() {
  createCanvas(400, 400);
  pong = new Pong();
}

function draw() {
  pong.draw();
}
