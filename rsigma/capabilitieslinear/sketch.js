let padding = 20;
let upperCase = true;
let baseArrowColors = ['#accbff', '#92bbff', '#78aaff', '#649eff', '#4188ff'];//['#EC9F05', '#BFD7EA', '#FF6663', '#E0FF4F', '#7EB77F'];
let baseTextColor = (50, 50, 50);
let baseCapabilityHighlight = ['#ffa07a','#ff7f50','#ff6347'];//['#78A1BB', '#D2F898', '#BFA89E'];
let capabilityHighlightLerp = 0.4;
let phaseCounter = 0;

// meta layout;
let pCSeperationMult = 2;

//arrow geom
let arrowPointPr = 0.01;
let arrowWidthPr = 0.5;
let arrowHeightPr = 0.5;
//capability border geom
let cbWidthPr = 0.4;

class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Section {
  constructor(title, keywords = null) {
    this.title = title;
    if (upperCase == true) {
      this.title = this.title.toUpperCase();
    }
    this.type = 'capability';
    if (keywords == null) {
      this.type = 'service';
    }
    this.hovered = false;
    this.geometry = [];
    this.colors = {};
    this.children = [];
    this.lerpDir = 0.0;
  }
  setPosition(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h + padding;
  }
  drawStatics() {
    noStroke();
    rectMode(CENTER);
    if (this.hovered == false && this.lerpDir > 0.0) {
      this.lerpDir -= 0.04;
    }
    if (this.hovered == true && this.lerpDir < 1.0) {
      this.lerpDir += 0.04;
    }
    fill(lerpColor(this.colors['box-lo'], this.colors['box-hi'], this.lerpDir));
    beginShape();
    for (let i = 0; i < this.geometry.length; i++) {
      vertex(this.geometry[i].x, this.geometry[i].y);
    }
    endShape();
    fill(this.colors['text']);
    textAlign(CENTER, CENTER);
    text(this.title, this.x, this.y);
  }
};

let capabilities = [];
let services = [];

function windowResized() {
  textSize(min(height/12, width/60));
  setupCoords();
}

function setupCoords() {
  createCanvas(windowWidth, 100);
  textSize(min(height/2, width/50));
  let startHeight = 0.5 * height;
  let border = (width / (services.length + 1));
  for (let i = 0; i < services.length; i++) {
    let x = (i + 1) * (border);
    let y = startHeight;
    services[i].setPosition(x, y, border, textSize());
  }
  for (let i = 0; i < services.length; i++) {
    services[i].geometry = [];
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y - services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr + width*arrowPointPr, services[i].y));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y + services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr - width*arrowPointPr, services[i].y + services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr, services[i].y));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr  - width*arrowPointPr, services[i].y - services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y - services[i].height * arrowHeightPr));
  }
  
}

function setup() {
  createCanvas(windowWidth, 100);
  textFont('Georgia');
  textSize(min(height/2, width/50));
  capabilities.push (new Section('Integration Assesment', ['Process & Workflow', 'Project Specification', 'System Integration Vetting', 'Goal Setting & Exit Planning', 'ROI thresholds','KPI management']));
  capabilities.push (new Section('Solution Engineering', ['Process Certification', 'Testing & Simulation', 'Reliability & Forecasting', 'Safety Audit', 'Regulatory & Compliance']));
  capabilities.push (new Section('Ownership Transfer', ['SOP Generation', 'Operator Training', 'IP Development', 'Integrator Relationships', 'Reporting & Documentation']));
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].colors['text'] = color(baseTextColor);
    capabilities[i].colors['box-lo'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityHighlightLerp);
    capabilities[i].colors['box-hi'] = color(baseCapabilityHighlight[i]);
  }
  services.push (new Section('Assess'));
  services.push (new Section('Design'));
  services.push (new Section('Build'));
  services.push (new Section('Implement'));
  services.push (new Section('Support'));
  capabilities[0].children.push(services[0]);
  capabilities[0].children.push(services[1]);
  capabilities[1].children.push(services[1]);
  capabilities[1].children.push(services[2]);
  capabilities[1].children.push(services[3]);
  capabilities[2].children.push(services[3]);
  capabilities[2].children.push(services[4]);
  for (let i = 0; i < services.length; i++) {
    services[i].colors['text'] = color(baseTextColor);
    services[i].colors['box-hi'] = color(baseArrowColors[i]);
    services[i].colors['box-lo'] = lerpColor(color(baseArrowColors[i]), color(255), capabilityHighlightLerp);
  }
  setupCoords();
}

function draw() {
  clear();
  // background(255, 0, 0);
  // for (let i = 0; i < capabilities.length; i++) {
  //   capabilities[i].drawStatics();
  //   capabilities[i].hovered = false;
  // }
  for (let i = 0; i < services.length; i++) {
    services[i].drawStatics();
    services[i].hovered = false;
  }
  if (frameCount % 60 == 0) {
    phaseCounter += 1;
  }
services[phaseCounter % 5].hovered = true;
  // for (let i = 0; i < capabilities[phaseCounter % 3].children.length; i++) {
  //   capabilities[phaseCounter % 3].children[i].hovered = true;
  // }
}
