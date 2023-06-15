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

globalPlayers = `
[
  {
    "firstName": "Dan",
    "lastName": "S",
    "contact": "",
    "availability": [
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true
    ]
  },
  {
    "firstName": "Dan",
    "lastName": "M",
    "contact": "",
    "availability": [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  },
  {
    "firstName": "Zultan",
    "lastName": "P",
    "contact": "",
    "availability": [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  },
  {
    "firstName": "Casey",
    "lastName": "R",
    "contact": "",
    "availability": [
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true
    ]
  },
  {
    "firstName": "Steve",
    "lastName": "C",
    "contact": "",
    "availability": [
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false
    ]
  },
  {
    "firstName": "Antony",
    "lastName": "A",
    "contact": "",
    "availability": [
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  },
  {
    "firstName": "Phil",
    "lastName": "N",
    "contact": "",
    "availability": [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  },
  {
    "firstName": "Kieran",
    "lastName": "O",
    "contact": "",
    "availability": [
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false
    ]
  },
  {
    "firstName": "David",
    "lastName": "D",
    "contact": "",
    "availability": [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  },
  {
    "firstName": "Kevin R",
    "lastName": "",
    "contact": "",
    "availability": [
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false
    ]
  },
  {
    "firstName": "Larry",
    "lastName": "E",
    "contact": "",
    "availability": [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ]
  }
]



`