let colors = {};
let themes = {};
let COLOR_THEME = 'dark';


let scrollX = 0;
let scrollY = 0;
let globalZoom = 1;
let mouseHasFocus = false;
let lastInputTime;
let highFrameRate = 30;
let lowFrameRate = 5;
let inputTimeout = 500;

let menu;

let session;
let myTextSize = 12;

let mousePressTime;
let mouseHoldDurationValue = 200;
let mouseOldPos;

let app;
let NO_CHANGE = 0;
let APPLICATION = 2;
let LANDING = 1;