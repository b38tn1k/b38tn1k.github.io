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
    'parent',
    'widgets',
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

/**
* @description Verify if a variable is not empty. If the variable is an array or an 
* object, checks if it has keys.
* 
* @param variable - The `variable` input parameter is passed to the function and is 
* checked for emptiness.
* 
* @returns { boolean } - The output returned by this function is `true`.
*/
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
/**
* @description The `constructor` function takes `criteria`, `capture`, and an optional 
* `firstPass` argument, and initializes the following properties:
* 
* 	- `criteria`: the given criteria object
* 	- `capture`: the given capture function
* 	- `firstPass`: a function that will be called on the first pass of the loop, or 
* an empty function if `firstPass` is `null` or not provided.
* 
* @param { object } criteria - The `criteria` input parameter specifies the conditions 
* used to determine whether a capture should be performed.
* 
* @param { any } capture - CAPTURE PARAMETER SAVES THE RESULTS OF THE FUNCTION CALL 
* IN THE OBJECT.
* 
* @param [firstPass=null] - The `firstPass` input parameter is an optional argument 
* that is set to a function by default.
*/
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

/**
* @description The function `isVector(key, obj)` checks if the value of the specified 
* `key` in the `obj` object is an instance of `p5.Vector`.
* 
* @param key - The `key` input parameter in the `isVector` function serves as the 
* name of the property to check if it is a `p5.Vector` instance.
* 
* @param { object } obj - The `obj` input parameter in the `isVector` function is 
* used to check if the specified property `key` exists in the object `obj` and if 
* its value is an instance of `p5.Vector`.
* 
* @returns { object } - The output returned by this function is a boolean value 
* indicating whether the object's property `key` is an instance of `p5.Vector`.
*/
function isVector(key, obj) {
    return obj[key] instanceof p5.Vector;
}

/**
* @description The function isVectorCapture(info, key, obj) sets the value of the 
* specified key in the info object to an array containing the x, y, and z coordinates 
* of the obj object.
* 
* @param { object } info - The `info` input parameter in the `isVectorCapture` 
* function is assigned a new value each time the function is called, and that value 
* is a reference to an object that contains the x, y, and z coordinates of a vector.
* 
* @param { string } key - The `key` input parameter in the `isVectorCapture` function 
* serves as a reference to the specific property of the `obj` object that should be 
* captured and stored in the `info` object.
* 
* @param { object } obj - The `obj` input parameter in the `isVectorCapture` function 
* is used to access the vector value of the specified key in the object `obj`.
*/
function isVectorCapture(info, key, obj) {
    info[key] = [obj[key].x, obj[key].y, obj[key].z];
}

/**
* @description The function `isVectorConstruct` sets the `x`, `y`, and `z` properties 
* of an object `obj` based on the values of an array `info` at the specified `key`.
* 
* @param { array } info - The `info` input parameter provides the vector components 
* for the `key` parameter, and its values are assigned to the corresponding properties 
* of the `obj` parameter.
* 
* @param { string } key - The `key` input parameter specifies the property name of 
* the object that should be updated with the corresponding element from the `info` 
* array.
* 
* @param { object } obj - The `obj` input parameter in the `isVectorConstruct` 
* function is used to store the resulting vector object.
*/
function isVectorConstruct(info, key, obj) {
    obj[key].x = info[key][0];
    obj[key].y = info[key][1];
    obj[key].z = info[key][2];
}

/**
* @description The function `isRequiresID` checks if a given key is a required ID 
* key by checking if the `reqIdKeys` set has the string representation of the key.
* 
* @param { string } key - The `key` input parameter is used to check if the given 
* object requires an ID.
* 
* @param { object } obj - The `obj` input parameter is passed to the `has()` method 
* of the `reqIdKeys` object.
* 
* @returns { boolean } - The output returned by this function is a boolean value 
* indicating whether the provided key is a required ID key. The function takes two 
* arguments, key and obj, and returns a boolean value based on the presence of the 
* key in the reqIdKeys set.
*/
function isRequiresID(key, obj) {
    return reqIdKeys.has(String(key));
}

