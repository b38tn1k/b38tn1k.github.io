// summarise schedule:
// list of names, repeat opponents, repeat teammates, captain count, missed weeks, consecutive missed weeks, total number of matches,
// list of broken rules (consecutive weeks)
// 4 matches minimum accross the 6 weeks
// history w.r.t time (favor older team mate / opponents if required to be teammate)

//TODO: players occasionally getting duplicated to mukltiple matches.

const CONSTANTS = {
    PLAYERS_PER_MATCH: 4,
    MINIMUM_REQUIRED_MATCHES: 4,
    ALLOWED_REPEATED_ATTEMPTS: 0, //15,
    MINIMUM_REQUIRED_CAPTAIN: 1,
};

// Tennis League Matchmaking Tool
class Scheduler {
    constructor() {
        this.players = [];
        this.gameSchedule = [];
        this.gameAvailability = [];
        this.weeksInSession;
        this.matchesPerWeek;
        this.courtsPerTimeSlot;
        this.modeHandOff = -1;
        this.generated = false;
        // this.img = createGraphics(612, 792);
        this.img = createGraphics(1275, 1650);
        this.img.background(color("#CC6633"));
        // drawTennisCourt(this.img, this.img.width/2, this.img.height/2, 80, 120);
    }

    draw() {
        this.generateUIResponse();
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

    resetGameSchedule() {
        this.gameSchedule = [];
        for (let i = 0; i < this.gameAvailability.length; i++) {
            let copiedGame = Object.assign(this.gameAvailability[i]);
            this.gameSchedule.push(copiedGame);
        }
        let old = { day: "notaday", timeslot: -1, week: -1 };
        let timeslotIndexMap = [];
        let tsIMi = -1;
        for (let game of this.gameSchedule) {
            if (game.day != old.day || game.timeslot != old.timeslot || game.week != old.week) {
                tsIMi++;
                timeslotIndexMap.push(0);
                old = { day: game.day, timeslot: game.timeslot, week: game.week };
            }
            timeslotIndexMap[tsIMi]++;
        }
        timeslotIndexMap = timeslotIndexMap.flatMap((num) => Array(num).fill(num));

        for (let i = 0; i < timeslotIndexMap.length; i++) {
            this.gameSchedule[i].concurrentGamesInTimeSlot = timeslotIndexMap[i];
        }
    }

    reset(gameAvailability, players) {
        this.gameAvailability = [];
        for (let i = 0; i < gameAvailability.length; i++) {
            for (let game of gameAvailability[i]) {
                let copiedGame = Object.assign(game);
                this.gameAvailability.push(copiedGame);
            }
        }
        this.resetGameSchedule();
        this.generated = false;
        this.players = players;
        this.weeksInSession = gameAvailability.length;
        this.matchesPerWeek = gameAvailability[0].length;
    }

    // to tell the user that something is happening
    generateUIResponse() {
        if (!this.generated) {
            this.generated = true;
            this.generateSchedule();
            let res = this.generateReportCard();
            let attempts = 0;

            while (attempts < CONSTANTS.ALLOWED_REPEATED_ATTEMPTS) {
                if (this.ruleCheck(res)) {
                    break;
                } else {
                    this.resetGameSchedule();
                    this.generateSchedule();
                    res = this.generateReportCard();
                    attempts++;
                }
            }

            let roster = [];
            for (let game of this.gameSchedule) {
                if (game.hasGame) {
                    roster.push({
                        timeslot: `Week ${game.week} ${game.day} ${game.timeslot} ${game.court}`,
                        captain: game.captain.fullName,
                        team1: game.teams[0].map(team => team.fullName).join(", "),
                        team2: game.teams[1].map(team => team.fullName).join(", "),
                    });
                }
            }
            console.table(roster);
            console.table(res);
            console.log(`Schedule generated in ${attempts} attempts`);
            let totalGames = this.gameSchedule.length;
            let totalGamesWithHasGameTrue = this.gameSchedule.filter((game) => game.hasGame === true).length;
            let percentage = (totalGamesWithHasGameTrue / totalGames) * 100;
            console.log(`Court utilization is ${percentage}%`);
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
            this.players[i].unavailability = [];
            this.players[i].freeGamesMissed = 0;

            // calculate unavailableScore
            this.players[i].unavailableScore = 0; // start with 0
            let gameIndex = 0;
            for (let k = 0; k < this.players[i].availability.length; k++) {
                if (!this.players[i].availability[k]) {
                    // if player is not available for a day
                    this.players[i].unavailableScore++; // increase unavailableScore by 1

                    // also add all games in the current timeslot to the player's unavailability
                    // there may be multiple games per court
                    // let currentTimeslot = this.gameAvailability[gameIndex].timeslot;
                    // while (
                    //     gameIndex < this.gameAvailability.length &&
                    //     this.gameAvailability[gameIndex].timeslot === currentTimeslot
                    // ) {
                    //     this.players[i].unavailability.push(this.gameAvailability[gameIndex]);
                    //     gameIndex++;
                    // }
                } else {
                    // increment the gameIndex to the next unique timeslot
                    let currentTimeslot = this.gameAvailability[gameIndex].timeslot;
                    while (
                        gameIndex < this.gameAvailability.length &&
                        this.gameAvailability[gameIndex].timeslot === currentTimeslot
                    ) {
                        gameIndex++;
                    }
                }
            }
        }
    }

    generateSchedule() {
        this.initializePlayerStats();
        let timeslotIndex = 0;
        let gameIndex = 0;
        let weekIndex = 0;
        let dayIndex = 0;

        // Group the data by week, day, and timeslot
        let weeks = groupBy(this.gameAvailability, "week");

        // Iterate over each week
        for (let week in weeks) {
            let days = groupBy(weeks[week], "day");
            let unselectedPlayers = [];
            // Iterate over each day in the week
            for (let day in days) {
                let timeslots = groupBy(days[day], "timeslot");
                // Iterate over each timeslot in the day
                for (let timeslot in timeslots) {
                    const players = this.getAvailablePlayers(
                        timeslotIndex,
                        weekIndex,
                        timeslots[timeslot],
                        gameIndex,
                        this.players
                    );
                    players.notSelected.forEach((player) => {
                        if (!unselectedPlayers.find((p) => p.unsecureID === player.unsecureID)) {
                            // If player is not already in unselectedPlayers, add them
                            unselectedPlayers.push(player);
                        }
                    });
                    unselectedPlayers = unselectedPlayers.filter(
                        (a1) => !players.selected.some((a2) => JSON.stringify(a1) === JSON.stringify(a2))
                    );
                    const playerGroups = this.createPlayerGroups(players.selected);
                    const captains = this.selectCaptains(playerGroups);
                    let matches = [];
                    playerGroups.forEach((group, i) => {
                        const teams = this.createTeams(group);
                        matches.push({ captain: captains[i], teams: teams });
                        teams.forEach((team) => {
                            team.forEach((player) => {
                                player.gamesPlayed++;
                            });
                        });
                        this.rememberTeams(teams); // moved to use unsecureID
                    });
                    // timeslots[timeslot]
                    // Iterate over each court in the timeslot
                    for (let i = 0; i < timeslots[timeslot].length; i++) {
                        // game.court
                        if (matches[i]) {
                            this.gameSchedule[gameIndex].captain = matches[i].captain;
                            this.gameSchedule[gameIndex].teams = matches[i].teams;
                            this.gameSchedule[gameIndex].hasGame = true;
                        } else {
                            this.gameSchedule[gameIndex].hasGame = false;
                        }
                        gameIndex++; // increment game index
                    }
                    timeslotIndex++; // increment timeslot index
                }
                dayIndex++; //increment day index
            }
            for (let player of unselectedPlayers) {
                player.weeksMissed.push(week);
                player.gamesMissed++;
                if (player.tempAvailable) {
                    player.freeGamesMissed++;
                }
            }
            weekIndex++; // increment week index
        }
    }

    rememberTeams(teams) {
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams.length; j++) {
                teams[i][j].teammates.push(teams[i][int(!j)].unsecureID);
                teams[i][j].opponents.push(teams[int(!i)][j].unsecureID);
                teams[i][j].opponents.push(teams[int(!i)][int(!j)].unsecureID);
            }
        }
    }

    getAvailablePlayers(timeslotIndex, weekIndex, courts, gameIndex, players) {
        let availablePlayers = players.filter((player) => player.availability[timeslotIndex]);
        availablePlayers = shuffle(availablePlayers);

        let notSelectedPlayers = players.filter((player) => !player.availability[timeslotIndex]);
        let numPlayersNeeded = courts.length * CONSTANTS.PLAYERS_PER_MATCH;

        const selectedPlayers = [];
        const remainingAvailablePlayers = [];

        notSelectedPlayers.forEach((player) => {
            player.tempAvailable = false;
        });

        availablePlayers.forEach((player) => {
            player.tempAvailable = true;
            if (
                player.weeksMissed.includes(weekIndex - 1) ||
                player.availability[timeslotIndex + 1] === false ||
                player.availability[timeslotIndex + 2] === false ||
                (gameIndex > CONSTANTS.MINIMUM_REQUIRED_MATCHES &&
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
            }
        } else {
            console.warn(`Not enough players available for week ${weekIndex}`);
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

        return { selected: selectedPlayers, notSelected: notSelectedPlayers };
    }

    hasHistory(player1, player2) {
        const res = player1.teammates.includes(player2.unsecureID) || player1.opponents.includes(player2.unsecureID);
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

        // Use the maximum number of iterations to avoid infinite loops
        let iteration = 0;

        // Iterate until a good arrangement is found or the limit is reached
        while (iteration < CONSTANTS.ALLOWED_REPEATED_ATTEMPTS) {
            iteration++;
            // Count the number of problematic pairings
            let badTeammates = this.countBadPairs(team1, "teammates") + this.countBadPairs(team2, "teammates");
            // let badOpponents = this.countBadPairs(team1.concat(team2), "opponents");
            // If there are no problems, return the teams
            // if (badTeammates === 0 && badOpponents === 0) {
            if (badTeammates === 0) {
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
                if (list[i][history].includes(list[j].unsecureID)) {
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
