const BUTTON_SIZE = 20;

class Feature extends Introspector {
  constructor(x, y, w = 400, h = 280, type) {
    super();
    this.g = new Geometry(x, y, w, h);
    this.g.clearBDims();
    this.mode = 'idle';
    this.buttons = [];
    this.type = type;
    this.dataLabels = {};
    this.data = {};
    this.data['id'] = type + '->' + getUnsecureHash();
    this.isAnimating = true;
    this.doAnimations = true;
    this.animationValue = 0.0;
    this.adoptable = true;
    this.notYetDrawnLabelAndButtons = true;
    this.caller = null;
    this.modelData = {};
    this.initButtons(BUTTON_SIZE);
    this.initDataLabels(BUTTON_SIZE);
    this.changed = true;
  }

  initDataLabels(buttonSize) {}
  initButtons(buttonSize) {}
  draw(zoom, cnv) {}

  delete() {
    this.buttons = [];
    this.dataLabels = {};
  }

  setMode(mode) {
    this.mode = mode;
  }

  turnOffAnimations() {
    this.doAnimations = false;
    this.animationValue = 1;
    this.g.bDims.h = this.g.aDims.h;
    this.g.bDims.w = this.g.aDims.w;
  }

  moveToMouse() {
    let mob = screenToBoard(mouseX, mouseY);
    this.g.bCart.x = mob.x;
    this.g.bCart.y = mob.y;
  }

  resizeToMouse() {
    let mob = screenToBoard(mouseX, mouseY);
    let pWidth = mob.x - this.g.bCart.x;
    let pHeight = mob.y - this.g.bCart.y;
    if (pWidth > 50 && pHeight > 50) {
      this.g.bDims.w = pWidth;
      this.g.bDims.h = pHeight;
    }
  }

  updateButtonsAndLabels(zoom) {
    this.buttons = this.buttons.filter((button) => button.mode !== 'delete');
    for (let button of this.buttons) {
      button.update(zoom, this.g);
    }
    for (let label in this.dataLabels) {
      this.dataLabels[label].update(zoom, this.g);
      if (this.dataLabels[label].mode == 'busy') {
        this.mode = this.dataLabels[label].mode;
      } else if (this.dataLabels[label].mode == 'cleared') {
        this.dataLabels[label].mode = 'idle';
        this.mode = 'idle';
      }
      if (this.dataLabels[label].changed == true) {
        this.changed = true;
        this.dataLabels[label].changed = false;
      }
    }
    this.data['title'] = this.dataLabels['title'].data;
  }

  drawButtonsAndLabels(
    zoom,
    cnv,
    myStrokeColor = getColor('outline'),
    myFillColor = getColor('secondary')
  ) {
    if (this.notYetDrawnLabelAndButtons) {
      if (this.mode == 'deleting') {
        zoom = this.animationValue;
      }
      if (this.mode != 'delete') {
        // Draw buttons
        for (let button of this.buttons) {
          // Convert button position to screen coordinates
          button.display(zoom, cnv, myStrokeColor, myFillColor);
        }
        // Draw data labels
        for (let label in this.dataLabels) {
          this.dataLabels[label].display(zoom, cnv, myStrokeColor, myFillColor);
        }
      }
    }
    this.notYetDrawnLabelAndButtons = false;
  }

  update(zoom) {
    // this.changed = false;
    this.g.update(zoom);
    if (this.g.isOnScreen) {
      this.updateButtonsAndLabels(zoom);
      this.checkModeAndAct();
    }
  }

  checkModeAndAct() {
    switch (this.mode) {
      case 'move':
        if (mouseIsPressed == false) {
          this.setMode('idle');
          this.changed = true;
        }
        break;
      case 'resize':
        if (mouseIsPressed == false) {
          this.setMode('idle');
          this.changed = true;
        }
        break;
    }
  }

  startDelete() {
    this.setMode('deleting');
    this.doAnimations = true;
    this.isAnimating = true;
  }