/**
* @description The function isRequiresIDCapture takes an object with keys 'input', 
* 'output', 'associatedConnector', 'children', and 'anchors' and an info object as 
* input. It sets the values of the info object based on the keys and values of the 
* input object, with the goal of capturing the 'id' property of each item.
* 
* @param { object } info - The `info` input parameter is used to store the result 
* of the function's execution.
* 
* @param { string } key - The `key` input parameter in the `isRequiresIDCapture` 
* function is used to determine which property of the `obj` object to check for the 
* presence of an `id` attribute.
* 
* @param { object } obj - The `obj` input parameter is passed as a reference to an 
* object, and it is used to retrieve information from that object.
*/
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

/**
* @description The function isRequiresIDConstruct takes info, key, and obj as input 
* and pushes the key onto an array of keys requiring an ID link within the obj object.
* 
* @param { object } info - The `info` input parameter in the `isRequiresIDConstruct` 
* function is used to provide additional information about the key and object being 
* analyzed.
* 
* @param { string } key - The `key` input parameter is used to identify the specific 
* key that requires an ID link.
* 
* @param { object } obj - The `obj` input parameter in the `isRequiresIDConstruct` 
* function serves as a reference to an object that contains keys requiring ID links.
*/
function isRequiresIDConstruct(info, key, obj) {
    obj.keysRequiringIDLink.push(key);
}

/**
* @description The function `isExcluded` takes two arguments `key` and `obj`, and 
* returns a boolean value indicating whether the given `key` is excluded from the 
* object `obj`.
* 
* @param { string } key - The `key` input parameter is used to determine if the 
* specified key is excluded from the object.
* 
* @param { object } obj - The `obj` input parameter is passed as a second argument 
* to the `has()` method in the `excludedKeys` and `reqIdKeys` sets.
* 
* @returns { boolean } - The output returned by this function is a boolean value, 
* indicating whether the given key is excluded or not.
*/
function isExcluded(key, obj) {
    return excludedKeys.has(String(key));//|| reqIdKeys.has(String(key));
}
/**
* @description The function noAction() does nothing.
*/
function noAction() {}

/**
* @description The function `isSelfDescriber` takes `key` and `obj` as parameters 
* and returns a boolean value indicating whether `obj` has a property with the given 
* `key` that is a `selfDescriber`.
* 
* @param { string } key - The `key` input parameter is used to determine if the given 
* object has a self-describing property with the specified key.
* 
* @param { object } obj - The `obj` input parameter is passed to the `has()` method 
* of the `selfDescriberKeys` object.
* 
* @returns { boolean } - The output returned by this function is a boolean value 
* indicating whether the provided key is a self-describing key or not.
*/
function isSelfDescriber(key, obj) {
    return selfDescriberKeys.has(String(key));
}

/**
* @description The function isSelfDescriberCapture takes information, a key, and an 
* object as input and sets the value of the information at the specified key to the 
* object's self-description.
* 
* @param { object } info - The `info` input parameter in the `isSelfDescriberCapture` 
* function serves as a target for setting the value of the specified key.
* 
* @param key - The `key` input parameter in the `isSelfDescriberCapture` function 
* serves as a reference to a property of the `obj` parameter.
* 
* @param { object } obj - The `obj` input parameter in the `isSelfDescriberCapture` 
* function serves as the object being evaluated for self-description capabilities.
*/
function isSelfDescriberCapture(info, key, obj) {
    info[key] = obj[key].selfDescribe();
}

/**
* @description The function isSelfDescriberConstruct takes in three parameters: info, 
* key, and obj.
* 
* @param { object } info - The `info` input parameter provides the definition for 
* the object being constructed.
* 
* @param { string } key - The `key` input parameter in the `isSelfDescriberConstruct` 
* function is used to determine which property of the `obj` object should be set to 
* the value of the `info` object's corresponding property.
* 
* @param { object } obj - The `obj` input parameter is used to store the object being 
* modified by the function.
*/
function isSelfDescriberConstruct(info, key, obj) {
    // console.log('isSelfDescriberConstruct', key);
    if (key != 'plant') {
        obj[key].def = info[key];
        obj[key].selfConstruct();
    }
}

/**
* @description The function `isSelfDescriberGroup` takes a `key` and an `obj` as 
* inputs and returns a `Boolean` value indicating whether the `obj` is a member of 
* the `selfDescriberGroups` set.
* 
* @param { string } key - The `key` input parameter is used to determine if the given 
* object is a member of a self-describing group.
* 
* @param { object } obj - The `obj` input parameter is passed as a second argument 
* to the `has()` method of the `selfDescriberGroups` object.
* 
* @returns { boolean } - The output returned by this function is a boolean value, 
* indicating whether the given key is a member of the self-describer group or not.
*/
function isSelfDescriberGroup(key, obj) {
    return selfDescriberGroups.has(String(key));
}

