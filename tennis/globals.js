// Frame rates
let highFrameRate = 30;
let lowFrameRate = 30;

// Global mouse timer variables
let mousePressTime;
let mouseOldPos;
let inputTimeout = 500;

function fpsEvent() {
  lastInputTime = millis(); // I wish JS had decorators
  frameRate(highFrameRate);
}

// Player data
let globalPlayers;

// Mode constants
const SCHEDULER = 0;
const AVAILABILITY = 1;

// Current mode
let mode = AVAILABILITY;

// mode classes
let availability;
let scheduler;

// Canvas reference
let cnv;
