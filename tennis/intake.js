// available courts count (2)
// time slots per game day (2)
// |-> add in time slots for each time
// available courts per time slot changes
// game days per week (1)
// balance time slots vs prioritising time slots setting
// courts are locked out for their time slots for the entire session
// 12 players in a flight (the league) best, next best, jrs.. they move around after every session
// https://docs.google.com/spreadsheets/d/16RnoOF49E4NChldnqGQ5x5LmiNK9znnHlVaPn1Bdw98/edit#gid=1944998598

const ELEMENT_CLASSES = {
    toolsDiv: "toolsDiv",
    textareaInput: "textarea-input",
    playerDataDivId: "playerDataDiv",
    playerAvailDivId: "playerAvailDiv",
    playerInfoDiv: "playerInfoDiv",
    // etc.
};

const BUTTON_CLASSES = {
    disabled: "disabled",
};

class Availability {
    constructor() {
        this.players = [];
        this.weeksInSession = 6;
        this.jsonInputVisible = false;
        this.jsonInputField = null;
        this.weeksInSessionSlider = null;
        this.playerDataDiv = null;
        this.playerAvailDiv = null;
        this.gameAvailabilitySchedule = [];
        this.oldPlayerLength = this.players.length;
        this.setup();
    }

    /**********************************************
     *             P5 COMPATIBILITY AND TIE-INS            *
     **********************************************/

    setup() {
        // Creating a new container for the UI elements in the sidebar.
        // This will serve as the main layout container for the application.
        const uiContainer = createDiv();
        uiContainer.id("sidebar");

        // Creating a heading for the application. This will be displayed at
        // the top of the sidebar and will serve to identify the application.
        createHeading(uiContainer, "League Ninja");

        // Create a 'test' button for troubleshooting. This button populates the JSON input field with either a global string or array.
        const testButton = createButtonIn(uiContainer, "Test", () => {
            this.courtsInput.value("Monday: Court 3, Court 4");
            this.timeSlotsInput.value("Monday: 6:30, 8:30");
            this.buildGameSchedule();

            if (typeof globalPlayers === "string") {
                // loading demo troubleshooting
                this.jsonInputField.value(globalPlayers);
            } else if (Array.isArray(globalPlayers)) {
                this.jsonInputField.value(join(globalPlayers, "\n"));
            } else {
                console.log("globalPlayers is neither a string nor an array");
            }

            this.parseJsonInput();
            this.generateAction();
        });

        // Creating a section for the league tools within the UI container.
        // These tools are specific to managing the league aspects of the application.
        this.createLeagueToolsSection(uiContainer);

        // Creating a section for the player tools within the UI container.
        // These tools are specific to managing the player aspects of the application.
        this.createPlayerToolsSection(uiContainer);

        // Creating a section for the schedule tools within the UI container.
        // These tools are specific to managing the schedule aspects of the application.
        this.createScheduleToolsSection(uiContainer);

        // Creating dedicated divs for player data & player availability.
        // This allows for better organization and easier manipulation of these sections.
        this.createPlayerInfoDivs();
    }

    draw() {
        // Placeholder
    }

    /****************************************************
     *        HTML & USER SECTION CREATION         *
     ****************************************************/

    toggleElements(show, oneToShow = "none") {
        // Define an array of elements that are mutually exclusive
        // These elements are not intended to be displayed at the same time
        const mutuallyExclusiveElements = [
            select("#" + ELEMENT_CLASSES.playerDataDivId),
            select("#" + ELEMENT_CLASSES.playerAvailDivId),
        ];

        // Loop through each of the mutually exclusive elements
        mutuallyExclusiveElements.forEach((element) => {
            // Ensure the element is not null, if it is, then it doesn't exist in the DOM
            // and there's no need to attempt style changes on it
            if (element !== null) {
                // If the 'oneToShow' argument is specified (i.e., not "none")
                // and the current element's ID matches 'oneToShow', then determine
                // whether to show or hide it based on the 'show' argument
                if (oneToShow !== "none" && element.id() === oneToShow) {
                    element.style("display", show ? "block" : "none");
                }
                // If the current element's ID does not match 'oneToShow', hide it
                // This ensures that only the element specified by 'oneToShow' (if any) is visible
                else if (element.id() !== oneToShow) {
                    element.style("display", "none");
                }
            }
        });

        // Loop through the mutually exclusive elements again to set the width of their buttons
        for (let i = 0; i < mutuallyExclusiveElements.length; i++) {
            // Create the CSS selector for the button within the current element
            const elementId = "#" + mutuallyExclusiveElements[i].id();
            const button = select(elementId + " button");
            // If a button exists within the current element, set its width based on the 'show' argument
            // If 'show' is true, the button will take up the full width of its container; otherwise, it will auto-size
            if (button) {
                button.style("width", show ? "100%" : "auto");
            }
        }
    }

