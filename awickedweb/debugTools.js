class TimedLog {
    constructor() {
        this.time = millis();
        this.logs = {};
    }

    log(caller, msg=' ', interval=1) {
        if (caller in this.logs) {
            this.logs[caller].msg = msg;
            this.logs[caller].updated = true;
        } else {
            this.logs[caller] = {}
            this.logs[caller].msg = msg;
            this.logs[caller].interval = interval;
            this.logs[caller].trigger = millis();
            this.logs[caller].updated = true;
        }
    }

    update() {
        for (key in this.logs) {
            if (this.logs[key].trigger < millis() && this.logs[key].updated == true){
                console.log(key, this.logs[key].msg);
                this.logs[key].trigger = millis() + (this.logs[key].interval * 1000);
                this.logs[key].updated = false;
            }
        }
    }
};


function createPhysicsDiv() {
  physicsDiv = createDiv('<h3>Web Physics Tester</h3>');
  physicsDiv.html('Particle Mass<br>', true);
  let s = createSlider(1, 50, PARTICLE_MASS, 1);
  s.input(function () {PARTICLE_MASS = s.value();})
  s.parent(physicsDiv);
  s.style('width', '100%');
  physicsDiv.html('<br>Dampening<br>', true);
  let s1 = createSlider(0, 100, DAMPENING*100, 1);
  s1.input(function () {DAMPENING = parseFloat(s1.value())/100;})
  s1.parent(physicsDiv);
  s1.style('width', '100%');
  physicsDiv.html('<br>Gravity<br>', true);
  let s2 = createSlider(0, 10000, GRAVITY*10000);
  s2.input(function () { GRAVITY = s2.value()/10000;})
  s2.parent(physicsDiv);
  s2.style('width', '100%');
  physicsDiv.html('<br>Spring Constant<br>', true);
  let s3 = createSlider(0, 100, K*100);
  s3.input(function () { K = s3.value()/100;})
  s3.parent(physicsDiv);
  s3.style('width', '100%');
  physicsDiv.html('<small><br>Click to start a web. <br>Click again to end it.<br>Click on a web after starting a web to connect. <br>Click near a web to pull it and test physics.<br>SPACE: toggle debug shapes.<br>SHIFT click: start a web from a web connection.<br>X click: cut a web.</small>', true);
  physicsDiv.position(10, 10);
  physicsDiv.show();
  physicsDiv.style('background-color', '#BCBCBC');
  physicsDiv.style('padding', '10px');
  physicsDiv.mouseOver(function() {CURSOR_IN_GAME_WINDOW = false;});
  physicsDiv.mouseOut(function() {CURSOR_IN_GAME_WINDOW = true;});
}

function writePhysics(x, y) {
  fill(255);
  noStroke();
  text('FPS: ' + frameRate().toFixed(2), x, y);
  y += 18;
  text('Particle Mass: ' + String(PARTICLE_MASS), x, y);
  y += 18;
  text('Dampening: ' + String(DAMPENING), x, y);
  y += 18;
  text('Gravity: ' + String(GRAVITY), x, y);
  y += 18;
  text('Spring Constant: ' + String(K), x, y);
  y += 18;
}
