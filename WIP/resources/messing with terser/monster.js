var printStack = true;
var clickDebug = true;
var showDev = true;
var showFPS = true;
// printStack = false;
clickDebug = false;
showDev = false;
showFPS = false;

var B_UNSET = 0;
var B_TRUE = 1;
var B_FALSE = 2;

var RM_NORMAL = 0;
var RM_CREATE = 1;
var RM_PRESENT = 2;

var M_IDLE = 0;
var M_MOVE = 1;
var M_RESIZE = 2;
var M_DELETE = 3;
var M_SELECTED = 4;
var M_EXPAND_OR_COLLAPSE = 5;
var M_START = 6;
var M_NEW = 7;
var M_COPY = 8;
var M_MUTATE = 9;

var V_NUMBER = 0;
var V_STRING = 1;
var V_BOOL = 2;

var TST_OFF = 0;
var TST_LOAD = 1;
var TST_TIDY = 2;
var TST_RUN = 3;
var TST_PAUSE = 4;

var T_START = 1;
var T_STOP = 105;
var T_COMMENT = 3;
var T_BLOCK = 23;
var T_LEN = 6;
var T_GET = 8;
var T_RUN = 53;
var T_SET = 10;
var T_VAR = 45;
var T_INPUT = 47;
var T_CONST = 46;
var T_IF = 30;
var T_WHILE = 7;
var T_EQUAL = 48;
var T_LESS = 9;
var T_GREATER = 38;
var T_ADD = 11;
var T_SUBTRACT = 52;
var T_MULT = 13;
var T_DIV = 14;
var T_MOD = 32;
var T_AVERAGE = 33;
var T_SQRT = 34;
var T_HYPOT = 35;
var T_GOTO = 16;
var T_NOT = 28;
var T_COS = 24;
var T_SIN = 26;
var T_CONDITION = 103;
var T_RANGE = 150;
var T_ELSE = 102;
var T_DO = 101;
var T_OUTLET = 104;
var T_ASSIGN = 42;
var T_CONSOLE = 2;
var T_PRINT = 27;
var T_TURTLE = 0;
var T_INLET = 201;
var T_ROUND = 4;
var T_PUSH = 41;
var T_DELETE = 44;
var T_FOR = 51;
var T_INDEX = 222;
var T_REF = 223;
var T_LAYOUT_BLOCK = 666;

var backupObject;
var zoomMode = false;
var mobileDeviceDetected = false;
var selectChanged = true;
var fontSizeString = '12px';
var doJLOG = false;
var doJLOGCountDown = 0;
var bgGrid, widthOnTwo, heightOnTwo, cells, c, shareLinkString, pres;
var myDivs = {};
var xPos, yPos, xStart, yStart, xOff, yOff, doMouseDrag;
var allColors = {};
var showBlockMenu = false;
var showDemoMenu = false;
var showUtils = false;
var shareLinkGenerated = false;
var slowMode = false;
var fastMode = false;
var speedMode = 0;
var flash = true;
var gridSize = 20;
var demos = [];
var mobileHType;
var mobileHAddon = false;
var tidyFlag = 0;
var expandMenu = true;
var submenu = 0;
var currentTestIndex = 0;
var testPacer = 0;
var testPaceSettings = [0, 0, 0, 500, 500];
var testTimer = TST_OFF;
var testLoop = false;
var tutorial = false;
var tutorialstring = '';
var hideMenu = false;
var disableDrag = false;
var mainDiv;
let logCounter = 0;
var redrawCounter = 0;
var notIdle = true;
var noClickZone = [0, 0, 0, 0];
var clearCellFlag = 0;
var speedButton, flashButton;
var showGUI = true;
var presentationMode = false;
var presCreationMode = false;
var autoStart = false;
var presentationDivs = {};
var runMode = RM_NORMAL;


var turtleVars = ['turtleX', 'turtleY', 'turtleDraw'];
var everyone = [T_COMMENT, T_CONST, T_BLOCK, T_VAR, T_INPUT, T_IF, T_WHILE, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_GOTO, T_NOT, T_CONDITION, T_ELSE, T_DO, T_OUTLET, T_ASSIGN, T_PRINT, T_AVERAGE, T_SQRT, T_HYPOT, T_SIN, T_COS, T_LEN, T_GET, T_SET, T_START, T_CONSOLE, T_ROUND, T_PUSH, T_DELETE, T_FOR, T_RUN];
var userBlocks = [T_BLOCK, T_GOTO, T_INPUT, T_VAR, T_CONST, T_ASSIGN, T_IF, T_WHILE, T_NOT, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_AVERAGE, T_SQRT, T_HYPOT, T_PRINT, T_COMMENT, T_COS, T_SIN, T_TURTLE, T_LEN, T_GET, T_SET, T_ROUND, T_PUSH, T_DELETE, T_FOR, T_RUN];
var notStartOrConsole = [T_COMMENT, T_CONST, T_VAR, T_IF, T_WHILE, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_GOTO, T_NOT, T_CONDITION, T_ELSE, T_DO, T_OUTLET, T_ASSIGN, T_PRINT, T_AVERAGE, T_SQRT, T_HYPOT, T_SIN, T_COS, T_LEN, T_GET, T_SET, T_ROUND, T_PUSH, T_DELETE, T_FOR, T_RUN];
var notStartOrConsoleOrSpecial = [T_COMMENT, T_CONST, T_VAR, T_IF, T_WHILE, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_GOTO, T_NOT, T_ASSIGN, T_PRINT, T_AVERAGE, T_SQRT, T_HYPOT, T_SIN, T_COS, T_LEN, T_GET, T_SET, T_ROUND, T_PUSH, T_DELETE, T_FOR, T_RUN];
var numberyOnes = [T_OUTLET, T_COMMENT, T_CONST, T_VAR, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_AVERAGE, T_SQRT, T_HYPOT, T_COS, T_SIN, T_LEN, T_GET, T_ROUND];
var boolyOnes = [T_COMMENT, T_NOT, T_EQUAL, T_GREATER, T_LESS];
var conditionallyOnes = boolyOnes.concat(numberyOnes.slice(1));
var presComponents = [T_INPUT, T_CONST];

var mathFunctions = [T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_AVERAGE, T_SQRT, T_HYPOT, T_SIN, T_COS, T_ROUND];
var boolFunctions = [T_NOT, T_EQUAL, T_GREATER, T_LESS];
var utilities = [T_COMMENT, T_PRINT, T_TURTLE];
var conditionals = [T_IF, T_WHILE, T_FOR];
var containers = [T_BLOCK, T_INPUT, T_CONST,];
var handles = [T_GOTO, T_VAR, T_ASSIGN];
var arrayTools = [T_LEN, T_GET, T_SET, T_PUSH, T_DELETE, T_RUN];

var blockMenuDict = {};
blockMenuDict['data containers'] = containers;
blockMenuDict['data references'] = handles;
blockMenuDict['array tools'] = arrayTools;
blockMenuDict['math'] = mathFunctions;
blockMenuDict['comparisons'] = boolFunctions;
blockMenuDict['conditionals'] = conditionals;
blockMenuDict['utilities'] = utilities;




var blockConfig = {};
blockConfig[T_BLOCK] = {};
blockConfig[T_GOTO] = {};
blockConfig[T_VAR] = {};
blockConfig[T_INPUT] = {};
blockConfig[T_IF] = {};
blockConfig[T_WHILE] = {};
blockConfig[T_EQUAL] = {};
blockConfig[T_LESS] = {};
blockConfig[T_GREATER] = {};
blockConfig[T_ADD] = {};
blockConfig[T_HYPOT] = {};
blockConfig[T_AVERAGE] = {};
blockConfig[T_SQRT] = {};
blockConfig[T_SUBTRACT] = {};
blockConfig[T_MULT] = {};
blockConfig[T_DIV] = {};
blockConfig[T_MOD] = {};
blockConfig[T_NOT] = {};
blockConfig[T_CONDITION] = {};
blockConfig[T_RANGE] = {};
blockConfig[T_ELSE] = {};
blockConfig[T_DO] = {};
blockConfig[T_OUTLET] = {};
blockConfig[T_START] = {};
blockConfig[T_STOP] = {};
blockConfig[T_ASSIGN] = {};
blockConfig[T_CONSOLE] = {};
blockConfig[T_PRINT] = {};
blockConfig[T_COMMENT] = {};
blockConfig[T_CONST] = {};
blockConfig[T_TURTLE] = {};
blockConfig[T_INLET] = {};
blockConfig[T_SIN] = {};
blockConfig[T_COS] = {};
blockConfig[T_LEN] = {};
blockConfig[T_GET] = {};
blockConfig[T_RUN] = {};
blockConfig[T_SET] = {};
blockConfig[T_ROUND] = {};
blockConfig[T_PUSH] = {};
blockConfig[T_DELETE] = {};
blockConfig[T_FOR] = {};
blockConfig[T_INDEX] = {};
blockConfig[T_REF] = {};
blockConfig[T_LAYOUT_BLOCK] = {};


blockConfig[T_BLOCK]['block label'] = "block";
blockConfig[T_GOTO]['block label'] = "block";
blockConfig[T_VAR]['block label'] = "variable";
blockConfig[T_INPUT]['block label'] = "variable";
blockConfig[T_IF]['block label'] = "if";
blockConfig[T_WHILE]['block label'] = "while";
blockConfig[T_EQUAL]['block label'] = "equal";
blockConfig[T_LESS]['block label'] = "less";
blockConfig[T_GREATER]['block label'] = "greater";
blockConfig[T_ADD]['block label'] = "add";
blockConfig[T_AVERAGE]['block label'] = "average";
blockConfig[T_SQRT]['block label'] = "sqrt";
blockConfig[T_HYPOT]['block label'] = "hypot";
blockConfig[T_SUBTRACT]['block label'] = "subtract";
blockConfig[T_MULT]['block label'] = "multiply";
blockConfig[T_DIV]['block label'] = "divide";
blockConfig[T_MOD]['block label'] = "modulus";
blockConfig[T_NOT]['block label'] = "not";
blockConfig[T_CONDITION]['block label'] = "condition";
blockConfig[T_RANGE]['block label'] = "repeats w/ count";
blockConfig[T_ELSE]['block label'] = "else";
blockConfig[T_DO]['block label'] = "do";
blockConfig[T_OUTLET]['block label'] = "out";
blockConfig[T_START]['block label'] = "start";
blockConfig[T_STOP]['block label'] = "stop";
blockConfig[T_ASSIGN]['block label'] = "assign";
blockConfig[T_CONSOLE]['block label'] = "console";
blockConfig[T_PRINT]['block label'] = "print";
blockConfig[T_COMMENT]['block label'] = "//";
blockConfig[T_CONST]['block label'] = "constant";
blockConfig[T_TURTLE]['block label'] = "turtle 200x150";
blockConfig[T_INLET]['block label'] = "inlet";
blockConfig[T_SIN]['block label'] = "sin";
blockConfig[T_COS]['block label'] = "cos";
blockConfig[T_LEN]['block label'] = "length";
blockConfig[T_GET]['block label'] = "get";
blockConfig[T_RUN]['block label'] = "run";
blockConfig[T_SET]['block label'] = "set";
blockConfig[T_ROUND]['block label'] = "round";
blockConfig[T_PUSH]['block label'] = "push";
blockConfig[T_DELETE]['block label'] = "delete";
blockConfig[T_FOR]['block label'] = "repeat";
blockConfig[T_INDEX]['block label'] = "index";
blockConfig[T_REF]['block label'] = "value";
blockConfig[T_LAYOUT_BLOCK]['block label'] = "layout cell";

blockConfig[T_BLOCK]['accept child'] = notStartOrConsoleOrSpecial;
blockConfig[T_VAR]['accept child'] = [T_COMMENT]; //nothing
blockConfig[T_INPUT]['accept child'] = [T_COMMENT]; //nothing
blockConfig[T_IF]['accept child'] = [T_CONDITION, T_DO, T_ELSE, T_COMMENT];
blockConfig[T_WHILE]['accept child'] = [T_CONDITION, T_DO, T_ELSE, T_COMMENT];
blockConfig[T_FOR]['accept child'] = [T_RANGE, T_DO, T_ELSE, T_COMMENT];
blockConfig[T_EQUAL]['accept child'] = numberyOnes.slice(1);//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD];
blockConfig[T_LESS]['accept child'] = numberyOnes.slice(1);//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD];
blockConfig[T_GREATER]['accept child'] = numberyOnes.slice(1);//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD];
blockConfig[T_ADD]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_AVERAGE]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_SIN]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_COS]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_SQRT]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_ROUND]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_SUBTRACT]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_MULT]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_DIV]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_HYPOT]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_MOD]['accept child'] = numberyOnes;//[T_OUTLET, T_VAR, T_INPUT, T_CONST, T_COMMENT];
blockConfig[T_GOTO]['accept child'] = [T_COMMENT];
blockConfig[T_NOT]['accept child'] = [...conditionallyOnes];
// blockConfig[T_NOT]['accept child'].push(T_OUTLET);
blockConfig[T_CONDITION]['accept child'] = conditionallyOnes;
blockConfig[T_RANGE]['accept child'] = [T_OUTLET, T_COMMENT, T_CONST, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_AVERAGE, T_SQRT, T_HYPOT, T_COS, T_SIN, T_LEN, T_GET, T_ROUND, T_LEN];
blockConfig[T_ELSE]['accept child'] = notStartOrConsole;
blockConfig[T_DO]['accept child'] = notStartOrConsole;
blockConfig[T_OUTLET]['accept child'] = [T_COMMENT];
blockConfig[T_START]['accept child'] = notStartOrConsoleOrSpecial;
blockConfig[T_START]['accept child'].push(T_BLOCK);
blockConfig[T_STOP]['accept child'] = [];
blockConfig[T_ASSIGN]['accept child'] = [T_VAR, T_CONST, T_COMMENT, T_GET];
blockConfig[T_CONSOLE]['accept child'] = [];
blockConfig[T_PRINT]['accept child'] = [T_VAR, T_INPUT, T_CONST, T_COMMENT, T_GOTO, T_BLOCK, T_GET];
blockConfig[T_COMMENT]['accept child'] = [];
blockConfig[T_CONST]['accept child'] = [T_COMMENT];
blockConfig[T_TURTLE]['accept child'] = [T_INLET];
blockConfig[T_INLET]['accept child'] = [];
blockConfig[T_LEN]['accept child'] = [];
blockConfig[T_GET]['accept child'] = [T_INDEX];
blockConfig[T_RUN]['accept child'] = [T_INDEX];
blockConfig[T_SET]['accept child'] = [T_INDEX, T_REF];
blockConfig[T_PUSH]['accept child'] = [T_REF];
blockConfig[T_DELETE]['accept child'] = [T_INDEX];
blockConfig[T_INDEX]['accept child'] = numberyOnes.slice(1);
blockConfig[T_REF]['accept child'] = numberyOnes.slice(1);
blockConfig[T_REF]['accept child'].push(T_GOTO);
blockConfig[T_LAYOUT_BLOCK]['accept child'] = presComponents;

blockConfig[T_BLOCK]['max children'] = 100;
blockConfig[T_GOTO]['max children'] = 0;
blockConfig[T_VAR]['max children'] = 0;
blockConfig[T_INPUT]['max children'] = 0;
blockConfig[T_IF]['max children'] = 3;
blockConfig[T_WHILE]['max children'] = 3;
blockConfig[T_FOR]['max children'] = 3;
blockConfig[T_EQUAL]['max children'] = 100;
blockConfig[T_LESS]['max children'] = 100;
blockConfig[T_GREATER]['max children'] = 100;
blockConfig[T_ADD]['max children'] = 100;
blockConfig[T_AVERAGE]['max children'] = 100;
blockConfig[T_SQRT]['max children'] = 2;
blockConfig[T_ROUND]['max children'] = 2;
blockConfig[T_SIN]['max children'] = 2;
blockConfig[T_COS]['max children'] = 2;
blockConfig[T_SUBTRACT]['max children'] = 100;
blockConfig[T_MULT]['max children'] = 100;
blockConfig[T_DIV]['max children'] = 100;
blockConfig[T_MOD]['max children'] = 100;
blockConfig[T_HYPOT]['max children'] = 100;
blockConfig[T_NOT]['max children'] = 100;
blockConfig[T_CONDITION]['max children'] = 100;
blockConfig[T_RANGE]['max children'] = 1;
blockConfig[T_ELSE]['max children'] = 100;
blockConfig[T_DO]['max children'] = 100;
blockConfig[T_OUTLET]['max children'] = 0;
blockConfig[T_START]['max children'] = 100;
blockConfig[T_STOP]['max children'] = 100;
blockConfig[T_ASSIGN]['max children'] = 100;
blockConfig[T_CONSOLE]['max children'] = 0;
blockConfig[T_PRINT]['max children'] = 100;
blockConfig[T_COMMENT]['max children'] = 0;
blockConfig[T_CONST]['max children'] = 0;
blockConfig[T_TURTLE]['max children'] = 3;
blockConfig[T_INLET]['max children'] = 2;
blockConfig[T_LEN]['max children'] = 1;
blockConfig[T_GET]['max children'] = 1;
blockConfig[T_RUN]['max children'] = 1;
blockConfig[T_SET]['max children'] = 2;
blockConfig[T_PUSH]['max children'] = 1;
blockConfig[T_DELETE]['max children'] = 1;
blockConfig[T_INDEX]['max children'] = 1;
blockConfig[T_REF]['max children'] = 1;
blockConfig[T_LAYOUT_BLOCK]['max children'] = 1;

var I_NONE = 0;
var I_TEXT = 1;
var I_SELECT = 2;
var I_TEXT_AREA = 3;
var I_CANVAS = 0;

blockConfig[T_BLOCK]['input type'] = I_TEXT;
blockConfig[T_GOTO]['input type'] = I_SELECT;
blockConfig[T_VAR]['input type'] = I_SELECT;
blockConfig[T_INPUT]['input type'] = I_TEXT;
blockConfig[T_IF]['input type'] = I_NONE;
blockConfig[T_WHILE]['input type'] = I_NONE;
blockConfig[T_FOR]['input type'] = I_NONE;
blockConfig[T_EQUAL]['input type'] = I_NONE;
blockConfig[T_LESS]['input type'] = I_NONE;
blockConfig[T_GREATER]['input type'] = I_NONE;
blockConfig[T_ADD]['input type'] = I_NONE;
blockConfig[T_SIN]['input type'] = I_NONE;
blockConfig[T_COS]['input type'] = I_NONE;
blockConfig[T_AVERAGE]['input type'] = I_NONE;
blockConfig[T_SQRT]['input type'] = I_NONE;
blockConfig[T_ROUND]['input type'] = I_NONE;
blockConfig[T_SUBTRACT]['input type'] = I_NONE;
blockConfig[T_MULT]['input type'] = I_NONE;
blockConfig[T_DIV]['input type'] = I_NONE;
blockConfig[T_MOD]['input type'] = I_NONE;
blockConfig[T_HYPOT]['input type'] = I_NONE;
blockConfig[T_NOT]['input type'] = I_NONE;
blockConfig[T_CONDITION]['input type'] = I_NONE;
blockConfig[T_RANGE]['input type'] = I_SELECT;
blockConfig[T_ELSE]['input type'] = I_NONE;
blockConfig[T_DO]['input type'] = I_NONE;
blockConfig[T_OUTLET]['input type'] = I_SELECT;
blockConfig[T_START]['input type'] = I_NONE;
blockConfig[T_STOP]['input type'] = I_NONE;
blockConfig[T_ASSIGN]['input type'] = I_NONE;
blockConfig[T_CONSOLE]['input type'] = I_NONE;
blockConfig[T_PRINT]['input type'] = I_NONE;
blockConfig[T_COMMENT]['input type'] = I_TEXT_AREA;
blockConfig[T_CONST]['input type'] = I_TEXT;
blockConfig[T_TURTLE]['input type'] = I_CANVAS;
blockConfig[T_INLET]['input type'] = I_NONE;
blockConfig[T_LEN]['input type'] = I_SELECT;
blockConfig[T_GET]['input type'] = I_SELECT;
blockConfig[T_RUN]['input type'] = I_SELECT;
blockConfig[T_SET]['input type'] = I_SELECT;
blockConfig[T_PUSH]['input type'] = I_SELECT;
blockConfig[T_DELETE]['input type'] = I_SELECT;
blockConfig[T_INDEX]['input type'] = I_NONE;
blockConfig[T_REF]['input type'] = I_NONE;
blockConfig[T_LAYOUT_BLOCK]['input type'] = I_TEXT;

