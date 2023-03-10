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
    this.keywordString = '';
    if (keywords == null) {
      this.type = 'service';
    } else {
      for (let i = 0; i < keywords.length; i++) {
        this.keywordString += keywords[i] + '\n';
      }

    }
    this.hovered = false;
    this.geometry = [];
    this.colors = {};
    this.children = [];
  }
  setPosition(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.x1 = x - w/2; //- padding;
    this.y1 = y - h/2;// - padding;
    this.x2 = x + w/2;// + padding;
    this.y2 = y + h/2;// + padding;
    this.width = w;
    this.height = h + padding;
  }
  drawStatics() {
    if (this.type == 'capability') {
      this.drawCapabilityStatics();
    } else {
      this.drawServiceStatics();
    }
  }

  drawHoveredFG(){
    if (this.type == 'capability') {
      this.drawCapabilityHFG();
    } else {
      this.drawServiceHFG()
    }    
  }

  drawFG() {
    if (this.hovered == true && this.keywords != null) {
      this.drawHoveredFG();
    }
  }

  drawCapabilityStatics() {
    rectMode(CENTER);
    fill(this.colors['box-hi']);
    rect(this.x, this.y, this.width * cbWidthPr, this.height);
    fill(this.colors['text']);
    let ts = textSize();
    textSize(1.5 * ts);
    textAlign(CENTER, CENTER);
    text(this.title, this.x, this.y);
    textSize(ts);
  }

  drawServiceStatics() {
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

  drawCapabilityHFG() {
    rectMode(CENTER);
    fill(this.colors['box-lo']);
    rect(this.x, this.y, this.width * cbWidthPr, this.height);
    fill(this.colors['text']);
    textAlign(CENTER, CENTER);
    text(this.keywordString, this.x, this.y + textSize()/2);
  }
  drawServiceHFG() {

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
  let maxY;
  let leaderCap;
  let startHeight = 0.1 * height;
  let border = (width / (capabilities.length + 1))
  for (let i = 0; i < capabilities.length; i++) {
    let x = (i + 1) * border;
    let y = startHeight;
    capabilities[i].setPosition(x, y, border, 1.2 * textSize() * capabilities[i].keywords.length);
    if (capabilities[i].height > maxHeight) {
      maxHeight = capabilities[i].height;
      maxY = capabilities[i].y;
    }
  }
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].setPosition(capabilities[i].x, maxY, border, maxHeight);
  }
  let x1 = capabilities[0].x; // start
  let inc = (capabilities[capabilities.length-1].x - x1)/(services.length-1); // increment
  let y = capabilities[0].y + capabilities[0].height/2 + padding;
  // x1 -= capabilities[0].width;

  for (let i = 0; i < services.length; i++) {
    services[i].setPosition(x1, y, border, textSize());
    x1 += inc;
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
  capabilities.push (new Section('Integration\nAssesment', ['Process & Workflow', 'Project Specification', 'System Integration Vetting', 'Goal Setting & Exit Planning', 'ROI thresholds','KPI management']));
  capabilities.push (new Section('Solution\nEngineering', ['Process Certification', 'Testing & Simulation', 'Reliability & Forecasting', 'Safety Audit', 'Regulatory & Compliance']));
  capabilities.push (new Section('Ownership\nTransfer', ['SOP Generation', 'Operator Training', 'IP Development', 'Integrator Relationships', 'Reporting & Documentation']));
  for (let i = 0; i < capabilities.length; i++) {
    capabilities[i].colors['text'] = color(baseTextColor);
    capabilities[i].colors['box-lo'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityHighlightLerp);
    capabilities[i].colors['box-zone'] = lerpColor(color(baseCapabilityHighlight[i]), color(255), capabilityZoneLerp);
    capabilities[i].colors['box-hi'] = color(baseCapabilityHighlight[i]);
  }
  services.push (new Section('Asses'));
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
