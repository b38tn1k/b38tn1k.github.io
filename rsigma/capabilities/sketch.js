let padding = 10;
let upperCase = true;

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
    textAlign(CENTER, CENTER);
    text(this.title, this.x, this.y);
  }

  serviceStatics() {
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
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  capabilities.push (new Section('Integration Assesment', ['Process and Workflow Assesment', 'Project Specification', 'System Integration Vetting', 'Goal Setting & Exit Planning', 'ROI thresholds & KPI management']));
  capabilities.push (new Section('Solution Engineering', ['Process Certification', 'Testing & Simulation', 'Reliability & Forecasting', 'Safety Audit', 'Regulatory & Compliance Management']));
  capabilities.push (new Section('Ownership Transfer', ['SOP Generation', 'Operator Training', 'Patent Guidance & IP Development', 'Integrator Relationship Management', 'Transition Reporting & Documentation']));
  services.push (new Section('Asses'));
  services.push (new Section('Design'));
  services.push (new Section('Build'));
  services.push (new Section('Implement'));
  services.push (new Section('Support'));
  for (let i = 0; i < services.length; i++) {
    let border = (width / (services.length + 1))
    let x = (i + 1) * border;
    let y = 0.25 * height;
    services[i].setPosition(x, y, border, textSize());
  }
  for (let i = 0; i < capabilities.length; i++) {
    let border = (width / (capabilities.length + 1))
    let x = (i + 1) * border;
    let y = 0.5 * height;
    capabilities[i].setPosition(x, y, border, textSize());
  }
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
