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
// Define key mapping for compression and uncompression
const keyMap = {
    bOffset : '<bfs>',
    bSqrDim: '<bsd>',
    Connector: '<con>',
    connected: '<ctd>',
    connector: '<ctr>',
    FeatureDataIDLabel: '<IDL>',
    FeatureDataTextLabel: '<Tl>',
    FeatureUIButtonClose: '<Cb>',
    FeatureUIButtonLetterLabel: '<Lb>',
    FeatureUIButtonMove: '<Mb>',
    FeatureUIButtonResize: '<Rb>',
    FeatureUIInputButton: '<Ib>',
    FeatureUIOutputButton: '<Ob>',
    Geometry: '<geo>',
    Input: '<ipt>',
    INPUT: '<IPT>',
    METRIC: '<MTR>',
    Metric: '<Mtr>',
    metric: '<mtr>',
    Output: '<opt>',
    OUTPUT: '<OPT>',
    PROCESS: '<PRO>',
    ParentDefined: '<pdf>',
    ParentLink: '<Pl>',
    PARENTLINK: '<PL>',
    parentLink: '<pl>',
    Plant: '<P>',
    plant: '<p>',
    Labels: '<lbl>',
    Process: '<Pro>',
    process: '<pro>',
    title: '<ttl>',
    metric: '<metric>',
    Resize: '<rsz>',
    RESIZE: '<RSZ>',
    SOURCE: '<SRC>',
    source: '<src>',
    Source: '<Src>',
    XDELETE: '<XDL>',
    Xdelete: '<Xdl>',
    aDims: '<aD>',
    bCart: '<bC>',
    bDims: '<bD>',
    buttons: '<b>',
    changed: '<chg>',
    constructor: '<c>',
    dataLabels: '<dL>',
    features: '<f>',
    mouseOverData: '<mod>',
};
