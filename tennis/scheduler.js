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

// Tennis League Matchmaking Tool
class Scheduler {
    constructor() {
        this.players = [];
        this.gameSchedule = [];
        this.numWeeks = 6;
        this.numMatchesPerWeek = 2;
        this.numPlayersPerMatch = 4;
        this.modeHandOff = -1;
        this.generated = false;
        this.img = createGraphics(612, 792);
        this.img.background(color("#CC6633"));
        // drawTennisCourt(this.img, this.img.width/2, this.img.height/2, 80, 120);
    }

    draw(availability) {
        this.generateUIResponse(availability);
        imageMode(CENTER);

        const maxWidth = 0.9 * (windowWidth - 340 * 2); // Remaining width after accounting for the border
        const maxHeight = 0.9 * windowHeight; // Using the full height

        const imgWidth = this.img.width;
        const imgHeight = this.img.height;

        const aspectRatio = imgWidth / imgHeight;

        let newWidth, newHeight;
        if (aspectRatio > 1) {
            // Landscape image
            newWidth = maxWidth;
            newHeight = maxWidth / aspectRatio;
        } else {
            // Portrait or square image
            newWidth = maxHeight * aspectRatio;
            newHeight = maxHeight;
        }

        const x = 400 * pixelDensity(); //windowWidth / 2 + 340; // Center X position
        const y = windowHeight / 2; // Center Y position
        imageMode(CENTER);
        image(this.img, x, y, newWidth, newHeight);
    }

    // to tell the user that something is happening
    generateUIResponse(availability) {
        if (!this.generated) {
            this.players = availability.players;

            // Draw a white box on the screen that says 'Generating Schedule'
            fill(255);
            rect(0, 0, width, height);
            textAlign(CENTER, CENTER);
            fill(0);
            text("Generating Schedule", width / 2, height / 2);
            this.generated = true;

            // Trigger the schedule generation function with a delay
            setTimeout(() => {
                this.generateSchedule();
                // this.logSchedule();
                this.drawPoster();
            }, 100); // Delay of 1000 milliseconds (adjust as needed)
        }
    }

