// Contains all global variables in the script.

function getUnsecureHash() {
    let myStr =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 8);
}

// Object to store colors
let colors = {};

// Object to store themes
let themes = {};

// Constant to represent the color theme
let COLOR_THEME = 'dark';

// Constant for text size
const myTextSize = 12;

// Reference to the canvas
let cnv;

// Navigation variables
let scrollX = 0;
let scrollY = 0;
let globalZoom = 1;
let mouseHasFocus = false;
let lastInputTime;

// Frame rates
let highFrameRate = 30;
let lowFrameRate = 5;

// Timeout for input detection
let inputTimeout = 500;

// Global singular objects
let menu;
let sess;
let keyboardRequiresFocus = false;

// Global mouse timer variables
let mousePressTime;
let mouseHoldDurationValue = 200;
let mouseOldPos;

// Mode status constants
let NO_CHANGE = 0;
let APPLICATION = 2;
let LANDING = 1;

// JSON loader object
let JSONloader;

