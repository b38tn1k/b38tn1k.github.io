// available courts count (2)
// time slots per game day (2)
// |-> add in time slots for each time
// available courts per time slot changes
// game days per week (1)
// balance time slots vs prioritising time slots setting
// courts are locked out for their time slots for the entire session
// 12 players in a flight (the league) best, next best, jrs.. they move around after every session
// https://docs.google.com/spreadsheets/d/16RnoOF49E4NChldnqGQ5x5LmiNK9znnHlVaPn1Bdw98/edit#gid=1944998598

// WEDNESDAY ARVO: next step is to work on updatePlayers to allow availability for timeslots per week.
// maybe a drop down of unavailables would be smarter? think

const ELEMENT_CLASSES = {
    toolsDiv: "toolsDiv",
    textareaInput: "textarea-input",
    // etc.
};

const BUTTON_CLASSES = {
    disabled: "disabled",
};

class Availability {
    constructor() {
        this.players = [];
        this.title = "Player Availabilities";
        this.matchesPerWeek = 4;
        this.weeksInSession = 6;
        this.jsonInputVisible = false;
        this.jsonInputField = null;
        this.matchesPerWeekSlider = null;
        this.weeksInSessionSlider = null;
        this.playerDataDiv = null;
        this.oldPlayerLength = this.players.length;
        this.setup();
    }

    draw() {
        // Placeholder draw function, can be implemented as needed
        if (this.oldPlayerLength !== this.players.length) {
            if (this.players.length > 0) {
                this.generateButton.removeClass(BUTTON_CLASSES.disabled);
            } else {
                this.generateButton.addClass(BUTTON_CLASSES.disabled);
            }
            this.oldPlayerLength = this.players.length;
        }
    }

    // time slots

    toggleAllElements(show) {
        const elementsToShow = [select("#playerDataDiv")];

        elementsToShow
            .filter((element) => element !== null)
            .forEach((element) => {
                element.style("display", show ? "block" : "none");
            });

        for (let i = 0; i < elementsToShow.length; i++) {
            const elementId = "#" + elementsToShow[i].id();
            const button = select(elementId + " button");
            if (button) {
                button.style("width", show ? "100%" : "auto");
            }
        }
    }

    setup() {
        // Create the UI elements and set up the initial configuration
        const uiContainer = createDiv();
        uiContainer.id("sidebar");

        // Create the main heading
        this.createHeading(uiContainer, "League Ninja");

        this.createLeagueToolsSection(uiContainer);

        this.createPlayerToolsSection(uiContainer);

        this.createScheduleToolsSection(uiContainer);

        // Create the player data div
        this.createPlayerDataDiv();
    }

    createHeading(parent, text) {
        // Create a heading element and add it to the parent container
        const heading = createElement("h2", text);
        heading.parent(parent);
    }

    // Helper Function for creating section
    createSection(parent, id) {
        const section = createDiv();
        section.id(id);
        section.addClass(ELEMENT_CLASSES.toolsDiv);
        section.parent(parent);
        return section;
    }

    // Helper Function for creating button
    createButtonIn(parent, label, action, buttonClass = null) {
        const button = createButton(label);
        button.parent(parent);
        button.mousePressed(action);
        if (buttonClass) {
            button.addClass(buttonClass);
        }
        return button;
    }

