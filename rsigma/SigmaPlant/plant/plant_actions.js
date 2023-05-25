
function openDialog(plantData, xa, ya) {
    // Create a dialog box for text input
    const dialog = createInput(plantData.data);

    // Apply CSS styles based on the current theme
    dialog.style('border', `10px solid ${getColor('secondary')}`);
    dialog.style('outline', getColor('outline'));
    dialog.style('color', getColor('text'));
    dialog.style('background-color', getColor('primary'));

    // Set the position of the dialog box
    dialog.position(xa - 2, ya - 4);

    // Set a callback function to update the data field when the user presses Enter
    dialog.changed(() => {
        plantData.data = dialog.value();
        plantData.mode = 'cleared';
        dialog.remove(); // Remove the dialog box from the DOM
        console.log('hey');
    });

    // Prevent event propagation within the dialog
    dialog.mouseClicked((event) => {
        event.stopPropagation();
    });

    // Add an event listener to remove the dialog if mouse is pressed outside the dialog box
    const removeDialog = () => {
        if (plantData.mode === 'busy') {
            plantData.data = dialog.value(); // not sure if this is the right UX
            plantData.mode = 'cleared';
            dialog.remove(); // Remove the dialog box from the DOM
            document.removeEventListener('mousedown', removeDialog);
        }
    };

    // Add an event listener to dismiss the dialog if mouse is pressed outside the dialog box
    document.addEventListener('mousedown', removeDialog);

    // Add an event listener to prevent dismissing the dialog if clicking inside the dialog box
    dialog.elt.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });
}

function NOP(plantData) {
    plantData.mode = 'cleared';
}