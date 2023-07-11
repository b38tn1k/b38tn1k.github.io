const excludedKeys = new Set([
    'action',
    'capture',
    'rFilters',
    'adoptable',
    'animationValue',
    'caller',
    'doAnimations',
    'isAnimating',
    'mode',
    'notYetDrawnLabelAndButtons',
    'manualOnScreen',
    'doCheckMouseOver',
    'source',
    'hasMouseOver',
    'sCart',
    'sDims',
    'sMids',
    'sSqrDim',
    'sSqrDimOn2',
    'untethered',
    'untetheredClicks',
    'connectorIsOnScreen',
    'static',
    'keysRequiringIDLink',
    'path',
    'def',
    'command',
    'bCartOld',
    'parent'
]);
const reqIdKeys = new Set([
    'input',
    'output',
    // 'buses',
    'children',
    'anchors',
    'associatedConnector'
]);
const selfDescriberKeys = new Set(['plant', 'g']);
const selfDescriberGroups = new Set(['buttons', 'dataLabels']);

function isNotEmpty(variable) {
    if (variable) {
        if (Array.isArray(variable) || typeof variable === 'object') {
            return Object.keys(variable).length !== 0;
        }
        return true;
    }
    return true;
}

class PropertyFilter {
    constructor(criteria, capture, firstPass=null) {
        this.criteria = criteria;
        this.capture = capture;
        if (firstPass) {
            this.firstPass = firstPass;
        } else {
            this.firstPass = () => {};
        }
    }
}

function isVector(key, obj) {
    return obj[key] instanceof p5.Vector;
}

function isVectorCapture(info, key, obj) {
    info[key] = [obj[key].x, obj[key].y, obj[key].z];
}

function isVectorConstruct(info, key, obj) {
    obj[key].x = info[key][0];
    obj[key].y = info[key][1];
    obj[key].z = info[key][2];
}

function isRequiresID(key, obj) {
    return reqIdKeys.has(String(key));
}

function isRequiresIDCapture(info, key, obj) {
    if (obj[key]) {
        switch (String(key)) {
            case 'input':
            case 'output':
            case 'associatedConnector':
                info[key] = obj[key].data['id'];
                break;
            case 'children':
                if (obj[key].length > 0) {
                    info[key] = [];
                    for (let i = 0; i < obj[key].length; i++) {
                        info[key].push(obj[key][i].data['id']);
                    }
                }
                break;
            case 'anchors':
                info[key] = {};
                info[key]['Input'] = obj[key]['Input'].data['id'];
                info[key]['Output'] = obj[key]['Output'].data['id'];
                break;
            default:
                break;
        }
    }
}

function isRequiresIDConstruct(info, key, obj) {
    obj.keysRequiringIDLink.push(key);
}

function isExcluded(key, obj) {
    return excludedKeys.has(String(key));//|| reqIdKeys.has(String(key));
}
function noAction() {}

function isSelfDescriber(key, obj) {
    return selfDescriberKeys.has(String(key));
}

function isSelfDescriberCapture(info, key, obj) {
    info[key] = obj[key].selfDescribe();
}

function isSelfDescriberConstruct(info, key, obj) {
    // console.log('isSelfDescriberConstruct', key);
    if (key != 'plant') {
        obj[key].def = info[key];
        obj[key].selfConstruct();
    }
}

function isSelfDescriberGroup(key, obj) {
    return selfDescriberGroups.has(String(key));
}

function isSelfDescriberGroupCapture(info, key, obj) {
    if (Array.isArray(obj[key])) {
        info[key] = [];
        for (let i = 0; i < obj[key].length; i++) {
            info[key].push(obj[key][i].selfDescribe());
        }
    } else {
        info[key] = {};
        Object.keys(obj[key]).forEach((k) => {
            // info[key].push(obj[key][k].selfDescribe());
            info[key][k] = obj[key][k].selfDescribe();
        });
    }
}

function isSelfDescriberGroupConstruct(info, key, obj) {
    if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
            obj[key][i].def = info[key][i];
            obj[key][i].selfConstruct();
        }
    } else {
        Object.keys(obj[key]).forEach((k) => {
            obj[key][k].def = info[key][k];
            obj[key][k].selfConstruct();
        });
    }
}

function catchAll(key, obj) {
    // return !isExcluded(key, obj);
    return true;
}

function catchAllConstruct(info, key, obj) {
    obj[key] = info[key];
}

function catchAllCapture(info, key, obj) {
    if (obj[key] != null && isNotEmpty(obj[key])) {
        info[key] = obj[key];
    }
}

class Introspector {
    constructor(placeholder=false) {
        this.placeholder = placeholder;
        this.def = null; // for self construction
        this.keysRequiringIDLink = []
        this.rFilters = [];
        this.rFilters.push(new PropertyFilter(isExcluded, noAction));
        this.rFilters.push(new PropertyFilter(isVector, isVectorCapture, isVectorConstruct));
        this.rFilters.push(
            new PropertyFilter(isSelfDescriber, isSelfDescriberCapture, isSelfDescriberConstruct)
        );
        this.rFilters.push(
            new PropertyFilter(isSelfDescriberGroup, isSelfDescriberGroupCapture, isSelfDescriberGroupConstruct)
        );
        this.rFilters.push(
            new PropertyFilter(isRequiresID, isRequiresIDCapture, isRequiresIDConstruct)
        );
        this.rFilters.push(new PropertyFilter(catchAll, catchAllCapture, catchAllConstruct));
    }

    selfConstruct() {
        if (this.placeholder == false) {
            Object.keys(this.def).forEach((key) => {
                for (let rf of this.rFilters) { // if I reverse, I need to write more filters anyway
                    if (rf.criteria(String(key), this)) {
                        rf.firstPass(this.def, key, this);
                        break;
                    }
                }
            });
        }
    }

    selfDescribe() {
        // const stack = new Error().stack;
        // console.log(stack);
        let info = {
            constructor: this.constructor.name
        };
        Object.keys(this).forEach((key) => {
            for (let rf of this.rFilters) {
                if (rf.criteria(String(key), this)) {
                    rf.capture(info, key, this);
                    break;
                }
            }
        });
        const jsonString = JSON.stringify(info);
        return JSON.parse(jsonString);
    }
}
