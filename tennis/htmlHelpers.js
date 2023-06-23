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

function createTableHeader(table, headerCells, cspan = []) {
    const headerRow = createElement("tr");
    headerRow.parent(table);
    headerCells.forEach((cellText, i) => {
        const cell = createElement("th", cellText);
        if (cspan.length != 0) {
            cell.attribute("colspan", cspan[i]);
        }
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
    createTableFromData(
        div,
        scheduleData,
        ["Game Time", "Captain", "Team A", "Team 1"],
        ["timeslot", "captain", "team1", "team12", "team2", "team22"],
        [1, 1, 2, 2]
    );
    const p = createParagraph(div, "block");
    p.html("<b><b>");
    createHeading(div, "Player Stats");
    if (failures.length <= 0) {
        let passLabel = createElement("h3", "Passing");
        passLabel.parent(div);
        passLabel.style("color", "green");
    } else {
        let failLabel = createElement("h3", "Failing");
        failLabel.parent(div);
        failLabel.style("color", "red");
    }
    createTableFromData(
        div,
        playerData,
        [
            "Player",
            "Games Played",
            "Total Games Missed",
            "Free Games Missed",
            "Games Captained",
            "Max Same Teammate Count",
            "Max Same Opponent Count",
            "Double Up Days",
        ],
        [
            "fullName",
            "totalGamesPlayed",
            "totalGamesMissed",
            "freeGamesMissedAcc",
            "gamesCaptainedAcc",
            "maxSameTeammate",
            "maxSameOpponent",
            "daysExceeded",
        ],
        [],
        failures
    );
    const p2 = createParagraph(div, "block");
    p2.html(`<br>Court utilization is ${percentage}%`);
}

function createTableFromData(parent, data, headers, columns, cspan = [], failures = []) {
    const table = createTable(parent);
    createTableHeader(table, headers, cspan);
    data.forEach((rowData, rowIndex) => {
        const row = createElement("tr");
        row.parent(table);
        if (failures.includes(rowData[columns[0]])) {
            row.style("background-color", "lightcoral"); // Replace "lightcoral" with your preferred shade of light red
        }
        columns.forEach((column) => {
            createTableCell(row, String(rowData[column]) || ""); // use an empty string as default value
        });
    });
}

// testing something
function adjustPlayerAvails(players) {
    let mymat = [];
    let fullyAvailableLength = players[0].availability.length;
    let sumOfColsTrue = new Array(fullyAvailableLength).fill(0);

    // First, compute the sums for each column
    players.forEach((p, i) => {
        p.availability.forEach((a, j) => {
            if (a === true) {
                sumOfColsTrue[j]++;
            }
        });
    });

    // Then, construct the matrix
    players.forEach((p, i) => {
        let row = [];
        let sumOfRowsTrue = p.availability.reduce((total, a) => total + (a === true ? 1 : 0), 0);
        p.availability.forEach((a, j) => {
            let t = { val: a, row: sumOfRowsTrue, col: sumOfColsTrue[j] };
            row.push(t);
        });
        mymat.push(row);
    });
    // Create and sort rowIndexes
    let rowIndexes = mymat.map((row, index) => ({
        index,
        sum: row.reduce((total, t) => total + (t.val === true ? 1 : 0), 0),
    }));
    rowIndexes.sort((a, b) => b.sum - a.sum);

    // Create and sort colIndexes
    let colIndexes = sumOfColsTrue.map((sum, index) => ({ index, sum }));
    colIndexes.sort((a, b) => b.sum - a.sum);
    let preprocess = extractValues(mymat);

    for (let col of colIndexes) {
        let numPlayersToRemove = col.sum % 4;
        rowIndexes.sort((a, b) => b.sum - a.sum);
        while (numPlayersToRemove > 0) {
            for (let row of rowIndexes) {
                if (row.sum > 4 && mymat[row.index][col.index].val == true) {
                    mymat[row.index][col.index].val = false;
                    mymat[row.index][col.index].sumOfRowsTrue--;
                    mymat[row.index][col.index].sumOfColsTrue--;
                    row.sum--;
                    col.sum--;
                    numPlayersToRemove--;
                    if (numPlayersToRemove == 0) {
                        break;
                    }
                }
            }
        }
    }
    let postprocess = extractValues(mymat);
    return postprocess;
}

function extractValues(mymat) {
    // Map over each row in mymat
    return mymat.map((row) => {
        // Map over each object in the row
        return row.map((obj) => {
            // Return only the val property of the object
            return obj.val;
        });
    });
}

function compareArrays(array1, array2) {
    // Initialize an empty array to store the comparison results
    let comparisonArray = [];

    // Loop over each row in array1
    for (let i = 0; i < array1.length; i++) {
        // Initialize an empty array for this row in the comparison array
        comparisonArray[i] = [];
        // Loop over each item in this row
        for (let j = 0; j < array1[i].length; j++) {
            // If the item in array1 is different from the item in array2, add true to the comparison array
            // Otherwise, add false
            comparisonArray[i][j] = array1[i][j] !== array2[i][j];
        }
    }

    return comparisonArray;
}
