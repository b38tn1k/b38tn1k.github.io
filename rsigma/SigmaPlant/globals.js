let colors = {};
let themes = {};
let COLOR_THEME = 'dark';
const myTextSize = 12;
//canvas
let cnv;
//navigation stuff
let scrollX = 0;
let scrollY = 0;
let globalZoom = 1;
let mouseHasFocus = false;
let lastInputTime;
let highFrameRate = 30;
let lowFrameRate = 5;
let inputTimeout = 500;
// global singular
let menu;
let sess;
// global mouse timer
let mousePressTime;
let mouseHoldDurationValue = 200;
let mouseOldPos;
// mode status
let NO_CHANGE = 0;
let APPLICATION = 2;
let LANDING = 1;