blockConfig[T_BLOCK]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_GOTO]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_VAR]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_CONST, 'copy' : true};
blockConfig[T_INPUT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_IF]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_WHILE, 'copy' : true};
blockConfig[T_WHILE]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_FOR, 'copy' : true};
blockConfig[T_FOR]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_IF, 'copy' : true};
blockConfig[T_EQUAL]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_LESS, 'copy' : true};
blockConfig[T_LESS]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_GREATER, 'copy' : true};
blockConfig[T_GREATER]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_EQUAL, 'copy' : true};
blockConfig[T_ADD]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_SUBTRACT, 'copy' : true};
blockConfig[T_SUBTRACT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_MULT, 'copy' : true};
blockConfig[T_MULT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_DIV, 'copy' : true};
blockConfig[T_DIV]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_MOD, 'copy' : true};
blockConfig[T_MOD]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_AVERAGE, 'copy' : true};
blockConfig[T_AVERAGE]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_HYPOT, 'copy' : true};
blockConfig[T_SQRT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_HYPOT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_ROUND, 'copy' : true};
blockConfig[T_ROUND]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_ADD, 'copy' : true};
blockConfig[T_SIN]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_COS, 'copy' : true};
blockConfig[T_COS]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_SIN, 'copy' : true};
blockConfig[T_NOT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_CONDITION]['handles'] = {'move' : false, 'resize'  : true, 'delete'  : false, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_RANGE]['handles'] = {'move' : false, 'resize'  : true, 'delete'  : false, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_ELSE]['handles'] = {'move' : false, 'resize'  : true, 'delete'  : false, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_DO]['handles'] = {'move' : false, 'resize'  : true, 'delete'  : false, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_OUTLET]['handles'] = {'move' : false, 'resize'  : false, 'delete'  : false, 'expand'  : false, 'mutate' : -1, 'copy' : true};
blockConfig[T_START]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : false, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_STOP]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_ASSIGN]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_CONSOLE]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : false, 'mutate' : -1, 'copy' : false};
blockConfig[T_PRINT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_COMMENT]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : false, 'mutate' : -1, 'copy' : true};
blockConfig[T_CONST]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_INPUT, 'copy' : true};
blockConfig[T_TURTLE]['handles'] = {'move' : true, 'resize'  : false, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : false};
blockConfig[T_INLET]['handles'] = {'move' : false, 'resize'  : false, 'delete'  : false, 'expand'  : false, 'mutate' : -1, 'copy' : true};
blockConfig[T_LEN]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_GET]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_RUN, 'copy' : true};
blockConfig[T_RUN]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_DELETE, 'copy' : true};
blockConfig[T_SET]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_PUSH]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
blockConfig[T_DELETE]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : T_GET, 'copy' : true};
blockConfig[T_INDEX]['handles'] = {'move' : false, 'resize'  : false, 'delete'  : false, 'expand'  : false, 'mutate' : -1, 'copy' : false};
blockConfig[T_REF]['handles'] = {'move' : false, 'resize'  : false, 'delete'  : false, 'expand'  : false, 'mutate' : -1, 'copy' : false};
blockConfig[T_LAYOUT_BLOCK]['handles'] = {'move' : true, 'resize'  : true, 'delete'  : true, 'expand'  : true, 'mutate' : -1, 'copy' : true};
function selectChangedCallback(){
  selectChanged = true;
  redrawCounter = 2;
}

class Cell {
  constructor(type, x, y, w, h, c, r) {
    jlog('Cell', 'constructor');
    // heirachy
    this.children = [];
    this.childIndicies = [];
    this.parent = -1;
    // control etc
    this.dataSH;
    this.dataSHasType = {};
    this.handleSH = 'unset';
    // if (type == T_VAR || type == T_OUTLET || type == T_RANGE) {
    //   this.handleSH = 'unset';
    // }
    this.type = int(type);
    this.textLabel = blockConfig[this.type]['block label'];
    if (this.type == T_BLOCK){
      // this.textLabel = '<a href="javascript:void(0)" onclick="toggleInput("")">' + this.textLabel + '</a>';
    }
    // labels, tools, setup
    this.mode = M_IDLE;
    this.highlight = false;
    this.underneath = false;
    this.flash = false;
    this.startForm = false;
    this.showHandleInput = false;
    this.inputOptions = [];
    this.forceHandleSH = false;
    this.forceHandleSHFrameOff = -1;
    // geometry
    this.childYBorder = 2*r;
    this.childXBorder = 1.5 * r;
    this.ySpacer = 0;
    if (type == T_CONSOLE) {
      w = 2*w;
      h = 5*h;
    }
    this.width = w;
    this.height = h;
    this.oldHeight = h;
    this.minWidth = w;
    this.minHeight = h;
    this.radius = r;
    this.x = x;
    this.y = y;
    this.deletable = true;
    this.copyable = true;
    this.resizable = true;
    this.mutable = true;
    this.expandable = true;
    this.startable = true;
    this.viewX = x;
    this.viewY = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.hide = false;
    this.shrink = false;
    this.handleW = 1.5*r;
    this.handleH = 1.5*r;
    this.graphicUpdate = true;
    this.specialLayer = null;
    this.id;
    // colors
    this.colors = c;
    if (type == T_START) {
      this.makeStartButtonOptions();
      this.sbHighlight = false;
    }
    // divs
    this.lineNumber = 0;
    this.indexLabeldiv = createDiv(this.textLabel);
    this.indexLabeldiv.style('font-size', fontSizeString);
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.yHeaderEnd = parseInt(this.indexLabeldiv.style('font-size')) + this.childYBorder;
    if (this.type == T_START) {
      this.yHeaderEnd += 2 * this.handleH;
    } else {
      this.yHeaderEnd -= 2 * this.handleH;
    }
    this.height += this.yHeaderEnd;
    this.startHeight = this.height;
    this.startWidth = this.width;
    if (this.type == T_TURTLE){
      this.canvas = createGraphics(200, 150);
      this.canvas.pixelDensity(1);
      this.canvas.background(255);
    }
    this.buildDivs();
    this.resizeConsole();
    this.updateAllDivPositions();
  }

  get size() {
    jlog('Cell', 'size');
    return [this.width, this.height]
  }

  resetDims(full=false) {
    if (full == true) {
      this.height = this.startHeight;
      this.width = this.startWidth;
    }
    this.minWidth = this.width;
    this.minHeight = this.height;
  }

  getDataSH() {
    jlog('Cell', 'getDataSH');
    const d = new Date();
    switch(this.handleSH) {
      case 'random':
        this.dataSH = random();
        break;
      case 'year':
        this.dataSH = d.getFullYear();
        break;
      case 'month#':
        this.dataSH = d.getMonth() + 1;
        break;
      case 'monthS':
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        this.dataSH = month[d.getMonth()];
        break;
      case 'day#':
        this.dataSH = d.getDate();
        break;
      case 'dayS':
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dataSH = days[d.getDay()];
        break;
      case 'hour':
        this.dataSH = d.getHours();
        break;
      case 'minute':
        this.dataSH = d.getMinutes();
        break;
      case 'second':
        this.dataSH = d.getSeconds();
        break;
      case 'millis':
        this.dataSH = d.getMilliseconds();
        break;
      default:
        break;
    }
    return this.dataSH;
  }

  getDataSHForPrint() {
    jlog('Cell', 'getDataSHForPrint');
    let res = this.getDataSH();
    if (String(res) == 'undefined') {
      res = this.textLabel;
    }
    return res;
  }

  disableDelete(){
    jlog('Cell', 'disableDelete');
    this.deletable = false;
  }

  disableAllButMove(){
    jlog('Cell', 'disableAllButMove');
    this.deletable = false;
    this.copyable = false;
    this.resizable = false;
    this.mutable = false;
    this.expandable = false;
    this.startable = false;
  }

  updateHandleSH(newHandle) {
    jlog('Cell', 'updateHandleSH');
    this.handleSH = newHandle;
    if (this.type == T_LAYOUT_BLOCK){
      this.indexLabeldiv.html(this.handleSH);
    }
    if (this.type == T_BLOCK || this.type == T_INPUT){
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
      // this.textLabel = '<strong><a href="javascript:void(0)" onclick="toggleInput(\''+String(this.handleSH)+'\',' + String(this.type) + ')">' + blockConfig[this.type]['block label'] + '</a></strong>';
      // let button = createButton(this.handleSH + ': ' + blockConfig[this.type]['block label'], String(this.handleSH) + 'type' +  String(this.type));
      // button.parent(this.indexLabeldiv);
      // button.show();
      // if (callback != 0) {
      //   button.mousePressed(callback);
      // }
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
      this.updateView(this.viewX - this.x, this.viewY - this.y);
      this.updateAllDivPositions();
      this.refresh();
    }
    if (this.type == T_BLOCK) {
      this.input.value(newHandle);
    }
    if (this.type == T_VAR) {
      this.input.selected(newHandle);
      // this.inputOptions.push(newHandle);
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    }
    if (this.type == T_GOTO) {
      this.input.selected(newHandle);
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    }

    if (blockConfig[this.type]['input type'] == I_SELECT) {
      this.input.selected(newHandle);
    }

    // if (newHandle != 'unset' && String(newHandle) != 'undefined'){
    //   this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    // }
  }

  reStyle() {
    jlog('Cell', 'reStyle');
    this.indexLabeldiv.style('font-size', fontSizeString);
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.buildDivs();
    // if (blockConfig[this.type]['input type'] != I_NONE) {
    //   this.input.style('font-size', fontSizeString);
    // }

  }

  resizeConsole(m1=100, m2=75) {
    jlog('Cell', 'resizeConsole');
    this.graphicUpdate = true;
    if (this.type == T_CONSOLE) {
      this.minWidth = max(m1, this.minWidth);
      this.minHeight = max(m2, this.minHeight);
      this.indexLabeldiv.size(this.width - 3*this.childXBorder, this.height - this.childYBorder);
      this.indexLabeldiv.style('overflow', "auto");
    }
  }

  buildDivs() {
    jlog('Cell', 'buildDivs');
    this.graphicUpdate = true;
    let xp = this.viewX;
    let yp = this.viewY;
    this.height = this.startHeight;
    this.width = this.startWidth;
    this.ySpacer = 0;
    if (this.input) {
      this.input.remove();
    }
    if (blockConfig[this.type]['input type'] == I_TEXT) {
      this.input = createInput();
      this.input.input(selectChangedCallback);
    }
    if (blockConfig[this.type]['input type'] == I_TEXT_AREA) {
      this.input = createElement('textarea');
      this.input.input(selectChangedCallback);
    }
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      this.input = createSelect();
      this.input.changed(selectChangedCallback);
      this.width = max(this.width, this.startWidth);
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.style('font-size', fontSizeString);
      if (this.showHandleInput == true) {
        this.input.style('background-color', colorToHTMLRGB(this.colors[1]));
      } else {
        if (this.type == T_CONST){
          this.input.style('background-color', colorToHTMLRGB(color(255)));
        } else {
          this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
        }
      }
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
      let h = this.input.size().height;
      let w = this.width;
      this.standardInputHeight = h;
      this.input.size(w, h);
      this.width = w + 3*this.childXBorder;
      if (mobileDeviceDetected == true) {
        this.width += this.handleW;
      }
      this.ySpacer += this.input.height;
      this.minWidth = this.width;
    }

    this.updateAllDivPositions();
  }

  updateAllDivPositions() {
    jlog('Cell', 'updateAllDivPositions');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    this.updateDivPosition(this.indexLabeldiv, xp + 2*this.childXBorder, yp);
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.updateDivPosition(this.input, xp + this.childXBorder, yp + this.childYBorder + this.yHeaderEnd);
    }
  }

  updateDataSH(value, hard=false) {
    jlog('Cell', 'updateDataSH');
    this.dataSH = value;
    if (blockConfig[this.type]['input type'] == I_TEXT && hard==true){
      this.input.value(value, value);
      if (showGUI == false) {
        this.input.hide();
        this.indexLabeldiv.hide();
      }
    }

    if (blockConfig[this.type]['input type'] == I_SELECT && hard==true){
      this.input.selected(value);
      if (showGUI == false) {
        this.input.hide();
        this.indexLabeldiv.hide();
      }
    }

    // if (/^\d+\.\d+$/.test(String(value)) == true) {
    //   value = parseFloat(value).toFixed(3);
    // }

    // if (this.type != T_INLET) {
    //   let htmlString = this.textLabel + ' ' + this.handleSH + String(value);
    //   this.indexLabeldiv.html(htmlString);
    // }
    this.unpackDataSH();
  }

  updateView(xOff, yOff) {
    jlog('Cell', 'updateView');
    if (this.parent == -1){
      this.viewX = this.x + xOff;
      this.viewY = this.y + yOff;
    }
  }

  draw(canvas=null) {
    jlog('Cell', 'draw');
    // let x = this.x;
    // let y = this.y;
    let x = this.viewX;
    let y = this.viewY;
    if (this.specialLayer) {
      let sx = x - (this.specialLayer.width - this.width)/2;
      let sy = y - (this.specialLayer.height - this.height)/2;
      image(this.specialLayer, int(sx), int(sy));
    }
    if (this.hide === false){
      // body
      if (this.flash == true) {
        fill(this.colors[2]);
      } else {
        if (this.highlight === true) {
          fill(this.colors[2]);
        } else {
          fill(this.colors[0]);
        }
      }
      if (this.underneath === true) {
        if (blockConfig[this.type]['input type'] != I_NONE) {
          this.input.hide();
        }
        this.indexLabeldiv.hide();

      }
      if (this.underneath === false) {
        if (blockConfig[this.type]['input type'] != I_NONE) {
          if (this.type == T_BLOCK) {
            if (this.showHandleInput == true) {
              this.input.show();
            } else {
              this.input.hide();
            }
          } else {
            this.input.show();
          }
        }
        this.indexLabeldiv.show();
        if (showGUI == false) {
          this.indexLabeldiv.hide();
          if (blockConfig[this.type]['input type'] != I_NONE) {
            this.input.hide();
          }
        }

      }
      stroke(this.colors[1]);
      rect(x, y, this.width, this.height, this.radius);
      if (blockConfig[this.type]['handles']['move'] == true) {
        fill(this.colors[1]);
        rect(x, y, this.handleW, this.handleH);
      }
      if (blockConfig[this.type]['handles']['delete'] == true && this.deletable == true && this.startable == true) { // to avoid messing up tutorials
        fill(this.colors[3]);
        stroke(this.colors[3]);
        rect(x + this.width - this.handleW, y, this.handleW, this.handleH);
        stroke(this.colors[1]);
      }
      if (blockConfig[this.type]['handles']['expand'] == true && this.expandable == true) {
        fill(this.colors[1]);
        rect(x + this.width/2 - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
      }
      if (this.shrink == false) {
        if (blockConfig[this.type]['handles']['resize'] == true && this.resizable == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['copy'] == true && this.copyable == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['mutate'] != -1 && this.mutable == true) {
          fill(this.colors[1]);
          rect(x, y + this.height - this.handleH, this.handleW, this.handleH);
        }
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].draw();
      }
      if (this.type == T_TURTLE){
        image(this.canvas, x + this.handleW, y + 3*this.yHeaderEnd)
      }
    } else {
      this.hideDivs();
    }
    if (this.shrink === true) {
      this.hideDivs();
    }
    if (this.type == T_START && this.shrink == false) {
      image(this.sbGraphics[int(this.startForm)][int(this.sbHighlight)], x + this.width/2 - 1.5*this.handleW, y + this.yHeaderEnd - 2 * (1.25 * this.handleH));
    }
  }

  toggleStartForm(myBool){
    jlog('Cell', 'toggleStartForm');
    this.startForm = myBool;
    if (myBool == true) {
      this.textLabel = blockConfig[T_STOP]['block label'];
      this.indexLabeldiv.html(this.textLabel);
    } else {
      this.textLabel = blockConfig[T_START]['block label'];
      this.indexLabeldiv.html(this.textLabel);
    }
  }

  makeStartButtonOptions() {
    jlog('Cell', 'makeStartButtonOptions');
    this.sbGraphics = {};
    this.sbGraphics[0] = {};
    this.sbGraphics[1] = {};

    this.sbGraphics[0][0] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[0][1] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[1][0] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[1][1] = createGraphics(3*this.handleW, 3*this.handleH);

    this.sbGraphics[0][0].stroke(this.colors[1]);
    this.sbGraphics[0][1].stroke(this.colors[1]);
    this.sbGraphics[1][0].stroke(this.colors[1]);
    this.sbGraphics[1][1].stroke(this.colors[1]);

    this.sbGraphics[0][0].fill(this.colors[0]);
    this.sbGraphics[0][1].fill(this.colors[2]);
    this.sbGraphics[1][0].fill(this.colors[0]);
    this.sbGraphics[1][1].fill(this.colors[2]);

    this.sbGraphics[0][0].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[0][1].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[1][0].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[1][1].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);

    this.sbGraphics[0][0].fill(this.colors[2]);
    this.sbGraphics[0][1].fill(this.colors[0]);
    this.sbGraphics[1][0].fill(this.colors[2]);
    this.sbGraphics[1][1].fill(this.colors[0]);

    this.sbGraphics[0][0].triangle(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 0.5, 2.5*this.handleH, this.handleW*2.5, this.handleH*1.5);
    this.sbGraphics[0][1].triangle(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 0.5, 2.5*this.handleH, this.handleW*2.5, this.handleH*1.5);
    this.sbGraphics[1][0].rect(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 2, this.handleH * 2);
    this.sbGraphics[1][1].rect(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 2, this.handleH * 2);
  }

  updateDivPosition(div, x, y){
    jlog('Cell', 'updateDivPosition');
    div.position(x, y);
  }

  moveC(x, y, xdelta, ydelta) {
    jlog('Cell', 'moveC');
    this.graphicUpdate = true;
    // this.x = x;
    // this.y = y;
    // let xp = this.x;
    // let yp = this.y;
    this.viewX = x;
    this.viewY = y;
    this.x = this.viewX - xdelta;
    this.y = this.viewY - ydelta;
    this.refresh(xdelta, ydelta);
  }

  refresh(xdelta, ydelta) {
    jlog('Cell', 'refresh');
    this.graphicUpdate = true;
    let childX = this.viewX + this.childXBorder;
    let childY = this.viewY + 2*this.childYBorder + this.ySpacer + this.yHeaderEnd;
    if (this.showHandleInput == false && this.type == T_BLOCK){
      childY -= this.standardInputHeight;
    }
    if (this.type == T_TURTLE){
      childX += this.canvas.width + this.handleW;
      childY = this.viewY + 3*this.yHeaderEnd;// + this.childYBorder + this.ySpacer + this.yHeaderEnd;
    }
    this.updateAllDivPositions();
    for (let i = 0; i < this.children.length; i++) {
      if (blockConfig[this.type]['accept child'].indexOf(this.children[i].type) != -1) {
        this.children[i].moveC(childX, childY, xdelta, ydelta);
        childY += this.childYBorder + this.children[i].height;
      }
    }
  }

  resizeC(x, y) {
    jlog('Cell', 'resize');
    this.graphicUpdate = true;
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let nw = x - xp;
    let nh = y - yp;
    if (nw > 2*this.handleW) {
      this.width = nw;
    }
    if (nh > 2*this.handleH) {
      this.height = nh;
    }
    if (this.type == T_COMMENT) {
      if (mobileDeviceDetected == true) {
        this.input.size(this.width - 3*this.childXBorder - this.handleW, this.height - 4*this.childYBorder);
      } else {
        this.input.size(this.width - 3*this.childXBorder, this.height - 4*this.childYBorder);
      }
      this.minHeight = this.height;
      this.minWidth = this.minWidth;
    } else {
      this.width = max(this.minWidth, this.width);
    }

    this.height = max(this.minHeight, this.height);
    if (blockConfig[this.type]['input type'] != I_NONE && blockConfig[this.type]['input type'] != I_TEXT_AREA && this.type != T_CONSOLE) {
      if (mobileDeviceDetected == true) {
        this.input.size(this.width - 3*this.childXBorder - this.handleW, this.standardInputHeight);
      } else {
        this.input.size(this.width - 3*this.childXBorder, this.standardInputHeight);
      }
    }

    this.resizeConsole();

  }

  reshape(reshape=false) {
    jlog('Cell', 'reshape');
    if (this.type == T_LAYOUT_BLOCK){
      return;
    }
    this.graphicUpdate = true;
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].mode == M_IDLE) {
        this.children[i].reshape();
      }
    }
    let heightSum = this.yHeaderEnd + this.childYBorder + this.ySpacer;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].width + this.childXBorder * 2 > this.width) {
        this.width = this.children[i].width + this.childXBorder * 2;
      }
      if (this.children[i].hide == false){
        heightSum += this.children[i].height + this.childYBorder;
      }

    }
    heightSum += 2 * this.childYBorder;
    if (heightSum > this.height) {
      this.height = heightSum;
      this.minHeight = this.height;
    }
    if (this.height < this.indexLabeldiv.size().height) {
      this.minHeight = this.indexLabeldiv.size().height + 2*this.childYBorder;
    }
    if (reshape == true) {
      this.height = this.minHeight;
    }
    if (this.shrink === true) {
      this.width = this.startWidth;
      this.height = this.yHeaderEnd * 3;
      if (this.type == T_START) {
        this.height = this.yHeaderEnd;
      } else {
        this.height = this.yHeaderEnd * 3;
      }
      this.minHeight = this.height;
    }
    if (this.width < this.indexLabeldiv.size().width + 3 * this.childXBorder && this.type != T_CONSOLE) {
      this.width = this.indexLabeldiv.size().width + 3 * this.childXBorder;
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      let h = this.input.size().height;
      if (mobileDeviceDetected == true) {
        this.input.size(this.width - 3 * this.childXBorder - this.handleW);
      } else {
        this.input.size(this.width - 3 * this.childXBorder);
      }

    }
    this.refresh(0, 0);
    if (this.type == T_TURTLE){
      this.height = this.canvas.height + this.yHeaderEnd + 4 * this.handleH;
      this.width = this.canvas.width + 2 * this.handleW;
      if (this.children[0]) {
        if (this.children[0].mode != M_DELETE){
          this.width += this.children[2].width + this.handleW;
        }
      }
    }
  }

  markForDeletion() {
    jlog('Cell', 'markForDeletion');
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].markForDeletion();
    }

    this.mode = M_DELETE;
  }

  cleanForDeletionSafe() {
    jlog('Cell', 'cleanForDeletionSafe');
    let par = -1;
    if (this.mode == M_DELETE) {
      this.indexLabeldiv.remove();
      par = this.parent;
      this.removeParent();
      if (blockConfig[this.type]['input type'] != I_NONE) {
        this.input.remove();
        this.input.remove();
      }
    }
    return par;
  }

  checkButtons(x, y) {
    jlog('Cell', 'checkButtons');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let breaker = false;
    if (this.hide == false) {
      let fudge = 2;
      if (zoomMode == true || this.mode == M_NEW) {
        fudge = this.handleW;
      }
      if (blockConfig[this.type]['handles']['move'] == true) {
        if (x > xp - fudge && x < xp + this.handleW + fudge) {
          if (y > yp - fudge && y < yp + this.handleH + fudge) {
            console.log('move button pressed');
            this.mode = M_MOVE;
            breaker = true;
          }
        }
      }
      if (blockConfig[this.type]['handles']['delete'] == true) {
        if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
          if (y > yp - fudge && y < yp + this.handleH + fudge) {
            console.log('delete button pressed');
            if (this.type == T_CONSOLE) {
              this.indexLabeldiv.html(this.textLabel);
              this.lineNumber = 0;
            } else {
              if (this.deletable == true){
                this.mode = M_DELETE;
              }
              breaker = true;
            }
          }
        }
      }
      if (blockConfig[this.type]['handles']['expand'] == true) {
        if (x > xp + this.width/2 - this.handleW && x < xp + this.width/2) {
          if (y > yp + this.height - this.handleH && y < yp + this.height) {
            console.log('expand || collapse button pressed');
            if (this.mutable == true) {
              this.mode = M_EXPAND_OR_COLLAPSE;
            }
            breaker = true;
          }
        }
      }
      if (this.shrink == false){
        if (blockConfig[this.type]['handles']['resize'] == true) {
          if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
            if (y > yp + this.height - this.handleH - fudge && y < yp + this.height + fudge) {
              console.log('resize button pressed');
              if (this.resizable == true) {
                this.mode = M_RESIZE;
              }
              breaker = true;
            }
          }
        }

        // rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
        if (blockConfig[this.type]['handles']['copy'] == true) {
          let xMin = xp + this.width - this.handleW;
          let yMin = yp + this.height/2 - this.handleH;
          let xMax = xMin + this.handleW;
          let yMax = yMin + this.handleH;
          if (xMin - fudge < x && x < xMax + fudge) {
            if (yMin - fudge < y && y < yMax + fudge) {
              console.log('copy button pressed');
              if (this.copyable == true) {
                this.mode = M_COPY;
              }
              breaker = true;
            }
          }
        }
        if (blockConfig[this.type]['handles']['mutate'] != -1) {
          if (xp - fudge < x && x < xp+this.handleW + fudge) {
            if (yp + this.height - this.handleH - fudge < y && y < yp + this.height + fudge){
              console.log('mutate button pressed');
              if (this.mutable == true) {
                this.mode = M_MUTATE;
              }

              breaker = true;
            }
          }
        }
        if (this.type == T_START) {
          if (this.mode != M_MOVE && this.shrink == false) {
            let xMin = xp + this.width/2 - 1.5*this.handleW;
            let xMax = xMin + 3*this.handleW;
            if (x > xMin && x < xMax) {
              let yMin = yp + this.yHeaderEnd - 2 * (1.25 * this.handleH);
              let yMax = yMin + 3*this.handleH;
              if (y > yMin && y < yMax) {
                if (this.startable == true) {
                  this.mode = M_START;
                }
                breaker = true;
              }
            }
          }
        }
      }
    }
    return breaker;
  }

  clearConsole(){
    jlog('Cell', 'clearConsole');
    if (this.type == T_CONSOLE) {
      this.indexLabeldiv.html(this.textLabel);
      this.lineNumber = 0;
    }
  }

  updateSHs() {
    jlog('Cell', 'updateSHs');
    if (this.forceHandleSH == false && blockConfig[this.type]['input type'] != I_NONE && this.mode != M_NEW) {
      switch (this.type) {
        case T_BLOCK:
          if (this.mode != M_SELECTED) {
            this.updateHandleSH(this.input.value());
          }
          break;
        case T_GOTO:
          this.updateHandleSH(this.input.value());
          break;
        case T_VAR:
          this.updateHandleSH(this.input.value());
          break;
        case T_GET:
          this.updateHandleSH(this.input.value());
          break;
        case T_RUN:
          this.updateHandleSH(this.input.value());
          break;
        case T_SET:
          this.updateHandleSH(this.input.value());
          break;
        case T_RANGE:
          this.updateHandleSH(this.input.value());
          break;
        case T_PUSH:
          this.updateHandleSH(this.input.value());
          break;
        case T_DELETE:
          this.updateHandleSH(this.input.value());
          break;
        case T_LEN:
          this.updateHandleSH(this.input.value());
          break;
        case T_OUTLET:
            let tempHandle = this.input.value();
            if (this.handleSH != tempHandle){
              this.unsetData();
              // this.handleSH = tempHandle;
              this.updateHandleSH(tempHandle);
            }
          break;
        case T_INPUT:
          if (this.mode != M_SELECTED) {
            if (this.showHandleInput == false){
              this.updateDataSH(this.input.value());
            }
          }
          break;
        case T_COMMENT:
          this.dataSH = this.input.value();
          break;
        case T_CONST:
          this.updateDataSH(this.input.value());
          break;
        default:
          break;
      }
      this.unpackDataSH();
    }
    if (this.forceHandleSH == true) {
      this.updateDataSH(this.handleSH, true);
      if (this.forceHandleSHFrameOff == -1) {
        this.forceHandleSHFrameOff = frameCount + 5;
      }
    }
    if (this.forceHandleSHFrameOff != -1 && this.forceHandleSHFrameOff < frameCount) {
      this.forceHandleSH = false;
      this.forceHandleSHFrameOff = -1;
    }

  }

  unpackDataSH() {
    jlog('Cell', 'unpackDataSH');
    this.dataSHasType['string'] = this.dataSH;
    this.dataSHasType['number'] = parseFloat(this.dataSH);
    this.dataSHasType['isNumber'] = !(isNaN(this.dataSHasType['number']));
    if (this.dataSH == 'false'){
      this.dataSHasType['bool'] = false;
    } else {
      this.dataSHasType['bool'] = true;
    }
    if (/^\d+\.\d+$/.test(this.dataSH) == true || /^\d+$/.test(this.dataSH) == true) {
      this.dataSHasType['bool'] = Boolean(parseInt(this.dataSH))
    }
  }

  updateOptions(options) {
    jlog('Cell', 'updateOptions');
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      for (let i = 0; i < this.inputOptions.length; i++){
        if (options[this.type].indexOf(this.inputOptions[i]) == -1) {
          this.inputOptions = [];
          this.input.remove();
          this.buildDivs();
          break
        }
      }
      for (let i = 0; i < options[this.type].length; i++){
        this.input.option(options[this.type][i], options[this.type][i]);
        this.inputOptions.push(options[this.type][i]);
      }
      if (options[this.type].indexOf(this.handleSH) != -1){
        this.input.selected(this.handleSH);
      }
    }
    let tempSet = new Set(this.inputOptions);
    this.inputOptions = Array.from(tempSet);
  }

  forcefullyAddChildren(ind, child) {
    jlog('Cell', 'forcefullyAddChildren');
    this.graphicUpdate = true;
    this.childIndicies.push(ind);
    this.children.push(child);
  }

  acceptsChild(type) {
    jlog('Cell', 'acceptsChild');
    return (blockConfig[this.type]['accept child'].indexOf(type) != -1)
  }

  addChild(ind, child, force=false) {
    jlog('Cell', 'addChild');
    this.graphicUpdate = true;
    if (force == true|| (this.acceptsChild(child.type) == true && this.children.length < blockConfig[this.type]['max children'])) {
      if (this.childIndicies.indexOf(ind) == -1) {
        this.children.push(child);
        this.childIndicies.push(ind);
      }
    }
    return true;
  }

  addParent(ind, parent) {
    jlog('Cell', 'addParent');
    this.parent = ind;
    if (this.type == T_START) {
      this.parent = -1;
    }
  }

  removeParent() {
    jlog('Cell', 'removeParent');
    this.parent = -1;
  }

  clearChildren() {
    jlog('Cell', 'clearChildren');
    this.childIndicies = [];
    this.children = [];
    this.minHeight = 0;
    this.reshape(true);
  }

  removeChild(ind) {
    jlog('Cell', 'removeChild');
    this.graphicUpdate = true;
    if (this.type != T_VAR && this.type != T_INPUT) {
      let ci = this.childIndicies.indexOf(ind);
      if (ci != -1) {
        this.childIndicies.splice(ci, 1);
        this.children.splice(ci, 1);
      }
    }
    this.minHeight = 0;
    this.reshape(true);
    return this.parent;
  }

  expandOrCollapse() {
    jlog('Cell', 'expandOrCollapse');
    if (this.type == T_TURTLE) {
      this.canvas.clear();
      this.canvas.background(255);
      this.shrink = false;
    } else {
      if (this.shrink === true) {
        this.expandBlock();
      } else {
        this.shrinkBlock();
      }
    }
    this.graphicUpdate = true;
    this.mode = M_IDLE
  }

  hideDivs() {
    jlog('Cell', 'hideDivs');
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.hide();
    }
  }

  hideBlock(andChildren = true) {
    jlog('Cell', 'hideBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      if (andChildren == true) {
        this.children[i].hideBlock();
      }
    }
    this.hide = true;
    this.hideDivs();
    this.indexLabeldiv.hide();
  }

  showDivs() {
    jlog('Cell', 'showDivs');
    if (blockConfig[this.type]['input type'] != I_NONE) {
      if (this.type == T_BLOCK) {
        if (this.showHandleInput == true) {
          this.input.show();
        } else {
          this.input.hide();
        }
      } else {
        this.input.show();
      }
      if (showGUI == false) {
        this.input.hide();
      }
    }
    if (showGUI == false) {
      this.indexLabeldiv.hide();
    }
  }

  showBlock() {
    jlog('Cell', 'showBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
    }
    this.hide = false;
    this.showDivs();
    this.indexLabeldiv.show();
  }

  shrinkBlock() {
    jlog('Cell', 'shrinkBlock');
    this.graphicUpdate = true;
    this.oldHeight = this.height;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
      this.children[i].shrinkBlock();
    }
    this.shrink = true;
    this.hideDivs();
  }

  expandBlock() {
    jlog('Cell', 'expandBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
      this.children[i].expandBlock();
    }
    this.shrink = false;
    this.showDivs();
    this.minHeight = this.oldHeight;
    this.height = this.oldHeight;
    this.reshape();
  }

  selfDescribe(short=false) {
    jlog('Cell', 'selfDescribe');
    console.log('TYPE', blockConfig[this.type]['block label']);
    console.log('DATA',this.dataSH);
    console.log('DATAAS',this.dataSHasType);
    console.log('HANDLE', this.handleSH);
    console.log('CHILDREN', this.childIndicies);
    console.log('DIMS', this.width, this.height);
    console.log('PARENT', this.parent);
    console.log('XY', this.x, this.y);
    console.log('VIEW XY', this.viewX, this.viewY);
    console.log('\n');
  }

  unsetData(){
    jlog('Cell', 'unsetData');
    let nothing;
    this.dataSH = nothing;
  }

  pushX(x) {
    jlog('Cell', 'pushX');
    this.viewX += x;
    this.x += x;
  }

  inArea(x, y) {
    jlog('Cell', 'inArea');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;

    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      if (zoomMode == true || this.mode == M_NEW) {
        fudge = this.handleW;
      }
      if (x > xp - fudge && x < xp + this.width + fudge) {
        if (y > yp - fudge && y < yp + this.height + fudge) {
          if (clickDebug == true) {
            this.selfDescribe(false);
          }
          // this.unsetData()
          // this.children = [];
          // this.parent = -1;
          breaker = true;
        }
      }
    }
    return breaker;
  }

};
class Cells {
  constructor(c, h, l, i, dt) {
    jlog('Cells', 'constructor');
    this.cells = [];
    this.dWidth = 80;
    this.dHeight = 40;
    this.dRadius = 5;
    this.activeIndex = -1;
    this.colors = c;
    this.highlights = h;
    this.lowlights = l;
    this.inverted = i;
    this.dualtone = dt;
    this.varNames = 'abcdefghijklmnopqrstuvwxyz';
    this.varHandles = ['unset'];
    this.map = {};
    this.run = false;
    this.viewXdelta = 0;
    this.viewYdelta = 0;
    this.cellsInView = [];
    this.oldMouse = true;
    this.rebuildMenuFlag = false;
    this.redrawFlag = false;
    this.parentFlag = 0;
    this.parentWidthRecord = [-1, 0];
    this.partialUpdate = [];
    this.createMode = false;
    this.presBackup;
    this.layoutArray;
  }

