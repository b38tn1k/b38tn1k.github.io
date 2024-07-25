// Initialize Dragula
document.addEventListener("DOMContentLoaded", function() {
    dragula([
        document.getElementById('todo'),
        document.getElementById('inprogress'),
        document.getElementById('done')
    ]);
});

// Function to add a card to a specific column
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
function removeCard(button) {
    const card = button.parentElement;
    card.remove();
}