// Initialize Dragula
document.addEventListener("DOMContentLoaded", function() {
    // Initializes drag and drop functionality for three DOM elements.

    dragula([
        document.getElementById('todo'),
        document.getElementById('inprogress'),
        document.getElementById('done')
    ]);
});

// Function to add a card to a specific column
/**
 * @description Creates a new card element with a title "New Task" and a remove button,
 * assigns it to a specified DOM element with the given ID, and appends it as a child
 * element.
 * 
 * @param {string} columnId - Used to identify a column element on the page.
 */
function addCard(columnId) {
    const column = document.getElementById(columnId);
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
        <p>New Task</p>
        <button onclick="removeCard(this)">Remove</button>
    `;
    column.appendChild(card);
}

// Function to remove a card
/**
 * @description Removes a HTML element that contains a specified button from its
 * parent element. It does so by first locating the parent element of the button and
 * then removing it from the DOM using the `remove()` method.
 * 
 * @param {HTMLButtonElement} button - Used to identify a card removal button.
 */
function removeCard(button) {
    const card = button.parentElement;
    card.remove();
}