    drawPoster() {
        this.img.background(color("#CC6633"));
        if (this.gameSchedule && Array.isArray(this.gameSchedule)) {
            let numOfWeeks = this.gameSchedule.length;

            // Define the border size
            let mainBorderSize = 20;
            let innerBorderSize = 10;

            // Find the most square-like configuration
            let optimalCols = 1;
            let optimalRows = numOfWeeks;
            let optimalRatio = this.img.width / this.img.height; // Start with canvas ratio
            for (let cols = 1; cols <= numOfWeeks; cols++) {
                let rows = Math.ceil(numOfWeeks / cols);
                let cellWidth = (this.img.width - mainBorderSize * (cols + 1)) / cols;
                let cellHeight = (this.img.height - mainBorderSize * (rows + 1)) / rows;
                let ratio = cellWidth / cellHeight;
                // If this ratio is closer to 1 than the optimal ratio, update the optimal configuration
                if (Math.abs(1 - ratio) < Math.abs(1 - optimalRatio)) {
                    optimalCols = cols;
                    optimalRows = rows;
                    optimalRatio = ratio;
                }
            }

            // Calculate dimensions of each rectangle based on optimal configuration
            let rectWidth = (this.img.width - mainBorderSize * (optimalCols + 1)) / optimalCols;
            let rectHeight = (this.img.height - mainBorderSize * (optimalRows + 1)) / optimalRows;

            let mainGrid = [];
            this.img.textSize(18);
            this.img.textAlign(CENTER, CENTER);
            // Loop through each rectangle in grid
            for (let i = 0; i < optimalRows; i++) {
                for (let j = 0; j < optimalCols; j++) {
                    // Check if we have not exceeded numOfWeeks
                    if (numOfWeeks > 0) {
                        const x = mainBorderSize + j * (rectWidth + mainBorderSize);
                        const y = mainBorderSize + i * (rectHeight + mainBorderSize);
                        mainGrid.push({
                            x: x,
                            y: y,
                            w: rectWidth,
                            h: rectHeight,
                            tx: x + rectWidth / 2,
                            ty: y + this.img.textSize(),
                        });
                        this.img.noFill();
                        this.img.stroke(230, 150, 100);
                        this.img.rect(x, y, rectWidth, rectHeight);
                        numOfWeeks--;
                    }
                }
            }

            this.img.noStroke();
            this.img.fill(255);
            // Loop through mainGrid and draw rectangles
            for (let i = 0; i < mainGrid.length; i++) {
                this.img.textSize(18);
                this.img.fill(255);
                this.img.text("Week " + String(i+1), mainGrid[i].tx, mainGrid[i].ty);

                // Get number of games in this week
                let numGames = this.gameSchedule[i].length;
                const shrinker = 0.5;

                // Define your desired width to height ratio
                let desiredRatio = 2 / 3; // width/height

                // Calculate optimal number of rows and columns for inner grid
                let numGamesTemp = numGames;
                let optimalInnerCols = Math.round(Math.sqrt(numGamesTemp / desiredRatio));
                let optimalInnerRows = Math.ceil(numGamesTemp / optimalInnerCols);

                let availableWidth = mainGrid[i].w - innerBorderSize * (optimalInnerCols + 1);
                let availableHeight = mainGrid[i].h - innerBorderSize * (optimalInnerRows + 1);

                let rawInnerWidth = availableWidth / optimalInnerCols;
                let rawInnerHeight = availableHeight / optimalInnerRows;

                // Maintaining the aspect ratio of the desired ratio
                let innerWidth, innerHeight;
                if (rawInnerWidth / rawInnerHeight > desiredRatio) {
                    // height is the limiting factor
                    innerHeight = rawInnerHeight;
                    innerWidth = innerHeight * desiredRatio;
                } else {
                    // width is the limiting factor
                    innerWidth = rawInnerWidth;
                    innerHeight = innerWidth / desiredRatio;
                }

                innerWidth *= shrinker;
                innerHeight *= shrinker;

                // Calculate the total width and height of the tennis courts without borders
                let totalCourtsWidth = optimalInnerCols * innerWidth;
                let totalCourtsHeight = optimalInnerRows * innerHeight;

                // Calculate the remaining width and height in the grid cell after placing the courts
                let remainingWidth = mainGrid[i].w - totalCourtsWidth;
                let remainingHeight = mainGrid[i].h - totalCourtsHeight;

                // Calculate the new border size based on the remaining space
                // There are (optimalInnerCols + 1) horizontal borders and (optimalInnerRows + 1) vertical borders
                let horizontalBorderSize = Math.max(10, remainingWidth / (optimalInnerCols + 1));
                let verticalBorderSize = Math.max(10, remainingHeight / (optimalInnerRows + 1));

                let totalInnerWidth = innerWidth * optimalInnerCols + horizontalBorderSize * (optimalInnerCols - 1);
                let totalInnerHeight = innerHeight * optimalInnerRows + verticalBorderSize * (optimalInnerRows - 1);

                let startX = mainGrid[i].x + (mainGrid[i].w - totalInnerWidth) / 2;
                let startY = this.img.textSize() * 0.5 + mainGrid[i].y + (mainGrid[i].h - totalInnerHeight) / 2;

                // Loop through each rectangle in inner grid
                this.img.textSize(10);
                for (let j = 0; j < optimalInnerRows; j++) {
                    for (let k = 0; k < optimalInnerCols; k++) {
                        // Check if we have not exceeded numGames
                        if (numGamesTemp > 0) {
                            console.log(this.gameSchedule[i][j + k].captains[0]);
                            // Calculate x, y, w, h
                            let x = startX + k * (innerWidth + horizontalBorderSize);
                            let y = startY + j * (innerHeight + verticalBorderSize);
                            let tyTop = y - this.img.textSize() * 2.5;
                            let tyBottom = y + innerHeight + 1.5 * this.img.textSize();
                            for (let team = 0; team < 2; team++) {
                                let ty = team == 0 ? tyTop : tyBottom;
                                for (let player = 0; player < 2; player++) {
                                    if (
                                        this.gameSchedule[i][j + k].captains[0].firstName ==
                                        this.gameSchedule[i][j + k].teams[team][player].firstName
                                    ) {
                                        this.img.fill(255, 255, 0);
                                    } else {
                                        this.img.fill(255);
                                    }
                                    this.img.text(
                                        this.gameSchedule[i][j + k].teams[team][player].firstName +
                                            " " +
                                            this.gameSchedule[i][j + k].teams[team][player].lastName,
                                        x + innerWidth / 2,
                                        ty
                                    );
                                    ty += this.img.textSize() * 1.5;
                                }
                                if (team == 0) {
                                    tyTop = ty;
                                } else {
                                    tyBottom = ty;
                                }
                            }

                            // let ty = y-textSize() * 2.5;
                            // if (this.gameSchedule[i][j + k].captains[0].firstName == this.gameSchedule[i][j + k].teams[0][0].firstName) {
                            //     this.img.fill(255, 255, 0);
                            // } else {
                            //     this.img.fill(255);
                            // }
                            // this.img.text(this.gameSchedule[i][j + k].teams[0][0].firstName + " " + this.gameSchedule[i][j + k].teams[0][0].lastName, x + innerWidth/2, ty);
                            // ty += this.img.textSize() * 1.5;
                            // if (this.gameSchedule[i][j + k].captains[0].firstName == this.gameSchedule[i][j + k].teams[0][1].firstName) {
                            //     this.img.fill(255, 255, 0);
                            // } else {
                            //     this.img.fill(255);
                            // }
                            // this.img.text(this.gameSchedule[i][j + k].teams[0][1].firstName + " " + this.gameSchedule[i][j + k].teams[0][1].lastName, x + innerWidth/2, ty);
                            // ty = y + innerHeight + 1.5 * this.img.textSize();
                            // if (this.gameSchedule[i][j + k].captains[0].firstName == this.gameSchedule[i][j + k].teams[1][0].firstName) {
                            //     this.img.fill(255, 255, 0);
                            // } else {
                            //     this.img.fill(255);
                            // }
                            // this.img.text(this.gameSchedule[i][j + k].teams[1][0].firstName + " " + this.gameSchedule[i][j + k].teams[1][0].lastName, x + innerWidth/2, ty);
                            // ty += this.img.textSize() * 1.5;
                            // if (this.gameSchedule[i][j + k].captains[0].firstName == this.gameSchedule[i][j + k].teams[1][1].firstName) {
                            //     this.img.fill(255, 255, 0);
                            // } else {
                            //     this.img.fill(255);
                            // }
                            // this.img.text(this.gameSchedule[i][j + k].teams[1][1].firstName + " " + this.gameSchedule[i][j + k].teams[1][1].lastName, x + innerWidth/2, ty);

                            // Draw the inner rectangle
                            drawTennisCourt(this.img, x, y, innerWidth, innerHeight);
                            numGamesTemp--;
                        }
                    }
                }
            }
        }
    }

