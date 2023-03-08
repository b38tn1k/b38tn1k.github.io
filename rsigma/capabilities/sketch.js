let padding = 20;
let upperCase = true;
let baseArrowColors = ['#EC9F05', '#BFD7EA', '#FF6663', '#E0FF4F', '#7EB77F'];
let baseTextColor = (50, 50, 50);
let baseCapabilityHighlight = ['#78A1BB', '#D2F898', '#BFA89E'];
let capabilityHighlightLerp = 0.2;

// meta layout;
let pCSeperationMult = 3;

//arrow geom
let arrowPointPx = 20;
let arrowWidthPr = 0.3;
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
      console.log(this.geometry);
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
    rectMode(CENTER);
    fill(this.colors['box-lo']);
    let h = (this.height + 1) * this.keywords.length;
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
    this.hovered = false;
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
  setupCoords();
}

function setupCoords() {
  createCanvas(windowWidth, windowHeight);
  let maxHeight = 0;
  for (let i = 0; i < services.length; i++) {
    let border = (width / (services.length + 1))
    let x = (i + 1) * border;
    let y = 0.25 * height;
    services[i].setPosition(x, y, border, textSize());
    if (services[i].height > maxHeight) {
      maxHeight = services[i].height;
    }
  }
  for (let i = 0; i < capabilities.length; i++) {
    let border = (width / (capabilities.length + 1))
    let x = (i + 1) * border;
    let y = 0.25 * height + pCSeperationMult * maxHeight;
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
  // textSize(32);
  capabilities.push (new Section('Integration Assesment', ['Process & Workflow', 'Project Specification', 'System Integration Vetting', 'Goal Setting & Exit Planning', 'ROI thresholds','KPI management']));
  capabilities.push (new Section('Solution Engineering', ['Process Certification', 'Testing & Simulation', 'Reliability & Forecasting', 'Safety Audit', 'Regulatory & Compliance']));
  capabilities.push (new Section('Ownership Transfer', ['SOP Generation', 'Operator Training', 'IP Development', 'Integrator Relationships', 'Reporting & Documentation']));
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].colors['text'] = color(baseTextColor);
    capabilities[i].colors['box-lo'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityHighlightLerp);
    capabilities[i].colors['box-hi'] = color(baseCapabilityHighlight[i]);
  }
  services.push (new Section('Asses'));
  services.push (new Section('Design'));
  services.push (new Section('Build'));
  services.push (new Section('Implement'));
  services.push (new Section('Support'));
  for (let i = 0; i < services.length; i++) {
    services[i].colors['text'] = color(baseTextColor);
    services[i].colors['arrow'] = color(baseArrowColors[i]);
  }
  setupCoords();
  
}

function draw() {
  clear();
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].draw();
    capabilities[i].checkHover(mouseX, mouseY);
  }
  for (let i = 0; i < services.length; i++) {
    services[i].draw();
    services[i].checkHover(mouseX, mouseY);
  }
}