  get length() {
    jlog('Cells', 'length');
    return this.cells.length;
  }

  removeCreateMode() {
    jlog('Cells', 'removeCreateMode');
    this.quickClear(true);
    this.cellsInView = [];
    this.cells = [];
    this.createMode = false;
    // make this have memory later
  }

  addIDsForCreateMode() {
    for (let i = 0; i < this.length; i++) {
      this.cells[i].id = i;
    }
  }

  cleanForCreateMode() {
    jlog('Cells', 'cleanForCreateMode');
    this.createMode = true;
    let layoutCount = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].type != T_LAYOUT_BLOCK) {
        this.cells[i].removeParent();
        this.cells[i].clearChildren();
        this.cells[i].disableAllButMove();
      } else {
        layoutCount += 1;
      }
      this.cellsInView.push(i);
    }
    // this.cells[0].width = this.dWidth; // make console small
    // this.cells[0].height = this.dHeight;
    // this.cells[0].resetDims();
    this.mapAndLink();
    if (layoutCount == 0) {
      this.newLayoutBlock('A0', windowWidth/3, 10);
    } else {
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].type == T_LAYOUT_BLOCK) {
          if (this.cells[i].children.length != 0){
            this.cells[i].children[0].addParent(i, this.cells[i]);
          }
        }
      }
    }
  }

  newLayoutBlock(name, x, y) {
    let c = [color(0, 0, 0, 0), color(0, 0, 0, 255), color(255, 255, 255, 255), color(0, 0, 0, 255), color(0, 0, 0, 255)];
    let pIndex = this.length;
    this.cellsInView.push(pIndex);
    this.cells.push(new Cell(T_LAYOUT_BLOCK, x, y, this.dWidth*2, this.dHeight*2.8, c, this.dRadius))
    this.cells[pIndex].updateHandleSH(name);
    // this.cells[pIndex].childYBorder /= 2;
  }

  getLayoutBlockNextName(name){
    let newName = '';
    if (name[0] == 'Z'){
      newName = getLayoutBlockBelowName(name);
    } else {
      let value = name[0].charCodeAt(0);
      let newLetter = String.fromCharCode(value + 1);
      newName = newLetter + name.slice(1);
    }
    return newName;
  }

  getLetterAndNumber(name){
    let letter = name[0];
    let value = name[0].charCodeAt(0);
    let number = parseInt(name.slice(1));
    return {'letter' : letter, 'ascii' : value, 'number' : number};
  }

  getLayoutBlockBelowName(name){
    let startName = this.getLetterAndNumber(name);
    let newNumber = String(startName['number'] + 1);
    let newLetter = 'A'.charCodeAt(0);
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].type == T_LAYOUT_BLOCK) {
        if (this.getLetterAndNumber(this.cells[i].handleSH)['number'] == newNumber){
          newLetter = this.getLetterAndNumber(this.cells[i].handleSH)['ascii'] + 1;
        }
      }
    }
    return String.fromCharCode(newLetter) + newNumber;
  }

  getLayoutArray(){
    let layoutArray = [];
    let rowArray = [];
    let mydiv = [];
    let prev = 'A-1';
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].type == T_LAYOUT_BLOCK){
        mydiv = [];
        mydiv.push(this.cells[i].input.value());
        if (this.cells[i].children.length != 0) {
          mydiv.push(this.cells[i].children[0].id);
        }
        if (this.cells[i].handleSH == this.getLayoutBlockNextName(prev)) {
          rowArray.push(mydiv);
        } else {
          layoutArray.push(rowArray);
          rowArray = [];
          rowArray.push(mydiv);
        }
        prev = this.cells[i].handleSH;
      }
    }
    layoutArray.push(rowArray);
    layoutArray = layoutArray.slice(1);
    return (layoutArray);
  }

  tidy(xMin, yMin) {
    jlog('Cells', 'tidy');
    let bigBlocks = [];
    let consol, start;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].parent == -1) {
        if (this.cells[i].type != T_START && this.cells[i].type != T_CONSOLE && this.cells[i].type != T_LAYOUT_BLOCK) {
          this.cells[i].reshape(true);
          bigBlocks.push(this.cells[i]);
        } // i hate this but..
      } else {
        let parType = this.cells[this.cells[i].parent].type;
        let cType = this.cells[i].type;
        if (blockConfig[parType]['accept child'].indexOf(cType) == -1) {
          bigBlocks.push(this.cells[i]);
        }
      }
    }
    this.cells[1].resizeConsole();
    // bigBlocks.sort(function(a, b) {return a.width - b.width});
    // bigBlocks.sort(function(a, b) {return sqrt(a.x**2 + a.y**2) - sqrt(b.x**2 + b.y**2)});
    bigBlocks.sort(function(a, b) {return a.width * a.height - b.width * b.height});
    if (this.createMode == false) {
      bigBlocks.unshift(this.cells[0], this.cells[1]);
    }
    let x = xMin;
    let y = yMin;
    let offset = 0;
    let newPos = [];
    for (let i = 0; i < bigBlocks.length; i++) {
      if (y + bigBlocks[i].height > windowHeight || (i < 2 && this.createMode == false)) {
        x += offset + bigBlocks[i].childXBorder * 3;
        y = yMin;
        offset = 0;
      }
      newPos.push([x, y]);
      bigBlocks[i].reshape();
      if (bigBlocks[i].width > offset) {
        offset = bigBlocks[i].width;
      }
      y += bigBlocks[i].height + bigBlocks[i].childYBorder;
    }
    for (let i = 0; i < bigBlocks.length; i++) {
      bigBlocks[i].x = newPos[i][0];
      bigBlocks[i].y = newPos[i][1];
      // bigBlocks[i].reshape();
      bigBlocks[i].updateAllDivPositions();
    }
    this.updateView(this.viewX, this.viewY, false);
    this.mapAndLink();
    this.rebuildMenuFlag = true;
  }

  saveCells(smaller=false) {
    jlog('Cells', 'saveCells');
    let snapshot = {};
    this.mapAndLink();
    for (let i = 0; i < this.length; i++) {
      snapshot[i] = {};
      if (smaller == false) {
        // console.log('smaller is false');
        snapshot[i]['x'] = int(this.cells[i].x);
        snapshot[i]['y'] = int(this.cells[i].y);
        if (i == 1){
          snapshot[i]['tL'] = blockConfig[T_CONSOLE]['block label'];
        } else {
          snapshot[i]['tL'] = this.cells[i].textLabel;
        }
        snapshot[i]['L'] = this.cells[i].indexLabeldiv.html();
        snapshot[i]['h'] = this.cells[i].hide;
        snapshot[i]['s'] = this.cells[i].shrink;
      } else {
        // console.log('smaller is true');
      }
      snapshot[i]['t'] = this.cells[i].type;
      snapshot[i]['d'] = this.cells[i].dataSH;
      snapshot[i]['i'] = this.cells[i].handleSH;
      snapshot[i]['p'] = this.cells[i].parent;
      if (this.cells[i].childIndicies.length != 0){
        snapshot[i]['c'] = this.cells[i].childIndicies;
      }
    }
    return snapshot;
  }

  addCellWithInfo(info) {
    jlog('Cells', 'addCellWithInfo');
    let type = info.t;
    if (type > this.colors.length){
      type = this.cells[info.p].type;
    }
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    let newCell = this.length;
    this.cells.push(new Cell(info.t, info.x, info.y, this.dWidth, this.dHeight, c, this.dRadius));
    this.cells[newCell].hide = info.h;
    this.cells[newCell].shrink = info.s;
    // this.cells[newCell].dataSH = info.d;
    this.cells[newCell].updateDataSH(info.d);
    // this.cells[newCell].handleSH = info.i;
    this.cells[newCell].updateHandleSH(info.i);
    this.varHandles.push(info.i);
    this.cells[newCell].parent = info.p;
    if (info.t == T_OUTLET || info.t == T_VAR || info.t == T_INPUT || info.t == T_INLET){
      this.cells[newCell].textLabel = info.tL;
      this.cells[newCell].indexLabeldiv.html(info.L);
      this.cells[newCell].updateHandleSH(info.i);
      this.cells[newCell].updateDataSH(info.d);
    }
    if (blockConfig[this.cells[newCell].type]['input type'] == I_SELECT) {
      this.cells[newCell].input.option(info.i);
      this.cells[newCell].input.selected(info.i);
    }
    if (blockConfig[this.cells[newCell].type]['input type'] == I_TEXT || blockConfig[this.cells[newCell].type]['input type'] == I_TEXT_AREA) {
      if (this.cells[newCell].type == T_BLOCK) {
        this.cells[newCell].input.value(info.i);
      } else {
        this.cells[newCell].input.value(info.d);
      }
    }
    this.cells[newCell].refresh(this.viewXdelta, this.viewYdelta);
    if (this.cells[newCell].hide == true || showGUI == false) {
      this.cells[newCell].hideBlock();
    }
    this.cells[newCell].updateAllDivPositions();
    this.rebuildMenuFlag = true;
  }

  nudgeX(x) {
    jlog('Cells', 'nudgeX');
    let nudgeVal = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].x < x) {
        nudgeVal = max(nudgeVal, x - this.cells[i].x);
      }
    }
    for (let i = 0; i < this.length; i++) {
      this.cells[i].moveC(this.cells[i].x + nudgeVal, this.cells[i].y, this.viewXdelta, this.viewYdelta);
    }
  }

  putInAddyBar(smaller=false) {
    jlog('Cells', 'putInAddyBar');
    let myURL = getURL();
    if (myURL.indexOf('#') != -1) {
      myURL = myURL.slice(0, myURL.indexOf('#'));
    }
    let myJSONString = JSON.stringify(this.saveCells(smaller))
    if (this.createMode == true) {
      this.presBackup['layout'] = this.getLayoutArray();
      myJSONString = JSON.stringify(this.presBackup);
    }
    let myString = myURL + '#' + encodeURIComponent(myJSONString);
    // console.log(myString.length);
    return myString;
  }

  makeFromAddyBar(myString=getURL()) {
    jlog('Cells', 'makeFromAddyBar');
    if (myString.indexOf('#') == -1) {
      return false;
    }
    try {
      let myURI = myString.slice(myString.indexOf('#')+1)
      if (myURI[0] == '#') {
        myURI = myURI.slice(1);
      }
      let myJSONString = decodeURIComponent(myURI);

      let myLoaderMap = JSON.parse(myJSONString);
      // this is annoying!
      let layoutIndex = Object.keys(myLoaderMap).indexOf('layout');
      if (layoutIndex != -1) {
        cells.layoutArray = myLoaderMap['layout'];
      }
      for (key in Object.keys(myLoaderMap)) {
        if (key != layoutIndex) {
          this.addCellWithInfo(myLoaderMap[key]);
        }
      }
      for (key in Object.keys(myLoaderMap)) {
        if (key != layoutIndex) {
          this.linkChildren(key, myLoaderMap[key]);
        }
      }
      if (showGUI == true) {
        for (let i = 0; i < this.length; i++) {
          this.cells[i].reshape(true);
        }
      } else {
        for (let i = 0; i < this.length; i++) {
          this.cells[i].hideBlock();
        }
      }

    } catch (e) {
      console.log('failed to load', e);
      return false;
    }
    return true;
  }

  linkChildren(ind, info) {
    jlog('Cells', 'linkChildren');
    let id = parseInt(ind);
    if (! info.c) {
      info.c = [];
    }
    for (let i = 0; i < info.c.length; i++) {
      this.cells[id].forcefullyAddChildren(info.c[i], this.cells[info.c[i]], true);
    }
  }

  // turnOffActiveIndex() {
  //   if (this.activeIndex != -1) {
  //     this.cells[this.activeIndex].mode = M_IDLE;
  //     this.activeIndex = -1;
  //   }
  // }

  pushChild(type, myBlockIndex, myBlock, childData){
    jlog('Cells', 'pushChild');
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    let child = new Cell(type, myBlock.viewX, myBlock.viewY, this.dWidth, this.dHeight, c, this.dRadius);
    child.updateDataSH(childData);
    // child.updateHandleSH('newData');
    child.input.value(childData, childData);
    myBlock.addChild(this.length, child);
    child.addParent(myBlockIndex, myBlock);
    this.cells.push(child);
    this.rebuildMenuFlag = true;
    myBlock.reshape();

    return child;
  }

  replaceWithType(type, parent, oldBlock, targetIndex, source){
    jlog('Cells', 'replaceWithType');
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    let child = new Cell(type, oldBlock.viewX, oldBlock.viewY, this.dWidth, this.dHeight, c, this.dRadius);
    child.parent = oldBlock.parent;
    let indexInParent = parent.childIndicies.indexOf(targetIndex);
    parent.children[indexInParent] = child;
    oldBlock.mode = M_DELETE;
    oldBlock.cleanForDeletionSafe();
    oldBlock.mode = M_IDLE;
    this.cells[targetIndex] = child;
    this.mapAndLink();
    this.cells[targetIndex].updateDataSH(source.dataSH, true);
    this.cells[targetIndex].updateHandleSH(source.handleSH);
    return child;
  }

  addCell(type, startX, y = 17) {
    jlog('Cells', 'addCell');
    this.rebuildMenuFlag = true;
    this.mapAndLink();
    let x = startX;//0.15 * windowWidth;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, c, this.dRadius));
    let pIndex = this.length - 1;
    if (type == T_PRINT) {
      c = [this.colors[T_VAR], this.highlights[T_VAR], this.lowlights[T_VAR], this.inverted[T_VAR], this.dualtone[T_VAR]];
      this.cells.push(new Cell(T_VAR, x, y, this.dWidth, this.dHeight, c, this.dRadius));
      this.cells[pIndex].addChild(pIndex+1, this.cells[pIndex+1])
      this.cells[pIndex+1].addParent(pIndex, this.cells[pIndex]);
      this.cells[pIndex+1].input.option('unset', 'unset');
      this.cells[pIndex+1].input.selected('unset');
    }
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[pIndex].updateHandleSH(tempID);
      // this.cells[pIndex].textLabel += ' ' + tempID;
      // this.cells[pIndex].indexLabeldiv.html(this.cells[pIndex].textLabel);
      this.varHandles.push(tempID);
    }
    if (type == T_IF || type == T_WHILE || type == T_FOR) {
      let counter = 2;
      if (type == T_FOR) {
        this.cells.push(new Cell(T_RANGE, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
        this.cells[pIndex + 1].updateHandleSH('unset');
      } else {
        this.cells.push(new Cell(T_CONDITION, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      }
      this.cells.push(new Cell(T_DO, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      for (let i = 1; i <= counter; i++) {
        this.cells[pIndex].addChild(pIndex + i, this.cells[pIndex + i], true);
        this.cells[pIndex + i].addParent(pIndex, this.cells[pIndex], true);
      }
      this.cells[pIndex].refresh(this.viewXdelta, this.viewYdelta);
    }

    if (blockConfig[type]['accept child'].indexOf(T_INDEX) != -1) {
      this.cells.push(new Cell(T_INDEX, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      let cIndex = this.length-1;
      this.cells[pIndex].addChild(cIndex, this.cells[cIndex]);
      this.cells[cIndex].addParent(pIndex, this.cells[pIndex]);
    }
    if (blockConfig[type]['accept child'].indexOf(T_REF) != -1) {
      this.cells.push(new Cell(T_REF, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      let cIndex = this.length-1;
      this.cells[pIndex].addChild(cIndex, this.cells[cIndex]);
      this.cells[cIndex].addParent(pIndex, this.cells[pIndex]);
    }

    if (blockConfig[type]['accept child'].indexOf(T_OUTLET) != -1) {
      this.cells.push(new Cell(T_OUTLET, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells[pIndex].addChild(pIndex + 1, this.cells[pIndex + 1]);
      this.cells[pIndex + 1].addParent(pIndex, this.cells[pIndex]);
      this.cells[pIndex + 1].handleSH= 'unset';//tempID;
      this.cells[pIndex + 1].indexLabeldiv.html(this.cells[pIndex + 1].textLabel);
      this.cells[pIndex + 1].updateDataSH('unset');
      this.cells[pIndex + 1].input.option('unset', 'unset');
      this.cells[pIndex + 1].input.selected('unset');
      if (this.varHandles.indexOf('unset') == -1){
        this.varHandles.push('unset');
      }
    }
    if (type == T_BLOCK) {
      let tempID = this.getID(2);
      this.cells[pIndex].updateHandleSH(tempID);
      this.cells[pIndex].input.value(tempID, tempID);
    //   this.cells[pIndex].handleSH = this.cells[pIndex].input.value();
    }
    this.cells[pIndex].reshape();
    if (type != T_START && type != T_CONSOLE) {
      this.cells[pIndex].mode = M_NEW;
      this.activeIndex = pIndex;
    }
    if (type == T_TURTLE) {
      let index = this.length;
      for (let i = 0; i < turtleVars.length; i++) {
        this.cells.push(new Cell(T_INLET, x, y, this.dWidth, this.dHeight, c, this.dRadius));
        this.cells[index + i].updateHandleSH(turtleVars[i]);
        this.cells[index + i].updateDataSH(0);
        this.cells[pIndex].addChild(index + i, this.cells[index + i])
        this.cells[index + i].addParent(pIndex, this.cells[pIndex]);
      }
    }
    for (let i = pIndex; i < this.length; i++) {
      this.cellsInView.push(i);
    }
    if (showGUI == false) {
      this.cells[pIndex].hideBlock();
    }
  }

  quickClear(brutal=false){
    jlog('Cells', 'quickClear');
    let start = 0;
    if (brutal == true) {
      start = 0;
    }
    for (let i = start; i < this.length; i++){
      this.cells[i].indexLabeldiv.remove();
      if (this.cells[i].input) {
        this.cells[i].input.remove();
      }
    }
    if (brutal == false) {
      this.cells[0].children = [];
      this.cells[0].resetDims(true);
      this.cells[0].childIndicies = [];
      this.cells[1].reshape(true);
      this.cells.splice(2);
    }

  }

  getID(count) {
    jlog('Cells', 'getID');
    let tempID = '';
    for (let i = 0; i < count; i++) {
      tempID += this.varNames[floor(random(0, this.varNames.length))];
    }
    if (this.varHandles.indexOf(tempID) != -1) {
      tempID = this.getID();
    }
    return tempID;
  }

  checkSelected(x, y) {
    jlog('Cells', 'checkSelected');
    let inArea = false;
    if (this.activeIndex != -1){
      if (this.cells[this.activeIndex].mode == M_NEW){
        this.cells[this.activeIndex].mode = M_MOVE;
        return true;
      }
    }
    for (let j = 0; j < this.cellsInView.length; j++) {
      let i = this.cellsInView[j];
      if (this.cells[i].inArea(x, y) === true) {
        inArea = true;
        this.cells[i].mode = M_SELECTED;
        if (this.cells[i].checkButtons(x, y) === true) {
          this.activeIndex = i;
          break;
        }
      } else {
        this.cells[i].mode = M_IDLE;
        this.activeIndex = -1;
      }
    }
    return inArea;
  }

  pprint(myStr) {
    jlog('Cells', 'pprint');
    myStr += '\ncell:     \t'
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(i) + '\t';
    }
    myStr += '\nmode:  \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].mode) + '\t';
    }
    myStr += '\n#child: \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].childIndicies.length) + '\t';
    }
    myStr += '\nChild Indicies for Cell: \n';
    for (let i = 0; i < this.cells.length; i++){
      if (this.cells[i].childIndicies.length > 0) {
        myStr += 'Cell ' + String(i) + '\t\t\t';
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          myStr += String(this.cells[i].childIndicies[j]) + '\t'
        }
        myStr+='\n'
      }
    }
  }

  startStop(x, y, mdown) {
    jlog('Cells', 'startStop');
    this.run = ! this.run;
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].toggleStartForm(this.run);
  }

  stop() {
    jlog('Cells', 'stop');
    this.run = false;
    this.cells[0].toggleStartForm(false);
  }

  doDelete(x, y, mdown) {
    jlog('Cells', 'doDelete');
    this.rebuildMenuFlag = true;
    let gotoVarHandleCatcher = [];
    let rebuildFlag = false;
    let delHandle = [];
    if (this.length == 1) { // last cell
      this.cells[0].cleanForDeletionSafe();
      this.cells = [];
    } else {
      // recursive call to find all children to also be deleted
      this.cells[this.activeIndex].markForDeletion();
      let map = []; // for the 'survivors'
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].mode != M_DELETE){
          map.push(i); // find all cells that will not be deleted
        } else {
          if (this.cells[i].handleSH) {
            rebuildFlag = true;
            if (this.cells[i].type != T_INPUT && this.cells[i].type != T_BLOCK){
              gotoVarHandleCatcher.push(this.cells[i].handleSH);
            }
            if (this.cells[i].handleSH != 'unset') {
              delHandle.push(this.cells[i].handleSH);
              this.varHandles.splice(this.varHandles.indexOf(this.cells[i].handleSH), 1);
            }
          }
          let tdv = this.cellsInView.indexOf(i);
          if (tdv != -1){
            this.cellsInView.splice(tdv, 1);
            this.parentFlag += 1;
          }
        }
        // remove parent / child links and divs for those in delete mode
        let parent = this.cells[i].cleanForDeletionSafe();
        if (parent != -1 && this.cells[parent]){
          let pParent = this.cells[parent].removeChild(i);
          while (pParent != -1) {
            if (this.cells[pParent]) {
              this.cells[pParent].minHeight = 0;
              this.cells[pParent].reshape(true);
              pParent = this.cells[pParent].parent;
            }
          }
        }
      }
      // reassign parent/child relationship
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          let oldCI = this.cells[i].childIndicies[j]
          let oldPI = i;
          let newCI = map.indexOf(oldCI);
          let newPI = map.indexOf(oldPI);
          this.cells[oldCI].parent = newPI;
          this.cells[i].childIndicies[j] = newCI;
        }
      }
      // console.log('made it this far')// nope
      // recreate the cell list
      let newCells = [];
      for (let i = 0; i < map.length; i++) {
        newCells.push(this.cells[map[i]]);
      }
      this.cells = newCells;
    }
    this.activeIndex = -1;
    if (rebuildFlag === true) {
      for (let i = 0; i < this.length; i++) {
        if (blockConfig[this.cells[i].type]['input type'] == I_SELECT) {
          this.cells[i].input.remove();
          // if (this.cells[i].type != T_GOTO){
          //   this.cells[i].varLabeldiv.remove();
          // }
          this.cells[i].buildDivs();
        }
      }

      for (let i = 0; i < this.length; i++) {
        if (blockConfig[this.cells[i].type]['input type'] == I_SELECT) {
          if (delHandle.indexOf(this.cells[i].handleSH) != -1 && gotoVarHandleCatcher.indexOf(this.cells[i].handleSH) == -1) {
            this.cells[i].input.option('unset');
          } else {
            this.cells[i].input.option(this.cells[i].handleSH);
            this.cells[i].input.selected(this.cells[i].handleSH);
          }
        }
      }
    }
  }

  doCopy(programatic = false, parent = -1){
    jlog('Cells', 'doCopy');
    let type = this.cells[this.activeIndex].type;
    let x = this.cells[this.activeIndex].x;
    let y = this.cells[this.activeIndex].y;
    let c = this.cells[this.activeIndex].colors;
    let handle = this.cells[this.activeIndex].handleSH;
    let val = this.cells[this.activeIndex].dataSH;
    let opts = this.cells[this.activeIndex].inputOptions;
    this.cells[this.activeIndex].mode = M_IDLE;
    const oldAI = this.activeIndex;

    // let w = this.cells[this.activeIndex].width;
    // let h = this.cells[this.activeIndex].height;
    this.activeIndex = this.length;
    let iCanHasChild = true;
    if (type == T_BLOCK){
      iCanHasChild = false;
      type  = T_GOTO;
      c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    }
    if (type == T_INPUT || type == T_RANGE){
      iCanHasChild = false;
      type  = T_VAR;
      c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    }
    if (programatic == false) {
      if (type == T_OUTLET){
        iCanHasChild = false;
        type  = T_VAR;
        c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
      }
    }
    if (type == T_INLET){
      iCanHasChild = false;
      type  = T_VAR;
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, c, this.dRadius));

    let newAI = this.activeIndex;
    this.cells[this.activeIndex].mode = M_NEW;
    this.cells[this.activeIndex].handleSH = handle;
    this.cells[this.activeIndex].dataSH = val;
    if (parent != -1) {
      this.cells[this.activeIndex].parent = parent;
    }
    // if (type == T_VAR) {
    if (blockConfig[type]['input type'] == I_SELECT) {
      for (let i = 0; i < opts.length; i++) {
        this.cells[this.activeIndex].inputOptions.push(opts[i]);
      }
      this.cells[newAI].input.selected(this.cells[newAI].handleSH);
    }
    if (blockConfig[type]['input type'] == I_TEXT) {
      this.cells[this.activeIndex].input.value(val, val);
    }
    if (iCanHasChild == true) {
      const childrenStart = this.length;
      for (let i = 0; i < this.cells[oldAI].childIndicies.length; i++) {
        this.activeIndex = this.cells[oldAI].childIndicies[i];
        this.doCopy(true, newAI);
      }
      this.activeIndex = newAI;

      for (let i = childrenStart; i < this.length; i++){
        this.cells[i].mode = M_IDLE;
        let parentIndex = this.cells[i].parent;
        this.cells[parentIndex].addChild(i, this.cells[i]);
        this.cells[i].addParent(parentIndex, this.cells[parentIndex]);
      }
      this.cells[this.activeIndex].mode = M_NEW;
      if (programatic == true) {
        for (let i = this.length-1; i != newAI; i--){
          this.cells[i].minHeight = 0;
          this.cells[i].reshape(true);
        }
      }

      this.mapAndLink();
    }
  }

  doMove(x, y, mdown) {
    jlog('Cells', 'doMove');
    this.cells[this.activeIndex].moveC(x, y, this.viewXdelta, this.viewYdelta);
    if (this.cells[this.activeIndex].parent != -1) {
      this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
      this.cells[this.activeIndex].removeParent();
    }
  }

  doParentDrop(x, y, mdown) {
    jlog('Cells', 'doParentDrop');
    let pParentIndexes = [];
    // let pMoveIndexes = [];
    if (this.cells[this.activeIndex].type != T_START) {
      for (let j = 0; j < this.cellsInView.length; j++) {
        let i = this.cellsInView[j];

        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
          this.cells[i].underneath = mdown || this.cells[this.activeIndex].mode == M_NEW;
        } else {
          this.cells[i].underneath = false;
        }
        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
          if (this.cells[i].acceptsChild(this.cells[this.activeIndex].type)) {
            this.cells[i].highlight = mdown || this.cells[this.activeIndex].mode == M_NEW;
            pParentIndexes.push(i);
          } else {
            // pMoveIndexes.push(i);
          }
        } else {
          this.cells[i].highlight = false;
        }
      }
    }

    // release
    if (mdown === false && this.cells[this.activeIndex].mode == M_MOVE) {
      // if (pMoveIndexes.length != 0) {
      //   for (let i = 0; i < pMoveIndexes.length; i++) {
      //     console.log(this.cells[pMoveIndexes[i]].textLabel);
      //   }
      // }
      // create parent/child link and initial align
      if (pParentIndexes.length != 0) {
        // make parent trees
        let parentTree = [];
        for (let i = 0; i < pParentIndexes.length; i++) {
          // let branch = [pParentIndexes[i]];
          let branch = 1;

          parent = this.cells[pParentIndexes[i]].parent;
          while (parent != -1) {
            // branch.push(parent);
            branch += 1;
            if (this.cells[parent].type == T_GOTO) { // UI and code logic are too close here :-/
              parent = -1;
            } else {
              parent = this.cells[parent].parent
            }

          }
          parentTree.push(branch);
        }
        let pParentIndex = pParentIndexes[parentTree.indexOf(max(parentTree))];
        if (this.cells[this.activeIndex].parent != -1) {
          this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
          this.cells[this.activeIndex].removeParent();
        }
        let ok = this.cells[pParentIndex].addChild(this.activeIndex, this.cells[this.activeIndex]);
        if (ok == true) {
          this.parentFlag += 1;
          this.cells[this.activeIndex].addParent(pParentIndex, this.cells[pParentIndex]);
          this.cells[pParentIndex].refresh(this.viewXdelta, this.viewYdelta);
          this.parentWidthRecord = [pParentIndex, this.cells[pParentIndex].width]

        }
      }
      this.cells[this.activeIndex].mode = M_IDLE;
      this.activeIndex = -1;
    }
  }

  clean() {
    jlog('Cells', 'clean');
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].parent != -1){
        console.log(this.cells[this.cells[i].parent].childIndicies.indexOf(i));
      }
    }
  }

  mapAndLink() {
    jlog('Cells', 'mapAndLink');
    let map = {};
    map[T_GOTO] = [];
    map[T_PUSH] = [];
    map[T_DELETE] = [];
    map[T_GET] = [];
    map[T_RUN] = [];
    map[T_SET] = [];
    map[T_LEN] = [];
    map[T_VAR] = [];
    map[T_OUTLET] = [];
    map[T_RANGE] = [];
    let varTable = {};
    for (let i = 0; i < this.length; i++) {
      // grab everything
      this.cells[i].updateSHs();
      if ((this.cells[i].type == T_WHILE) || this.cells[i].type == T_IF || this.cells[i].type == T_FOR || this.cells[i].type == T_CONDITION || this.cells[i].type == T_RANGE) {
        this.cells[i].dataSH = B_UNSET;
      }
      if (this.cells[i].type == T_CONST) {
        let nothing;
        this.cells[i].handleSH = nothing;
      }
      // create variable map
      // if ((this.cells[i].type == T_OUTLET || this.cells[i].type == T_INPUT || this.cells[i].type == T_INLET)) { //this.cells[i].mode != M_SELECTED
      if (this.cells[i].type == T_INPUT) { //this.cells[i].mode != M_SELECTED
        map[T_VAR].push(this.cells[i].handleSH);
        map[T_OUTLET].push(this.cells[i].handleSH);
        map[T_PUSH].push(this.cells[i].handleSH);
        map[T_DELETE].push(this.cells[i].handleSH);
        map[T_GET].push(this.cells[i].handleSH);
        map[T_SET].push(this.cells[i].handleSH);
        map[T_RANGE].push(this.cells[i].handleSH);
        map[T_LEN].push(this.cells[i].handleSH);
        if (this.run == false) {
          varTable[this.cells[i].handleSH] = this.cells[i].getDataSH();
        }
      }
      // read from block names
      if (this.cells[i].type == T_BLOCK) {
        map[T_GOTO].push(this.cells[i].handleSH);
        map[T_PUSH].push(this.cells[i].handleSH);
        map[T_DELETE].push(this.cells[i].handleSH);
        map[T_GET].push(this.cells[i].handleSH);
        map[T_RUN].push(this.cells[i].handleSH);
        map[T_SET].push(this.cells[i].handleSH);
        map[T_LEN].push(this.cells[i].handleSH);
      }
      // make pretty
      this.cells[i].reshape();
    }

    map[T_VAR] = map[T_VAR].concat(['unset', 'random', 'year', 'month#', 'monthS', 'day#', 'dayS', 'hour', 'minute', 'second', 'millis']);
    map[T_OUTLET].push('unset');
    map[T_RANGE].push('unset');
    map[T_GOTO].push('unset');
    map[T_PUSH].push('unset');
    map[T_DELETE].push('unset');
    map[T_GET].push('unset');
    map[T_RUN].push('unset');
    map[T_SET].push('unset');
    map[T_LEN].push('unset');
    for (let i = 0; i < this.length; i++) {
      if (this.run == false || this.partialUpdate.indexOf(i) != -1) {
        this.cells[i].updateOptions(map);
        if (this.cells[i].type == T_VAR) {
          this.cells[i].dataSH = varTable[this.cells[i].handleSH];
        }
        if (this.cells[i].mode == M_DELETE){
          this.cells[i].cleanForDeletionSafe();
        }
      }
    }
  }

  doMutate() {
    jlog('Cells', 'doMutate');
    this.rebuildMenuFlag = true;
    let ac = this.cells[this.activeIndex];
    ac.mode = M_IDLE;
    let type = blockConfig[ac.type]['handles']['mutate'];
    let data = ac.dataSH;
    let handle = ac.handleSH;
    let pInd = ac.parent;
    let parent = this.cells[ac.parent];
    let children = ac.children;
    let childIndicies = ac.childIndicies;
    ac.indexLabeldiv.remove();
    if (blockConfig[ac.type]['input type'] != I_NONE) {
      ac.input.remove();
      ac.input.remove();
    }
    // if (ac.type == T_VAR) {
    //   ac.varLabeldiv.remove();
    //   ac.varLabeldiv.remove();
    // }
    let inParentIndex = 0;
    if (pInd != -1) {
      inParentIndex = parent.childIndicies.indexOf(this.activeIndex);
    }
    ac.mode = M_IDLE;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    this.cells[this.activeIndex] = new Cell(type, ac.x, ac.y, this.dWidth, this.dHeight, c, this.dRadius);
    this.cells[this.activeIndex].dataSH = data;
    this.cells[this.activeIndex].handleSH = handle;
    this.cells[this.activeIndex].children = children;
    this.cells[this.activeIndex].childIndicies = childIndicies;
    this.cells[this.activeIndex].parent = pInd;
    if (pInd != -1) {
      parent.children[inParentIndex] = this.cells[this.activeIndex];
    }
    for (let i = 0; i < this.cells[this.activeIndex].children.length; i++){
      if ([T_CONDITION, T_ELSE, T_DO, T_OUTLET, T_INDEX, T_REF].indexOf(this.cells[this.activeIndex].children[i].type) != -1) {
        this.cells[this.activeIndex].children[i].colors = c;
        this.cells[this.activeIndex].children[i].reStyle();
      }
    }
    if (type == T_SQRT) {
      for (let i = 2; i < this.cells[this.activeIndex].children.length; i++){
        this.cells[this.activeIndex].children[i].hideBlock();
      }
      this.cells[this.activeIndex].minHeight = 0;
      this.cells[this.activeIndex].reshape();


    } else {
      for (let i = 2; i < this.cells[this.activeIndex].children.length; i++){
        this.cells[this.activeIndex].children[i].showBlock();
      }
    }
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[this.activeIndex].updateHandleSH(tempID);
      // this.cells[this.activeIndex].textLabel += ' ' + tempID;
      // this.cells[this.activeIndex].indexLabeldiv.html(this.cells[this.activeIndex].textLabel);
      this.cells[this.activeIndex].input.value(data, data);
      this.varHandles.push(tempID);
    }
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].reshape(this.viewXdelta, this.viewYdelta);

    if (pInd != -1) {
      parent.reshape(this.viewXdelta, this.viewYdelta);
    }
  }

  hideAll(exceptions=[123456754356783646728347682]) {
    for (let i = 0; i < this.length; i++) {
      if (exceptions.indexOf(this.cells[i].type) == -1) {
        this.cells[i].hideBlock(false); //don't hide children, they will be an exception or hidden anyway
      }
    }
  }

  update(x, y, mdown) {
    jlog('Cells', 'update');
    // build mode
    if (this.parentFlag > 0) {
      this.reshapeAllInView();
      if (this.parentWidthRecord[0] != -1) {
        let delta = this.cells[this.parentWidthRecord[0]].width - this.parentWidthRecord[1]
        for (let i = 0; i < this.length; i++) {
          if (this.cells[i].x > this.cells[this.parentWidthRecord[0]].x){
            this.cells[i].pushX(delta);
          }
        }
        this.reshapeAllInView();
      }
      this.parentWidthRecord = [-1, 0]
      this.parentFlag -= 1;
    }
    if (this.run == false) {
      // active cell
      if (this.activeIndex != -1) {
        if (this.cells[this.activeIndex].mode == M_MUTATE){
          this.doMutate();
        }
        if (this.cells[this.activeIndex].mode == M_NEW){
          this.doMove(x, y, true);
        }
        if (this.cells[this.activeIndex].mode == M_START){
          this.startStop(x, y, mdown);
        }
        // deleting
        if (this.cells[this.activeIndex].mode == M_DELETE){
          this.doDelete(x, y, mdown);
          this.mapAndLink();
        } else {
          // move
          if (mdown === true && this.cells[this.activeIndex].mode == M_MOVE) {
            this.doMove(x, y, mdown);
          }
          // resize
          if (mdown === true && this.cells[this.activeIndex].mode == M_RESIZE) {
            this.parentFlag = 2;
            this.cells[this.activeIndex].resizeC(x, y);
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_EXPAND_OR_COLLAPSE) {
            if (this.cells[this.activeIndex].type == T_LAYOUT_BLOCK) {
              this.newLayoutBlock(this.getLayoutBlockBelowName(this.cells[this.activeIndex].handleSH), this.cells[this.activeIndex].x, this.cells[this.activeIndex].y + this.cells[this.activeIndex].height + 5);
              this.cells[this.activeIndex].mode = M_IDLE;
            } else {
              this.parentFlag = 2;
              this.cells[this.activeIndex].expandOrCollapse();
              if (this.cells[this.activeIndex].shrink == true) {
                let parent = this.cells[this.activeIndex].parent;
                while (parent != -1) {
                  this.cells[parent].minHeight = 0;
                  this.cells[parent].reshape(true);
                  parent = this.cells[parent].parent;
                }
              }
            }
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_COPY) {
            if (this.cells[this.activeIndex].type == T_LAYOUT_BLOCK) {
              this.newLayoutBlock(this.getLayoutBlockNextName(this.cells[this.activeIndex].handleSH), this.cells[this.activeIndex].x + this.cells[this.activeIndex].width + 5, this.cells[this.activeIndex].y);
              this.cells[this.activeIndex].mode = M_IDLE;
            } else {
              this.doCopy();
            }

          }
          if (this.redrawFlag == true) {
            this.doParentDrop(x, y, mdown);
          }
        }
      }
      if (this.oldMouse != mdown || selectChanged == true) {
        this.mapAndLink();
        this.oldMouse = mdown;
        selectChanged = false;
      }
    } else { // RUN MODE!!!
      // stop button
      if (this.cells[0].mode == M_START){
        this.startStop(x, y, mdown);
      }
      // and NOTHING ELSE CAUSE I SHOULD MAKE A NEW THING!
    }
  }

  reshapeAllInView(){
    jlog('Cells', 'reshapeAllInView');
    for (let i = 0; i < this.cellsInView.length; i++) {
      if (this.cells[this.cellsInView[i]] != null){
        this.cells[this.cellsInView[i]].reshape(this.viewX, this.viewY, false);
      }
    }
  }

  hideAllDivs(){
    jlog('Cells', 'hideAllDivs');
    for (let i = 0; i < this.length; i++){
      this.cells[i].indexLabeldiv.hide();
      this.cells[i].hideDivs();
    }
  }

  showAllDivs(){
    jlog('Cells', 'showAllDivs');
    for (let i = 0; i < this.length; i++){
      if (this.cells[i].hide == false) {
        this.cells[i].indexLabeldiv.show();
        this.cells[i].showDivs();
      }
    }
  }

  updateView(xPos, yPos, doDrag) {
    jlog('Cells', 'updateView');
    this.viewXdelta = xPos;
    this.viewYdelta = yPos;
    this.redrawFlag = false;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].graphicUpdate == true) {
        this.cells[i].graphicUpdate = false;
        this.redrawFlag = true;
      }
      // might need to clean this up!
      if (this.cells[i].parent == -1) {// || blockConfig[this.cells[this.cells[i].parent].type]['accept child'].indexOf(this.cells[i].type == -1)) {
        this.cells[i].updateView(this.viewXdelta, this.viewYdelta);
      } else {
        let parType = this.cells[this.cells[i].parent].type;
        let cType = this.cells[i].type;
        if (blockConfig[parType]['accept child'].indexOf(cType) == -1) {
          this.cells[i].updateView(this.viewXdelta, this.viewYdelta);
        }
      }
      if (doDrag == true && this.cellsInView.indexOf(i) != -1) {
        this.cells[i].updateAllDivPositions();
        this.cells[i].refresh();
      }
    }
  }

  cellInView(cell) {
    jlog('Cells', 'cellInView');
    let inview = false;
    let xMin = -1*cell.width;
    let xMax = windowWidth;
    let yMin = -1*cell.height;
    let yMax = windowHeight;
    if (xMin < cell.viewX && cell.viewX < xMax) {
      if ( yMin < cell.viewY && cell.viewY < yMax) {
        inview = true;
      }
    }
    return inview;
  }

  draw(canvas = null) {
    jlog('Cells', 'draw');
    this.cellsInView = [];
    for (let i = 0; i < this.length; i++) {
      this.cellInView(this.cells[i]);
      if (this.cellInView(this.cells[i]) == true) {
        this.cells[i].draw();
        this.cellsInView.push(i);
      }
    }
    if (this.activeIndex != -1) {
     this.cells[this.activeIndex].draw();
   }
  }

  addCellsForPres(inputCells, start = 0){
    jlog('PresentationHelper', 'addCells');
    for (let i = start; i < inputCells.length; i++) {
      this.addCellForPres(inputCells[i]);
    }
  }

  addCellForPres(cell){
    jlog('PresentationHelper', 'addCell');
    if (presComponents.indexOf(cell.type) != -1){
      this.cells.push(cell);
    }
  }

};
class Controller {
  constructor() {
    jlog('Controller', 'constructor');
    this.script;
    this.envChanged = false;
    this.index = 0;
    this.stackTrace = {};
    this.workingStack = [];
    this.terminate;
    this.run = false;
    this.activeCell = null;
    this.running = false;
    this.prevIndex = -1;
    this.varMap = {};
    this.varRecord = [];
    this.weHaveATurtlePeople = false;
    this.turtleIndex = -1;
    this.tBuffX = [];
    this.tChangeX = false;
    this.tBuffY = [];
    this.tChangeY = false;
    this.stackNotes = [];
    this.stackSizeRecord = [];
    this.objectWideFlashFlag = true;
    this.tidyFlag = false;
  }

