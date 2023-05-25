let colors = {};
let themes = {};
let COLOR_THEME = "dark";


let scrollX = 0;
let scrollY = 0;
let zoom = 1;
let mouseHasFocus = false;
let lastInputTime;
let highFrameRate = 30;
let lowFrameRate = 5;
let inputTimeout = 1000;

let menu;

let plant;
let myTextSize = 12;

let mousePressTime;
let mouseHoldDurationValue = 200;
let mouseOldPos;

let robotoMono;