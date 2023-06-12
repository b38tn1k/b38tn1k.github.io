class Availability {
    constructor(players) {
        this.players = players;
        this.title = "Player Availabilities";
        this.matchesPerWeek = 2;
        this.weeksInSession = 6;
        this.jsonInputVisible = false;
        this.jsonInputField = null;
        this.matchesPerWeekSlider = null;
        this.weeksInSessionSlider = null;
        this.playerDataDiv = null;
        this.setup();
    }

    draw() {
        // Placeholder draw function, can be implemented as needed
    }

    toggleAllElements(show) {
        const elements = [
          select("#sidebar"),
          select("#matchesInAWeek"),
          select("#weeksInASession"),
          select("#loadPlayerData"),
          select("#JSONLoadInput"),
          select("#savePlayerData"),
          select("#playerDataDiv")
        ];
      
        elements.forEach((element) => {
          if (element) {
            element.style("display", show ? "block" : "none");
          }
        });
      }

    setup() {
        // Create the UI elements and set up the initial configuration
        const uiContainer = createDiv();
        uiContainer.id("sidebar");

        // Create the main heading
        this.createHeading(uiContainer, "Player Schedules");

        // Create the section for matches per week
        this.createMatchesInAWeekSection(uiContainer);

        // Create the section for weeks in a session
        this.createWeeksInASessionSection(uiContainer);

        // Create the section for loading player data
        this.createLoadPlayerDataSection(uiContainer);

        // Create the input section for JSON data
        this.createJSONLoadInput(uiContainer);

        this.createSavePlayerDataSection(uiContainer)

        // Create the player data div
        this.createPlayerDataDiv();
    }

    createHeading(parent, text) {
        // Create a heading element and add it to the parent container
        const heading = createElement("h1", text);
        heading.parent(parent);
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
                } else {
                    this.showLoadStatus("Players List Incomplete!", "red");
                    console.error("Invalid players list!");
                    this.saveDataButton.addClass("disabled");
                }
            } else {
                this.showLoadStatus("Invalid JSON format!", "red");
                console.error("Invalid JSON format!");
                this.saveDataButton.addClass("disabled");
            }
        } catch (error) {
            this.showLoadStatus("Error parsing JSON!", "red");
            console.error("Error parsing JSON:", error);
            this.saveDataButton.addClass("disabled");
        }
    }

    showLoadStatus(message, color) {
        // Show the load status message with the specified color
        this.jsonLoadStatus.html(message);
        this.jsonLoadStatus.style("color", color);
        this.jsonLoadStatus.style("display", "block");
    }

    updatePlayerData() {
        if (this.players.length === 0) {
            return;
        }
    
        this.clearPlayerData();
        const table = this.createTable();
        this.createTableHeader(table);
        this.createPlayerRows(table);
        this.createAddPlayerRow(table);
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

        const headerCells = ["First Name", "Last Name", "Contact"];
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
      
          this.createTableCell(row, player.firstName);
          this.createTableCell(row, player.lastName);
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
        actionsCell.parent(row);

        deleteButton.mousePressed(() => {
            const index = this.players.indexOf(player);
            if (index !== -1) {
                this.players.splice(index, 1);
                this.updatePlayerData();
            }
        });
    }

    createAddPlayerRow(table) {
        const addPlayerRow = createElement("tr");
        addPlayerRow.parent(table);

        const firstNameInput = createInput();
        const lastNameInput = createInput();
        const contactInput = createInput();
        const addPlayerButton = createButton("Add Player");

        const inputs = [firstNameInput, lastNameInput, contactInput];
        inputs.forEach((input) => {
            const tableCell = createElement("td");
            const cellInput = input.parent(tableCell);
            tableCell.parent(addPlayerRow);
        });

        Array(this.weeksInSession)
            .fill()
            .forEach(() => {
                const tableCell = createElement("td");
                tableCell.parent(addPlayerRow);
            });

        const addPlayerCell = createElement("td");
        addPlayerButton.parent(addPlayerCell);
        addPlayerCell.parent(addPlayerRow);

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