/**
* @description The function takes an object `info`, a key `key`, and an object `obj`, 
* and adds the self-descriptions of the values in `obj` for the given key to `info`.
* 
* @param { object } info - The `info` input parameter is an object that is being 
* populated with the results of the `selfDescribe()` method calls for each item in 
* the array or object `obj[key]`.
* 
* @param { string } key - The `key` input parameter in the `isSelfDescriberGroupCapture` 
* function is used to specify the property or properties of the `obj` object to be 
* iterated over and captured.
* 
* @param { object } obj - The `obj` input parameter in the `isSelfDescriberGroupCapture` 
* function is the object being analyzed for self-descriptiveness.
*/
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

/**
* @description The function isSelfDescriberGroupConstruct sets the value of obj[key]'s 
* def property to info[key][i] and calls obj[key][i].selfConstruct().
* 
* @param { object } info - The `info` input parameter provides the definition values 
* for the objects being constructed.
* 
* @param { string } key - The `key` input parameter specifies the property or 
* properties of the object that should be assigned the values from the `info` object.
* 
* @param { object } obj - The `obj` input parameter is the object that is being 
* processed by the function.
*/
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

/**
* @description The function `catchAll` takes two parameters `key` and `obj`, and 
* returns `true` if the specified key is not excluded from the object.
* 
* @param { string } key - The `key` input parameter is passed to the `isExcluded` 
* function to determine if the current key should be included or excluded from the 
* object.
* 
* @param { object } obj - The `obj` input parameter in the `catchAll` function serves 
* as a context object for the key being checked.
* 
* @returns { boolean } - The output returned by this function is "true" for all input 
* keys and objects.
*/
function catchAll(key, obj) {
    // return !isExcluded(key, obj);
    return true;
}

/**
* @description The function catchAllConstruct assigns the value of the given key in 
* the 'info' object to the corresponding key in the 'obj' object.
* 
* @param { object } info - The `info` input parameter in the `catchAllConstruct` 
* function serves as a source for the values that will be assigned to the corresponding 
* properties in the `obj` object.
* 
* @param { string } key - The `key` input parameter in the `catchAllConstruct` 
* function serves as a reference to the property name in the `info` object that 
* should be copied to the `obj` object.
* 
* @param { object } obj - The `obj` input parameter in the `catchAllConstruct` 
* function serves as a destination object to which the values of the `info` object's 
* properties are assigned.
*/
function catchAllConstruct(info, key, obj) {
    obj[key] = info[key];
}

/**
* @description The function catchAllCapture(info, key, obj) captures the value of 
* the specified key in obj and stores it in the corresponding key of info, if the 
* key exists and the value is not null or empty.
* 
* @param { object } info - The `info` input parameter in the `catchAllCapture` 
* function serves as a target object to store the values of the properties found in 
* the `obj` parameter.
* 
* @param { string } key - The `key` input parameter in the `catchAllCapture` function 
* serves as a reference to the specific property of the `obj` object that should be 
* captured and assigned to the corresponding property in the `info` object, if the 
* property is not null or empty.
* 
* @param { object } obj - OBJECT PROVIDES VALUES FOR KEY.
*/
function catchAllCapture(info, key, obj) {
    if (obj[key] != null && isNotEmpty(obj[key])) {
        info[key] = obj[key];
    }
}

class Introspector {
/**
* @description The `constructor` function initializes an object with various properties 
* and filters for working with different types of data.
* 
* @param { boolean } [placeholder=false] - The `placeholder` input parameter sets 
* the `placeholder` property of the object.
*/
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

/**
* @description This function constructs the component by iterating over its definition 
* (this.def) and applying filters (rf.criteria) to each key. If a filter passes, it 
* calls the firstPass method with the definition, key, and component.
*/
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
        if (this.widgets) {
            for (let widget of this.widgets) {
                widget.setup();
            }
        }
    }

/**
* @description The function `selfDescribe()` generates a detailed description of an 
* object, including its constructor name and all properties and their values.
* 
* @returns { object } - The output returned by the `selfDescribe()` function is an 
* object that contains information about the instance of the class that called the 
* function. The object includes the constructor name and any properties and methods 
* defined in the class, as well as any filters that match the properties and methods.
*/
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