  display(zoom, cnv) {
    if (this.isAnimating && this.doAnimations) {
      fpsEvent();
      const baseIncrement = 0.07;
      const desiredFrameRate = highFrameRate;
      const currentFrameRate = frameRate();
      const increment = baseIncrement * (desiredFrameRate / currentFrameRate);
      if (this.mode == 'deleting') {
        this.animationValue -= increment;
      } else {
        this.animationValue += increment;
      }
      this.g.bDims.h = this.g.aDims.h * this.animationValue;
      this.g.bDims.w = this.g.aDims.w * this.animationValue;
      if (this.animationValue >= 1.0 && this.mode != 'deleting') {
        this.isAnimating = false;
        this.g.bDims.h = this.g.aDims.h;
        this.g.bDims.w = this.g.aDims.w;
      }
      if (this.animationValue <= 0.0 && this.mode == 'deleting') {
        this.mode = 'delete';
      }
    }

    if (this.g.isOnScreen == true) {
      this.notYetDrawnLabelAndButtons = true;
      this.draw(zoom, cnv);
      this.drawButtonsAndLabels(zoom, cnv);
    }
  }

  checkIsOnScreen() {
    return (
      this.g.sCart.x < windowWidth &&
      this.g.sCart.x + this.g.sDims.w > 0 &&
      this.g.sCart.y < windowHeight &&
      this.g.sCart.y + this.g.sDims.h > 0
    );
  }

  handleMousePress(zoom) {
    if (this.g.isOnScreen == true) {
      for (let button of this.buttons) {
        const res = button.mouseClickActionHandler(zoom);
        if (res) {
          this.caller = button;
        }
      }
      for (let label in this.dataLabels) {
        this.dataLabels[label].mouseClickActionHandler(zoom);
      }
    }
  }
}

class Process extends Feature {
  constructor(x, y, width, height, plant, targetPlant) {
    super(x, y, width, height, 'process'); // Call the parent constructor
    this.plant = plant;
    this.targetPlant = targetPlant;
    this.buses = {};
    this.buses = {
      source: new Set(),
      sink: new Set()
    };
    this.modelData = {};
    this.setupFromSubProcess();
  }

  collectBuses() {
    let inputIndices = this.plant.features
      .map((feature, index) => (feature.type == 'source' ? index : null))
      .filter((index) => index !== null);

    this.buses['source'] = new Set(inputIndices);

    let outputIndices = this.plant.features
      .map((feature, index) => (feature.type == 'sink' ? index : null))
      .filter((index) => index !== null);
    this.buses['sink'] = new Set(outputIndices);
  }

  setupIOButtons(buttonSize = BUTTON_SIZE) {
    this.collectBuses();
    const numSourceBuses = this.buses['source'].size;
    const numSinkBuses = this.buses['sink'].size;

    // Get all the valid source and sink ids from plant features
    const validSourceIds = Array.from(this.buses['source']).map(
      (index) => this.plant.features[index].data['id']
    );
    const validSinkIds = Array.from(this.buses['sink']).map(
      (index) => this.plant.features[index].data['id']
    );
    const validIDs = [...validSourceIds, ...validSinkIds];
    // Remove invalid buttons
    this.removeInvalidButtons(validIDs);
    const xIncrementSource =
      numSourceBuses > 1 ? (0.8 - 0.2) / (numSourceBuses - 1) : 0;
    const xIncrementSink =
      numSinkBuses > 1 ? (0.8 - 0.2) / (numSinkBuses - 1) : 0;
    // Create input and output buttons
    this.createIOButtons(
      'source',
      FeatureUIInputButton,
      'Input',
      'i_connect',
      xIncrementSource,
      buttonSize
    );
    this.createIOButtons(
      'sink',
      FeatureUIOutputButton,
      'Output',
      'o_connect',
      xIncrementSink,
      buttonSize
    );
  }

  removeInvalidButtons(validIDs) {
    for (let button of this.buttons) {
      if (
        (button instanceof FeatureUIInputButton ||
          button instanceof FeatureUIOutputButton) &&
        !validIDs.includes(button.targetID)
      ) {
        button.mode = 'delete';
      }
    }
  }

  createIOButtons(busType, ButtonType, label, mode, xIncrement, buttonSize) {
    let x = 0.2; // Start at the minimum x value
    for (let index of this.buses[busType]) {
      let id = this.plant.features[index].data['id'];
      let existingButton = this.buttons.find(
        (button) => button.targetID === id
      );
      let mouseOverData = this.plant.features[index].dataLabels['title'].data;
      if (!existingButton) {
        let b = new ButtonType(
          label,
          x,
          busType === 'source' ? 0 : 1,
          buttonSize,
          () => this.setMode(mode)
        );
        b.targetID = id;
        b.doCheckMouseOver = true;
        b.mouseOverData = mouseOverData;
        this.buttons.push(b);
      } else {
        existingButton.mouseOverData = mouseOverData;
      }
      x += xIncrement;
    }
  }

