let padding = 20;
let upperCase = true;
let baseArrowColors = ['#accbff', '#92bbff', '#78aaff', '#649eff', '#4188ff'];//['#EC9F05', '#BFD7EA', '#FF6663', '#E0FF4F', '#7EB77F'];
let baseTextColor = (50, 50, 50);
let baseCapabilityHighlight = ['#ffa07a','#ff7f50','#ff6347'];//['#78A1BB', '#D2F898', '#BFA89E'];
let capabilityHighlightLerp = 0.5;
let capabilityZoneLerp = 0.75;



// meta layout;
let pCSeperationMult = 2;

//arrow geom
let arrowPointPx = 20;
let arrowWidthPr = 0.5;
let arrowHeightPr = 0.5;
//capability border geom
let cbWidthPr = 0.8;

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
    this.keywords = keywords;
    this.type = 'capability';
    if (keywords == null) {
      this.type = 'service';
    }
    this.hovered = false;
    this.geometry = [];
    this.colors = {};
    this.children = [];
  }
  setPosition(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.x1 = x - w/2 - padding;
    this.y1 = y - h/2 - padding;
    this.x2 = x + w/2 + padding;
    this.y2 = y + h/2 + padding;
    this.width = w;
    this.height = h + padding;
    console.log(this.height);
  }
  drawStatics() {
    if (this.type == 'capability') {
      this.capabilityStatics();
    } else {
      this.serviceStatics();
    }
  }

  capabilityStatics() {
    noStroke();
    rectMode(CENTER);
    if (this.hovered == false) {
      fill(this.colors['box-hi']);
    } else {
      fill(this.colors['box-lo']);
    }
    
    rect(this.x, this.y, this.width * cbWidthPr, this.height);
    textAlign(CENTER, CENTER);
    fill(this.colors['text']);
    text(this.title, this.x, this.y);
  }

  serviceStatics() {
    noStroke();
    fill(this.colors['arrow']);
    beginShape();
    for (let i = 0; i < this.geometry.length; i++) {
      vertex(this.geometry[i].x, this.geometry[i].y);
    }
    endShape();
    fill(this.colors['text']);
    textAlign(CENTER, CENTER);
    text(this.title, this.x, this.y);
  }

  drawHoveredBG() {
    if (this.type == 'capability') {
      this.capabilityHBG();
    } else {
      this.serviceHBG()
    }
  }

  capabilityHBG() {
    noStroke();
    rectMode(CORNER);
    fill(this.colors['box-lo']);
    
    let w = this.children[this.children.length-1].x2 - this.children[0].x1;
    let h = this.height + (this.y2 + this.height * this.keywords.length) - this.children[0].y1;
    rect(this.children[0].x1, this.children[0].y1, w, h);

    rectMode(CENTER);
    fill(this.colors['box-lo']);
    h = (this.height + 1) * this.keywords.length;
    
    rect(this.x, this.y + this.height/2 + h/2, this.width * cbWidthPr, h);
  }

  serviceHBG() {
    
  }

  draw () {
    if (this.hovered == true) {
      this.drawHoveredBG();
    }
    this.drawStatics();
    if (this.hovered == true && this.keywords != null) {
      this.drawHoveredFG();
    }
  }

  drawBG() {
    if (this.hovered == true) {
      this.drawHoveredBG();
    }
  }

  drawFG() {
    if (this.hovered == true && this.keywords != null) {
      this.drawHoveredFG();
    }
  }

  capabilityHFG() {
    let x = this.x - textWidth(this.title)/2;
    let y = this.y + this.height;
    textAlign(LEFT);
    fill(this.colors['text']);
    for (let i = 0; i < this.keywords.length; i++) {
      text(this.keywords[i], x, y);
      y += this.height;
    }
  }

  serviceHFG() {

  }

  drawHoveredFG(){
    if (this.type == 'capability') {
      this.capabilityHFG();
    } else {
      this.serviceHFG()
    }
    
  }

  checkHover(x, y) {
    // if (mouseIsPressed == true) {
      this.hovered = false;
    // }
    if (x > this.x1 && x < this.x2) {
      if (y > this.y1 && y < this.y2) {
        this.hovered = true;
      }
    }
  }
};

let capabilities = [];
let services = [];

function windowResized() {
  textSize(windowWidth/100);
  setupCoords();
}

function setupCoords() {
  createCanvas(windowWidth, windowHeight);
  let maxHeight = 0;
  let startHeight = 0.1 * height;
  for (let i = 0; i < services.length; i++) {
    let border = (width / (services.length + 1))
    let x = (i + 1) * border;
    let y = startHeight;
    services[i].setPosition(x, y, border, textSize());
    if (services[i].height > maxHeight) {
      maxHeight = services[i].height;
    }
  }
  for (let i = 0; i < capabilities.length; i++) {
    let border = (width / (capabilities.length + 1))
    let x = (i + 1) * border;
    let y = startHeight + pCSeperationMult * maxHeight;
    capabilities[i].setPosition(x, y, border, textSize());
  }
  for (let i = 0; i < services.length; i++) {
    services[i].geometry = [];
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y - services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr + arrowPointPx, services[i].y));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y + services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr - arrowPointPx, services[i].y + services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr, services[i].y));
    services[i].geometry.push(new Coord(services[i].x + services[i].width * arrowWidthPr  - arrowPointPx, services[i].y - services[i].height * arrowHeightPr));
    services[i].geometry.push(new Coord(services[i].x - services[i].width * arrowWidthPr, services[i].y - services[i].height * arrowHeightPr));
  }
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  capabilities.push (new Section('Project Assessment', ['Process & Workflow', 'Project Specification', 'System Integration Vetting', 'Goal Setting & Exit Planning', 'ROI thresholds','KPI management']));
  capabilities.push (new Section('Solution Engineering', ['Process Certification', 'Testing & Simulation', 'Reliability & Forecasting', 'Safety Audit', 'Regulatory & Compliance']));
  capabilities.push (new Section('Ownership Transfer', ['SOP Generation', 'Operator Training', 'IP Development', 'Integrator Relationships', 'Reporting & Documentation']));
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].colors['text'] = color(baseTextColor);
    capabilities[i].colors['box-lo'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityHighlightLerp);
    capabilities[i].colors['box-zone'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityZoneLerp);
    capabilities[i].colors['box-hi'] = color(baseCapabilityHighlight[i]);
  }
  services.push (new Section('Scope'));
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
    services[i].colors['arrow'] = color(baseArrowColors[i]);
  }
  setupCoords();
  
}

function draw() {
  clear();
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].checkHover(mouseX, mouseY);
  }
  // for (let i = 0; i < services.length; i++) {
  //   services[i].checkHover(mouseX, mouseY);
  // }
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].drawBG();
  }
  for (let i = 0; i < services.length; i++) {
    services[i].drawBG();
  }
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].drawStatics();
  }
  for (let i = 0; i < services.length; i++) {
    services[i].drawStatics();
  }
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].drawFG();
  }
  for (let i = 0; i < services.length; i++) {
    services[i].drawFG();
  }

}