  step(flash, fastMode) {
    jlog('Controller', 'step');
    this.objectWideFlashFlag = flash;
    try { // big try so I can put anything into the onscreen c onsole
      if (this.index < this.script.length) {
        this.activeCell = this.script[this.index];
        if (flash == true && this.stackTrace.length > 1) {
          this.activeCell.flash = true;
          this.script[this.stackTrace[this.stackTrace.length - 2]].flash = false;
        }
        switch (this.activeCell.type) {
          case T_START:
            this.t_start(this.activeCell, this.index);
            break;
          case T_GOTO:
            this.t_goto(this.activeCell, this.index);
            break;
          case T_BLOCK:
            let stillInBlock = this.t_block(this.activeCell, this.index);
            if (stillInBlock == false) {
              this.moveByParent();
            }
            break;
          case T_PRINT:
            this.t_print(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_ASSIGN:
            this.t_assign(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_ADD:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_SUBTRACT:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_MULT:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_DIV:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_MOD:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_AVERAGE:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_SQRT:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_ROUND:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_HYPOT:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_SIN:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_COS:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_COMMENT:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_VAR:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_CONST:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_INPUT:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_EQUAL:
            this.t_compare(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_LESS:
            this.t_compare(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_GREATER:
            this.t_compare(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_NOT:
            this.t_not(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_IF:
            let stillInIf = this.t_if(this.activeCell, this.index);
            if (stillInIf == false) {
              this.moveByParent();
            }
            break;
          case T_WHILE:
            let stillInWhile = this.t_while(this.activeCell, this.index);
            if (stillInWhile == false) {
              this.moveByParent();
            }
            break;
          case T_FOR:
            let stillInFor = this.t_for(this.activeCell, this.index);
            if (stillInFor == false) {
              this.moveByParent();
            }
            break;
          case T_ELSE:
            this.index = this.script[this.index].parent;
            break;
          case T_DO:
            this.index = this.script[this.index].parent;
            break;
          case T_LEN:
            this.t_len(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_GET:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_RUN:
            let tempInd = this.index;
            this.t_arrayOp(this.activeCell, this.index);
            if (tempInd == this.index) {
              this.moveByParent();
            }
            break;
          case T_SET:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_PUSH:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_DELETE:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          default:
            this.script[1].indexLabeldiv.html("<br>Something is missing", true);
            this.HCF();
            break;
        }
        if (this.run == true && fastMode == true) {
          this.step(flash, fastMode);
        }
      } else {
        this.run = false;
        // this.script[this.stackTrace[this.stackTrace.length - 2]].flash = false;
        for (let i = 0; i < cells.length; i++){
          cells.cells[i].flash = false;
        }
        this.printStack();
        if (this.envChanged == true) {
          this.tidyFlag = true;
          this.d_print('<small>Your environment was updated.</small><br>');
          let button = createButton('reset env');
          button.addClass('basic');
          button.parent(cells.cells[1].indexLabeldiv);
          button.mousePressed(loadBackup);
          cells.cells[1].indexLabeldiv.html('<br>', true);
          this.script[1].lineNumber += 1;
          this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
        }
      }
    } catch (error) {
      this.HCF();
      this.script[1].indexLabeldiv.html('\n' + error, true);
      console.log(error);
    }
  }

  updateVarMap(key, data) {
    jlog('Controller', 'updateVarMap');
    if (key == 'turtleX') {
      this.tChangeX = true;
    }
    if (key == 'turtleY') {
      this.tChangeY = true;
    }
    for (let i = 0; i < this.varMap[key].length; i++) {
      this.varMap[key][i].updateDataSH(data);
    }
    this.updateTurtle();
  }

  moveByParent() {
    jlog('Controller', 'moveByParent');
    if (this.workingStack.length > 100) {
      this.script[1].indexLabeldiv.html('\n uncomfortably deep stack, time to die', true);
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
      this.run = false;
    }
    let currentI = this.workingStack.pop();
    this.addToStack(currentI, 0); // 0 means it adds to trace, not working stack
    this.script[currentI].flash = false;
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_IF) {
      currentI = this.workingStack.pop();
      this.addToStack(currentI, 0);
    }
    if (this.script[currentI].type == T_RANGE && this.script[this.script[currentI].parent].type == T_FOR) {
      let target = this.script[currentI].dataSHasType['number'];
      let counter = this.script[this.script[currentI].parent].dataSHasType['number'];
      if (target < counter) {
        this.script[this.script[currentI].parent].updateDataSH(B_UNSET);
        currentI = this.workingStack.pop();
        this.addToStack(currentI, 0);
      }
    }
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_WHILE) {
      let shrinkStack = this.workingStack.indexOf(this.script[currentI].parent);
      this.workingStack = this.workingStack.slice(0, shrinkStack + 1);
      this.addNote("shrunk working stack");
      if (this.script[currentI].getDataSH() == B_FALSE) {
        currentI = this.workingStack.pop();
        this.addToStack(currentI, 0);
      }
    }
    this.script[currentI].flash = false;
    if (this.workingStack.length < 1) {
      this.index = this.terminate;
      return;
    } else {
      let callerI = this.workingStack[this.workingStack.length - 1];
      let callerC = this.script[callerI];
      let curInCaller = callerC.childIndicies.indexOf(currentI);
      if (curInCaller == -1 || curInCaller == callerC.childIndicies.length - 1) {
        this.addToStack(callerI, 0);
        this.moveByParent();
      } else {
        this.index = callerC.childIndicies[curInCaller + 1];
      }
    }
  }

  findBlock(handle) {
    jlog('Controller', 'findBlock');
    let block = -1;
    for (let i = 0; i < this.script.length; i++) {
      if ((this.script[i].type == T_BLOCK || this.script[i].type == T_INPUT) && this.script[i].handleSH == handle) {
        block = i;
        break;
      }
    }
    if (handle == 'unset') {
      return -1;
    }
    return block;
  }

  getValue(child, index) {
    jlog('Controller', 'getValue');
    let data;
    let varType = -1;
    if (mathFunctions.indexOf(child.type) != -1) {
      this.t_math(child, index);
      data = child.children[0].getDataSH();
      varType = V_NUMBER;
    } else if (boolFunctions.indexOf(child.type) != -1 && (child.type != T_NOT)) {
      this.t_compare(child, index);
      data = child.getDataSH();
      varType = V_BOOL;
    } else if (child.type == T_LEN) {
      this.t_len(child, index);
      data = child.getDataSH();
      varType = V_NUMBER;
    } else if (child.type == T_NOT) {
      this.t_not(child, index);
      data = child.getDataSH();
      varType = V_BOOL;
    } else if (child.type == T_GET) {
      this.t_arrayOp(child, index);
      data = child.getDataSH();
      if (/^\d+\.\d+$/.test(data) == true || /^\d+$/.test(data) == true || /^\-+\d+$/.test(data) == true || /^\-+\d+\.+\d+$/.test(data) == true) {
        varType = V_NUMBER;
      } else if (data == 'true' || data == 'false') {
        varType = V_BOOL;
        data = (data == 'true');
      } else {
        varType = V_STRING;
      }
    } else {
      data = child.getDataSH();
      if (/^\d+\.\d+$/.test(data) == true || /^\d+$/.test(data) == true || /^\-+\d+$/.test(data) == true || /^\-+\d+\.+\d+$/.test(data) == true) {
        varType = V_NUMBER;
      } else if (data == 'true' || data == 'false') {
        varType = V_BOOL;
        data = (data == 'true');
      } else {
        varType = V_STRING;
      }
    }
    let result = {
      type: varType,
      data: data
    };
    return result;
  }

  lookAtChildren(activeCell, index, start = 0) {
    jlog('Controller', 'lookAtChildren');
    let onlyNums = true;
    let onlyBools = true;
    let containsString = false;
    let vals = [];
    let isNumbers = [];
    // this.runChildren(activeCell.children, activeCell.childIndicies);
    for (let i = start; i < activeCell.children.length; i++) {
      if (activeCell.children[i].type != T_COMMENT) {
        let result = this.getValue(activeCell.children[i], activeCell.childIndicies[i]);
        vals.push(result['data']);
        if (result['type'] == V_NUMBER) {
          onlyBools = false;
          isNumbers.push(true);
        } else if (result['type'] == V_STRING) {
          onlyBools = false;
          onlyNums = false;
          containsString = true;
          isNumbers.push(false);
        } else if (result['type'] == V_BOOL) {
          onlyNums = false;
          isNumbers.push(false);
        }
      }
    }
    let res = {};
    res['onlyNums'] = onlyNums;
    res['vals'] = vals;
    res['isNumbers'] = isNumbers;
    res['onlyBools'] = onlyBools;
    res['containsString'] = containsString;
    return res;
  }

  evaluateCondition(onlyBools, onlyNums, vals) {
    jlog('Controller', 'evaluateCondition');
    let res = true;
    let myResult = 0;
    if (onlyBools == true) {
      for (let i = 0; i < vals.length; i++) {
        myResult += int(vals[i]);
      }
      res = (myResult == vals.length);
    }
    if (onlyNums == true) {
      for (let i = 0; i < vals.length; i++) {
        if (vals[i] == 0) {
          res = false;
        }
      }
    }
    return res;
  }

  startStop(cells) {
    jlog('Controller', 'startStop');
    // started
    if (cells.run == true && this.running == false) {
      this.run = true;
      this.running = true;
      this.index = 0;
      cells.mapAndLink(); // freeze the thing
      cells.mapAndLink(); // do it twice for fun
      backupObject = JSON.stringify(cells.saveCells());
      this.envChanged = false;
      this.script = cells.cells;
      this.terminate = this.script.length + 1;
      this.stackTrace = {};
      this.stackTrace['index'] = [];
      this.stackTrace['dir'] = [];
      this.stackTrace['label'] = [];
      this.stackTrace['handle'] = [];
      this.workingStack = [0];
      this.varRecord = [];
      this.tBuffX = [];
      this.tBuffY = [];
      this.varMap = {};
      this.varMap['outlet'] = [];
      this.weHaveATurtlePeople = false;
      this.stackNotes = [];
      this.stackSizeRecord = [];
      for (let i = 0; i < cells.length; i++) {
        if (showGUI == false) {
          cells.cells[i].hideBlock();
        }
        if (this.script[i].type == T_VAR || this.script[i].type == T_OUTLET || this.script[i].type == T_INPUT) {
          if (!(this.script[i].handleSH in this.varMap)) {
            this.varMap[this.script[i].handleSH] = [];
          }
          this.varMap[this.script[i].handleSH].push(this.script[i]);
        }
        if (this.script[i].type == T_TURTLE) {
          this.weHaveATurtlePeople = true;
          this.turtleIndex = i;
        }
      }
      for (key in this.varMap) {
        if (cells.varHandles.indexOf(key) == -1) {
          cells.varHandles.push(key);
          // cells.mapAndLink();
          this.startStop(cells);
        }
      }
    }
    // stop by cells
    if (cells.run == false) {
      if (this.run == true) {
        this.printStack();
      }
      this.run = false;
      this.running = false;
    }
    // stop by controller
    if (this.run == false) {
      cells.stop();
      this.running = false;
    }
  }

  update(cells, flash, fastMode) {
    this.startStop(cells);
    if (this.run == true) {
      this.step(flash, fastMode);
    }
  }

  HCF() {
    jlog('Controller', 'HCF');
    this.index = this.terminate;
    this.run = false;
  }

  printStack() {
    jlog('Controller', 'printStack');
    if (showGUI == false) {
      cells.hideAllDivs();
    }
    let readableStack = {};
    for (let i = 0; i < this.stackTrace['index'].length; i++) {
      readableStack[i] = {};
      readableStack[i]['stack depth'] = this.stackSizeRecord[i];
      readableStack[i]['block index'] = this.stackTrace['index'][i];
      readableStack[i]['name'] = this.stackTrace['label'][i];
      readableStack[i]['handle'] = this.stackTrace['handle'][i];
      readableStack[i]['data state'] = this.varRecord[i];
      readableStack[i]['dir'] = (this.stackTrace['dir'][i] == 1) ? 'in' : 'out';
      readableStack[i]['stack notes'] = ""
    }
    for (let i = 0; i < this.stackNotes.length; i++) {
      let note = this.stackNotes[i];
      readableStack[note[0]]['stack notes'] = note[1];
    }
    if (printStack == true) {
      console.table(readableStack);
    }
  }
  addNote(myString) {
    jlog('Controller', 'addNote');
    this.stackNotes.push([this.stackTrace['index'].length - 1, myString]);
  }

  addToStack(index, dir = 1) {
    jlog('Controller', 'addToStack');
    this.stackSizeRecord.push(this.workingStack.length);
    this.stackTrace['index'].push(index);
    this.stackTrace['dir'].push(dir);
    this.stackTrace['label'].push(this.script[index].textLabel);
    this.stackTrace['handle'].push(this.script[index].handleSH);
    if (dir == 1) {
      this.workingStack.push(index);
      this.script[index].flash = this.objectWideFlashFlag;
    }
    let varRecAtom = '';
    for (key in this.varMap) {
      if (this.varMap[key].length > 0) {
        varRecAtom += String(key) + ": " + this.varMap[key][0].getDataSH() + ' | ';
      } else {
        varRecAtom += String(key) + " ";
      }
    }
    this.varRecord.push(varRecAtom);
  }

  updateTurtle() {
    jlog('Controller', 'updateTurtle');
    if (this.weHaveATurtlePeople == true) {
      if (this.tChangeX == true) {
        this.tBuffX.push(parseFloat(this.varMap['turtleX'][0].getDataSH()));
        this.tChangeX = false;
      }
      if (this.tChangeY == true) {
        this.tBuffY.push(parseFloat(this.varMap['turtleY'][0].getDataSH()));
        this.tChangeY = false;
      }
      if (this.varMap['turtleDraw'][0].dataSHasType["bool"] == true) {
        this.updateVarMap('turtleDraw', 0);
        while (this.tBuffX.length < this.tBuffY.length) {
          this.tBuffX.push(this.tBuffX[this.tBuffX.length - 1]);
        }
        while (this.tBuffX.length > this.tBuffY.length) {
          this.tBuffY.push(this.tBuffY[this.tBuffY.length - 1]);
        }
        for (let i = 0; i < this.tBuffX.length - 1; i++) {
          let x1 = this.tBuffX[i];
          let x2 = this.tBuffX[i + 1];
          let y1 = this.tBuffY[i];
          let y2 = this.tBuffY[i + 1];
          this.script[this.turtleIndex].canvas.line(x1, y1, x2, y2);
        }
        this.tBuffX = [];
        this.tBuffY = [];
      }
    }
  }

  t_start(activeCell, index) {
    jlog('Controller', 't_start');
    this.addToStack(index);
    if (activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = activeCell.childIndicies[0];
    }
  }

  t_goto(activeCell, index) {
    jlog('Controller', 't_goto');
    this.addToStack(index);
    // let myIndex = this.index;
    let next = activeCell.handleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].handleSH && this.script[i].type == T_BLOCK) {
        this.index = i;
      }
    }
    // this.script[this.index].parent = myIndex;
  }

  t_block(activeCell, index) {
    jlog('Controller', 't_block');
    this.addToStack(index);
    let stillIn = false;
    if (activeCell.children.length != 0) {
      stillIn = true;
      this.index = activeCell.childIndicies[0];
    }
    return stillIn;
  }

  buildPrintString(activeCell, depth){
    jlog('Controller', 'buildPrintString');
    depth += 1;
    if (depth > 20) {
      return 'max depth';
    }
    let myOutput = '';
    for (let j = 0; j < activeCell.children.length; j++) {
      if (activeCell.children[j].type == T_GET) {
        this.t_arrayOp(activeCell.children[j], activeCell.childIndicies[j]);
        if (String(activeCell.children[j].dataSH).indexOf('object:') == -1){
          myOutput += activeCell.children[j].dataSH;
        } else {
          let myInd = this.unpackGet(activeCell.children[j]);
          if (this.script[myInd].type == T_BLOCK || this.script[myInd].type == T_GOTO){
            myOutput += '[';
            myOutput += this.buildPrintString(this.script[myInd], depth);
            myOutput += ']';
          } else {
            myOutput += this.script[myInd].getDataSHForPrint();
          }
        }
      } else if (activeCell.children[j].type == T_GOTO || activeCell.children[j].type == T_BLOCK) {
        let block = this.findBlock(activeCell.children[j].handleSH);
        myOutput += '[';
        if (block == -1) {
          myOutput += 'unset';
        } else {
          myOutput += this.buildPrintString(this.script[block], depth);
        }
        myOutput += ']';
      } else if (activeCell.children[j].type != T_COMMENT) {
        myOutput += String(this.script[activeCell.childIndicies[j]].getDataSHForPrint());
      }
      if (j < activeCell.children.length-1) {
        myOutput += ', ';
      }
    }
    return myOutput;
  }

  d_print(myString, inplace=false, flagString=''){
    jlog('Controller', 'd_print');
    if (!this.script){
      this.script = cells.cells;
    }
    if (inplace == true) {
      let htmlString = this.script[1].indexLabeldiv.html();
      if (htmlString.indexOf(flagString) != -1){
        htmlString = htmlString.slice(0, htmlString.indexOf(flagString))

      }
      htmlString += flagString + myString;
      this.script[1].indexLabeldiv.html(htmlString);
    } else {
      this.script[1].indexLabeldiv.html('<br>' + myString + '<br>', true);
      this.script[1].lineNumber += 1;
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
    }
  }

  t_print(activeCell, index) {
    jlog('Controller', 't_print');
    this.addToStack(index);
    let myOutput = this.script[1].lineNumber + ': '
    if (this.script[1].lineNumber == 0) {
      myOutput = '<br>' + this.script[1].lineNumber + ': ';
    }

    let myString = this.buildPrintString(activeCell, 0).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    console.log(myString);
    let stringForConsole = myOutput + myString + '<br>';
    if (presentationMode == true) {
      addToPresentation(myString, 'console');
    } else {
      this.script[1].indexLabeldiv.html(stringForConsole, true);
      this.script[1].lineNumber += 1;
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
    }

  }

  t_assign(activeCell, index) {
    jlog('Controller', 't_assign');
    this.addToStack(index);
    this.lookAtChildren(activeCell, index);
    if (activeCell.children.length > 1) {
      let assigner = activeCell.children[0];
      let data = assigner.getDataSH();
      let cI = activeCell.childIndicies;
      for (let i = 1; i < cI.length; i++) {
        let key = this.script[cI[i]].handleSH;
        this.updateVarMap(key, data);
      }
    }
  }

  t_math(activeCell, index) {
    jlog('Controller', 't_math');
    this.addToStack(index);
    let res;
    let survey = this.lookAtChildren(activeCell, index, 1);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
    if (onlyNums) {
      res = parseFloat(vals[0]);
      if (activeCell.type == T_HYPOT) {
        res = res ** 2;
      }
      for (let i = 1; i < vals.length; i++) {
        switch (activeCell.type) {
          case T_ADD:
            res += parseFloat(vals[i]);
            break;
          case T_SUBTRACT:
            res -= parseFloat(vals[i]);
            break;
          case T_MULT:
            res *= parseFloat(vals[i]);
            break;
          case T_DIV:
            res /= parseFloat(vals[i]);
            break;
          case T_MOD:
            res %= parseFloat(vals[i]);
            break;
          case T_AVERAGE:
            res += parseFloat(vals[i]);
            break;
          case T_HYPOT:
            res += parseFloat(vals[i]) ** 2;
            break;
        }
      }
      switch (activeCell.type) {
        case T_SQRT:
          res = sqrt(res);
          break;
        case T_SIN:
          res = sin(res);
          break;
        case T_COS:
          res = cos(res);
          break;
        case T_ROUND:
          res = round(res);
          break;
      }
      if (activeCell.type == T_AVERAGE) {
        res = res / vals.length;
      }
      if (activeCell.type == T_HYPOT) {
        res = sqrt(res);
      }
    }
    let output = activeCell.children[0].handleSH;
    this.updateVarMap(output, res)
  }

  t_compare(activeCell, index) {
    jlog('Controller', 't_compare');
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index, 0);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
    let res = true;
    if (vals.length == 0) {
      res = false;
    }
    if (onlyNums == true) {
      let prev = vals[0];
      for (let i = 1; i < vals.length; i++) {
        switch (activeCell.type) {
          case T_EQUAL:
            if (prev != vals[i]) {
              res = false;
            }
            break;
          case T_GREATER:
            if (prev <= vals[i]) {
              res = false;
            }
            break;
          case T_LESS:
            if (prev >= vals[i]) {
              res = false;
            }
            break;
        }
        prev = vals[i];
      }
    } else {
      let prev = vals[0];
      for (let i = 1; i < vals.length; i++) {
        switch (activeCell.type) {
          case T_EQUAL:
            if (prev != vals[i]) {
              res = false;
            }
            break;
          case T_GREATER:
            res = false;
            break;
          case T_LESS:
            res = false
            break;
        }
        prev = vals[i];
      }
    }
    // and return
    activeCell.dataSH = res;
  }

  t_not(activeCell, index) {
    jlog('Controller', 't_not');
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index, 0);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let containsString = survey['containsString'];
    let isNumbers = survey['isNumbers'];
    let onlyBools = survey['onlyBools'];
    let res = this.evaluateCondition(onlyBools, onlyNums, vals);
    res = !res;
    // let output = activeCell.children[0].handleSH;
    activeCell.dataSH = res;
    // this.updateVarMap(output, res)
  }

