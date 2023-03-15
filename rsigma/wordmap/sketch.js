var yTextSpace;

const nodeSize = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textSize(10);
  yTextSpace = textSize();

  let root = new Node(width/2, height/2, 'R Sigma');
  addChildren(root, 'R Sigma', ['Robots', 'Languages', 'Softwares & Packages', 'Process'], 150);
  addChildren(root, 'Robots', ['UAS', 'AMRs', 'UGVs', 'Articulated Arms', 'Legged Robots'], 150);
  addChildren(root, 'UAS', ['PX4','QGC', 'Ardupilot', 'Part 104'], 75);
  addChildren(root, 'Legged Robots', ['Agility Digit','BD Spot'], 75);
  addChildren(root, 'Articulated Arms', ['Universal Robotics'], 75);
  addChildren(root, 'Languages', ['Python', 'C++', 'Javascript', 'Lua', 'MATLAB'], 150);
  addChildren(root, 'Languages', ['Python', 'C++', 'Javascript', 'Lua', 'MATLAB'], 150);
  addChildren(root, 'Softwares & Packages', ['AI, ML, CV, & NLP', 'Simulation & Design', 'Cloud'], 150);
  addChildren(root, 'AI, ML, CV, & NLP', ['TensorFlow', 'OpenCV'], 150);
  addChildren(root, 'Simulation & Design', ['ROS', 'Unity3D', 'MoveItStudio', 'SolidWorks', 'Fusion360', 'KiCAD'], 150);
  addChildren(root, 'Cloud', ['AWS', 'GCP'], 150);
  addChildren(root, 'Process', ['QA', 'FMEA', 'RCA', 'ROI', 'Agile', 'IR4.0', 'HCD'], 150);
  root.draw();
}

function addChildren(root, nodeName, childNames, childRadius) {
  let res = false;
  if (root.title == nodeName) {
    res = true;
    let startAngle;
    let childAngle;
    if (root.title != 'R Sigma') {
      childAngle = (TWO_PI)/(childNames.length * 2);
      startAngle = root.enterAngle + (childAngle * childNames.length) + HALF_PI;
    } else {
      childAngle = (TWO_PI)/childNames.length;
      startAngle = 0;
    }
    let x, y;
    for (let i = 0; i < childNames.length; i++) {
      let a = startAngle + i * childAngle;
      x = root.x + Math.cos(a) * childRadius;
      y = root.y + Math.sin(a) * childRadius;
      root.children.push(new Node(x, y, childNames[i], a));
    }
  } else {
    for (let i = 0; i < root.children.length; i++) {
      if (addChildren(root.children[i], nodeName, childNames, childRadius) == true) {
        res = true;
      }
    }
  }
  return res;
}

function draw() {}

class Node {
  constructor(x, y, title, enterAngle=0) {
    this.x = x;
    this.y = y;
    this.title = title;
    this.children = [];
    this.enterAngle = enterAngle;
  }

  drawGraphics(){
    fill(0);
    stroke(0);
    circle(this.x, this.y, nodeSize);
    for (let child of this.children) {
      line(this.x, this.y, child.x, child.y);
      child.drawGraphics();
    }
  }

  drawText(){
    noStroke();
    fill(255);
    rect(this.x, this.y-yTextSpace, textWidth(this.title) * 1.1, textSize() * 1.1);
    fill(0);
    text(this.title, this.x, this.y - yTextSpace);
    for (let child of this.children) {
      child.drawText();
    }
  }

  draw() {
    this.drawGraphics();
    this.drawText();
  }
}
