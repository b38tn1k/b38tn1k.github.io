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
// JSON loader
let JSONloader;
// Define key mapping for compression and uncompression
const keyMap = {
    aDims: '<aD>',
    bCart: '<bC>',
    bDims: '<bD>',
    bOffset: '<bO>',
    bSqrDim: '<bS>',
    buttons: '<bt>',
    changed: '<cg>',
    connected: '<ct>',
    Connector: '<Cn>',
    connector: '<cn>',
    constructor: '<cr>',
    dataLabels: '<dl>',
    data: '<d>',
    Edit: '<e>',
    EDIT: '<E>',
    false: '<f>',
    FeatureDataIDLabel: '<FL>',
    FeatureDataTextLabel: '<TL>',
    features: '<ft>',
    FeatureUIButtonClose: '<Cb>',
    FeatureUIButtonLetterLabel: '<Lb>',
    FeatureUIButtonMove: '<Mb>',
    FeatureUIButtonResize: '<Rb>',
    FeatureUIInputButton: '<Ib>',
    FeatureUIOutputButton: '<Ob>',
    Geometry: '<ge>',
    INPUT: '<IN>',
    Input: '<in>',
    Labels: '<lb>',
    MERGE: '<MG>',
    Merge: '<Mg>',
    merge: '<mg>',
    METRIC: '<MC>',
    Metric: '<Mc>',
    metric: '<mc>',
    mouseOverData: '<md>',
    OUTPUT: '<OT>',
    Output: '<ot>',
    ParentDefined: '<pd>',
    PARENTLINK: '<PL>',
    ParentLink: '<Pl>',
    parentLink: '<pl>',
    PARENT: '<PN>',
    Parent: '<Pn>',
    parent: '<pn>',
    Plant: '<PT>',
    plant: '<pt>',
    PROCESS: '<PR>',
    Process: '<Pr>',
    process: '<pr>',
    RESIZE: '<RS>',
    Resize: '<rs>',
    SOURCE: '<SC>',
    Source: '<Sc>',
    source: '<sc>',
    SPLIT: '<SP>',
    Split: '<Sp>',
    split: '<sp>',
    sink: '<s>',
    SINK: '<S>',
    target: '<tg>',
    title: '<tl>',
    true: '<t>',
    type: '<tp>',
    XDELETE: '<XD>',
    Xdelete: '<Xd>',
    Zone: '<z>',
    ZONE: '<Z>'
};
