function createHeading(parent, text) {
    // Create a heading element and add it to the parent container
    const heading = createElement("h2", text);
    heading.parent(parent);
}

// Helper Function for creating section
function createSection(parent, id) {
    const section = createDiv();
    section.id(id);
    section.addClass(ELEMENT_CLASSES.toolsDiv);
    section.parent(parent);
    return section;
}

// Helper Function for creating button
function createButtonIn(parent, label, action, buttonClass = null) {
    const button = createButton(label);
    button.parent(parent);
    button.mousePressed(action);
    if (buttonClass) {
        button.addClass(buttonClass);
    }
    return button;
}

// Helper Function for creating textarea
function createTextarea(parent, validationFunction, placeholder = null) {
    const textarea = createElement("textarea");
    textarea.parent(parent);
    textarea.input(validationFunction);
    textarea.addClass(ELEMENT_CLASSES.textareaInput);
    if (placeholder) {
        textarea.attribute("placeholder", placeholder);
    }
    return textarea;
}

// Helper Function for creating paragraph
function createParagraph(parent, displayStyle = "none") {
    const paragraph = createP();
    paragraph.parent(parent);
    paragraph.style("display", displayStyle);
    return paragraph;
}

function createTableCell(row, cellText) {
    const cell = createElement("td", cellText);
    cell.parent(row);
}

function createTable(parent) {
    const table = createElement("table");
    table.parent(parent);
    return table;
}

function createTableHeader(table, headerCells) {
    const headerRow = createElement("tr");
    headerRow.parent(table);
    headerCells.forEach((cellText) => {
        const cell = createElement("th", cellText);
        cell.parent(headerRow);
    });
}

function getTimeSchedule(str) {
    if (!str.includes(":")) {
        return false;
    }
    let daysTimes = str.split("\n"); // ["Monday: 6:30, 8:30", "Thursday: 6:30"]
    let schedule = daysTimes.map((dayTime) => {
        let colonIndex = dayTime.indexOf(":");
        let day = dayTime.substring(0, colonIndex).trim();
        let times = dayTime
            .substring(colonIndex + 1)
            .split(",")
            .map((time) => time.trim());
        return { day, times };
    });
    return schedule;
}

// Monday: Court 3, Court 4
// Thursday: Court 4
// Monday: 6:30, 8:30
// Thursday: 6:30

function getCourtSchedule(str) {
    if (!str.includes(":")) {
        return false;
    }
    let daysCourts = str.split("\n"); // ["Monday: Court 3, Court 4", "Thursday: Court 4"]
    let schedule = daysCourts.map((dayCourt) => {
        let colonIndex = dayCourt.indexOf(":");
        let day = dayCourt.substring(0, colonIndex).trim();
        let courts = dayCourt
            .substring(colonIndex + 1)
            .split(",")
            .map((court) => court.trim());
        return { day, courts };
    });
    return schedule;
}

// Helper function to group by property
function groupBy(array, prop) {
    return array.reduce((groups, item) => {
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
}

function drawTennisCourt(buffer, x, y, width, height) {
    const courtColor = color("#006400"); // Green color for the tennis court
    const serviceBoxColor = color("#0000FF"); // Blue color for the service boxes
    const lineColor = color("#FFFFFF"); // White color for the lines

    // Set the buffer as the rendering target
    buffer.push();
    // buffer.translate(x - width / 2, y - height / 2); // Translate to center of the court
    buffer.translate(x, y); // Translate to corner of the court

    // Draw the outer court
    buffer.stroke(lineColor);
    buffer.strokeWeight(1);
    buffer.fill(courtColor);
    buffer.rect(0, 0, width, height);
    buffer.line(width / 2, height * 0.3, width / 2, height * 0.7);
    buffer.line(0, height / 2, width, height / 2);
    buffer.line(width * 0.1, 0, width * 0.1, height);
    buffer.line(width * 0.9, 0, width * 0.9, height);
    buffer.line(width * 0.1, height * 0.3, width * 0.9, height * 0.3);
    buffer.line(width * 0.1, height * 0.7, width * 0.9, height * 0.7);

    // Reset the rendering target
    buffer.pop();
}

function createTimeAndReportTables(div, scheduleData, playerData, percentage, failures) {
    div.html("");
    createHeading(div, "Schedule");
    createTableFromData(div, scheduleData, ['Game Time', 'Captain', 'Team A', 'Team 1'], ['timeslot', 'captain', 'team1', 'team2']);
    const p = createParagraph(div, "block");
    p.html('<b><b>');
    createHeading(div, "Player Stats");
    createTableFromData(div, playerData, ['Player', 'Games Played', 'Total Games Missed', 'Free Games Missed', 'Games Captained', 'Max Same Teammate Count', 'Max Same Opponent Count'], ['fullName', 'totalGamesPlayed', 'totalGamesMissed', 'freeGamesMissedAcc', 'gamesCaptainedAcc', 'maxSameTeammate', 'maxSameOpponent'], failures);
    const p2 = createParagraph(div, "block");
    p2.html(`<br>Court utilization is ${percentage}%`);
    console.log(failures);
}

function createTableFromData(parent, data, headers, columns, failures = []) {
    const table = createTable(parent);
    createTableHeader(table, headers);
    data.forEach((rowData, rowIndex) => {
        const row = createElement("tr");
        row.parent(table);
        if (failures.includes(rowData[columns[0]])) {
            row.style("background-color", "lightcoral"); // Replace "lightcoral" with your preferred shade of light red
        }
        columns.forEach(column => {
            createTableCell(row, String(rowData[column]) || ''); // use an empty string as default value
        });
    });
}

