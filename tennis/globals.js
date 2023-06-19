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

// ID tool
function getUnsecureHash() {
  let myStr =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  myStr += myStr + myStr;
  return myStr.substring(0, 8);
}

globalPlayers = `
[
  {
    "firstName": "Dan",
    "lastName": "S",
    "fullName": "Dan S",
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
    ],
    "unsecureID": "67xerlr8"
  },
  {
    "firstName": "Dan",
    "lastName": "M",
    "fullName": "Dan M",
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
    ],
    "unsecureID": "6aa6p33v"
  },
  {
    "firstName": "Zultan",
    "lastName": "P",
    "fullName": "Zultan P",
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
    ],
    "unsecureID": "i0c74mpp"
  },
  {
    "firstName": "Casey",
    "lastName": "R",
    "fullName": "Casey R",
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
    ],
    "unsecureID": "9mafjdn3"
  },
  {
    "firstName": "Steve",
    "lastName": "C",
    "fullName": "Steve C",
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
    ],
    "unsecureID": "il4gs0qu"
  },
  {
    "firstName": "Antony",
    "lastName": "A",
    "fullName": "Antony A",
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
    ],
    "unsecureID": "iar6vill"
  },
  {
    "firstName": "Phil",
    "lastName": "N",
    "fullName": "Phil N",
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
    ],
    "unsecureID": "d727yblr"
  },
  {
    "firstName": "Kieran",
    "lastName": "O",
    "fullName": "Kieran O",
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
    ],
    "unsecureID": "tn59layc"
  },
  {
    "firstName": "David",
    "lastName": "D",
    "fullName": "David D",
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
    ],
    "unsecureID": "rxkih3sa"
  },
  {
    "firstName": "Kevin",
    "lastName": "R",
    "fullName": "Kevin R ",
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
    ],
    "unsecureID": "mlqk4d8c"
  },
  {
    "firstName": "Larry",
    "lastName": "E",
    "fullName": "Larry E",
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
    ],
    "unsecureID": "dr3phfwr"
  }
]

`