    // Helper Function for creating textarea
    createTextarea(parent, validationFunction, placeholder = null) {
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
    createParagraph(parent, displayStyle = "none") {
        const paragraph = createP();
        paragraph.parent(parent);
        paragraph.style("display", displayStyle);
        return paragraph;
    }

    // Revised Method Definitions
    createPlayerToolsSection(parent) {
        const section = this.createSection(parent, "playerTools");
        this.createHeading(section, "Player Tools");
        this.editPlayerButton = this.createButtonIn(section, "Edit Players", () => {
            mode = AVAILABILITY;
            this.toggleAllElements(true);
            this.updatePlayerData();
        });
        this.loadJsonButton = this.createButtonIn(section, "Load JSON", () => {
            this.parseJsonInput();
            this.generateAction();
        });
        this.jsonInputField = this.createTextarea(section, () => {}, "");
        const testButton = this.createButtonIn(section, "Test", () => {
            this.jsonInputField.value(join(globalPlayers, "\n"));
            this.courtsInput.value("Monday: Court 3, Court 4");
            this.timeSlotsInput.value("Monday: 6:30, 8:30");
            this.parseJsonInput();
            this.generateAction();
            
        });
        this.jsonLoadStatus = this.createParagraph(section);
        this.saveDataButton = this.createButtonIn(section, "Save", this.savePlayerData.bind(this), "disabled");
        this.playerDataSaveStatus = this.createParagraph(section);
    }

    createLeagueToolsSection(parent) {
        const section = this.createSection(parent, "leagueTools");
        this.createHeading(section, "League Setup");
        this.timeSlotsInput = this.createTextarea(
            section,
            this.validateAndUpdatePlayerData.bind(this),
            "e.g.\nMonday: 6:30, 8:30\nThursday: 6:30"
        );
        this.courtsInput = this.createTextarea(
            section,
            this.validateAndUpdatePlayerData.bind(this),
            "e.g.\nMonday: Court 3, Court 4\nThursday: Court 4"
        );
        this.leagueDuration = createP(`League Duration: ${this.weeksInSession} weeks`);
        this.leagueDuration.parent(section);
        this.weeksInSessionSlider = createSlider(4, 12, this.weeksInSession);
        this.weeksInSessionSlider.parent(section);
        this.weeksInSessionSlider.id("weeksInSessionSlider");
        this.weeksInSessionSlider.input(() => {
            this.weeksInSession = this.weeksInSessionSlider.value();
            this.validateAndUpdatePlayerData();
            this.leagueDuration.html(`League Duration: ${this.weeksInSession} weeks`);
        });
    }

    createScheduleToolsSection(parent) {
        const section = this.createSection(parent, "scheduleTools");
        this.createHeading(section, "Schedule Tools");
        this.generateButton = this.createButtonIn(
            section,
            "Generate",
            () => {
                this.generateAction();
            },
            "disabled"
        );
        this.imageSaveButton = this.createButtonIn(
            section,
            "Save Schedule",
            () => {
                save(scheduler.img, "schedule.jpg");
            },
            "disabled"
        );
    }

    getTimeSchedule(str) {
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

    getCourtSchedule(str) {
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

    validateAndUpdatePlayerData() {
        // Validate the input fields and sliders here
        let courts = this.courtsInput.value();
        let timeslots = this.timeSlotsInput.value();
        let weeks = this.weeksInSessionSlider.value();
        let ts, cs;
        try {
            ts = this.getTimeSchedule(timeslots);
            cs = this.getCourtSchedule(courts);
        } catch (e) {
            console.log(e);
        }
        console.log("TS", ts);
        console.log("CS", cs);
        if (ts && cs) {
            // Map each day in timeslots
            let weeklySchedule = ts.flatMap(tsDay => {
                // Find matching day in courts
                let matchingCourtDay = cs.find(csDay => csDay.day === tsDay.day);
                if (matchingCourtDay) {
                    // If found, map each timeslot and each court of the matching day
                    return tsDay.times.flatMap(time => {
                        return matchingCourtDay.courts.map(court => {
                            return {
                                day: tsDay.day,
                                timeslot: time,
                                court: court
                            }
                        });
                    });
                } else {
                    // If no matching day found, return empty array
                    return [];
                }
            });
    
            // Create a schedule repeated for the number of weeks
            let schedule = [];
            for (let i = 1; i <= weeks; i++) {
                let weekSchedule = weeklySchedule.map(game => {
                    return {
                        ...game,
                        week: i
                    };
                });
                schedule = schedule.concat(weekSchedule);
            }
    
            console.log("Schedule", schedule);
        }
    
        // If everything is valid, update the player data
        this.updatePlayerData();
    }
    
    

    generateAction() {
        for (let player of this.players) {
            // player.availability = player.checkboxes.map((checkbox) => checkbox.checked());
            player.fullName = `${player.firstName} ${player.lastName}`;
        }

        if (this.players.length == 0) {
            return false;
        }
        // mode change using global mode var
        mode = SCHEDULER;
        scheduler.generated = false;
        scheduler.gameSchedule = [];
        scheduler.numWeeks = this.weeksInSession;
        scheduler.numMatchesPerWeek = this.matchesPerWeek;
        this.imageSaveButton.removeClass(BUTTON_CLASSES.disabled);

        this.toggleAllElements(false);
    }

    createPlayerDataDiv() {
        // Create the player data div
        this.playerDataDiv = createDiv().style("display", "none");
        this.playerDataDiv.id("playerDataDiv");
    }

    parseJsonInput() {
        mode = AVAILABILITY;
        // Parse the entered JSON data and update the players array
        const inputText = this.jsonInputField.value();

        try {
            const parsedData = JSON.parse(inputText);
            if (Array.isArray(parsedData)) {
                const isValid = parsedData.every((player) => {
                    const hasFirstName = typeof player.firstName === "string";
                    const hasLastName = typeof player.lastName === "string";
                    const hasContact = typeof player.contact === "string";
                    const hasAvailability = Array.isArray(player.availability);
                    return hasFirstName && hasLastName && hasContact && hasAvailability;
                });

                if (isValid) {
                    this.players = parsedData;
                    this.showLoadStatus("Load succeeded!", "green");
                    this.updatePlayerData();
                    this.playerDataDiv.style("display", "block");
                    console.log("JSON data loaded successfully!");
                    this.enableButtonsFirst();
                } else {
                    this.showLoadStatus("Players List Incomplete!", "red");
                    console.error("Invalid players list!");
                    this.disableButtons();
                }
            } else {
                this.showLoadStatus("Invalid JSON format!", "red");
                console.error("Invalid JSON format!");
                this.disableButtons();
            }
        } catch (error) {
            this.showLoadStatus("Error parsing JSON!", "red");
            console.error("Error parsing JSON:", error);
            this.disableButtons();
        }
        if (this.players.length > 0) {
            this.enableButtonsFirst();
        }
    }

    disableButtons() {
        this.saveDataButton.addClass(BUTTON_CLASSES.disabled);
        this.generateButton.addClass(BUTTON_CLASSES.disabled);
        this.imageSaveButton.addClass(BUTTON_CLASSES.disabled);
    }

    enableButtonsFirst() {
        this.saveDataButton.removeClass(BUTTON_CLASSES.disabled);
        this.generateButton.removeClass(BUTTON_CLASSES.disabled);
    }

    showLoadStatus(message, color) {
        // Show the load status message with the specified color
        this.jsonLoadStatus.html(message);
        this.jsonLoadStatus.style("color", color);
        this.jsonLoadStatus.style("display", "block");
    }

    updatePlayerData() {
        this.clearPlayerData();
        const table = this.createTable();
        this.createTableHeader(table);
        this.createPlayerRows(table);
        this.createAddPlayerTable();
    }

    clearPlayerData() {
        this.playerDataDiv.html("");
    }

    createTable() {
        const table = createElement("table");
        table.parent(this.playerDataDiv);
        return table;
    }

    createTableHeader(table) {
        const headerRow = createElement("tr");
        headerRow.parent(table);

        const headerCells = ["Name", "Contact"];
        for (let i = 1; i <= this.weeksInSession; i++) {
            headerCells.push(`W${i}`);
        }
        headerCells.push("Actions");

        headerCells.forEach((cellText) => {
            const cell = createElement("th", cellText);
            cell.parent(headerRow);
        });
    }

    createPlayerRows(table) {
        this.players.forEach((player, playerIndex) => {
            const row = createElement("tr");
            row.parent(table);

            this.createTableCell(row, player.firstName + " " + player.lastName);
            this.createTableCell(row, player.contact);
            const checkboxRefs = this.createAvailabilityCells(row, player.availability);
            this.createDeleteButton(row, player);

            // Store checkbox references for the player
            player.checkboxes = checkboxRefs;
        });
    }

    createTableCell(row, cellText) {
        const cell = createElement("td", cellText);
        cell.parent(row);
    }

    createAvailabilityCells(row, availability) {
        const checkboxRefs = [];
        for (let i = 0; i < this.weeksInSession; i++) {
            const availabilityCell = createElement("td");
            availabilityCell.parent(row);

            const checkbox = createCheckbox("", availability[i]);
            checkbox.parent(availabilityCell);
            checkboxRefs.push(checkbox);

            const checkboxLabel = createElement("label");
            checkboxLabel.parent(availabilityCell);
            checkboxLabel.attribute("for", checkbox.elt.id);
            checkboxLabel.html(`W${i + 1}`);
        }
        return checkboxRefs;
    }

    createDeleteButton(row, player) {
        const deleteButton = createButton("Delete");
        const actionsCell = createElement("td");
        deleteButton.parent(actionsCell);
        deleteButton.style("width", "100%");
        actionsCell.parent(row);

        deleteButton.mousePressed(() => {
            const index = this.players.indexOf(player);
            if (index !== -1) {
                this.players.splice(index, 1);
                this.updatePlayerData();
            }
        });
    }

    createAddPlayerTable() {
        // Create a new table
        const addPlayerTable = createElement("table");
        addPlayerTable.parent(this.playerDataDiv);

        // Create a row in the new table
        const addPlayerRow = createElement("tr");
        addPlayerRow.parent(addPlayerTable);

        // Create the input elements
        const firstNameInput = createInput();
        const lastNameInput = createInput();
        const contactInput = createInput();
        const addPlayerButton = createButton("Add Player");

        // Create an array of inputs and placeholders
        const inputs = [firstNameInput, lastNameInput, contactInput];
        const placeholders = ["First Name", "Last Name", "Contact"];

        // Add the input fields to the table
        inputs.forEach((input, index) => {
            const tableCell = createElement("td");
            const cellInput = input.parent(tableCell);
            cellInput.style("width", "100%");
            cellInput.attribute("placeholder", placeholders[index]); // This line adds the placeholder text
            tableCell.parent(addPlayerRow);
        });

        // Add the button to the table
        const addPlayerCell = createElement("td");
        addPlayerButton.parent(addPlayerCell);
        addPlayerButton.style("width", "100%");
        addPlayerCell.parent(addPlayerRow);

        // Add the functionality of the button
        addPlayerButton.mousePressed(() => {
            const newPlayer = {
                firstName: firstNameInput.value(),
                lastName: lastNameInput.value(),
                contact: contactInput.value(),
                availability: Array(this.weeksInSession).fill(false),
            };

            this.players.push(newPlayer);
            this.updatePlayerData();
            inputs.forEach((input) => input.value(""));
        });
    }

    savePlayerData() {
        const updatedPlayers = this.players.map((player) => {
            const availability = player.checkboxes.map((checkbox) => checkbox.checked());
            return {
                firstName: player.firstName,
                lastName: player.lastName,
                contact: player.contact,
                availability: availability,
            };
        });

        const jsonData = JSON.stringify(updatedPlayers, null, 2);
        console.log(jsonData);

        saveJSON(updatedPlayers, "playerData.json");

        this.showSaveStatus("Player data saved!", "green");
    }

    showSaveStatus(message, color) {
        this.playerDataSaveStatus.html(message);
        this.playerDataSaveStatus.style("color", color);
        this.playerDataSaveStatus.style("display", "block");
    }
}
