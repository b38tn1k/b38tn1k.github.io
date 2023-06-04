const BUTTON_SIZE = 20;

class Feature {
  constructor(x, y, w = 400, h = 280, type) {
    this.id = type + '->' + getUnsecureHash();

    this.g = new Geometry(x, y, w, h);

    this.board = createVector(x, y);
    this.width = 0;
    this.height = 0;
    this.animationW = w;
    this.animationH = h;
    this.shouldRender = true;

    this.mode = 'idle';
    this.buttons = [];
    this.type = type;
    this.dataLabels = {};
    this.data = {};
    this.isAnimating = true;
    this.doAnimations = true;
    this.animationValue = 0.0;
    this.adoptable = true;
    this.notYetDrawnLabelAndButtons = true;
    this.caller = null;
    this.modelData = {};
    this.initButtons(BUTTON_SIZE);
    this.initDataLabels(BUTTON_SIZE);
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
    this.height = this.animationH;
    this.width = this.animationW;
  }

  moveToMouse() {
    let mob = screenToBoard(mouseX, mouseY);
    this.board.x = mob.x;
    this.board.y = mob.y;
  }

  resizeToMouse() {
    let mob = screenToBoard(mouseX, mouseY);
    let pWidth = mob.x - this.board.x;
    let pHeight = mob.y - this.board.y;
    if (pWidth > 50 && pHeight > 50) {
      this.width = pWidth;
      this.height = pHeight;
    }
  }

  updateScreenCoords(zoom) {
    this.screen = boardToScreen(this.board.x, this.board.y);
    this.onScreenWidth = this.width * zoom;
    this.onScreenHeight = this.height * zoom;
  }

  updateButtonsAndLabels(zoom) {
    this.buttons = this.buttons.filter((button) => button.mode !== 'delete');
    for (let button of this.buttons) {
      button.update(
        zoom,
        this.screen.x,
        this.screen.y,
        this.onScreenWidth,
        this.onScreenHeight
      );
    }
    for (let label in this.dataLabels) {
      this.dataLabels[label].update(
        zoom,
        this.screen.x,
        this.screen.y,
        this.onScreenWidth,
        this.onScreenHeight
      );
      if (this.dataLabels[label].mode == 'busy') {
        this.mode = this.dataLabels[label].mode;
      } else if (this.dataLabels[label].mode == 'cleared') {
        this.dataLabels[label].mode = 'idle';
        this.mode = 'idle';
      }
    }
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
    this.shouldRender = this.isInScreen();
    this.updateScreenCoords(zoom);
    this.updateButtonsAndLabels(zoom);
    this.checkModeAndAct();
  }

  checkModeAndAct() {
    switch (this.mode) {
      case 'move':
        if (mouseIsPressed == false) {
          this.setMode('idle');
        }
        break;
      case 'delete':
        break;
      case 'edit':
        break;
      case 'i_connect':
        break;
      case 'o_connect':
        break;
      case 'resize':
        if (mouseIsPressed == false) {
          this.setMode('idle');
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

      this.height = this.animationH * this.animationValue;
      this.width = this.animationW * this.animationValue;
      if (this.animationValue >= 1.0 && this.mode != 'deleting') {
        this.isAnimating = false;
        this.height = this.animationH;
        this.width = this.animationW;
      }
      if (this.animationValue <= 0.0 && this.mode == 'deleting') {
        this.mode = 'delete';
      }
    }

    if (this.shouldRender == true) {
      this.notYetDrawnLabelAndButtons = true;
      this.draw(zoom, cnv);
      this.drawButtonsAndLabels(zoom, cnv);
    }
  }

  isInScreen() {
    let screenTopLeft = screenToBoard(0, 0);
    let screenBottomRight = screenToBoard(windowWidth, windowHeight);

    return (
      this.board.x < screenBottomRight.x &&
      this.board.x + this.width > screenTopLeft.x &&
      this.board.y < screenBottomRight.y &&
      this.board.y + this.height > screenTopLeft.y
    );
  }

  handleMousePress(zoom) {
    for (let button of this.buttons) {
      const res = button.checkMouseClick(zoom);
      if (res) {
        this.caller = button;
      }
    }
    for (let label in this.dataLabels) {
      this.dataLabels[label].checkMouseClick(zoom);
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
      (index) => this.plant.features[index].id
    );
    const validSinkIds = Array.from(this.buses['sink']).map(
      (index) => this.plant.features[index].id
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
      let id = this.plant.features[index].id;
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
    } else {
      // this.plant.update(zoom);
    }
  }

  initDataLabels(buttonSize) {
    // this.dataLabels['title'] = new FeatureDataTextLabel(
    //   0,
    //   0.15,
    //   'PROCESS',
    //   buttonSize,
    //   openDialog
    // );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.id,
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
    this.dataLabels['tab'] = new FeatureDataTabGroup(
      this.board.x,
      this.board.y,
      this
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);
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
      this.id,
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);

    fill(getColor('primary'));
    noStroke();
    // Calculate the center of the rectangle
    const centerX = this.screen.x + this.onScreenWidth / 2;
    const centerY = this.screen.y + this.onScreenHeight / 2;
    // Draw the ellipse
    ellipse(centerX, centerY, this.onScreenWidth, this.onScreenHeight);
  }
}

