// summarise schedule:
// list of names, repeat opponents, repeat teammates, captain count, missed weeks, consecutive missed weeks, total number of matches,
// list of broken rules (consecutive weeks)
// 4 matches minimum accross the 6 weeks
// history w.r.t time (favor older team mate / opponents if required to be teammate)

//TODO: players occasionally getting duplicated to mukltiple matches.

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

const CONSTANTS = {
    PLAYERS_PER_MATCH: 4,
    MINIMUM_REQUIRED_MATCHES: 4,
    ALLOWED_REPEATED_ATTEMPTS: 15,
    MINIMUM_REQUIRED_CAPTAIN: 1,
};

// Tennis League Matchmaking Tool
class Scheduler {
    constructor() {
        this.players = [];
        this.gameSchedule = [];
        this.numWeeks;
        this.numMatchesPerWeek;
        this.modeHandOff = -1;
        this.generated = false;
        // this.img = createGraphics(612, 792);
        this.img = createGraphics(1275, 1650);
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
            this.generated = true;
            this.generateSchedule();
            let res = this.generateReportCard();

            for (let i = 0; i < CONSTANTS.ALLOWED_REPEATED_ATTEMPTS; i++) {
                console.log(i);
                if (this.ruleCheck(res)) {
                    break;
                } else {
                    this.gameSchedule = [];
                    this.generateSchedule();
                    res = this.generateReportCard();
                }
            }
            console.table(res);
            const inter = new Interpreter(this.players, this.gameSchedule, this.img);
            // this.logSchedule();
            inter.drawPoster();
        }
    }

    initializePlayerStats() {
        // Initialize player statistics
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].gamesPlayed = 0;
            this.players[i].gamesCaptained = 0;
            this.players[i].gamesMissed = 0;
            this.players[i].weeksMissed = [];
            this.players[i].teammates = [];
            this.players[i].opponents = [];
            this.players[i].availability = this.players[i].checkboxes.map((checkbox) => checkbox.checked());

            // calculate unavailableScore
            this.players[i].unavailableScore = 0; // start with 0
            this.players[i].availability.forEach((available) => {
                if (!available) {
                    // if player is not available for a day
                    this.players[i].unavailableScore++; // increase unavailableScore by 1
                }
            });
        }
    }

    generateSchedule() {
        this.initializePlayerStats();
        // Create game schedule
        for (let week = 0; week < this.numWeeks; week++) {
            const matches = [];

            const selectedPlayers = this.getAvailablePlayers(week, this.players);
            const playerGroups = this.createPlayerGroups(selectedPlayers);
            const captains = this.selectCaptains(playerGroups);

            for (let i = 0; i < playerGroups.length; i++) {
                const playersInMatch = playerGroups[i];
                const captain = captains[i];
                const teams = this.createTeams(playersInMatch);
                this.rememberTeams(teams);

                // Update player statistics
                playersInMatch.forEach((player) => {
                    player.gamesPlayed++;
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

    rememberTeams(teams) {
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams.length; j++) {
                teams[i][j].teammates.push(teams[i][int(!j)]);
                teams[i][j].opponents.push(teams[int(!i)][j]);
                teams[i][j].opponents.push(teams[int(!i)][int(!j)]);
            }
        }
    }

    getAvailablePlayers(week, players) {
        let availablePlayers = players.filter((player) => player.availability[week]);
        availablePlayers = shuffle(availablePlayers);

        let notSelectedPlayers = players.filter((player) => !player.availability[week]);
        let numPlayersNeeded = this.numMatchesPerWeek * CONSTANTS.PLAYERS_PER_MATCH;

        const selectedPlayers = [];
        const remainingAvailablePlayers = [];

        availablePlayers.forEach((player) => {
            if (
                player.weeksMissed.includes(week - 1) ||
                player.availability[week + 1] === false ||
                (this.numMatchesPerWeek * week > CONSTANTS.MINIMUM_REQUIRED_MATCHES &&
                    player.gamesPlayed < CONSTANTS.MINIMUM_REQUIRED_MATCHES)
            ) {
                selectedPlayers.push(player);
            } else {
                remainingAvailablePlayers.push(player);
            }
        });
        availablePlayers = remainingAvailablePlayers;
        availablePlayers.sort((a, b) => a.unavailableScore - b.unavailableScore);
        const numAvailablePlayers = selectedPlayers.length + availablePlayers.length;

        while (numAvailablePlayers < numPlayersNeeded) {
            numPlayersNeeded -= CONSTANTS.PLAYERS_PER_MATCH;
        }

        if (numAvailablePlayers >= numPlayersNeeded) {
            while (selectedPlayers.length < numPlayersNeeded) {
                selectedPlayers.push(availablePlayers.pop());
                // const randomIndex = Math.floor(Math.random() * availablePlayers.length);
                // const randomPlayer = availablePlayers.splice(randomIndex, 1)[0];
                // selectedPlayers.push(randomPlayer);
            }
        } else {
            console.warn(`Not enough players available for week ${week}`);
        }

        while (selectedPlayers.length % 4 != 0) {
            let maxIndex = 0;
            for (let i = 1; i < selectedPlayers.length; i++) {
                if (selectedPlayers[i].gamesPlayed > selectedPlayers[maxIndex].gamesPlayed) {
                    maxIndex = i;
                }
            }
            selectedPlayers.splice(maxIndex, 1);
        }
        while (selectedPlayers.length > numPlayersNeeded) {
            notSelectedPlayers.push(selectedPlayers.pop());
        }

        notSelectedPlayers = notSelectedPlayers.concat(availablePlayers);

        notSelectedPlayers.forEach((player) => {
            player.weeksMissed.push(week);
            player.gamesMissed++;
        });

        return selectedPlayers;
    }

    hasHistory(player1, player2) {
        const res = player1.teammates.includes(player2) || player1.opponents.includes(player2);
        return res;
    }

    createPlayerGroups(selectedPlayers) {
        const numPlayersNeeded = selectedPlayers.length;
        const numGroups = numPlayersNeeded / CONSTANTS.PLAYERS_PER_MATCH;
        let playerGroups = new Array(numGroups).fill(null).map(() => []);

        // First round: assign one player to each group
        for (let i = 0; i < numGroups; i++) {
            playerGroups[i].push(selectedPlayers.pop());
        }

        // Assign remaining players to groups with the least common history
        while (selectedPlayers.length > 0) {
            // Select player
            let player = selectedPlayers.pop();

            // Calculate strangeness scores for each group that hasn't reached its maximum size
            let strangenessScores = playerGroups
                .map((group, index) => {
                    return group.length < CONSTANTS.PLAYERS_PER_MATCH
                        ? {
                              index: index,
                              score: group.reduce((count, otherPlayer) => {
                                  return count + (this.hasHistory(player, otherPlayer) ? 0 : 1);
                              }, 0),
                          }
                        : null;
                })
                .filter(Boolean); // filter out null scores

            // Find group with the least history with the current player
            let leastCommonHistoryGroupIndex = strangenessScores.sort((a, b) => a.score - b.score)[0].index;

            // Add player to the group with the least common history
            playerGroups[leastCommonHistoryGroupIndex].push(player);
        }

        // Check if any group is overfilled and correct it
        let overfilledGroups = playerGroups.filter((group) => group.length > CONSTANTS.PLAYERS_PER_MATCH);
        let underfilledGroups = playerGroups.filter((group) => group.length < CONSTANTS.PLAYERS_PER_MATCH);
        while (overfilledGroups.length > 0 && underfilledGroups.length > 0) {
            let overfilledGroup = overfilledGroups[0];
            let underfilledGroup = underfilledGroups[0];
            // Move player from overfilled group to underfilled group
            underfilledGroup.push(overfilledGroup.pop());

            // Update the overfilled and underfilled groups arrays
            overfilledGroups = playerGroups.filter((group) => group.length > CONSTANTS.PLAYERS_PER_MATCH);
            underfilledGroups = playerGroups.filter((group) => group.length < CONSTANTS.PLAYERS_PER_MATCH);
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

        for (let captain of captains) {
            let ci = this.players.findIndex(
                (player) => player.firstName === captain.firstName && player.lastName === captain.lastName
            );
            this.players[ci].gamesCaptained += 1;
        }
        return captains;
    }

    createTeams(playersInMatch) {
        // Shallow copy the players array to avoid mutating the original
        let players = [...playersInMatch];

        // Randomize the players array
        players.sort(() => Math.random() - 0.5);

        // Initially divide players into two random teams
        let team1 = [players[0], players[1]];
        let team2 = [players[2], players[3]];

        // Set the maximum number of iterations to avoid infinite loops
        let maxIterations = 5;
        let iteration = 0;

        // Iterate until a good arrangement is found or the limit is reached
        while (iteration < maxIterations) {
            iteration++;

            // Count the number of problematic pairings
            let badTeammates = this.countBadPairs(team1, "teammates") + this.countBadPairs(team2, "teammates");
            let badOpponents = this.countBadPairs(team1.concat(team2), "opponents");

            // If there are no problems, return the teams
            if (badTeammates === 0 && badOpponents === 0) {
                return [team1, team2];
            }

            // Swap a random pair of players between the teams
            let swapIndex1 = Math.floor(Math.random() * team1.length);
            let swapIndex2 = Math.floor(Math.random() * team2.length);
            [team1[swapIndex1], team2[swapIndex2]] = [team2[swapIndex2], team1[swapIndex1]];
        }

        // If a perfect arrangement was not found, just return the last one
        return [team1, team2];
    }

    // Helper function to count how many times player1.history.includes(player2) for each pair in a list
    countBadPairs(list, history) {
        let count = 0;
        for (let i = 0; i < list.length - 1; i++) {
            for (let j = i + 1; j < list.length; j++) {
                if (list[i][history].includes(list[j])) {
                    count++;
                }
            }
        }
        return count;
    }

    getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    generateReportCard() {
        const reportCards = this.players.map((player) => {
            const totalGamesPlayed = player.gamesPlayed;
            const totalGamesMissed = player.gamesMissed;

            // Compute longest consecutive streak of missed games that are not due to availability
            const missedWeeksNotDueToAvailability = player.weeksMissed.filter(
                (week) => player.availability[week - 1] === true
            );
            let longestMissingStreak = 0;
            let currentStreak = 0;
            for (let i = 1; i < missedWeeksNotDueToAvailability.length; i++) {
                if (missedWeeksNotDueToAvailability[i] - missedWeeksNotDueToAvailability[i - 1] === 1) {
                    currentStreak++;
                } else {
                    longestMissingStreak = Math.max(longestMissingStreak, currentStreak);
                    currentStreak = 0;
                }
            }
            longestMissingStreak = Math.max(longestMissingStreak, currentStreak); // consider the last streak

            const gamesCaptained = player.gamesCaptained;

            // Compute how often the player had the same team mate
            const teammateCounts = player.teammates.reduce((counts, teammate) => {
                const key = `${teammate.firstName} ${teammate.lastName}`;
                counts[key] = (counts[key] || 0) + 1;
                return counts;
            }, {});
            const maxSameTeammate = Math.max(...Object.values(teammateCounts));

            // Compute how often the player had the same opponent
            const opponentCounts = player.opponents.reduce((counts, opponent) => {
                const key = `${opponent.firstName} ${opponent.lastName}`;
                counts[key] = (counts[key] || 0) + 1;
                return counts;
            }, {});
            const maxSameOpponent = Math.max(...Object.values(opponentCounts));

            return {
                fullName: player.fullName,
                totalGamesPlayed,
                totalGamesMissed,
                longestMissingStreak,
                gamesCaptained,
                maxSameTeammate,
                maxSameOpponent,
            };
        });
        return reportCards;
    }

    ruleCheck(reportCard) {
        let passed = true;
        for (let r of reportCard) {
            if (r.totalGamesPlayed < CONSTANTS.MINIMUM_REQUIRED_MATCHES) {
                passed = false;
            }
            if (r.gamesCaptained < CONSTANTS.MINIMUM_REQUIRED_CAPTAIN) {
                passed = false;
            }

            // include a total avoidance method

        }
        return passed;
    }
}