  t_if(activeCell, index) {
    jlog('Controller', 't_if');
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.getDataSH() == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let no = activeCell.children[2];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0) {
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
    }
    return stillIn;
  }

  runChildren(childs, indix){ //arays but used sequentially
    jlog('Controller', 'runChildren');
    for (let i = 0; i < childs.length; i++){
      switch(childs[i].type){
        case T_EQUAL:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_LESS:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_GREATER:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_NOT:
          this.t_not(childs[i], indix[i]);
          break;
        default:
          break;
      }
    }
  }

  t_condition(activeCell, index) {
    jlog('Controller', 't_condition');
    this.addToStack(index);
    activeCell.dataSH = B_UNSET;
    let survey = this.lookAtChildren(activeCell, index, 0);
    let res = this.evaluateCondition(survey['onlyBools'], survey['onlyNums'], survey['vals']);
    if (res == true) {
      activeCell.dataSH = B_TRUE;
    } else {
      activeCell.dataSH = B_FALSE;
    }
  }

  t_for(activeCell, index) {
    jlog('Controller', 't_for');
    this.addToStack(index);
    let stillIn = false;
    if (activeCell.children[0].children.length > 0) {
      this.addToStack(activeCell.childIndicies[0]);
      if (activeCell.children[0].children[0].type == T_LEN){
        this.t_len(activeCell.children[0].children[0], activeCell.children[0].childIndicies[0]);
      }
      let repeats = activeCell.children[0].children[0].dataSHasType['number'];
      activeCell.children[0].updateDataSH(repeats);
      activeCell.updateDataSH(activeCell.dataSHasType['number'] + 1);
      if (activeCell.dataSH <= repeats) {
        stillIn = true;
      }
      this.updateVarMap(activeCell.children[0].handleSH, activeCell.dataSHasType['number'] -1);
    }
    if (stillIn == true) {
      if (activeCell.children[1].children.length > 0) {
        this.addToStack(activeCell.childIndicies[1]);
        this.index = activeCell.children[1].childIndicies[0];
      }
    }
    return stillIn;
  }

  t_while(activeCell, index) {
    jlog('Controller', 't_while');
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.getDataSH() == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0) {
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
      stillIn = false;
    }
    return stillIn;
  }

  t_len(activeCell, index) {
    jlog('Controller', 't_len');
    this.addToStack(index);
    let blockIndex = this.findBlock(activeCell.handleSH);
    if (blockIndex == -1) {
      return;
    }
    activeCell.dataSH = -1;
    if (this.script[blockIndex].type == T_INPUT){
      activeCell.updateDataSH(this.script[blockIndex].dataSHasType['string'].length);
    } else {
      activeCell.updateDataSH(this.script[blockIndex].children.length);
    }
  }

  unpackGet(getBlock){
    jlog('Controller', 'unpackGet');
    if (getBlock.dataSH.indexOf('object:') != -1){
      let index = parseInt(getBlock.dataSH.slice('object:'.length));
      if (String(this.script[index].handleSH) == 'undefined') {
        return index;
      } else {
        return this.findBlock(this.script[index].handleSH);
      }
    } else {
      return getBlock.dataSH;
    }
  }

  t_arrayOp(activeCell, index) {
    jlog('Controller', 't_arrayOp');
    this.addToStack(index);
    if (activeCell.children[0].children.length == 0){
      return;
    }
    let blockIndex = this.findBlock(activeCell.handleSH);
    if (blockIndex == -1 || activeCell.children.length < 1 || activeCell.handleSH == 'unset') {
      activeCell.updateDataSH(-1);
      return;
    }
    this.tidyFlag = true;
    let blockType = this.script[blockIndex].type;
    let myInd = parseInt(activeCell.children[0].children[0].dataSH);
    if (activeCell.type == T_GET || activeCell.type == T_RUN) {
      this.tidyFlag = false;
      if (blockType == T_INPUT){
        let target = String(this.script[blockIndex].dataSH);
        let dataval = target[myInd % target.length];
        activeCell.updateDataSH(dataval);
      } else {
        let children = this.script[blockIndex].children;
        let child = children[myInd % children.length];
        while (myInd < 0) {
          myInd += children.length;
        }
        myInd = myInd % children.length;
        let childInd = this.script[blockIndex].childIndicies[myInd];
        if (activeCell.type == T_RUN && (child.type == T_BLOCK || child.type == T_GOTO)){
          this.index = childInd;
          return;
        }
        this.addToStack(childInd);
        if (String(child.dataSH) != 'undefined') {
          activeCell.updateDataSH(child.dataSH);
        } else {
          activeCell.updateDataSH("object:" + this.script[blockIndex].childIndicies[myInd]);
        }
      }
    } else if (activeCell.type == T_PUSH) {
      this.lookAtChildren(activeCell.children[0], activeCell.childIndicies[0], 0);
      this.envChanged = true;
      let childData = 0;
      if (activeCell.children[0].children.length > 0){
        childData = activeCell.children[0].children[0].getDataSH();
      }
      if (blockType == T_INPUT) {
        this.script[blockIndex].updateDataSH(this.script[blockIndex].dataSHasType['string'] + String(childData), true);
        // need to update globally too
        let output = this.script[blockIndex].handleSH;
        this.updateVarMap(output, this.script[blockIndex].getDataSH());
      } else {
        let type = T_CONST;
        if (activeCell.children[0].children[0].type == T_GOTO) {
          type = T_GOTO;
        }
        let newChild = cells.pushChild(type, blockIndex, this.script[blockIndex], childData);
        if (type == T_GOTO) {
          newChild.updateHandleSH(activeCell.children[0].children[0].handleSH);
          newChild.forceHandleSH = true;
        }
        this.script.push(newChild);// = cells.cells;
        this.terminate = this.script.length + 1;

      }
    } else if (activeCell.type == T_SET) { // might not work with T_GET
      this.lookAtChildren(activeCell.children[0], activeCell.childIndicies[0], 0);
      this.lookAtChildren(activeCell.children[1], activeCell.childIndicies[1], 0);
      this.envChanged = true;
      let newVal = String(activeCell.children[1].children[0].getDataSH());
      if (blockType == T_INPUT) {
        newVal = newVal[0];
        let oldData = this.script[blockIndex].dataSHasType['string'];
        myInd = myInd % oldData.length;
        let newData = oldData.substring(0, myInd) + newVal + oldData.substring(myInd+1)
        this.script[blockIndex].updateDataSH(newData, true);
        let output = this.script[blockIndex].handleSH;
        this.updateVarMap(output, this.script[blockIndex].getDataSH());
      } else {
        let sourceType = activeCell.children[1].children[0].type;
        if (sourceType == T_GET) {
          // let getHandle = activeCell.children[1].children[0].handleSH;
          // let getIndex = activeCell.children[1].children[0].children[0].children[0].getDataSH();
          // let getBlock = this.findBlock(getHandle);
          // sourceType = this.script[getBlock].children[getIndex%this.script[getBlock].children.length];
          sourceType = T_CONST;
        }
        myInd = myInd % this.script[blockIndex].children.length
        let target = this.script[blockIndex].children[myInd];
        let targetI = this.script[blockIndex].childIndicies[myInd];
        // change to type: keep handle change data, add handle and data, addData ?
        cells.replaceWithType(sourceType, this.script[blockIndex], target, targetI, activeCell.children[1].children[0]);
        this.script = cells.cells;
      }
    } else if (activeCell.type == T_DELETE) {
      this.envChanged = true;
      if (blockType == T_INPUT) {
        let data = this.script[blockIndex].dataSHasType['string'];
        myInd = myInd % data.length;
        let newData = data.slice(0, myInd) + data.slice(myInd + 1);
        this.script[blockIndex].updateDataSH(newData, true);
        this.updateVarMap(this.script[blockIndex].handleSH, this.script[blockIndex].getDataSH());
      } else {
        if (this.script[blockIndex].children.length == 0) {
          return;
        }
        myInd = myInd % this.script[blockIndex].children.length;
        let indexToDelete = this.script[blockIndex].childIndicies[myInd];
        cells.cells[indexToDelete].markForDeletion();
        let deleted = [];
        for (let i = 0; i < cells.length; i++){
          if (cells.cells[i].mode == M_DELETE){
            deleted.push(i);
          }
        }
        cells.activeIndex = indexToDelete;
        cells.doDelete();
        this.script = cells.cells;
        this.terminate -= deleted.length;
        for (let j = 0; j < deleted.length; j++) {
          for (let i = 0; i < this.workingStack.length; i++){
            if (this.workingStack[i] > deleted[j]) {
              this.workingStack[i] -= 1;
            }
          }
        }
      }
    }
  }

};
function newCell(type, x =-1, y =-1) {
  jlog('Main', 'newCell');
  type = int(type);
  let presAddStart = 0;
  if (mobileDeviceDetected == false) {
    presAddStart = cells.length;
    cells.addCell(type, x, y);
    pres.addCellsForPres(cells.cells, presAddStart)
  } else {
    if (mobileHAddon == true) {
      presAddStart = cells.length;
      cells.addCell(mobileHType, x, y);
      pres.addCellsForPres(cells.cells, pas)
      mobileHAddon = false;
    } else {
      mobileHType = type;
      mobileHAddon = true;
    }
  }
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
}

