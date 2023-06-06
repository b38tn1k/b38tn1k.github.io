const excludedKeys = new Set([
    'action',
    'rFilters',
    'adoptable',
    'animationValue',
    'caller',
    'doAnimations',
    'isAnimating',
    'mode',
    'notYetDrawLabelAndButtons',
    'manualOnScreen',
    'hasMouseOver'
]);
const toDoKeys = new Set([
    'input',
    'output',
    'buses',
    'children',
    'anchors',
    'associatedConnector'
]);
const selfDescriberKeys = new Set(['plant', 'g']);
const selfDescriberGroups = new Set(['buttons', 'dataLabels']);

class ReportFilter {
    constructor(criteria, action) {
        this.criteria = criteria;
        this.action = action;
    }
}

function isVector(key, obj) {
    return obj[key] instanceof p5.Vector;
}

function isVectorAction(info, key, obj) {
    info[key] = {
        x: obj[key].x,
        y: obj[key].y,
        z: obj[key].z
    };
}

function isToDo(key, obj) {
    return toDoKeys.has(String(key));
}

function isExcluded(key, obj) {
    return excludedKeys.has(String(key));
}
function noAction() {}

function isSelfDescriber(key, obj) {
    return selfDescriberKeys.has(String(key));
}

function isSelfDescriberAction(info, key, obj) {
    info[key] = obj[key].selfDescribe();
}

function isSelfDescriberGroup(key, obj) {
    return selfDescriberGroups.has(String(key));
}

function isSelfDescriberGroupAction(info, key, obj) {
    info[key] = [];
    if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
            info[key].push(obj[key][i].selfDescribe());
        }
    } else {
        Object.keys(obj[key]).forEach((k) => {
            info[key].push(obj[key][k].selfDescribe());
        });
    }
}

function catchAll(key, obj) {
    return !(isExcluded(key, obj) || isToDo(key, obj));
}

function catchAllAction(info, key, obj) {
    info[key] = obj[key];
}

class Introspector {
    constructor() {
        this.rFilters = [];
        this.rFilters.push(new ReportFilter(isExcluded, noAction));
        this.rFilters.push(new ReportFilter(isToDo, noAction));
        this.rFilters.push(new ReportFilter(isVector, isVectorAction));
        this.rFilters.push(
            new ReportFilter(isSelfDescriber, isSelfDescriberAction)
        );
        this.rFilters.push(
            new ReportFilter(isSelfDescriberGroup, isSelfDescriberGroupAction)
        );
        this.rFilters.push(new ReportFilter(catchAll, catchAllAction));
    }

    selfDescribe() {
        let info = {
            constructor: this.constructor.name
        };

        Object.keys(this).forEach((key) => {
            for (let rf of this.rFilters) {
                if (rf.criteria(String(key), this)) {
                    rf.action(info, key, this);
                    break;
                }
            }
        });
        return info;
    }
}