    logSchedule() {
        if (this.gameSchedule && Array.isArray(this.gameSchedule)) {
            for (let week = 0; week < this.gameSchedule.length; week++) {
                const matches = this.gameSchedule[week];
                console.log(`Week ${week + 1}`);

                if (matches && Array.isArray(matches)) {
                    matches.forEach((match, matchIndex) => {
                        console.log(`Match ${matchIndex}`);
                        console.log(`Captain: ${match?.captains[0]?.firstName || "N/A"}`);

                        const team0Players = match?.teams[0];
                        const team1Players = match?.teams[1];

                        if (Array.isArray(team0Players)) {
                            const team0Names = team0Players.map((player) => player?.firstName);
                            const team0Display = team0Names && team0Names.length ? team0Names.join(", ") : "N/A";
                            console.log(`Team 0: ${team0Display}`);
                        } else {
                            console.log("Team 0: N/A");
                        }

                        if (Array.isArray(team1Players)) {
                            const team1Names = team1Players.map((player) => player?.firstName);
                            const team1Display = team1Names && team1Names.length ? team1Names.join(", ") : "N/A";
                            console.log(`Team 1: ${team1Display}`);
                        } else {
                            console.log("Team 1: N/A");
                        }
                    });
                } else {
                    console.log("No matches found for this week.");
                }
            }
        } else {
            console.log("No game schedule available.");
        }
    }

    generateSchedule() {
        // Initialize player statistics
        this.players.forEach((player) => {
            player.gamesPlayed = 0;
            player.gamesCaptained = 0;
            player.gamesMissed = 0;
            player.weeksMissed = [];
            player.teammates = [];
            player.opponents = [];
        });

        // Create game schedule
        for (let week = 0; week < this.numWeeks; week++) {
            const matches = [];

            const selectedPlayers = this.getAvailablePlayers(week);
            const playerGroups = this.createPlayerGroups(selectedPlayers);
            const captains = this.selectCaptains(playerGroups);

            for (let i = 0; i < playerGroups.length; i++) {
                const playersInMatch = playerGroups[i];
                const captain = captains[i];
                const teams = this.createTeams(playersInMatch, captain);

                // Update player statistics
                playersInMatch.forEach((player) => {
                    player.gamesPlayed++;
                    player.gamesCaptained = player === captain ? 1 : 0;
                });

                // Add match to the schedule
                matches.push({
                    week: week + 1,
                    matchNumber: i + 1,
                    players: playersInMatch,
                    captains: [captain],
                    teams: teams,
                });
            }

            // Add matches to the game schedule
            this.gameSchedule.push(matches);
        }
    }