    createPlayerToolsSection(parent) {
        // This function creates a section of UI controls for player management within the parent element provided.

        // Initialize the section for the player tools within the parent element.
        const section = createSection(parent, "playerTools");

        // Create the section header.
        createHeading(section, "Player Tools");

        // Create a button to allow editing of players, which toggles the relevant UI elements and updates player data.
        this.editPlayerButton = createButtonIn(section, "Edit Players", () => {
            mode = AVAILABILITY;
            this.toggleElements(true, ELEMENT_CLASSES.playerDataDivId);
            this.updatePlayerDataDiv();
        });

        // Create a button to allow editing of player availabilities, which toggles the relevant UI elements.
        this.editPlayerButton = createButtonIn(section, "Edit Availabilities", () => {
            mode = AVAILABILITY;
            this.toggleElements(true, ELEMENT_CLASSES.playerAvailDivId);
            this.updatePlayerAvailability();
        });

        // Create a button to load player data from a JSON format, and parse the input JSON.
        this.loadJsonButton = createButtonIn(section, "Load JSON", () => {
            this.parseJsonInput();
        });

        // Create a paragraph element to display the JSON loading status.
        this.jsonLoadStatus = createParagraph(section);

        // Create a textarea to input JSON data.
        this.jsonInputField = createTextarea(section, () => {}, "Paste text from a .json file here.");

        // Create a 'Save' button to save player data, with initial state as disabled.
        this.saveDataButton = createButtonIn(section, "Save", this.savePlayerData.bind(this), "disabled");

        // Create a paragraph element to display the save status.
        this.playerDataSaveStatus = createParagraph(section);
    }

    createLeagueToolsSection(parent) {
        // This function creates a section of UI controls for setting up the league within the parent element provided.

        // Initialize the section for the league tools within the parent element.
        const section = createSection(parent, "leagueTools");

        // Create the section header.
        createHeading(section, "League Setup");

        // Create a textarea to input time slots. Updates schedule upon any changes.
        this.timeSlotsInput = createTextarea(
            section,
            this.buildGameSchedule.bind(this),
            "e.g.\nMonday: 6:30, 8:30\nThursday: 6:30"
        );

        // Create a textarea to input courts. Updates schedule upon any changes.
        this.courtsInput = createTextarea(
            section,
            this.buildGameSchedule.bind(this),
            "e.g.\nMonday: Court 3, Court 4\nThursday: Court 4"
        );

        // Display the league duration in weeks. Initial value is taken from the class member 'weeksInSession'.
        this.leagueDuration = createP(`League Duration: ${this.weeksInSession} weeks`);
        this.leagueDuration.parent(section);

        // Create a slider to adjust the league duration from 4 to 24 weeks. The slider's value updates 'weeksInSession' and the schedule.
        this.weeksInSessionSlider = createSlider(4, 24, this.weeksInSession);
        this.weeksInSessionSlider.parent(section);
        this.weeksInSessionSlider.id("weeksInSessionSlider");
        this.weeksInSessionSlider.input(() => {
            this.weeksInSession = this.weeksInSessionSlider.value();
            this.buildGameSchedule();
            this.leagueDuration.html(`League Duration: ${this.weeksInSession} weeks`);
        });
    }