  setupFromSubProcess() {
    this.setupIOButtons();
  }

  update(zoom) {
    super.update(zoom);
    if (this.mode == 'deleting' || this.mode == 'delete') {
      this.plant = null;
    }
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'PROCESS',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
    // test

    this.modelData['INFO'] = {};
    this.modelData['INFO']['NAME'] = 'a process';
    this.modelData['INFO']['YEAR'] = 2010;
    this.modelData['INFO']['COST'] = 100000;
    this.modelData['TAGS'] = [];
    this.modelData['TAGS'].push('mandated');
    this.modelData['TAGS'].push('no value add');
    this.modelData['TAGS'].push('no AI');
    this.modelData['ACTIONS'] = {};
    this.modelData['ACTIONS']['TEST ACTION'] = () => console.log('test');
    // this.dataLabels['tab'] = new FeatureDataTabGroup(
    //   this.g.bCart.x,
    //   this.g.bCart.y,
    //   this
    // );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIButtonResize('Resize', 1, 1, buttonSize, () =>
        this.setMode('resize')
      )
    );
    this.buttons.push(
      new FeatureUIButtonLetterLabel('Edit', 1, 0.5, buttonSize, () =>
        this.transitionPlant()
      )
    );
  }

  transitionPlant() {
    this.mode = 'transition_plant';
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
  }
}

class Source extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 196, 196, 'source'); // Call the parent constructor
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'SOURCE',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIOutputButton('Output', 0.5, 1, buttonSize, () =>
        this.setMode('o_connect')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('secondary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

    fill(getColor('primary'));
    noStroke();
    // Calculate the center of the rectangle
    const centerX = this.g.sCart.x + this.g.sDims.w / 2;
    const centerY = this.g.sCart.y + this.g.sDims.h / 2;
    // Draw the ellipse
    ellipse(centerX, centerY, this.g.sDims.w, this.g.sDims.h);
  }
}

class ParentLink extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 98, 98, 'parentLink'); // Call the parent constructor
    this.targetPlant = null;
    this.adoptable = false;
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabelTrigger(
      0.5,
      0.3,
      'PARENT',
      buttonSize,
      () => this.transitionPlant()
    ); // bad, fix with a mode
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
  }

  transitionPlant() {
    this.mode = 'transition_plant';
  }
}

class Sink extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 196, 196, 'sink'); // Call the parent constructor
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'SINK',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIInputButton('Input', 0.5, 0, buttonSize, () =>
        this.setMode('i_connect')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

    fill(getColor('secondary'));
    noStroke(); // Calculate the center of the rectangle
    const centerX = this.g.sCart.x + this.g.sDims.w / 2;
    const centerY = this.g.sCart.y + this.g.sDims.h / 2;

    // Draw the ellipse
    ellipse(centerX, centerY, this.g.sDims.w, this.g.sDims.h);
  }
}

class Zone extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'zone'); // Call the parent constructor
    this.type = 'zone';
    this.children = [];
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIButtonResize('Resize', 1, 1, buttonSize, () =>
        this.setMode('resize')
      )
    );
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'ZONE',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  draw(zoom, cnv) {
    noFill();
    stroke(getColor('accent'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
    this.notYetDrawnLabelAndButtons = true;
    this.drawButtonsAndLabels(zoom, cnv, getColor('accent'));
  }

  checkIfShouldBeChild(feature) {
    // The feature is considered to be in the zone if its x and y positions are
    // within the zone's width and height. This assumes x and y are the top left
    // coordinates and the feature's size is negligible or already accounted for.
    return (
      feature.g.bCart.x >= this.g.bCart.x &&
      feature.g.bCart.x <= this.g.bCart.x + this.g.bDims.w &&
      feature.g.bCart.y >= this.g.bCart.y &&
      feature.g.bCart.y <= this.g.bCart.y + this.g.bDims.h &&
      feature.data['id'] != this.data['id']
    );
  }

  moveToMouse() {
    const mob = screenToBoard(mouseX, mouseY);
    const oldX = this.g.bCart.x;
    const oldY = this.g.bCart.y;
    this.g.bCart.x = mob.x;
    this.g.bCart.y = mob.y;
    const delta = createVector(this.g.bCart.x - oldX, this.g.bCart.y - oldY);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].g.bCart.add(delta);
    }
  }

  checkIfIsChild(feature) {
    return this.children.includes(feature);
  }

  removeChild(feature) {
    this.children = this.children.filter((child) => child !== feature);
  }

  addChild(feature) {
    this.children.push(feature);
  }

  emptyChildren() {
    this.children = [];
  }
}