function setTidyFlag() {
  jlog('Main', 'tidy');
  tidyFlag = 3;
}

function tidy() {
  jlog('Main', 'tidy');
  if (cells.run == false) {
    if (runMode == RM_NORMAL) {
      let xOffset = 2*myDivs['menu'].x + myDivs['menu'].size().width;
      cells.tidy(round(xOffset/(gridSize/2))*(gridSize/2), gridSize);
      if (zoomMode == true) {
        cells.update(mouseX, mouseY, mouseIsPressed);
      }
    }
    if (runMode == RM_CREATE) {
      let yOffset = 2*myDivs['presTools'].y + myDivs['presTools'].size().height// + gridSize/2;
      pres.tidy(myDivs['presTools'].x/pixelDensity(), yOffset);
      if (zoomMode == true) {
        pres.update(mouseX, mouseY, mouseIsPressed);
      }
    }
  }
}

function colorSetup() {
  jlog('Main', 'colorSetup');
  let colors = [];
  let icolors = [];
  let dtcolors = [];
  let highlights = [];
  let lowlights = [];
  for (let i = 0; i < c.length; i++) {
    colors.push(color('#' + c[i]));
  }
  delete c;
  let cvals;
  let m;

  for (let i = 0; i < colors.length; i++) {
    cvals = colors[i]['levels'][0] + colors[i]['levels'][1] + colors[i]['levels'][2];
    m = (colors[i]['maxes']['rgb'][0] + colors[i]['maxes']['rgb'][1] + colors[i]['maxes']['rgb'][2])/2;
    icolors.push(color(colors[i]['maxes']['rgb'][0] - colors[i]['levels'][0], colors[i]['maxes']['rgb'][1] - colors[i]['levels'][1], colors[i]['maxes']['rgb'][2] - colors[i]['levels'][2]))
    if (cvals > m) {
      highlights.push(lerpColor(colors[i], color(0), 0.7));
      lowlights.push(lerpColor(colors[i], color(255), 0.2));
      dtcolors.push(color(0));
    } else {
      highlights.push(lerpColor(colors[i], color(255), 0.7));
      lowlights.push(lerpColor(colors[i], color(0), 0.2));
      dtcolors.push(color(255));
    }
  }
  allColors['colors'] = colors;
  allColors['icolors'] = icolors;
  allColors['dtcolors'] = dtcolors;
  allColors['highlights'] = highlights;
  allColors['lowlights'] = lowlights;
}

function saveCells(wip=false) {
  jlog('Main', 'saveCells');
  let map = cells.saveCells();
  console.log(JSON.stringify(map));
  let name = 'demo' + String(demos.length) + '.json';
  if (wip == true) {
    name = 'wip-demo.json'
  }
  save(map, name, true);
  setTidyFlag();
}

function loadBackup() {
  jlog('Main', 'loadBackup');
  // console.log(backupObject);

  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  clearCells();
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells.cells = [];
  let myLoaderMap = JSON.parse(backupObject);
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  for (let i = 0; i < this.length; i++) {
    this.cells[i].reshape(true);
  }
  cells.cells[1].indexLabeldiv.html(consoleTextLabel);
  cells.cells[1].lineNumber = lineNumber;
  cells.cells[1].indexLabeldiv.elt.scrollTop = 1000 * cells.cells[1].lineNumber;
  setTidyFlag();
}

function shareLink() {
  jlog('Main', 'shareLink');
  // shareLinkGenerated = true;
  myDivs['shareLink'] = createDiv();
  myDivs['shareLink'].style('background-color', 'DimGray');
  myDivs['shareLink'].style('padding', '10px');
  myDivs['shareLink'].style('outline', '1px solid black');
  let w = 200;
  myDivs['shareLink'].size(w, null);
  myDivs['shareLink'].style('overflow', "auto");
  myDivs['shareLink'].position((windowWidth/2) - (w/2), 40);
  myDivs['shareLink'].show();
  addButtonToDiv('share project', 1, shareProject, myDivs['shareLink'], 'header');
  addButtonToDiv('create presentation', 1, createPresentation, myDivs['shareLink'], 'header');
  addButtonToDiv('cancel', 1, cancelShare, myDivs['shareLink']);
  // noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  noClickZone = [0, windowWidth, 0, windowHeight];
}

function cancelShare() {
  jlog('Main', 'cancelShare');
  myDivs['shareLink'].remove();
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  doMouseDrag = false;
}