    createScheduleToolsSection(parent) {
        // This function creates a section of UI controls for manipulating the schedule within the parent element provided.

        // Initialize the section for the schedule tools within the parent element.
        const section = createSection(parent, "scheduleTools");

        // Create the section header.
        createHeading(section, "Schedule Tools");

        // Create a button to generate the schedule. The function bound to this button is the `generateAction` method of this object.
        this.generateButton = createButtonIn(
            section,
            "Generate",
            () => {
                this.generateAction();
            },
            "disabled"
        );

        // Create a button to save the schedule as an image. The function bound to this button saves the scheduler's image as 'schedule.jpg'.
        this.imageSaveButton = createButtonIn(
            section,
            "Save Schedule",
            () => {
                save(scheduler.img, "schedule.jpg");
            },
            "disabled"
        );
    }

    createPlayerInfoDivs() {
        // This function creates div elements for displaying player data and availability. These divs are initially hidden.

        // Create the div for player data, initially hidden.
        this.playerDataDiv = createDiv().style("display", "none");
        this.playerDataDiv.id(ELEMENT_CLASSES.playerDataDivId);
        this.playerDataDiv.addClass(ELEMENT_CLASSES.playerInfoDiv);

        // Create the div for player availability, initially hidden.
        this.playerAvailDiv = createDiv().style("display", "none");
        this.playerAvailDiv.id(ELEMENT_CLASSES.playerAvailDivId);
        this.playerAvailDiv.addClass(ELEMENT_CLASSES.playerInfoDiv);
    }