class Metric extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 196, 196, 'metric'); // Call the parent constructor
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'METRIC',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIInputButton('Input', 0.5, 0, buttonSize, () =>
        this.setMode('i_connect')
      )
    );
    this.buttons.push(
      new FeatureUIOutputButton('Output', 0.5, 1, buttonSize, () =>
        this.setMode('o_connect')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

    fill(getColor('secondary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.g.sCart.x + this.g.sDims.w / 2;
    const centerY = this.g.sCart.y + this.g.sDims.h / 2;

    // Calculate dimensions for the hourglass
    const top = this.g.sCart.y;
    const bottom = this.g.sCart.y + this.g.sDims.h;
    const left = this.g.sCart.x;
    const right = this.g.sCart.x + this.g.sDims.w;

    // Draw the top triangle
    triangle(centerX, centerY, left, top, right, top);

    // Draw the bottom triangle
    triangle(centerX, centerY, left, bottom, right, bottom);
  }
}

class Split extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 196, 196, 'split'); // Call the parent constructor
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'SPLIT',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIInputButton('Input', 0.5, 0, buttonSize, () =>
        this.setMode('i_connect')
      )
    );
    this.buttons.push(
      new FeatureUIOutputButton('Output', 0.5, 1, buttonSize, () =>
        this.setMode('o_connect')
      )
    );
    this.buttons.push(
      new FeatureUIOutputButton('Output', 1, 1, buttonSize, () =>
        this.setMode('o_connect')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

    fill(getColor('secondary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.g.sCart.x + this.g.sDims.w / 2;
    const centerY = this.g.sCart.y + this.g.sDims.h / 2;

    // Calculate dimensions for the hourglass
    const top = this.g.sCart.y;
    const bottom = this.g.sCart.y + this.g.sDims.h;
    const left = this.g.sCart.x;
    const right = this.g.sCart.x + this.g.sDims.w;

    // Draw the top triangle
    triangle(centerX, top, left, centerY, right, centerY);

    // Draw the bottom triangle
    triangle(centerX, bottom, left, centerY, right, centerY);
  }
}

class Merge extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 196, 196, 'merge'); // Call the parent constructor
  }

  initDataLabels(buttonSize) {
    this.dataLabels['title'] = new FeatureDataTextLabel(
      0,
      0.15,
      'MERGE',
      buttonSize,
      openDialog
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.data['id'],
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
    this.buttons.push(
      new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
        this.startDelete()
      )
    );
    this.buttons.push(
      new FeatureUIInputButton('Input', 0.3, 0, buttonSize, () =>
        this.setMode('i_connect')
      )
    );
    this.buttons.push(
      new FeatureUIInputButton('Input', 0.6, 0, buttonSize, () =>
        this.setMode('i_connect')
      )
    );
    this.buttons.push(
      new FeatureUIOutputButton('Output', 0.5, 1, buttonSize, () =>
        this.setMode('o_connect')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('secondary'));
    stroke(getColor('outline'));
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

    fill(getColor('primary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.g.sCart.x + this.g.sDims.w / 2;
    const centerY = this.g.sCart.y + this.g.sDims.h / 2;

    // Calculate dimensions for the hourglass
    const top = this.g.sCart.y;
    const bottom = this.g.sCart.y + this.g.sDims.h;
    const left = this.g.sCart.x;
    const right = this.g.sCart.x + this.g.sDims.w;

    // Draw the top triangle
    triangle(centerX, top, left, centerY, right, centerY);

    // Draw the bottom triangle
    triangle(centerX, bottom, left, centerY, right, centerY);
  }
}

class Connector extends Feature {
  constructor(x, y, input, output) {
    super(x, y, 0, 0, 'connector'); // Call the parent constructor
    this.changed = false;
    this.g.manualOnScreen = true;
    this.isAnimating = false;
    this.type = 'connector';
    this.connectorIsOnScreen = true;
    this.input = input;
    this.output = output;
    this.anchors = {};
    this.untethered = true;
    if (this.input && this.output) {
      this.untethered = false;
      let inputAnchor = input.buttons.find(
        (button) => button.label === 'Input'
      );
      this.anchors['Input'] = inputAnchor;
      let outputAnchor = output.buttons.find(
        (button) => button.label === 'Output'
      );
      this.anchors['Output'] = outputAnchor;
      this.setupAnchors();
    } else {
      this.source = this.input != null ? this.input : this.output;
      this.sourceType = this.input != null ? 'Input' : 'Output';
      this.anchors[this.sourceType] = this.source.caller; // buttons.find(button => button.label === this.sourceType);
    }
    this.mode = 'idle';
    this.untetheredClicks = 0;
    this.adoptable = false;
    this.path = [];
  }

  selfDescribe() {
    let res;
    if (!this.untethered) {
      res = super.selfDescribe();
    }
    return res;
  }

  computePath(zoom) {
    if (this.input && this.output) {
      let buffer = 20 * zoom;

      let x1 =
        this.anchors['Input'].g.sCart.x + this.anchors['Input'].g.sSqrDimOn2;
      let y1 = this.anchors['Input'].g.sCart.y;

      let x2 =
        this.anchors['Output'].g.sCart.x + this.anchors['Output'].g.sSqrDimOn2;
      let y2 =
        this.anchors['Output'].g.sCart.y + this.anchors['Output'].g.sSqrDim;
      buffer = min(buffer, Math.abs(y2 - y1) / 3);

      // Calculate the midpoints
      let midY = (y1 + y2) / 2;
      let midX = (x1 + x2) / 2;
      // Calculate the connection points
      let cpY1 = y1 - buffer;
      let cpY4 = y2 + buffer;
      // Update path with the new points
      this.path = [
        {
          x: x1,
          y: y1
        },
        {
          x: x1,
          y: cpY1
        },
        {
          x: midX,
          y: cpY1
        },
        {
          x: midX,
          y: cpY4
        },
        {
          x: x2,
          y: cpY4
        },
        {
          x: x2,
          y: y2
        }
      ];
    }
  }

  setupAnchors() {
    for (let anchor in this.anchors) {
      this.anchors[anchor].connected = true;
      this.anchors[anchor].associatedConnector = this;
    }
  }

  attach(dest) {
    this.untethered = false;
    this.input ? (this.output = dest) : (this.input = dest);
    let key = this.sourceType == 'Output' ? 'Input' : 'Output';
    this.anchors[key] = dest.caller; // dest.buttons.find(button => button.data['id'] === key);
    this.setupAnchors();
    this.changed = true;
  }

  update(zoom) {
    this.changed = false;
    if (this.input && this.output) {
      this.g.manualOnScreen =
        this.input.g.isOnScreen || this.output.g.isOnScreen;
      if (
        this.input.mode == 'delete' ||
        this.output.mode == 'delete' ||
        this.input.mode == 'deleting' ||
        this.output.mode == 'deleting' ||
        this.anchors['Input'].mode == 'delete' ||
        this.anchors['Output'].mode == 'delete'
      ) {
        this.mode = 'delete';
        this.anchors['Input'].connected = false;
        this.anchors['Output'].connected = false;
      }
      this.computePath(zoom);
    } else {
      this.untethered = true;
      this.connectorIsOnScreen = true;
      if (this.source.mode == 'delete') {
        this.markToDelete();
      }
    }
  }

  markToDelete() {
    this.mode = 'delete';
    for (let anchor in this.anchors) {
      this.anchors[anchor].connected = false;
      this.anchors[anchor].associatedConnector = null;
    }
    this.changed = true;
  }

  draw(zoom, cnv) {
    noFill();
    stroke(getColor('connector'));
    if (this.untethered == false) {
      for (let i = 0; i < this.path.length - 1; i++) {
        let point1 = this.path[i];
        let point2 = this.path[i + 1];
        line(point1.x, point1.y, point2.x, point2.y);
      }
    } else {
      for (let anchor in this.anchors) {
        if (anchor == 'Input') {
          line(
            this.anchors['Input'].g.sCart.x +
              this.anchors['Input'].g.sSqrDimOn2,
            this.anchors['Input'].g.sCart.y,
            mouseX,
            mouseY
          );
        } else {
          line(
            mouseX,
            mouseY,
            this.anchors['Output'].g.sCart.x +
              this.anchors['Output'].g.sSqrDimOn2,
            this.anchors['Output'].g.sCart.y + this.anchors['Output'].g.sSqrDim
          );
        }
      }
    }
  }
}