function createPresentation() {
  jlog('Main', 'createPresentation');
  backupObject = JSON.stringify(cells.saveCells());
  pres.presBackup = cells.saveCells(true);
  cells.addIDsForCreateMode();
  redrawCounter = 2;
  if (pres.length == 0){
    pres.addCellsForPres(cells.cells)
  }
  cancelShare();
  presCreationMode = true;
  // showGUI = false;
  runMode = RM_CREATE;
  cells.hideAll(presComponents);
  myDivs['presTools'] = createDiv();
  myDivs['presTools'].style('background-color', 'DimGray');
  myDivs['presTools'].style('padding', '10px');
  myDivs['presTools'].style('outline', '1px solid black');
  myDivs['presTools'].size(myDivs['menu'].width, null);
  myDivs['presTools'].style('overflow', "auto");
  myDivs['presTools'].position(10, 10);
  myDivs['presTools'].show();
  hideMenu = true;
  myDivs['menu'].hide();
  addButtonToDiv('share presentation', 1, sharePresentation, myDivs['presTools']);
  addButtonToDiv('center', 13, imlost, myDivs['presTools']);
  addButtonToDiv('back', 1, exitPresentationMode, myDivs['presTools']);
  pres.cleanForCreateMode();
  setTidyFlag();
}

function exitPresentationMode() {
  hideMenu = false;
  presCreationMode = false;
  showGUI = true;
  pres.removeCreateMode();
  loadBackup();
  myDivs['menu'].show();
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  myDivs['presTools'].remove();
  runMode = RM_NORMAL;
  redrawCounter = 4;
  cells.updateView(xPos, yPos, true);
}

function sharePresentation() {
  shareLinkString = pres.putInAddyBar(true);
  let scriptLink = shareLinkString.replace('#', '##');
  exitPresentationMode();
  window.open(scriptLink);
  doMouseDrag = false;
}

function shareProject() {
  jlog('Main', 'shareProject');
  shareLinkString = cells.putInAddyBar();
  cancelShare();
  window.open(shareLinkString);
}

function loadCells(myLoaderMap) {
  jlog('Main', 'loadCells');
  imlost();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
  for (let i = 0; i < cells.length; i++) {
    cells.cells[i].mode = M_DELETE;
    cells.cells[i].cleanForDeletionSafe();
  }
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  // cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  mobileSettings();
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  let xOffset = 2*myDivs['menu'].x + myDivs['menu'].size().width;
  cells.nudgeX(xOffset);
  setTidyFlag(); // have to do twice?
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
  cells.updateView(xPos, yPos, true);
  setTidyFlag();
  redrawCounter = 4;
  pres.cells = [];
  pres.addCellsForPres(cells.cells);
}

function mobileSettings() {
  jlog('Main', 'mobileSettings');
  if (zoomMode == true){
    fontSizeString = '10px';
    cells.dWidth = 40;
    cells.dHeight = 20;
    cells.dRadius = 4;
  } else {
    cells.dWidth = 80;
    cells.dHeight = 40;
    cells.dRadius = 5;
    fontSizeString = '12px';
  }
}

function showHideBlockMenu() {
  jlog('Main', 'showHideBlockMenu');
  showBlockMenu = ! showBlockMenu;
  if (showBlockMenu == true) {
    myDivs['blocks']['main'].show();
    myDivs['demos'].hide();
    showDemoMenu = false;
    myDivs['utils'].hide();
    showUtils = false;
  } else {
    myDivs['blocks']['main'].hide();
    restyleMenuDiv();
    if (submenu != 0) {
      myDivs['blocks'][submenu].hide();
      submenu = 0;
    }
  }
}

function showHideDemoMenu() {
  jlog('Main', 'showHideDemoMenu');

  showDemoMenu = ! showDemoMenu;
  if (showDemoMenu == true) {
    myDivs['blocks']['main'].hide();
    showBlockMenu = false;
    myDivs['utils'].hide();
    showUtils = false;
    myDivs['demos'].show();
  } else {
    myDivs['demos'].hide();
    restyleMenuDiv();
  }
  // myDivs['menu'].html('');
  // createMenuDiv();
}

function clearCells() {
  jlog('Main', 'clearCells');
  controller.d_print('Clearing...');
  cells.quickClear();
  createMenuDiv();
}

function toggleSpeedMode() {
  jlog('Main', 'toggleSpeedMode');
  speedMode += 1;
  if (speedMode > 2) {
    speedMode = 0;
  }
  slowMode = false;
  fastMode = false;
  if (speedMode == 2) {
    slowMode = true;
  }
  if (speedMode == 1) {
    fastMode = true;
  }
  speedButton.html('speed: ' + String(speedMode + 1));
}

function toggleFlash() {
  jlog('Main', 'toggleFlash');
  flash = !flash;
  flashButton.html('flash: ' + String(flash));
}

function showAll() {
  jlog('Main', 'showAll');
  for (let i = 0; i < userBlocks.length; i++) {
    cells.addCell(userBlocks[i], 1.5 * myDivs['menu'].size().width);
    cells.cells[cells.activeIndex].mode = M_IDLE;
  }
  setTidyFlag();
}

function drawGrid() {
  jlog('Main', 'drawGrid');
  // console.log(xPos, yPos);
  for (let x = 0; x < windowWidth; x+=bgGrid.width) {
    for (let y = 0; y < windowHeight; y+= bgGrid.height) {
      image(bgGrid, x + xPos%20, y + yPos%20);
    }
  }
}

function mouseDrag() {
  jlog('Main', 'mouseDrag');
  if (mouseIsPressed == false) {
    doMouseDrag = false;
  }
  if (disableDrag == true){
    doMouseDrag = false;
  }
  if (doMouseDrag == true) {
    xOff = xStart - mouseX;
    yOff = yStart - mouseY;
    xPos -= xOff * 0.1;//0.03;
    yPos -= yOff  * 0.1;//0.03;
  } else {
    xOff = 0;
    yOff = 0;
  }
}

function imlost() {
  jlog('Main', 'imlost');
  xPos = 0;
  yPos = 0;
}

function togglezoomMode() {
  jlog('Main', 'togglezoomMode');
  zoomMode = ! zoomMode;
  // back up everything
  // reset font and max width sizes
  // recreate everything
  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  loadCells(currentLayout);
  cells.cells[1].indexLabeldiv.html(consoleTextLabel);
  cells.cells[1].lineNumber = lineNumber;
  cells.cells[1].indexLabeldiv.elt.scrollTop = 1000 * cells.cells[1].lineNumber;
  myDivs['menu'].html('');
  for (let i = 0; i < cells.length; i++){
    cells.cells[i].resetDims();
  }
  // createMenuDiv();
  if (zoomMode == false){
    myDivs['menu'].style('font-size', '16px');
  } else {
    myDivs['menu'].style('font-size', '12px');
  }
}

function newCellFromButtonClick(button) {
  jlog('Main', 'newCellFromButtonClick');
  type = button.srcElement.value;
  newCell(type, mouseX, mouseY);
  // createMenuDiv();
}

function createAddBlockMenu(list, div) {
  jlog('Main', 'createAddBlockMenu');
  for (let i = 0; i < list.length; i++) {
    addButtonToDiv('+ ' + blockConfig[list[i]]['block label'], list[i], newCellFromButtonClick, div, 'colorcoded');
  }
}

function loadCellsFromButtonClick(button) {
  jlog('Main', 'loadCellsFromButtonClick');
  index = parseInt(button.srcElement.value);
  loadCells(demos[index]);
  // createMenuDiv();
}

function showBlocksubmenu(button) {
  jlog('Main', 'showBlocksubmenu');
  let oldSM = submenu;
  submenu = parseInt(button.srcElement.value);
  for (let i = 1; i <= 7; i++){
    myDivs['blocks'][i].hide();
  }
  if (oldSM == submenu) {
    submenu = 0;
  } else {
    myDivs['blocks'][submenu].show();
  }
  restyleMenuDiv();
}

function addButtonToDiv(name, value, callback, div, cssClass='basic'){
  jlog('Main', 'addButtonToDiv');
  let button = createButton(name, String(value));
  // button.addClass(String(cssClass)); // i prefer using JS
  button.addClass('basic');
  if (cssClass == 'colorcoded') {
    let tc = allColors['dtcolors'][value].toString('#rrggbb');
    let c1 = allColors['colors'][value].toString('#rrggbb');
    button.style('color', tc);
    button.style('text-align', 'left');
    button.style('background-image', 'linear-gradient(' + c1 + ', ' + c1 + ')');
    button.style('border-color', 'DimGray');
  } else if (cssClass == 'dev') {
    button.style('height', '18px');
    button.style('background-image', 'linear-gradient(DimGray, DimGray)');
    button.style('border-color', 'DimGray');
    button.style('box-shadow', 'rgba(255,255,255,.6) 0 0px 0 inset')
    button.style('color', 'LightGray');
  } else if (cssClass == 'header') {
    button.style('background-image', 'linear-gradient(#b7b8ba ,#a7a9ac)');
  } else if (cssClass == 'demo') {
    button.style('text-align', 'left');
  } else if (cssClass == 'eg') {
    button.style('text-align', 'left');
    button.style('background-image', 'linear-gradient(#d7d8da ,#c7c9cc)');
  } else if (cssClass == 'big') {
    button.style('height', '100%');
    button.style('width', '100%');
  }


  button.parent(div);
  if (callback != 0) {
    button.mousePressed(callback);
  }

  if (cssClass == 'speedID') {
    speedButton = button;
  } else if (cssClass == 'flashID') {
    flashButton = button;

  }
  div.html('<br>', true);
}

function blocksMenu() {
  jlog('Main', 'blocksMenu');
  addButtonToDiv('blocks menu', 0, showHideBlockMenu, myDivs['menu'], 'header');
  myDivs['blocks'] = {};
  myDivs['blocks']['main'] = createDiv();
  for (let i = 1; i <= 7; i++) {
    myDivs['blocks'][i] = createDiv();
  }
  createAddBlockMenu(containers, myDivs['blocks'][1]);
  createAddBlockMenu(handles, myDivs['blocks'][2]);
  createAddBlockMenu(arrayTools, myDivs['blocks'][7]);
  createAddBlockMenu(mathFunctions, myDivs['blocks'][3]);
  createAddBlockMenu(boolFunctions, myDivs['blocks'][4]);
  createAddBlockMenu(conditionals, myDivs['blocks'][5]);
  createAddBlockMenu(utilities, myDivs['blocks'][6]);
  for (let i = 1; i <= 7; i++) {
    // if (i != submenu && showBlockMenu == true)
    myDivs['blocks'][i].hide();
  }
  addButtonToDiv('data containers', 1, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][1].parent(myDivs['blocks']['main']);

  addButtonToDiv('data references', 2, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][2].parent(myDivs['blocks']['main']);

  addButtonToDiv('array tools', 7, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][7].parent(myDivs['blocks']['main']);

  addButtonToDiv('math', 3, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][3].parent(myDivs['blocks']['main']);

  addButtonToDiv('comparison', 4, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][4].parent(myDivs['blocks']['main']);

  addButtonToDiv('conditionals', 5, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][5].parent(myDivs['blocks']['main']);

  addButtonToDiv('utilities', 6, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][6].parent(myDivs['blocks']['main']);

  addButtonToDiv('show all', 6, showAll, myDivs['blocks']['main']);
  myDivs['blocks']['main'].parent(myDivs['menu']);
  if (showBlockMenu == false) {
    myDivs['blocks']['main'].hide();
  } else {
    if (submenu != 0) {
      myDivs['blocks'][submenu].show();
    }
  }
}