class ParentLink extends Feature {
  constructor(x, y, width, height) {
    super(x, y, 98, 98, 'parentLink'); // Call the parent constructor
    this.targetPlant = null;
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
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
        this.setMode('move')
      )
    );
  }

  draw(zoom, cnv) {
    fill(getColor('primary'));
    stroke(getColor('outline'));
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);
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
      this.id,
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);

    fill(getColor('secondary'));
    noStroke(); // Calculate the center of the rectangle
    const centerX = this.screen.x + this.onScreenWidth / 2;
    const centerY = this.screen.y + this.onScreenHeight / 2;

    // Draw the ellipse
    ellipse(centerX, centerY, this.onScreenWidth, this.onScreenHeight);
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
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
      this.id,
      buttonSize,
      NOP
    );
  }

  draw(zoom, cnv) {
    noFill();
    stroke(getColor('accent'));
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);
    this.notYetDrawnLabelAndButtons = true;
    this.drawButtonsAndLabels(zoom, cnv, getColor('accent'));
  }

  checkIfChild(feature) {
    // The feature is considered to be in the zone if its x and y positions are
    // within the zone's width and height. This assumes x and y are the top left
    // coordinates and the feature's size is negligible or already accounted for.
    return (
      feature.x >= this.board.x &&
      feature.x <= this.board.x + this.width &&
      feature.y >= this.board.y &&
      feature.y <= this.board.y + this.height &&
      feature.id != this.id
    );
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
      NOP
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.id,
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);

    fill(getColor('secondary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.screen.x + this.onScreenWidth / 2;
    const centerY = this.screen.y + this.onScreenHeight / 2;

    // Calculate dimensions for the hourglass
    const top = this.screen.y;
    const bottom = this.screen.y + this.onScreenHeight;
    const left = this.screen.x;
    const right = this.screen.x + this.onScreenWidth;

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
      NOP
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.id,
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);

    fill(getColor('secondary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.screen.x + this.onScreenWidth / 2;
    const centerY = this.screen.y + this.onScreenHeight / 2;

    // Calculate dimensions for the hourglass
    const top = this.screen.y;
    const bottom = this.screen.y + this.onScreenHeight;
    const left = this.screen.x;
    const right = this.screen.x + this.onScreenWidth;

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
      NOP
    );
    this.dataLabels['id'] = new FeatureDataIDLabel(
      0,
      1,
      this.id,
      buttonSize,
      NOP
    );
  }

  initButtons(buttonSize) {
    this.buttons.push(
      new FeatureUIButtonMove('Move', 0, 0, buttonSize, () =>
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
    rect(this.screen.x, this.screen.y, this.onScreenWidth, this.onScreenHeight);

    fill(getColor('primary'));
    noStroke();
    // Calculate the center of the rectangle Calculate the center of the rectangle
    const centerX = this.screen.x + this.onScreenWidth / 2;
    const centerY = this.screen.y + this.onScreenHeight / 2;

    // Calculate dimensions for the hourglass
    const top = this.screen.y;
    const bottom = this.screen.y + this.onScreenHeight;
    const left = this.screen.x;
    const right = this.screen.x + this.onScreenWidth;

    // Draw the top triangle
    triangle(centerX, top, left, centerY, right, centerY);

    // Draw the bottom triangle
    triangle(centerX, bottom, left, centerY, right, centerY);
  }
}

class Connector extends Feature {
  constructor(x, y, input, output) {
    super(x, y, 0, 0, 'connector'); // Call the parent constructor
    this.isAnimating = false;
    this.type = 'connector';
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

  computePath(zoom) {
    if (this.input && this.output) {
      let buffer = 20 * zoom;

      let x1 =
        this.anchors['Input'].screen.x + this.anchors['Input'].screenDimOn2;
      let y1 = this.anchors['Input'].screen.y;

      let x2 =
        this.anchors['Output'].screen.x + this.anchors['Output'].screenDimOn2;
      let y2 =
        this.anchors['Output'].screen.y + this.anchors['Output'].screenDim;
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
    this.anchors[key] = dest.caller; // dest.buttons.find(button => button.id === key);
    this.setupAnchors();
  }

  update(zoom) {
    this.shouldRender = true;
    if (this.input && this.output) {
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
      // line(this.anchors['Input'].screen.x + this.anchors['Input'].screenDimOn2,
      // this.anchors['Input'].screen.y, this.anchors['Output'].screen.x +
      // this.anchors['Output'].screenDimOn2, this.anchors['Output'].screen.y +
      // this.anchors['Output'].screenDim);
    } else {
      for (let anchor in this.anchors) {
        if (anchor == 'Input') {
          line(
            this.anchors['Input'].screen.x + this.anchors['Input'].screenDimOn2,
            this.anchors['Input'].screen.y,
            mouseX,
            mouseY
          );
        } else {
          line(
            mouseX,
            mouseY,
            this.anchors['Output'].screen.x +
              this.anchors['Output'].screenDimOn2,
            this.anchors['Output'].screen.y + this.anchors['Output'].screenDim
          );
        }
      }
    }
  }
}
