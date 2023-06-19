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