function openDialog(featureData, xa, ya) {
    // turn off shortcut keys
    keyboardRequiresFocus = true;
    // Create a dialog box for text input
    const dialog = createInput(featureData.data['data']);
    // Create a container div for the dialog box
    const container = createDiv();
    container.position(xa - 2, ya - 6);
    container.style('display', 'flex');
    container.style('justify-content', 'center');
    container.style('align-items', 'center');
    container.style('border', '1px solid ' + getColor('outline'));

    // Add the dialog to the container
    container.child(dialog);

    // Apply CSS styles to the dialog
    dialog.style('padding', '10px');
    dialog.style('border', '10px solid ' + getColor('secondary'));
    dialog.style('outline', getColor('outline'));
    dialog.style('color', getColor('text'));
    dialog.style('background-color', getColor('primary'));


    const doTheThing = () => {
        featureData.data['data'] = dialog.value();
        featureData.mode = 'cleared';
        featureData.changed = true;
        fpsEvent();
        featureData.g.setBDimsWidth(
            myTextSize,
            TEXT_WIDTH_MULTIPLIER,
            dialog.value()
        );
        setTimeout(() => {
            dialog.remove();
            container.remove(); // Remove the dialog box and the container div from the DOM
        }, 50);
    };

    // Set a callback function to update the data field when the user presses Enter
    dialog.changed(() => {
        doTheThing();
    });

    // Add an event listener to prevent dismissing the dialog if clicking inside the dialog box
    dialog.elt.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });

    // Add an event listener to prevent dismissing the dialog if clicking inside the container
    container.elt.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });

    // Add an event listener to remove the dialog and the container if mouse is pressed outside the dialog box or the container
    const removeDialog = () => {
        // if (featureData.mode === 'busy') {
        doTheThing();
        document.removeEventListener('mousedown', removeDialog);
        // turn on shortcut keys
        keyboardRequiresFocus = false;
        // }
    };

    // Add an event listener to dismiss the dialog if mouse is pressed outside the dialog box or the container
    document.addEventListener('mousedown', removeDialog);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            doTheThing();
        }
    });
}

function NOP(featureData) {
    featureData.mode = 'cleared';
}
