const canvas = document.getElementById('ganttCanvas');
const ctx = canvas.getContext('2d');
const cellWidth = 30; // Width of each day cell
const cellHeight = 40; // Height of each task row
const tasks = [];
let selectedTask = null;

const today = new Date();
const startDate = new Date(today);
startDate.setDate(today.getDate() - 7);
const endDate = new Date(today);
endDate.setDate(today.getDate() + 28);

// Initialize the chart
document.addEventListener("DOMContentLoaded", drawChart);

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCalendar();
    drawTasks();
}

function drawCalendar() {
    let currentDate = new Date(startDate);

    for (let i = 0; i <= 35; i++) {
        const x = i * cellWidth;
        ctx.strokeRect(x, 0, cellWidth, cellHeight);
        ctx.fillText(currentDate.toDateString().substring(4, 10), x + 2, 20);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Draw today's line
    const todayX = (today - startDate) / (1000 * 60 * 60 * 24) * cellWidth;
    ctx.beginPath();
    ctx.moveTo(todayX, 0);
    ctx.lineTo(todayX, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.strokeStyle = 'black';
}

function drawTasks() {
    tasks.forEach((task, index) => {
        const x = (task.start - startDate) / (1000 * 60 * 60 * 24) * cellWidth;
        const width = (task.end - task.start) / (1000 * 60 * 60 * 24) * cellWidth;
        const y = (index + 1) * cellHeight;

        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, width, cellHeight - 5);
        ctx.strokeRect(x, y, width, cellHeight - 5);

        // Make the task clickable
        task.x = x;
        task.y = y;
        task.width = width;
        task.height = cellHeight - 5;

        ctx.fillStyle = 'white';
        ctx.fillText(`Task ${index + 1}`, x + 5, y + 25);
    });
}

// Add a new task
function addTask() {
    const newTask = {
        start: new Date(today),
        end: new Date(today),
    };
    newTask.end.setDate(newTask.end.getDate() + 7);
    tasks.push(newTask);
    drawChart();
}

// Handle clicking on tasks to edit
canvas.addEventListener('click', (e) => {
    const { offsetX, offsetY } = e;
    selectedTask = tasks.find(task => 
        offsetX >= task.x && offsetX <= task.x + task.width &&
        offsetY >= task.y && offsetY <= task.y + task.height
    );

    if (selectedTask) {
        document.getElementById('startDate').value = selectedTask.start.toISOString().split('T')[0];
        document.getElementById('endDate').value = selectedTask.end.toISOString().split('T')[0];
        document.getElementById('editModal').style.display = 'block';
    }
});

// Save task edits
function saveTask() {
    if (selectedTask) {
        selectedTask.start = new Date(document.getElementById('startDate').value);
        selectedTask.end = new Date(document.getElementById('endDate').value);
        document.getElementById('editModal').style.display = 'none';
        drawChart();
    }
}