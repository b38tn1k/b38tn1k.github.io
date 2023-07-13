function styleTextInputInput(input) {
    input.style('resize', 'none');
    input.style('background', 'transparent');
    input.style('border', 'transparent');
    input.style('margin', '0px');
    input.style('padding', '0px');
    input.style('color', getColor('outline'));
    input.style('caret-color', getColor('accent'));
    input.style('outline', 'none');
    input.style('font-family', 'Arial');
    input.style('text-align', 'center');
}

function styleTextInputTag(input) {
    input.style('background', getColor('secondary'));
    input.style('text-align', 'left');
}

function styleTextAreaInput(input) {
    input.style('resize', 'none');
    input.style('background', 'transparent');
    input.style('border', 'transparent');
    input.style('color', getColor('outline'));
    input.style('margin', '0px');
    input.style('padding', '0px');
    input.style('caret-color', getColor('accent'));
    input.style('outline', 'none');
    input.style('font-family', 'Arial');
    input.style('text-align', 'center');
}

function styleDivInput(input) {
    input.style('resize', 'none');
    input.style('background', 'transparent');
    input.style('border', 'transparent');
    input.style('margin', '0px');
    input.style('padding', '0px');
    input.style('color', getColor('outline'));
    input.style('caret-color', getColor('accent'));
    input.style('outline', 'none');
    input.style('font-family', 'Arial');
    input.style('text-align', 'center');
    input.style('display', 'flex');
    input.style('justify-content', 'center');
    input.style('align-items', 'center');
}

function styleDivTag(myDiv) {
    myDiv.style('border', '1px solid ' + getColor('outline'));
    myDiv.style('margin', '5px');
    myDiv.style('padding', '5px');
    myDiv.style('display', 'inline-block');
    myDiv.style('cursor', 'pointer');
}

function styleDivSelector(selector) {
    selector.style('background', getColor('primary'));
    selector.style('border', '1px solid ' + getColor('outline'));
    selector.style('color', getColor('outline'));
    selector.style('caret-color', getColor('accent'));
    selector.style('outline', 'none');
    selector.style('font-family', 'Arial');
}
