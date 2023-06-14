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
      "firstName": "Roger",
      "lastName": "Federer",
      "contact": "roger.federer@example.com",
      "availability": [true, true, false, false, true, true]
  },
  {
      "firstName": "Rafael",
      "lastName": "Nadal",
      "contact": "rafael.nadal@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Novak",
      "lastName": "Djokovic",
      "contact": "novak.djokovic@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Serena",
      "lastName": "Williams",
      "contact": "serena.williams@example.com",
      "availability": [true, true, true, true, false, false]
  },
  {
      "firstName": "Naomi",
      "lastName": "Osaka",
      "contact": "naomi.osaka@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Stefanos",
      "lastName": "Tsitsipas",
      "contact": "stefanos.tsitsipas@example.com",
      "availability": [false, true, true, true, true, true]
  },
  {
      "firstName": "Ashleigh",
      "lastName": "Barty",
      "contact": "ashleigh.barty@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Daniil",
      "lastName": "Medvedev",
      "contact": "daniil.medvedev@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Simona",
      "lastName": "Halep",
      "contact": "simona.halep@example.com",
      "availability": [true, true, false, false, true, true]
  },
  {
      "firstName": "Dominic",
      "lastName": "Thiem",
      "contact": "dominic.thiem@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Aryna",
      "lastName": "Sabalenka",
      "contact": "aryna.sabalenka@example.com",
      "availability": [true, true, true, true, true, true]
  },
  {
      "firstName": "Alexander",
      "lastName": "Zverev",
      "contact": "alexander.zverev@example.com",
      "availability": [true, true, true, true, true, true]
  }
]


`