// available courts count (2)
// time slots per game day (2)
// |-> add in time slots for each time
// available courts per time slot changes
// game days per week (1)
// balance time slots vs prioritising time slots setting
// courts are locked out for their time slots for the entire session
// 12 players in a flight (the league) best, next best, jrs.. they move around after every session

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
                this.generateScheduleButton.removeClass("disabled");
            } else {
                this.generateScheduleButton.addClass("disabled");
            }
            this.oldPlayerLength = this.players.length;
        }
    }

    // time slots

    toggleAllElements(show) {
        const elementsToShow = [
            // select("#sidebar"),
            select("#matchesInAWeek"),
            select("#weeksInASession"),
            select("#loadPlayerData"),
            select("#savePlayerData"),
            select("#playerDataDiv"),
            // select("#generateSchedule"),
        ];

        const editPlayerButton = select("#editPlayerData button");
        if (editPlayerButton) {
            editPlayerButton.style("width", "100%");
        }

        elementsToShow.forEach((element) => {
            if (element) {
                element.style("display", show ? "block" : "none");
            }
        });

        this.JSONLoadInput.style("display", "none");

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
        this.createHeading(uiContainer, "Player Availability");

        // Create the section for matches per week
        this.createMatchesInAWeekSection(uiContainer);

        // Create the section for weeks in a session
        this.createWeeksInASessionSection(uiContainer);

        this.createEditPlayerDataSection(uiContainer);

        // Create the section for loading player data
        this.createLoadPlayerDataSection(uiContainer);

        // Create the input section for JSON data
        this.createJSONLoadInput(uiContainer);

        this.createSavePlayerDataSection(uiContainer);

        this.createGenerateScheduleSection(uiContainer);

        this.createSaveScheduleSection(uiContainer);

        // Create the player data div
        this.createPlayerDataDiv();
    }

    createHeading(parent, text) {
        // Create a heading element and add it to the parent container
        const heading = createElement("h2", text);
        heading.parent(parent);
    }

    createEditPlayerDataSection(parent) {
        // Create the section for triggering Schedule Generation
        const section = createDiv();
        section.id("editPlayerData");
        section.parent(parent);
        // section.style("display", "none");

        // Create the heading for schedule generation
        this.createHeading(section, "Edit Player Data");

        // Create the button for generating schedule
        this.editPlayerButton = createButton("Edit Players");
        this.editPlayerButton.parent(section);
        this.editPlayerButton.mousePressed(() => {
            mode = AVAILABILITY;
            this.toggleAllElements(true);
            this.updatePlayerData();
        });
    }

    createMatchesInAWeekSection(parent) {
        // Create the section for matches per week
        const section = createDiv();
        section.id("matchesInAWeek");
        section.parent(parent);

        // Create the heading for matches per week
        const heading = createElement("h2", `Matches in a Week: ${this.matchesPerWeek}`);
        heading.parent(section);

        // Create the slider for adjusting matches per week
        this.matchesPerWeekSlider = createSlider(1, 14, this.matchesPerWeek);
        this.matchesPerWeekSlider.parent(section);
        this.matchesPerWeekSlider.id("matchesPerWeekSlider");
        this.matchesPerWeekSlider.input(() => {
            this.matchesPerWeek = this.matchesPerWeekSlider.value();
            heading.html(`Matches in a Week: ${this.matchesPerWeek}`);
        });
    }

    createWeeksInASessionSection(parent) {
        // Create the section for weeks in a session
        const section = createDiv();
        section.id("weeksInASession");
        section.parent(parent);

        // Create the heading for weeks in a session
        const heading = createElement("h2", `Weeks in a Session: ${this.weeksInSession}`);
        heading.parent(section);

        // Create the slider for adjusting weeks in a session
        this.weeksInSessionSlider = createSlider(4, 10, this.weeksInSession);
        this.weeksInSessionSlider.parent(section);
        this.weeksInSessionSlider.id("weeksInSessionSlider");
        this.weeksInSessionSlider.input(() => {
            this.weeksInSession = this.weeksInSessionSlider.value();
            heading.html(`Weeks in a Session: ${this.weeksInSession}`);
            this.updatePlayerData();
        });
    }

    createLoadPlayerDataSection(parent) {
        // Create the section for loading player data
        const section = createDiv();
        section.id("loadPlayerData");
        section.parent(parent);

        // Create the heading for loading player data
        this.createHeading(section, "Load Player Data");

        // Create the button for loading JSON data
        this.jsonInputButton = createButton("Load JSON");
        this.jsonInputButton.parent(section);
        this.jsonInputButton.mousePressed(this.toggleJsonInput.bind(this));

        // Create the paragraph element for displaying load status
        this.jsonLoadStatus = createP();
        this.jsonLoadStatus.parent(section);
        this.jsonLoadStatus.style("display", "none");
    }

    createGenerateScheduleSection(parent) {
        // Create the section for triggering Schedule Generation
        const section = createDiv();
        section.id("generateSchedule");
        section.parent(parent);

        // Create the heading for schedule generation
        this.createHeading(section, "Generate Schedule");

        // Create the button for generating schedule
        this.generateScheduleButton = createButton("Generate");
        this.generateScheduleButton.parent(section);
        this.generateScheduleButton.addClass("disabled");
        this.generateScheduleButton.mousePressed(() => {
            this.generateScheduleButtonAction();
        });
    }

    createSaveScheduleSection(parent) {
        // Create the section for saving images
        const section = createDiv();
        section.id("saveSchedule");
        section.parent(parent);
    
        // Create the heading for saving images
        this.createHeading(section, "Save Schedule");
    
        // Create the button for saving images
        this.imageSaveButton = createButton("Save Schedule");
        this.imageSaveButton.parent(section);
        this.imageSaveButton.addClass('disabled');
        this.imageSaveButton.mousePressed(() => {
            save(scheduler.img, 'schedule.jpg');
        });
        // Create the paragraph element for displaying save status
        this.imageSaveStatus = createP();
        this.imageSaveStatus.parent(section);
        this.imageSaveStatus.style("display", "none");
    }
    

    generateScheduleButtonAction() {
        for (let player of this.players) {
            // player.availability = player.checkboxes.map((checkbox) => checkbox.checked());
            player.fullName = player.firstName + " " + player.lastName;
        }
        // mode change using global mode var
        mode = SCHEDULER;
        scheduler.generated = false;
        scheduler.gameSchedule = [];
        scheduler.numWeeks = this.weeksInSession;
        scheduler.numMatchesPerWeek = this.matchesPerWeek;
        this.imageSaveButton.removeClass('disabled');
        
        this.toggleAllElements(false);
    }

    createSavePlayerDataSection(parent) {
        // Create the section for saving player data
        const section = createDiv();
        section.id("savePlayerData");
        section.parent(parent);

        // Create the heading for saving player data
        this.createHeading(section, "Save Player Data");

        // Create the button for saving player data
        this.saveDataButton = createButton("Save");
        this.saveDataButton.parent(section);
        this.saveDataButton.addClass("disabled");
        this.saveDataButton.mousePressed(this.savePlayerData.bind(this));

        // Create the paragraph element for displaying save status
        this.playerDataSaveStatus = createP();
        this.playerDataSaveStatus.parent(section);
        this.playerDataSaveStatus.style("display", "none");
    }

    createJSONLoadInput(parent) {
        // Create the input section for JSON data
        this.JSONLoadInput = createDiv();
        this.JSONLoadInput.id("JSONLoadInput");
        this.JSONLoadInput.style("display", "none");
        this.JSONLoadInput.parent(parent);

        // Create the textarea for entering JSON data
        this.jsonInputField = createElement("textarea");
        this.jsonInputField.parent(this.JSONLoadInput);
        this.jsonInputField.addClass("textarea-input");

        // Create the 'test' button
        const testButton = createButton("Test");
        testButton.parent(this.JSONLoadInput);
        testButton.mousePressed(() => {
            // TEST SHORTCUTTING! need to untest too
            this.jsonInputField.value(join(globalPlayers, "\n"));
            this.parseJsonInput();
            this.toggleJsonInput.bind(this);
            this.generateScheduleButtonAction();
        });
    }

    createPlayerDataDiv() {
        // Create the player data div
        this.playerDataDiv = createDiv();
        this.playerDataDiv.style("display", "none");
        this.playerDataDiv.id("playerDataDiv");
    }

    toggleJsonInput() {
        // Toggle the visibility of the JSON input section
        this.jsonInputVisible = !this.jsonInputVisible;
        this.JSONLoadInput.style("display", this.jsonInputVisible ? "block" : "none");

        if (!this.jsonInputVisible) {
            this.parseJsonInput();
        }

        // Hide the playerDataDiv when JSON input is visible
        this.playerDataDiv.style("display", this.jsonInputVisible ? "none" : "block");
    }

    parseJsonInput() {
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
                    this.saveDataButton.removeClass("disabled");
                    this.generateScheduleButton.removeClass("disabled");
                } else {
                    this.showLoadStatus("Players List Incomplete!", "red");
                    console.error("Invalid players list!");
                    this.saveDataButton.addClass("disabled");
                    this.generateScheduleButton.addClass("disabled");
                    this.imageSaveButton.addClass('disabled');
                }
            } else {
                this.showLoadStatus("Invalid JSON format!", "red");
                console.error("Invalid JSON format!");
                this.saveDataButton.addClass("disabled");
                this.generateScheduleButton.addClass("disabled");
                this.imageSaveButton.addClass('disabled');
            }
        } catch (error) {
            this.showLoadStatus("Error parsing JSON!", "red");
            console.error("Error parsing JSON:", error);
            this.saveDataButton.addClass("disabled");
            this.generateScheduleButton.addClass("disabled");
            this.imageSaveButton.addClass('disabled');
        }
    }

    showLoadStatus(message, color) {
        // Show the load status message with the specified color
        this.jsonLoadStatus.html(message);
        this.jsonLoadStatus.style("color", color);
        this.jsonLoadStatus.style("display", "block");
    }

    updatePlayerData() {
        // if (this.players.length === 0) {
        //     return;
        // }

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