    createAddPlayerRow(parent) {
        // This function creates a row in a given table for adding a new player. The row includes input fields for the player's first name, last name, and contact.

        // Initialize the table row within the parent element.
        const addPlayerRow = createElement("tr");
        addPlayerRow.parent(parent);

        // Initialize input fields for the player's first name, last name, and contact.
        const firstNameInput = createInput();
        const lastNameInput = createInput();
        const contactInput = createInput();

        // Initialize the 'Add Player' button.
        const addPlayerButton = createButton("Add Player");

        // Prepare the inputs and placeholders for integration into the table.
        const inputs = [firstNameInput, lastNameInput, contactInput];
        const placeholders = ["First Name", "Last Name", "Contact"];

        // Integrate the input fields into the table.
        inputs.forEach((input, index) => {
            const tableCell = createElement("td");
            const cellInput = input.parent(tableCell);
            cellInput.style("width", "100%");
            cellInput.attribute("placeholder", placeholders[index]); // This line adds the placeholder text
            tableCell.parent(addPlayerRow);
        });

        // Integrate the 'Add Player' button into the table.
        const addPlayerCell = createElement("td");
        addPlayerButton.parent(addPlayerCell);
        addPlayerButton.style("width", "100%");
        addPlayerCell.parent(addPlayerRow);

        // Define the functionality of the 'Add Player' button. On pressing, a new player is added to the players list and the player data is updated.
        addPlayerButton.mousePressed(() => {
            const newPlayer = {
                firstName: firstNameInput.value(),
                lastName: lastNameInput.value(),
                fullName: `${firstNameInput.value()} ${lastNameInput.value()}`,
                unsecureID: getUnsecureHash(),
                contact: contactInput.value(),
                availability: [],
            };

            this.players.push(newPlayer);
            this.updatePlayerDataDiv();
            inputs.forEach((input) => input.value(""));
            this.buildGameSchedule();
            this.checkButtons();
        });
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

    checkButtons() {
        if (this.players.length != 0 && this.gameAvailabilitySchedule.length != 0) {
            // If there are players and schedule, enable the buttons.
            this.enableButtonsFirst();
        } else {
            this.disableButtons();
        }
    }

    /***********************************************
     * MAJOR FUNCTION BUTTON CALLBACKS *
     ***********************************************/

    buildGameSchedule() {
        // This function generates a league schedule based on input values for courts, timeslots, and weeks.
        // It validates the input and builds a schedule array.

        // Collect user input for courts, timeslots, and weeks from UI elements.
        let courts = this.courtsInput.value();
        let timeslots = this.timeSlotsInput.value();
        let weeks = this.weeksInSessionSlider.value();

        // Initialize an empty schedule array.
        let schedule = [];
        let ts, cs;

        try {
            // Parse the timeslots and courts input into their respective schedules.
            ts = getTimeSchedule(timeslots);
            cs = getCourtSchedule(courts);

            if (ts && cs) {
                // If both timeslots and courts schedules exist, start building the weekly schedule.
                // Map each day in timeslots to each matching day in courts.
                let weeklySchedule = ts.flatMap((tsDay) => {
                    // Find the matching day in courts schedule.
                    let matchingCourtDay = cs.find((csDay) => csDay.day === tsDay.day);
                    if (matchingCourtDay) {
                        // If a matching day is found, map each timeslot to each court of the matching day.
                        return tsDay.times.flatMap((time) => {
                            return matchingCourtDay.courts.map((court) => {
                                return {
                                    day: tsDay.day,
                                    timeslot: time,
                                    court: court,
                                };
                            });
                        });
                    } else {
                        // If no matching day is found, return withtout changin gameSchedule
                        return;
                        // this.gameAvailabilitySchedule = [];
                    }
                });

                // Extend the weekly schedule into a full schedule for the given number of weeks.
                for (let i = 0; i < weeks; i++) {
                    let weekSchedule = weeklySchedule.map((day) => {
                        return {
                            ...day,
                            week: i + 1,
                        };
                    });

                    schedule.push(weekSchedule);
                }
            }
        } catch (e) {
            console.log(e);
        }

        // Update player data if the schedule is successfully built.
        // this.updatePlayerDataDiv();

        // Return the built schedule.
        this.gameAvailabilitySchedule = schedule;
        this.checkButtons();
    }

    generateAction() {
        // This function is used to initiate the schedule generation process.
        // It first checks if there are any players. If no players exist, it stops the process.
        // If players exist, it sets the global mode to SCHEDULER, resets some properties in the scheduler,
        // enables the 'Save Schedule' button and hides all the UI elements.

        // Check if there are any players. If no players exist, return false and stop the schedule generation process.
        if (this.players.length == 0 || this.gameAvailabilitySchedule.length == 0) {
            return false;
        }

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].checkboxes) {
                this.players[i].availability = this.players[i].checkboxes.map((checkbox) => checkbox.checked());
            } else {
                if (this.players[i].availability.length == 0) {
                    for (
                        let j = 0;
                        j < this.gameAvailabilitySchedule.length * this.gameAvailabilitySchedule[0].length;
                        j++
                    ) {
                        this.players[i].availability.push(true);
                    }
                }
            }
        }

        // Reset the 'generated' flag and 'gameSchedule' in the scheduler, share players, and set 'numWeeks' and 'numMatchesPerWeek'
        scheduler.reset(this.gameAvailabilitySchedule, this.players);

        // Switch to SCHEDULER mode, this mode signifies that the application is in schedule generation process.
        mode = SCHEDULER;

        // Enable the 'Save Schedule' button by removing the 'disabled' class.
        this.imageSaveButton.removeClass(BUTTON_CLASSES.disabled);

        // Hide all UI elements related to player data input, availability, etc.
        this.toggleElements(false);
    }

    parseJsonInput() {
        // This function is responsible for parsing the JSON input from the user to update the players array.
        // It first sets the mode to AVAILABILITY and grabs the JSON data from the input field.
        // It then builds the league schedule and checks if it exists. If no schedule exists, it warns the user.
        // The function then attempts to parse the JSON data. If the data is not a valid JSON array, or if the player objects
        // don't have the expected properties (firstName, lastName, contact, availability), it shows an error message
        // and disables the buttons. If the parsing is successful, it updates the players array,
        // updates the player data display, shows a success message, and enables the buttons.

        // Set the mode to AVAILABILITY
        mode = AVAILABILITY;

        // Grab the JSON data from the input field
        const inputText = this.jsonInputField.value();

        // Build the league schedule and check if it exists, TEMPORARY!
        this.buildGameSchedule();
        if (this.gameAvailabilitySchedule.length === 0) {
            this.showLoadStatus("Please set a League Schedule!", "orange");
        }

        // Try parsing the JSON data
        try {
            const parsedData = JSON.parse(inputText);

            // Check if the parsed data is an array
            if (Array.isArray(parsedData)) {
                // Check if each player object in the array has all the necessary properties
                const isValid = parsedData.every((player) => {
                    const hasFirstName = typeof player.firstName === "string";
                    const hasLastName = typeof player.lastName === "string";
                    const hasContact = typeof player.contact === "string";
                    const hasAvailability = Array.isArray(player.availability);

                    return hasFirstName && hasLastName && hasContact && hasAvailability;
                });

                // If the parsed data is valid, update the players array, show success message,
                // update player data display and enable the buttons.
                if (isValid) {
                    this.players = parsedData;
                    this.showLoadStatus("Load succeeded!", "green");
                    this.updatePlayerDataDiv();
                    this.playerDataDiv.style("display", "block");
                } else {
                    // If the parsed data is not valid, show an error message and disable the buttons.
                    this.showLoadStatus("Players List Incomplete!", "red");
                }
            } else {
                // If the parsed data is not an array, show an error message and disable the buttons.
                this.showLoadStatus("Invalid JSON format!", "red");
            }
        } catch (error) {
            // If an error occurs during JSON parsing, show an error message and disable the buttons.
            this.showLoadStatus("Error parsing JSON!", "red");
        }

        // check the state of loaded data to determine if User can progress
        this.checkButtons();
    }

    showLoadStatus(message, color) {
        // Show the load status message with the specified color
        console.log(message);
        this.jsonLoadStatus.html(message);
        this.jsonLoadStatus.style("color", color);
        this.jsonLoadStatus.style("display", "block");
    }

    /********************************************
     * PLAYER DATA OPERATIONS *
     ********************************************/

    updatePlayerDataDiv() {
        // Clear the previous content in the player data division
        this.playerDataDiv.html("");

        // Create a new table within the player data division
        const table = createTable(this.playerDataDiv);

        // Set the table header with the desired columns
        createTableHeader(table, ["First Name", "Last Name", "Contact", "Actions"]);

        // Add a row to the table for adding new players
        this.createAddPlayerRow(table);

        // Populate the table with existing player data
        this.populatePlayerDataRows(table);
    }

    populatePlayerDataRows(table) {
        // Iterate through each player in the players array
        this.players.forEach((player, playerIndex) => {
            // Create a new row for each player
            const row = createElement("tr");
            row.parent(table);

            // Populate the row with the player's data
            createTableCell(row, player.firstName);
            createTableCell(row, player.lastName);
            createTableCell(row, player.contact);

            // Attach a delete button to the row
            this.createPlayerDataDeleteButton(row, player);
        });
    }

    createPlayerDataDeleteButton(row, player) {
        // Create a delete button
        const deleteButton = createButton("Delete");

        // Create a cell for the delete button (goes under "Actions" column)
        const actionsCell = createElement("td");

        // Parent the delete button to the actions cell and set its width
        deleteButton.parent(actionsCell);
        deleteButton.style("width", "100%");

        // Parent the actions cell to the row
        actionsCell.parent(row);

        // Attach an event listener to the delete button
        deleteButton.mousePressed(() => {
            // Find the index of the player in the players array
            const index = this.players.indexOf(player);

            // If the player is found in the array, remove them
            if (index !== -1) {
                this.players.splice(index, 1);

                // Update the player data display
                this.updatePlayerDataDiv();
            }
        });
    }

    /**********************************************
     * PLAYER AVAILABILITY OPERATIONS *
     **********************************************/

    updatePlayerAvailability() {
        this.updatePlayerAvailDiv();
    }

    updatePlayerAvailDiv() {
        // Clear the previous content in the player data division
        this.playerAvailDiv.html("");

        // Create a new table within the player data division
        const table = createTable(this.playerAvailDiv);

        // Set the table header with the desired columns
        // createTableHeader(table, ["Name", "Availability"]);

        // Populate the table with existing player data (this.players[i].fullname, null for now)
        this.populatePlayerAvailRows(table);
    }

    populatePlayerAvailRows(parent) {
        // Get a unique list of all days from the game schedule
        let times = new Set();
        for (let i = 0; i < this.gameAvailabilitySchedule.length; i++) {
            for (let day of this.gameAvailabilitySchedule[i]) {
                let scheduleDay = { day: day.day, timeslot: day.timeslot, week: i };
                times.add(JSON.stringify(scheduleDay));
            }
        }

        times = Array.from(times).map((item) => JSON.parse(item));

        // Create the table structure
        let table = createElement("table");
        let thead = createElement("thead");
        let tbody = createElement("tbody");
        let headerRow1 = createElement("tr");
        let headerRow2 = createElement("tr");
        let headerRow3 = createElement("tr");
        let headerRow4 = createElement("tr");

        // Header row 1
        let nameHeader = createElement("th", "Name");
        nameHeader.addClass("name-header");
        nameHeader.addClass("table-header");
        nameHeader.attribute("rowspan", "4");
        headerRow1.child(nameHeader);
        let availabilityHeader = createElement("th", "Availability");
        availabilityHeader.addClass("table-header");
        availabilityHeader.attribute("colspan", times.length);
        headerRow1.child(availabilityHeader);
        thead.child(headerRow1);

        // Header row 2
        let weeks = Array.from(times).map((time) => time.week + 1);
        let uniqueWeeks = [...new Set(weeks)];
        for (let week of uniqueWeeks) {
            let weekHeader = createElement("th", `Week ${week}`);
            weekHeader.addClass("table-header");
            weekHeader.attribute("colspan", weeks.filter((w) => w === week).length);
            headerRow2.child(weekHeader);
        }
        thead.child(headerRow2);

        // Header row 4
        Array.from(times).forEach((time) => {
            let timeslotHeader = createElement("th", `${time.day.substring(0, 3)}<br>${time.timeslot}`);
            timeslotHeader.addClass("table-header");
            headerRow4.child(timeslotHeader);
        });
        thead.child(headerRow4);

        // Append thead and tbody to the table
        table.child(thead);
        table.child(tbody);

        // Iterate through each player in the players array
        this.players.forEach((player, playerIndex) => {
            player.checkboxes = [];
            // Create a new row for each player
            const row = createElement("tr");
            tbody.child(row);

            // Populate the row with the player's data
            createTableCell(row, player.fullName);

            Array.from(times).forEach((time) => {
                let checkboxCell = createElement("td");
                checkboxCell.addClass("checkbox-cell");
                let checkbox = createCheckbox("", true);
                checkbox.parent(checkboxCell);
                row.child(checkboxCell);
                player.checkboxes.push(checkbox);
            });
            for (let i = 0; i < min(player.checkboxes.length, player.availability.length); i++) {
                // console.log(player.availability[i]);
                player.checkboxes[i].checked(player.availability[i]);
            }
        });

        // Append the table to the parent element
        parent.child(table);
    }

    /*********************************
     * SAVE OPERATIONS *
     *********************************/

    savePlayerData() {
        // Map over the players array to create a new array of updated player data
        const updatedPlayers = this.players.map((player) => {
            const availability = player.checkboxes ? player.checkboxes.map((checkbox) => checkbox.checked()) : "unk";

            // Return an object containing the player's updated data
            return {
                firstName: player.firstName,
                lastName: player.lastName,
                fullName: player.fulName,
                contact: player.contact,
                availability: availability,
                unsecureID: player.unsecureID,
            };
        });

        // Stringify the updated player data and print it to the console
        const jsonData = JSON.stringify(updatedPlayers, null, 2);
        console.log(jsonData);

        // Save the updated player data as a JSON file
        saveJSON(updatedPlayers, "playerData.json");

        // Display a success message
        this.showSaveStatus("Player data saved!", "green");
    }

    showSaveStatus(message, color) {
        // Set the text of the playerDataSaveStatus HTML element to the provided message
        this.playerDataSaveStatus.html(message);

        // Set the color of the playerDataSaveStatus HTML element to the provided color
        this.playerDataSaveStatus.style("color", color);

        // Set the display style of the playerDataSaveStatus HTML element to "block" to make it visible
        this.playerDataSaveStatus.style("display", "block");
    }
}