    getAvailablePlayers(week) {
        let availablePlayers = this.players.filter((player) => player.availability[week]);
        availablePlayers = shuffle(availablePlayers);

        let notSelectedPlayers = this.players.filter((player) => !player.availability[week]);

        const selectedPlayers = [];
        const remainingAvailablePlayers = [];

        availablePlayers.forEach((player) => {
            if (player.weeksMissed.includes(week - 1)) {
                selectedPlayers.push(player);
            } else {
                remainingAvailablePlayers.push(player);
            }
        });
        availablePlayers = remainingAvailablePlayers;

        const numAvailablePlayers = selectedPlayers.length + availablePlayers.length;
        let numPlayersNeeded = this.numMatchesPerWeek * this.numPlayersPerMatch;

        while (numAvailablePlayers < numPlayersNeeded) {
            numPlayersNeeded -= 4;
        }

        if (numAvailablePlayers >= numPlayersNeeded) {
            while (selectedPlayers.length < numPlayersNeeded) {
                const randomIndex = Math.floor(Math.random() * availablePlayers.length);
                const randomPlayer = availablePlayers.splice(randomIndex, 1)[0];
                selectedPlayers.push(randomPlayer);
            }
        } else {
            console.warn(`Not enough players available for week ${week}`);
        }

        notSelectedPlayers = notSelectedPlayers.concat(availablePlayers);

        notSelectedPlayers.forEach((player) => {
            player.weeksMissed.push(week);
        });

        return selectedPlayers;
    }

    createPlayerGroups(selectedPlayers) {
        const numPlayersNeeded = selectedPlayers.length;
        const numGroups = numPlayersNeeded / this.numPlayersPerMatch;

        const playerGroups = [];

        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * this.numPlayersPerMatch;
            const endIndex = startIndex + this.numPlayersPerMatch;
            const group = selectedPlayers.slice(startIndex, endIndex);

            // Perform swapping logic based on teammates and opponents arrays
            const numSwaps = 4;
            let swapsRemaining = numSwaps;

            while (swapsRemaining > 0) {
                let swapped = false;

                for (let j = 0; j < group.length; j++) {
                    const player1 = group[j];

                    for (let k = j + 1; k < group.length; k++) {
                        const player2 = group[k];

                        if (player1.teammates.includes(player2) || player2.teammates.includes(player1)) {
                            // Swap players within the group
                            group[j] = player2;
                            group[k] = player1;

                            swapped = true;
                            swapsRemaining--;
                            break;
                        }
                    }

                    if (swapped) {
                        break;
                    }
                }

                if (!swapped) {
                    break;
                }
            }
            playerGroups.push(group);
        }

        return playerGroups;
    }

    selectCaptains(playerGroups) {
        const captains = [];

        playerGroups.forEach((group) => {
            const minGamesCaptained = Math.min(...group.map((player) => player.gamesCaptained));
            const playersWithLowestCaptains = group.filter((player) => player.gamesCaptained === minGamesCaptained);
            const captain = this.getRandomElement(playersWithLowestCaptains);
            captains.push(captain);
        });

        return captains;
    }

    createTeams(playersInMatch, captain) {
        const teams = [[captain], []];
        playersInMatch.forEach((player) => {
            if (player !== captain) {
                const availableTeams = teams.filter(
                    (team) => !team.includes(player) && team.length < this.numPlayersPerMatch - 1
                );

                if (availableTeams.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableTeams.length);
                    const selectedTeam = availableTeams[randomIndex];
                    selectedTeam.push(player);
                    player.teammates.push(player);
                } else {
                    // If no available teams, assign the player to a random team
                    const randomIndex = Math.floor(Math.random() * 2);
                    teams[randomIndex].push(player);
                    player.teammates.push(player);
                }
            }
        });

        // Check and adjust teams if necessary
        teams.forEach((team) => {
            if (team.length > 2) {
                const randomIndex = Math.floor(Math.random() * team.length);
                const playerToMove = team.splice(randomIndex, 1)[0];

                // Find a team with fewer than 2 players
                const targetTeam = teams.find((t) => t.length < 2);
                if (targetTeam) {
                    targetTeam.push(playerToMove);
                    playerToMove.teammates.push(playerToMove);
                }
            }
        });

        return teams;
    }

    getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}