function demoMenu(){
  jlog('Main', 'demoMenu');
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('demo menu', 6, showHideDemoMenu, myDivs['menu'], 'header');
  myDivs['demos'] = createDiv();
  addButtonToDiv('Hello, World!', 0, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Turing bit flip', 14, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Programmable TM', 15, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Sleep Sort', 7, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Draw Polygons', 8, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  // myDivs['menu'].html('<span style="color:LightGray">block usage:</span><br>', true);
  addButtonToDiv('blocks', 1, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('assigning', 2, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('basic math', 3, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('comparisons', 4, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('if', 5, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('if not', 6, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('while and array get', 9, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array/string push', 10, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array/string set', 11, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('string delete', 12, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array delete', 13, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('test all', 13, testAll, myDivs['demos']);
  myDivs['demos'].parent(myDivs['menu']);
  if (showDemoMenu == false){
    myDivs['demos'].hide();
  } else {
    myDivs['demos'].show();
  }

}

function showHideUtilMenu() {
  jlog('Main', 'showHideUtilMenu');
  showUtils = !showUtils;
  if (showUtils == true) {
    myDivs['utils'].show();
    myDivs['demos'].hide();
    showDemoMenu = false;
    myDivs['blocks']['main'].hide();
    showBlockMenu = false;

  } else {
    myDivs['utils'].hide();
    restyleMenuDiv();
  }
}

function utilitiesMenu(){
  jlog('Main', 'utilitiesMenu');
  myDivs['menu'].html("<br>", true);
  addButtonToDiv('tools', 13, showHideUtilMenu, myDivs['menu'], 'header');
  myDivs['utils'] = createDiv();
  addButtonToDiv('clear', 13, clearCells, myDivs['utils']);
  addButtonToDiv('tidy', 13, setTidyFlag, myDivs['utils']);
  addButtonToDiv('speed: ' + String(speedMode+1), 13, toggleSpeedMode, myDivs['utils'], 'speedID');
  addButtonToDiv('flash: ' + String(flash), 13, toggleFlash, myDivs['utils'], 'flashID');
  addButtonToDiv('origin', 13, imlost, myDivs['utils']);
  addButtonToDiv('share', 13, shareLink, myDivs['utils']);
  addButtonToDiv('refactor', 13, refactor, myDivs['utils']);
  // if (shareLinkGenerated == true) {
  //   addButtonToDiv('reshare', 13, shareLink, myDivs['utils']);
  //   myDivs['utils'].html('<a href="' +shareLinkString +'" target="_blank">share link</a><br>', true);
  // } else {
  //   addButtonToDiv('share', 13, shareLink, myDivs['utils']);
  // }
  if (zoomMode == false) {
    addButtonToDiv('zoom out', 13, togglezoomMode, myDivs['utils']);
    // myDivs['menu'].html('<br><a href="javascript:void(0);" onclick="togglezoomMode();createMenuDiv();">zoom out</a><br>', true);
  } else {
    // myDivs['menu'].html('<br><a href="javascript:void(0);" onclick="togglezoomMode();createMenuDiv();">zoom in</a><br>', true);
    addButtonToDiv('zoom in', 13, togglezoomMode, myDivs['utils']);
  }
  myDivs['utils'].parent(myDivs['menu']);
  if (showUtils == true) {
    myDivs['utils'].show();
  } else {
    myDivs['utils'].hide();
  }

  // myDivs['menu'].html('<br><a href="http://b38tn1k.com/code/ux/2022/09/08/blocks-explained/" target="_blank">about</a><br>', true);
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('about', 0, openAbout, myDivs['menu']);
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('version 0.000..01', 13, showDevDiv, myDivs['menu'], 'dev');
  // let myLink = createA('http://b38tn1k.com/code/ux/2022/09/08/blocks-explained/', 'about', '_blank_');
  // myLink.parent(myDivs['menu']);
}

function openAbout(){
  jlog('Main', 'openAbout');
  window.open('https://b38tn1k.com/code/ux/2022/09/08/blocks-explained/');
}

function closeRefactorDiv(){
  jlog('Main', 'closeRefactorDiv');
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  let stringed = String(JSON.stringify(cells.saveCells()));
  for (let i = 0; i < myDivs['refactorInputs'].length; i++){
    stringed = stringed.replaceAll(myDivs['refactorPriors'][i], myDivs['refactorInputs'][i].value());
  }

  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  clearCells();
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells.cells = [];
  let myLoaderMap = JSON.parse(stringed);
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  for (let i = 0; i < this.length; i++) {
    this.cells[i].reshape(true);
  }
  cells.cells[1].indexLabeldiv.html(consoleTextLabel);
  cells.cells[1].lineNumber = lineNumber;
  cells.cells[1].indexLabeldiv.elt.scrollTop = 1000 * cells.cells[1].lineNumber;
  myDivs['refactor'].remove();
  myDivs['refactorInputs'] = [];
  myDivs['refactorPriors'] = [];
}

function refactor() {
  jlog('Main', 'refactor');
  jlog('Main', 'refactor');
  myDivs['refactor'] = createDiv();;
  myDivs['refactor'].style('background-color', 'DimGray');
  myDivs['refactor'].style('padding', '10px');
  myDivs['refactor'].style('outline', '1px solid black');
  let w = 200;
  myDivs['refactor'].size(w, null);
  myDivs['refactor'].style('overflow', "auto");
  myDivs['refactor'].position((windowWidth/2) - (w/2), 40);
  myDivs['refactor'].show();
  let handleSet = new Set();
  for (let i = 0; i < cells.length; i++) {
    if (cells.cells[i].handleSH) {
      if (['turtleY', 'turtleX', 'turtleDraw', 'unset', 'random', 'year', 'month#', 'monthS', 'day#', 'dayS', 'hour', 'minute', 'second', 'millis'].indexOf(cells.cells[i].handleSH) == -1) {
        handleSet.add(cells.cells[i].handleSH);
      }
    }
  }
  myDivs['refactorInputs'] = [];
  myDivs['refactorPriors'] = [];
  for (const hand of handleSet.keys()) {
    let inp = createInput(hand);
    inp.parent(myDivs['refactor']);
    myDivs['refactorInputs'].push(inp);
    myDivs['refactorPriors'].push(hand);
  }
  addButtonToDiv('rename & close', 1, closeRefactorDiv, myDivs['refactor'], 'header');
  noClickZone = [0, windowWidth, 0, windowHeight];
}

function restyleMenuDiv(){
  myDivs['menu'].style('background-color', 'DimGray');
  myDivs['menu'].style('padding', '10px');
  myDivs['menu'].style('outline', '1px solid black');
  if (myDivs['menu'].size().height > windowHeight - 50){
    let newHeight = windowHeight - 50;
    myDivs['menu'].size(null, newHeight);
  } else {
    myDivs['menu'].size(null, null);
  }
  myDivs['menu'].style('overflow', "auto");
  myDivs['menu'].position(10, 10);
}

function createMenuDiv() {
  jlog('Main', 'createMenuDiv');
  myDivs['menu'].remove();
  if (showGUI == true) {
    myDivs['menu'] = createDiv();
    blocksMenu();
    demoMenu();
    utilitiesMenu();
    if (zoomMode == false){
      myDivs['menu'].style('font-size', '16px');
    } else {
      myDivs['menu'].style('font-size', '12px');
    }
    myDivs['menu'].style('background-color', 'DimGray');
    myDivs['menu'].style('padding', '10px');
    myDivs['menu'].style('outline', '1px solid black');
    if (myDivs['menu'].size().height > windowHeight - 50){
      let newHeight = windowHeight - 50;
      myDivs['menu'].size(null, newHeight);
    } else {
      myDivs['menu'].size(null, null);
    }
    myDivs['menu'].style('overflow', "auto");
    myDivs['menu'].position(10, 10);
    noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
    if (hideMenu == true){
      myDivs['menu'].hide();
      noClickZone = [-1, -1, -1, -1];
    } else {
      myDivs['menu'].show();
    }
    showDev = ! showDev;
    showDevDiv();
  }
}

function toggleDevOptions(button) {
  jlog('Main', 'toggleDevOptions');
  item = parseInt(button.srcElement.value);
  switch (item) {
    case 0:
      showFPS = !showFPS;
      break;
    case 1:
      clickDebug = !clickDebug;
      break;
    case 2:
      printStack = !printStack;
      break;
    case 3:
      doJLOGCountDown = 50;
      break;
  }
}

function showDevDiv(){
  showDev = ! showDev;
  if (showDev == false){
    if (myDivs['devDiv']) {
      myDivs['devDiv'].remove();
    }
    return;
  }
  if (myDivs['devDiv']) {
    myDivs['devDiv'].remove();
  }
  myDivs['devDiv']= createDiv();
  myDivs['devDiv'].style('font-size', '12px');
  myDivs['devDiv'].style('background-color', 'DimGray');
  myDivs['devDiv'].style('padding', '10px');
  myDivs['devDiv'].style('outline', '1px solid black');
  addButtonToDiv('save json', 0, saveCells, myDivs['devDiv']);
  addButtonToDiv('show FPS', 0, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('click log', 1, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('print stack', 2, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('tmi log', 3, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('free colors', 3, whatsLeft, myDivs['devDiv']);
  addButtonToDiv('clean', 3, cells.clean, myDivs['devDiv']);
  addButtonToDiv('load wip', demos.length-1, loadCellsFromButtonClick, myDivs['devDiv']);
  myDivs['devDiv'].position(windowWidth - (40 + myDivs['devDiv'].size().width), 10);
}

function setupScreen() {
  jlog('Main', 'setupScreen');
  jlog('Main', 'setupScreen');
  pixelDensity(1);
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    zoomMode = true;
    mobileDeviceDetected = true;
  }
  createCanvas(windowWidth, windowHeight);
  if (windowWidth/windowHeight < 10/16) {
    zoomMode = true;
  }
  let gs2 = gridSize**2;
  bgGrid = createGraphics(gs2, gs2);
  for (let i = gridSize/2; i < gs2; i += gridSize) {
    for (let j = gridSize/2; j < gs2; j+= gridSize) {
      bgGrid.point(i, j);
    }
  }
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  showDev = ! showDev;
  showDevDiv();
}

function doLastBit(){
  jlog('Main', 'doLastBit');
  let loaded = false;
  let demoIndex = -1;
  let myString = getURL();
  if (myString.indexOf("#tutorial")  != -1) {
    tutorial = true;
    tutorialstring = myString.slice(myString.indexOf("#tutorial"), myString.length);
  } else if (myString.indexOf("#demo") != -1) {
    let demo = myString.split("demo");
    demoIndex = parseInt(demo[demo.length - 1]);
  } else {
    loaded = cells.makeFromAddyBar();
  }
  loaded = doTutorials(loaded);
  if (loaded == false) {
    cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
    if (demoIndex != -1 && demoIndex < demos.length) {
      loadCells(demos[demoIndex]);
    }
    setTidyFlag();
  }
  if (cells.length > 1) {
    cells.cells[1].resizeConsole();
  }
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
  createPresentationDiv();
}

function createPresentationDiv(){
  jlog('Main', 'createPresentationDiv');
  presentationDivs['main'] = createDiv();
  presentationDivs['main'].style('font-size', '16px');
  // presentationDivs['main'].style('background-color', 'DimGray');
  presentationDivs['main'].style('padding', '10px');
  // presentationDivs['main'].size(null, null);
  presentationDivs['main'].style('overflow', "auto");
  presentationDivs['main'].position(10, 10);
  if (presentationMode == true) {
    presentationDivs['main'].show();
    console.log(cells.layoutArray);
  } else {
    presentationDivs['main'].hide();
  }

  presentationDivs['defaultItemsWrapper'] = createDiv();
  presentationDivs['defaultItemsWrapper'].style('font-size', '16px');
  // presentationDivs['defaultItemsWrapper'].style('padding', '10px');
  presentationDivs['defaultItemsWrapper'].style('border', "1px solid black")
  presentationDivs['defaultItemsWrapper'].size(null, 100);
  presentationDivs['defaultItemsWrapper'].parent(presentationDivs['main']);

  presentationDivs['startbutton'] = createDiv();
  presentationDivs['startbutton'].style('float', 'left');
  presentationDivs['startbutton'].size(100, null);
  presentationDivs['startbutton'].style('padding', "10px");
  addButtonToDiv('run', 3, runFromButton, presentationDivs['startbutton']);//, 'big');

  presentationDivs['startbutton'].parent(presentationDivs['defaultItemsWrapper']);

  presentationDivs['console'] = createDiv('<strong>console:</strong><br>');
  // presentationDivs['console'].style('overflow', "hidden");
  presentationDivs['console'].size(200, presentationDivs['defaultItemsWrapper'].size().height);// * 0.6);
  presentationDivs['console'].style('overflow', "scroll");
  presentationDivs['console'].style('background-color', "black");
  presentationDivs['defaultItemsWrapper'].style('border', "1px solid black")
  // presentationDivs['console'].style('padding', "10px");
  presentationDivs['console'].parent(presentationDivs['defaultItemsWrapper']);
}

function runFromButton() {
  cells.run = ! cells.run;
  fastMode = 1;
}

function addToPresentation(myString, div) {
  jlog('Main', 'addToPresentation');

  if (div == 'console') {
    presentationDivs[div].html(' > ' + myString + '<br>', true);
    presentationDivs['console'].elt.scrollTop = 1000 * presentationDivs['console'].html().length;
  }
}

function doTutorials(loaded) {
  jlog('Main', 'doTutorials');
  if (tutorial == true){
    let noIframe = true;
    try {
      noIframe = window.self == window.top;
    } catch (e) {
      noIframe = true;
    }
    if (noIframe == true) {
      let myDiv = createDiv('<a href="https://b38tn1k.com/code/ux/2022/09/08/blocks-explained/"> back to tutorial </a>');
      myDiv.style('font-size', '16px');
      textSize(16);
      myDiv.position(windowWidth - textWidth(' back to tutorial '), windowHeight - 40);
    }
    switch(tutorialstring) {
      case '#tutorialBlank':
        break;
      case '#tutorialHello':
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        loadCells(demos[0]);
        cells.cells[0].reshape();
        cells.cells[0].refresh();
        if (zoomMode == true){
          tidyFlag = 0;
          cells.cells[1].x = cells.cells[0].x;
          cells.cells[1].y = cells.cells[0].y + cells.cells[0].height + cells.cells[0].handleH*2;
        } else {
          setTidyFlag();
        }
        cells.run = true;
        loaded = true;
        break;
      case '#tutorialHandles':
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        cells.addCell(T_CONST, 1.5 * myDivs['menu'].size().width);
        cells.cells[2].mode = M_IDLE;
        cells.cells[2].x = (windowWidth / 2 ) - cells.cells[2].width/2;
        cells.cells[2].y = windowHeight/2 - cells.cells[2].height/2;
        cells.cells[2].specialLayer = createGraphics(cells.cells[2].width*3, cells.cells[2].height*3);
        let fSize = parseInt(fontSizeString.slice(0, 2));
        cells.cells[2].specialLayer.textSize(fSize);
        let xc = cells.cells[2].specialLayer.width/2;
        let yc = cells.cells[2].specialLayer.height/2;
        let cw2 = cells.cells[2].width/2;
        let ch2 = cells.cells[2].height/2;
        let gap = fSize * 2;
        let px = int(xc - cw2 - gap- cells.cells[2].specialLayer.textWidth("move"));
        let py = int(yc - ch2);
        cells.cells[2].specialLayer.text("move", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc - ch2);
        cells.cells[2].specialLayer.text("delete", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc);
        cells.cells[2].specialLayer.text("copy", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc + ch2 + fSize);
        cells.cells[2].specialLayer.text("resize", px, py);
        px = int(xc - cw2 - gap - cells.cells[2].specialLayer.textWidth("mutate"));
        py = int(yc + ch2 + fSize);
        cells.cells[2].specialLayer.text("mutate", px, py);
        px = int(xc);
        py = int(yc + ch2 + gap);
        cells.cells[2].specialLayer.textAlign(CENTER, CENTER);
        cells.cells[2].specialLayer.text("expand/collapse", px, py);
        loaded = true;
        hideMenu = true;
        disableDrag = true;
        break;
      case '#tutorialMove':
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        hideMenu = true;
        loaded = true;
        disableDrag = true;
        cells.addCell(T_COMMENT, windowWidth * 0.25);
        cells.addCell(T_BLOCK, windowWidth * 0.75);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[2].mode= M_IDLE;
        cells.cells[3].mode= M_IDLE;
        cells.cells[4].mode= M_IDLE;
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        cells.cells[2].x -= cells.cells[2].width/2;
        cells.cells[3].x -= cells.cells[3].width/2;
        cells.cells[4].x -= cells.cells[4].width/2;
        cells.cells[2].input.value("can't drop on me");
        cells.cells[3].updateHandleSH("drop on me!");
        cells.cells[4].input.value('drag me');
        cells.cells[2].disableDelete();
        cells.cells[3].disableDelete();
        cells.cells[4].disableDelete();
        break;
      case '#tutorialMutate':
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        hideMenu = true;
        loaded = true;
        disableDrag = true;
        cells.addCell(T_ADD, windowWidth * 0.5);
        cells.cells[2].x -= cells.cells[2].width/2;
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[4].input.value(1);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[5].input.value(2);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[6].input.value(3);
        cells.cells[2].addChild(4, cells.cells[4]);
        cells.cells[2].addChild(5, cells.cells[5]);
        cells.cells[2].addChild(6, cells.cells[6]);
        cells.cells[4].addParent(2, cells.cells[2]);
        cells.cells[5].addParent(2, cells.cells[2]);
        cells.cells[6].addParent(2, cells.cells[2]);
        for (let i = 0; i < cells.length; i++){
          cells.cells[i].disableDelete();
          cells.cells[i].mode = M_IDLE;
        }
        break;
      case '#tutorialCopy':
      cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
      cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
      cells.cells[0].x = windowWidth * 2;
      cells.cells[1].x = windowWidth * 2;
      hideMenu = true;
      loaded = true;
      disableDrag = true;
      cells.addCell(T_SUBTRACT, windowWidth * 0.7);
      cells.cells[2].x -= cells.cells[2].width/2;
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[4].input.value(1);
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[5].input.value(2);
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[6].input.value(3);
      cells.cells[2].addChild(4, cells.cells[4]);
      cells.cells[2].addChild(5, cells.cells[5]);
      cells.cells[2].addChild(6, cells.cells[6]);
      cells.cells[4].addParent(2, cells.cells[2]);
      cells.cells[5].addParent(2, cells.cells[2]);
      cells.cells[6].addParent(2, cells.cells[2]);
      cells.addCell(T_INPUT, windowWidth * 0.2);
      cells.cells[7].updateHandleSH("Reference me!");
      cells.cells[7].x -= cells.cells[7].width * 0.5;
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[8].input.value("Copy me!");
      cells.cells[8].x -= cells.cells[8].width  * 0.5;
      cells.cells[8].y += cells.cells[7].height + cells.cells[7].handleH*2;
      cells.addCell(T_BLOCK, windowWidth * 0.2);
      cells.cells[9].updateHandleSH("Reference me!");
      cells.cells[9].x -= cells.cells[9].width  * 0.5;
      cells.cells[9].y += cells.cells[8].y + cells.cells[8].height + cells.cells[8].handleH*2;
      cells.addCell(T_CONST, windowWidth * 0.25);
      cells.cells[9].addChild(10, cells.cells[10]);
      cells.cells[10].addParent(9, cells.cells[9]);
      cells.cells[10].input.value("inside a block")
      for (let i = 0; i < cells.length; i++){
        cells.cells[i].disableDelete();
        cells.cells[i].mode = M_IDLE;
      }
      break;
    case '#tutorialData':
      cells.addCell(T_START, 10);
      cells.addCell(T_CONSOLE, 10);
      hideMenu = true;
      loaded = true;
      cells.addCell(T_CONST, windowWidth * 0.5);
      cells.cells[cells.length-1].input.value("I am useless")
      cells.addCell(T_INPUT, windowWidth * 0.5);
      cells.cells[cells.length-1].input.value("I am eternal")
      cells.mapAndLink();
      cells.addCell(T_PRINT, windowWidth * 0.5);
      cells.cells[0].addChild(cells.length-2, cells.cells[cells.length-2]);
      let blockIndex = cells.length;
      cells.addCell(T_BLOCK, windowWidth * 0.5);
      cells.addCell(T_GOTO, windowWidth * 0.5);
      cells.addCell(T_CONST, 0);
      cells.addCell(T_CONST, 0);
      cells.mapAndLink();
      cells.cells[5].updateHandleSH(cells.cells[3].handleSH);
      cells.cells[7].updateHandleSH(cells.cells[6].handleSH);
      cells.cells[blockIndex].addChild(blockIndex+2, cells.cells[blockIndex+2]);
      cells.cells[blockIndex+2].addParent(blockIndex, cells.cells[blockIndex]);
      cells.cells[blockIndex].addChild(blockIndex+3, cells.cells[blockIndex+3]);
      cells.cells[blockIndex+3].addParent(blockIndex, cells.cells[blockIndex]);
      cells.cells[blockIndex+2].input.value("I'm ok");
      cells.cells[blockIndex+3].input.value("me too");
      let printIndex = cells.length;
      cells.addCell(T_PRINT, windowWidth * 0.5);
      cells.cells[0].addChild(cells.length-2, cells.cells[cells.length-2]);
      cells.cells[cells.length-2].addChild(blockIndex + 1, cells.cells[cells.length-2]);
      cells.activeIndex = cells.length-1;
      cells.doDelete();
      cells.mapAndLink();
      cells.cells[printIndex].addChild(blockIndex + 1, cells.cells[blockIndex + 1]);
      cells.cells[blockIndex + 1].addParent(printIndex, cells.cells[printIndex]);
      for (let i = 0; i < cells.length; i++){
        cells.cells[i].disableDelete();
        cells.cells[i].mode = M_IDLE;
      }
      cells.tidy(0, 10);
      break;
    }
  }
  return loaded;
}

function checkAnOrUpdateTutorial() {
  jlog('Main', 'checkAnOrUpdateTutorial');
  if (tutorial == true){
    switch(tutorialstring) {
      case '#tutorialBlank':
        break;
      case '#tutorialHello':
        demoIndex = 0;
        break;
      case '#tutorialHandles':
        if (cells.length < 3){
          cells.cells[0].x = windowWidth * 2;
          cells.cells[1].x = windowWidth * 2;
          cells.addCell(T_CONST, windowWidth * 0.5);
          cells.cells[2].mode = M_IDLE;
          cells.cells[2].x -= cells.cells[0].width/2;
        }
        cells.cells[2].x = max(cells.cells[2].x, 0);
        cells.cells[2].x = min(cells.cells[2].x, windowWidth-20);
        cells.cells[2].y = max(cells.cells[2].y, 0);
        cells.cells[2].y = min(cells.cells[2].y, windowHeight - 5);
        cells.cells[2].viewX = max(cells.cells[2].viewX, 0);
        cells.cells[2].viewX = min(cells.cells[2].viewX, windowWidth-20);
        cells.cells[2].viewY = max(cells.cells[2].viewY, 0);
        cells.cells[2].viewY = min(cells.cells[2].viewY, windowHeight - 5);
        cells.cells[2].updateAllDivPositions();
        break;
      case '#tutorialMove':
        for (let j = 2; j<5; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialMutate':
        for (let j = 2; j<7; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialCopy':
        for (let j = 2; j<11; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialData':
        if (millis() < 10000){
          cells.cells[5].updateHandleSH(cells.cells[3].handleSH);
          cells.cells[7].updateHandleSH(cells.cells[6].handleSH);
        }
        for (let j = 2; j<cells.length; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      }
    }
}

function testAll() {
  jlog('Main', 'testAll');
  while (speedMode != 1) {
    toggleSpeedMode();
  }
  testTimer = TST_LOAD;
  currentTestIndex = -1;
  testPacer = millis();
}

function colorToHTMLRGB(color) {
  jlog('Main', 'colorToHTMLRGB');
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

function toggleInput(cID, type){
  jlog('Main', 'toggleInput');
  console.log('functionality removed to tools/refactor');
  // for (let i = 0; i < cells.length; i++){
  //   if (type == cells.cells[i].type && (cells.cells[i].handleSH == cID)){
  //     cells.cells[i].showHandleInput = !cells.cells[i].showHandleInput;
  //   }
  //
  //   if (cells.cells[i].type == T_BLOCK && (cells.cells[i].handleSH == cID)) {
  //     if (cells.cells[i].showHandleInput == true && cells.cells[i].hide == false){
  //       cells.cells[i].input.show();
  //       cells.cells[i].refresh();
  //     }
  //     if (cells.cells[i].showHandleInput == false) {
  //       cells.cells[i].input.hide();
  //       cells.cells[i].refresh();
  //     }
  //     break;
  //   } else if (cells.cells[i].type == T_INPUT && (cells.cells[i].handleSH == cID)) {
  //     if (cells.cells[i].showHandleInput == true) {
  //       cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[3]));
  //       cells.cells[i].input.value(cells.cells[i].handleSH);
  //     } else {
  //       cells.cells[i].updateHandleSH(cells.cells[i].input.value());
  //       cells.cells[i].input.value(cells.cells[i].dataSH);
  //       cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[2]));
  //     }
  //     break;
  //   }
  // }
}

function jlog(classname, label) {
  if (['length', 'tidy', 'startStop', 'stop', 'toggleStartForm', 'resizeConsole', 'updateView', 'moveC','updateAllDivPositions', 'updateDivPosition', 'reshape', 'refresh'].indexOf(label) != -1) {
    return;
  }
  if (doJLOGCountDown > 0) {
    doJLOG = true;
  } else {
    doJLOG = false;
  }
  if (doJLOG == true) {
    console.debug('frame: '+ frameCount, classname, label);
    logCounter += 1;
    doJLOGCountDown -= 1;
    if (logCounter == 100) {
      console.clear();
    }
  }
}

function whatsLeft(){
  jlog('Main', 'whatsLeft');
  for (let i = 0; i < 55; i++) {
    if (everyone.indexOf(i) == -1){
      console.log('FREE:', i);
    }
  }
}
function deviceTurned() {
  jlog('Main', 'deviceTurned');
  setupScreen();
}

function windowResized() {
  jlog('Main', 'windowResized');
  setupScreen();
  cells.updateView(xPos, yPos, doMouseDrag);
  redrawCounter = 2;
}

function inClickableZone() {
  let res = true;
  if (mouseX > noClickZone[0] && mouseX < noClickZone[1]){
    if (mouseY > noClickZone[2] && mouseY < noClickZone[3]){
      res = false;
    }
  }
  return res;
}

function mousePressed() {
  frameRate(100);
  jlog('Main', 'mousePressed');
  if (mobileDeviceDetected == true && mobileHAddon == true) {
    newCell(mobileHType, mouseX, mouseY); // call it again;
  } else {
    if (inClickableZone() === true) { // this was commented out but I forget why
      if (runMode == RM_NORMAL) {
        doMouseDrag = !(cells.checkSelected(mouseX, mouseY));
      } else if (runMode == RM_CREATE) {
        doMouseDrag = !(pres.checkSelected(mouseX, mouseY));
      }
    } else {
      doMouseDrag = false;
    }
    if (doMouseDrag == true){
      xStart = mouseX;
      yStart = mouseY;
    }
  }
}

// function keyTyped() {
//   if (key === ' ') {
//     setTidyFlag();
//   } else
//   if (key == 's') {
//     save();
//   }
// }

function preload() {
  jlog('Main', 'preload');
  c = loadStrings('assets/nintendo-entertainment-system.hex');
  demos.push(loadJSON('assets/helloworld.json'));
  demos.push(loadJSON('assets/demo1.json'));
  demos.push(loadJSON('assets/demo2.json'));
  demos.push(loadJSON('assets/demo3.json'));
  demos.push(loadJSON('assets/demo4.json'));
  demos.push(loadJSON('assets/demo5.json'));
  demos.push(loadJSON('assets/demo6.json'));
  demos.push(loadJSON('assets/demo7.json'));
  demos.push(loadJSON('assets/demo8.json'));
  demos.push(loadJSON('assets/demo9.json'));
  demos.push(loadJSON('assets/demo10.json'));
  demos.push(loadJSON('assets/demo11.json'));
  demos.push(loadJSON('assets/demo12.json'));
  demos.push(loadJSON('assets/demo13.json'));
  demos.push(loadJSON('assets/demo14.json'));
  demos.push(loadJSON('assets/demo15.json'));

  demos.push(loadJSON('assets/wip-demo.json'));
}

function setup() {
  jlog('Main', 'setup');
  if (getURL().indexOf("##")  != -1) { // hijack earlier
    showGUI = false;
    presentationMode = true;
    // autoStart = true;
    runMode = RM_PRESENT;
  }
  pixelDensity(1);
  mainDiv = document.getElementById('main');
  myDivs['devDiv']= createDiv();
  colorSetup();
  setupScreen();
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  pres = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  mobileSettings()
  controller = new Controller();
  myDivs['menu']= createDiv();
  createMenuDiv();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
  showDev = ! showDev; //lazy
  showDevDiv();
  doLastBit();
  if (autoStart == true) {
    cells.run = true;
    fastMode = 1;
  }
  pres.addCellsForPres(cells.cells);
  pres.createMode = true;
}

function draw() {
  notIdle = (focused || cells.redrawFlag || cells.run || controller.tidyFlag || testTimer != TST_OFF || tidyFlag > 0 || frameCount < 100);
  if (notIdle == true){
    fpsSetValue = 30;
  } else {
    fpsSetValue = 5;
  }
  if (redrawCounter != 0) {
    clear();
  }
  if (runMode == RM_NORMAL) {
    if (showFPS == true){
      controller.d_print(frameRate().toFixed(2), true, '<br>FPS: ');
    }
    if ((tutorial == false) && (scrollX != 0 || scrollY != 0)) {
      window.scrollTo(0, 0);
      cells.updateView(xPos, yPos, false);
      cells.rebuildMenuFlag = true;
    }
    if (notIdle == true) {
      mouseDrag();
      cells.updateView(xPos, yPos, doMouseDrag);
    }
    if (redrawCounter != 0) {
      drawGrid();
      cells.draw();
      redrawCounter -= 1;
    }
    if (cells.redrawFlag == true || cells.run == true){
      redrawCounter = 2;
    }
    if (notIdle == true) {
      cells.update(mouseX, mouseY, mouseIsPressed);
    }
    if (redrawCounter != 0) {
      controller.update(cells, flash, fastMode);
    }
    if (controller.tidyFlag == true) {
      setTidyFlag();
      controller.tidyFlag = false;
    }
    if (cells.run == true && slowMode == true) {
      frameRate(5);
    } else {
      if (redrawCounter != 0) {
        frameRate(100);
      } else {
        frameRate(fpsSetValue);
      }
    }

    if (tidyFlag > 0) {
      tidy();
      cells.updateView(xPos, yPos, true);
      tidyFlag -= 1;
    }
    if (cells.rebuildMenuFlag == true){
      myDivs['menu'].remove();
      myDivs['menu']= createDiv();
      createMenuDiv();
      cells.rebuildMenuFlag = false;
    }

    if (testTimer != TST_OFF) {
      let readyToStep = (millis() - testPacer > testPaceSettings[testTimer]);
      if (cells.run == false && readyToStep == true) {
        switch(testTimer) {
          case TST_LOAD:
            currentTestIndex += 1;
            if (currentTestIndex == demos.length-1){
              if (testLoop == true) {
                currentTestIndex = 0;
              } else {
                testTimer = TST_OFF;
              }
            } else {
              testPacer = millis();
              loadCells(demos[currentTestIndex]);
              setTidyFlag();
              testTimer = TST_TIDY;
            }
            break;
          case TST_TIDY:
            testPacer = millis();
            testTimer = TST_RUN;
            break;
          case TST_RUN:
            testPacer = millis();
            cells.run = true;
            testTimer = TST_PAUSE;
            break;
          case TST_PAUSE:
            testPacer = millis();
            testTimer = TST_LOAD;
            break;
        }
      }
    }
    checkAnOrUpdateTutorial();
  } else if (runMode == RM_CREATE){
    if (redrawCounter != 0) {
      redrawCounter -= 1;
      drawGrid();
      pres.draw();
    }
    if (notIdle == true) {
      mouseDrag();
      pres.update(mouseX, mouseY, mouseIsPressed);
      pres.updateView(xPos, yPos, doMouseDrag);
    }
    if (tidyFlag > 0) {
      tidy();
      noClickZone = [10, myDivs['presTools'].size().width + 10, 10, pixelDensity * myDivs['presTools'].size().height + 10];
      pres.updateView(xPos, yPos, true);
      tidyFlag -= 1;
    }
    if (pres.redrawFlag == true){
      redrawCounter = 2;
    }
  } else if (runMode == RM_PRESENT){
    controller.update(cells, flash, fastMode);
  }
}
