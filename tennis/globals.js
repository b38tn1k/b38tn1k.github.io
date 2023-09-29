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
    let myStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 8);
}

globalPlayers =
    '{"league":{"weeks":6,"courts":"Monday: Court 3, Court 4","times":"Monday: 6:30, 8:30"},"players":[{"firstName":"Dan","lastName":"S","fullName":"Dan S","contact":"","availability":[false,true,false,true,false,true,false,false,false,true,false,true],"unsecureID":"67xerlr8"},{"firstName":"Dan","lastName":"M","fullName":"Dan M","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"6aa6p33v"},{"firstName":"Zultan","lastName":"P","fullName":"Zultan P","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"i0c74mpp"},{"firstName":"Casey","lastName":"R","fullName":"Casey R","contact":"","availability":[false,true,false,true,false,true,false,true,false,true,false,true],"unsecureID":"9mafjdn3"},{"firstName":"Steve","lastName":"C","fullName":"Steve C","contact":"","availability":[true,false,true,false,true,false,true,false,true,false,false,false],"unsecureID":"il4gs0qu"},{"firstName":"Antony","lastName":"A","fullName":"Antony A","contact":"","availability":[false,false,true,true,true,true,true,true,true,true,true,true],"unsecureID":"iar6vill"},{"firstName":"Phil","lastName":"N","fullName":"Phil N","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"d727yblr"},{"firstName":"Kieran","lastName":"O","fullName":"Kieran O","contact":"","availability":[true,false,true,false,true,false,true,false,true,false,true,false],"unsecureID":"tn59layc"},{"firstName":"David","lastName":"D","fullName":"David D","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"rxkih3sa"},{"firstName":"Kevin","lastName":"R","fullName":"Kevin R","contact":"","availability":[true,false,true,false,true,false,true,false,false,false,false,false],"unsecureID":"mlqk4d8c"},{"firstName":"Larry","lastName":"E","fullName":"Larry E","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"dr3phfwr"}]}';

l1 =
    '{"league":{"weeks":6,"courts":"GameNight: C1, C2, C3, C4","times":"GameNight: 5:00, 6:30"},"players":[{"firstName":"Sara","lastName":"C","fullName":"Sara C","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"zosyqydn"},{"firstName":"Regina","lastName":"D","fullName":"Regina D","contact":"","availability":[false,true,false,true,false,true,false,true,false,true,false,true],"unsecureID":"3x5chdv8"},{"firstName":"Suzanne","lastName":"G","fullName":"Suzanne G","contact":"","availability":[false,true,false,true,false,true,false,true,false,true,false,true],"unsecureID":"qrm6h4at"},{"firstName":"Karen","lastName":"J","fullName":"Karen J","contact":"","availability":[false,true,false,true,false,true,false,true,false,true,false,true],"unsecureID":"rmt14ewk"},{"firstName":"Liz","lastName":"N","fullName":"Liz N","contact":"","availability":[true,true,true,true,true,true,true,true,false,false,false,false],"unsecureID":"uxr3gao8"},{"firstName":"Jackie","lastName":"P","fullName":"Jackie P","contact":"","availability":[false,true,false,true,false,true,false,true,false,true,false,true],"unsecureID":"o0io4e3z"},{"firstName":"Beth","lastName":"P","fullName":"Beth P","contact":"","availability":[false,false,false,false,true,true,true,true,true,true,true,true],"unsecureID":"wg28kn2q"},{"firstName":"Loren","lastName":"R","fullName":"Loren R","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"ofw575mo"},{"firstName":"Maureen","lastName":"S","fullName":"Maureen S","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"w91spf73"},{"firstName":"Susan","lastName":"T","fullName":"Susan T","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"jprnyxce"},{"firstName":"Ellen","lastName":"T","fullName":"Ellen T","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"a3lvjbs5"},{"firstName":"Sandy","lastName":"A","fullName":"Sandy A","contact":"","availability":[true,true,true,true,true,true,true,true,false,false,true,true],"unsecureID":"9xbzghvm"}]}';

l2 =
    '{"league":{"weeks":6,"courts":"GameNight: C1, C2, C3, C4","times":"GameNight: 5:00, 6:30"},"players":[{"firstName":"Krista","lastName":"A","fullName":"Krista A","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"mplwbkx7"},{"firstName":"Sandy","lastName":"B","fullName":"Sandy B","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"dup9ndh0"},{"firstName":"Lisa","lastName":"B","fullName":"Lisa B","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"l7a1ngjb"},{"firstName":"Regan","lastName":"C","fullName":"Regan C","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"nmps7164"},{"firstName":"Jessica","lastName":"D","fullName":"Jessica D","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"fuiq0ihp"},{"firstName":"Marylynn","lastName":"E","fullName":"Marylynn E","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"oc656s6d"},{"firstName":"Zelle","lastName":"H","fullName":"Zelle H","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"3ik9v1v2"},{"firstName":"Stacy","lastName":"H","fullName":"Stacy H","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"mi1i5uxa"},{"firstName":"Nazlie","lastName":"L","fullName":"Nazlie L","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"m3sdwml0"},{"firstName":"Erin","lastName":"M","fullName":"Erin M","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"uewvzxgw"},{"firstName":"Veronica","lastName":"M","fullName":"Veronica M","contact":"","availability":[true,true,true,true,true,true,true,true,true,true,true,true],"unsecureID":"49z5tha6"}]}';

globalPlayers = l1;
