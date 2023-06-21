// summarise schedule:
// list of names, repeat opponents, repeat teammates, captain count, missed weeks, consecutive missed weeks, total number of matches,
// list of broken rules (consecutive weeks)
// 4 matches minimum accross the 6 weeks
// history w.r.t time (favor older team mate / opponents if required to be teammate)

//TODO: players occasionally getting duplicated to mukltiple matches.

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
        this.gameAvailability = [];
        this.weeksInSession;
        this.matchesPerWeek;
        this.courtsPerTimeSlot;
        this.modeHandOff = -1;
        this.generated = false;
        this.twoGamesAllowable = false;
        this.fairSpread = true;
        this.reportDiv;
        this.showReportDiv;
        this.timeslotGI = [];
        this.dayGI = [];
        this.weekGI = [];
        this.meanUnavailabilityScore = 0;
        // this.img = createGraphics(612, 792);
        // this.img = createGraphics(1275, 1650);
        // this.img.background(color("#CC6633"));
        // drawTennisCourt(this.img, this.img.width/2, this.img.height/2, 80, 120);
    }

    draw() {
        this.generateUIResponse();
        // imageMode(CENTER);

        // const maxWidth = 0.9 * (windowWidth - 340 * 2); // Remaining width after accounting for the border
        // const maxHeight = 0.9 * windowHeight; // Using the full height

        // const imgWidth = this.img.width;
        // const imgHeight = this.img.height;

        // const aspectRatio = imgWidth / imgHeight;

        // let newWidth, newHeight;
        // if (aspectRatio > 1) {
        //     // Landscape image
        //     newWidth = maxWidth;
        //     newHeight = maxWidth / aspectRatio;
        // } else {
        //     // Portrait or square image
        //     newWidth = maxHeight * aspectRatio;
        //     newHeight = maxHeight;
        // }

        // const x = 400 * pixelDensity(); //windowWidth / 2 + 340; // Center X position
        // const y = windowHeight / 2; // Center Y position
        // imageMode(CENTER);
        // image(this.img, x, y, newWidth, newHeight);
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

    reset(gameAvailability, players, reportDiv, showDiv, twoGamesAllowable = false, fairSpread = false) {
        this.twoGamesAllowable = twoGamesAllowable;
        this.fairSpread = fairSpread;
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
        this.reportDiv = reportDiv;
        this.showReportDiv = showDiv;
        this.timeslotGI = [];
        this.dayGI = [];
        this.weekGI = [];
    }

    // to tell the user that something is happening
    generateUIResponse() {
        if (!this.generated) {
            this.generated = true;
            this.generateSchedule();
            let res = this.generateReportCard();
            let attempts = 0;

            while (attempts < CONSTANTS.ALLOWED_REPEATED_ATTEMPTS) {
                if (this.ruleCheck(res).passed) {
                    break;
                } else {
                    this.resetGameSchedule();
                    this.generateSchedule();
                    res = this.generateReportCard();
                    attempts++;
                }
            }

            // const inter = new Interpreter(this.players, this.gameSchedule, this.img);
            this.logSchedule(res, attempts);
            createTimeAndReportTables(
                this.reportDiv,
                this.simplifyGameSchedule(),
                res,
                this.computeCourtUtilization(),
                this.ruleCheck(res).failures
            );
            this.showReportDiv();
            // inter.drawPoster();
        }
    }

    simplifyGameSchedule() {
        let roster = [];
        for (let game of this.gameSchedule) {
            if (game.hasGame) {
                roster.push({
                    timeslot: `Week ${game.week} ${game.day} ${game.timeslot} ${game.court}`,
                    captain: game.captain.fullName,
                    team1: game.teams[0][0].fullName, //game.teams[0].map((team) => team.fullName).join(", "),
                    team12: game.teams[0][1].fullName, //game.teams[0].map((team) => team.fullName).join(", "),
                    team2: game.teams[1][0].fullName, //game.teams[1].map((team) => team.fullName).join(", "),
                    team22: game.teams[1][1].fullName, //game.teams[1].map((team) => team.fullName).join(", "),
                });
            }
        }
        return roster;
    }

    computeCourtUtilization() {
        let totalGames = this.gameSchedule.length;
        let totalGamesWithHasGameTrue = this.gameSchedule.filter((game) => game.hasGame === true).length;
        let percentage = (totalGamesWithHasGameTrue / totalGames) * 100;
        return percentage;
    }

    logSchedule(res, attempts) {
        let roster = this.simplifyGameSchedule();
        console.table(roster);
        console.table(res);
        console.log(`Schedule generated in ${attempts} attempts`);
        let percentage = this.computeCourtUtilization();
        console.log(`Court utilization is ${percentage}%`);
    }

    initializePlayerStats() {
        // Initialize player statistics
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].gamesPlayedAcc = 0;
            this.players[i].gamesCaptainedAcc = 0;
            this.players[i].freeGamesMissedAcc = 0;
            this.players[i].gamesMissedAcc = 0;
            this.players[i].unavailableScore = 0;

            this.players[i].missedGames = [];
            this.players[i].missedDays = [];
            this.players[i].missedWeeks = [];

            this.players[i].playedGames = [];
            this.players[i].playedDays = [];
            this.players[i].playedWeeks = [];

            this.players[i].teammates = [];
            this.players[i].opponents = [];

            // calculate unavailableScore
            this.players[i].unavailableScore = 0; // start with 0
            let gameIndex = 0;
            for (let k = 0; k < this.players[i].availability.length; k++) {
                if (!this.players[i].availability[k]) {
                    // if player is not available for a day
                    // increase unavailableScore by 1
                    this.players[i].unavailableScore++;
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
            // First, extract the gamesPlayed array from each player
            let gamesPlayedArray = this.players.map((player) => player.unavailableScore);

            // Calculate the mean
            let sum = gamesPlayedArray.reduce((accumulator, value) => accumulator + value, 0);
            this.meanUnavailabilityScore = sum / gamesPlayedArray.length;
        }
    }

    countGamesAndTimeslotsPerUniqueDay(gameSchedule) {
        let statsPerDay = {};

        gameSchedule.forEach((game) => {
            const uniqueDay = game.day + game.week;

            // Initialize the object for this day if it doesn't exist yet
            if (!statsPerDay[uniqueDay]) {
                statsPerDay[uniqueDay] = {
                    games: 0,
                    timeslots: new Set(),
                };
            }

            // Increase the number of games
            statsPerDay[uniqueDay].games += 1;

            // Add the timeslot to the set of unique timeslots
            statsPerDay[uniqueDay].timeslots.add(game.timeslot);
        });

        // Convert the unique timeslots from a set to a count
        for (let day in statsPerDay) {
            statsPerDay[day].timeslots = statsPerDay[day].timeslots.size;
        }

        return Object.values(statsPerDay);
    }

    processTimeslot(timeslot, timeslotIndex, weekIndex, gameIndex, dayIndex, unselectedPlayers) {
        this.timeslotGI = [];
        const players = this.getTimeSlotGroup(timeslotIndex, weekIndex, timeslot, gameIndex, dayIndex, this.players);
        // ADD UNSELECTED PLAYERS TO WEEK GROWING LIST
        players.notSelected.forEach((player) => {
            if (!unselectedPlayers.find((p) => p.unsecureID === player.unsecureID)) {
                // If player is not already in unselectedPlayers, add them
                unselectedPlayers.push(player);
            }
        });
        // FILTER WEEK GROWING LIST BY SELECTED PLAYERS (MAYBE THEY MISSED SESS #1)
        unselectedPlayers = unselectedPlayers.filter(
            (a1) => !players.selected.some((a2) => a1.unsecureID === a2.unsecureID)
        );
        // BUILD GROUPS OF DIVERSITY
        const playerGroups = this.createPlayerGroups(players.selected);
        // CHOOSE A CAPTAIN
        const captains = this.selectCaptains(playerGroups);
        // BUILD MATCHES
        const matches = this.buildMatches(playerGroups, captains, dayIndex);
        // ASSIGN THE MATCH TO A COURT
        gameIndex = this.assignMatchesToCourt(matches, timeslot.length, gameIndex, unselectedPlayers);
        timeslotIndex++;
        // console.log("Timeslot:\t", this.timeslotGI);
        return { timeslotIndex, gameIndex, unselectedPlayers };
    }

    buildMatches(playerGroups, captains, dayIndex) {
        let matches = [];
        playerGroups.forEach((group, i) => {
            const teams = this.createTeams(group);
            matches.push({ captain: captains[i], teams: teams });
            teams.forEach((team) => {
                team.forEach((player) => {
                    player.gamesPlayedAcc++;
                    player.playedDays.push(dayIndex);
                });
            });
            this.rememberTeams(teams);
        });
        return matches;
    }

    assignMatchesToCourt(matches, timeslotLength, gameIndex, unselectedPlayers) {
        for (let i = 0; i < timeslotLength; i++) {
            if (matches[i]) {
                this.gameSchedule[gameIndex].captain = matches[i].captain;
                this.gameSchedule[gameIndex].teams = matches[i].teams;
                this.gameSchedule[gameIndex].hasGame = true;
            } else {
                this.gameSchedule[gameIndex].hasGame = false;
            }
            this.timeslotGI.push(gameIndex);
            this.dayGI.push(gameIndex);
            this.weekGI.push(gameIndex);
            for (let p of unselectedPlayers) {
                p.missedGames.push(gameIndex);
                p.gamesMissedAcc++;
                if (p.tempAvailable) {
                    p.freeGamesMissedAcc++;
                }
            }
            gameIndex++;
        }
        return gameIndex;
    }

    processDay(day, timeslotIndex, weekIndex, gameIndex, dayIndex) {
        let unselectedPlayers = [];
        let timeslots = groupBy(day, "timeslot");
        for (let timeslot in timeslots) {
            let result = this.processTimeslot(
                timeslots[timeslot],
                timeslotIndex,
                weekIndex,
                gameIndex,
                dayIndex,
                unselectedPlayers
            );
            timeslotIndex = result.timeslotIndex;
            gameIndex = result.gameIndex;
            unselectedPlayers = result.unselectedPlayers;
        }
        // console.log("Days:\t", this.dayGI);
        this.addMissed(this.dayGI, "missedDays", dayIndex);
        dayIndex++;
        return { dayIndex, timeslotIndex, gameIndex, unselectedPlayers };
    }

    generateSchedule() {
        this.initializePlayerStats();
        let timeslotIndex = 0;
        let gameIndex = 0;
        let weekIndex = 0;
        let dayIndex = 0;
        let weeks = groupBy(this.gameAvailability, "week");
        for (let week in weeks) {
            let days = groupBy(weeks[week], "day");
            let unselectedPlayers = []; // Initialize unselectedPlayers here
            this.weekGI = [];
            for (let day in days) {
                this.dayGI = [];
                let result = this.processDay(days[day], timeslotIndex, weekIndex, gameIndex, dayIndex);
                dayIndex = result.dayIndex;
                timeslotIndex = result.timeslotIndex;
                gameIndex = result.gameIndex;
                unselectedPlayers = result.unselectedPlayers; // Assign returned unselectedPlayers here
            }
            // console.log("Weeks:\t", this.weekGI);
            this.addMissed(this.weekGI, "missedWeeks", weekIndex);
            weekIndex++;
        }
    }

    addMissed(span, property, index) {
        for (let p of this.players) {
            if (span.every((val) => p.missedGames.includes(val))) {
                p[property].push(index);
            }
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

    getTimeSlotGroup(timeslotIndex, weekIndex, courts, gameIndex, dayIndex, players) {
        let availablePlayers = players.filter((player) => player.availability[timeslotIndex]);
        availablePlayers = shuffle(availablePlayers);

        // First, extract the gamesPlayed array from each player
        let gamesPlayedArray = players.map((player) => player.gamesPlayedAcc);

        // Calculate the mean
        let sum = gamesPlayedArray.reduce((accumulator, value) => accumulator + value, 0);
        let mean = sum / gamesPlayedArray.length;

        // Calculate the variance
        let variance =
            gamesPlayedArray.reduce((accumulator, value) => accumulator + Math.pow(value - mean, 2), 0) /
            gamesPlayedArray.length;

        let standardDeviation = Math.sqrt(variance);
        let notSelectedPlayers = players.filter((player) => !player.availability[timeslotIndex]);
        let removedPlayers = [];

        if (this.fairSpread) {
            // remove abnormally popular players, reduces court utilization but increases fair game distribution
            availablePlayers = availablePlayers.reduce((acc, player) => {
                if (
                    player.unavailabilityScore > this.meanUnavailabilityScore ||
                    player.gamesPlayedAcc > standardDeviation + mean
                ) {
                    removedPlayers.push(player);
                } else {
                    acc.push(player);
                }
                return acc;
            }, []);
            notSelectedPlayers = notSelectedPlayers.concat(removedPlayers);
        }

        // let danN = availablePlayers.filter((player) => player.fullName === "Dan S");
        // if (danN) {
        //     console.log(danN);
        // }

        if (!this.twoGamesAllowable) {
            // get rid of people who have already played
            let alreadyPlayed = availablePlayers.filter((player) => player.playedDays.includes(dayIndex));
            notSelectedPlayers = notSelectedPlayers.concat(alreadyPlayed);
            availablePlayers = availablePlayers.filter((player) => !player.playedDays.includes(dayIndex));
            // figure out remaining time slots
            let counter = gameIndex;
            while (true) {
                if (counter == this.gameSchedule.length) {
                    break;
                }
                if (
                    this.gameSchedule[gameIndex].week != this.gameSchedule[counter].week ||
                    this.gameSchedule[gameIndex].day != this.gameSchedule[counter].day
                ) {
                    break;
                } else {
                    counter++;
                }
            }
            let remainingTimeSlotsToday = (counter - gameIndex) / courts.length;

            if (remainingTimeSlotsToday > 1) {
                // find any players that have availability in time from the future of this day
                let futureAvailable = [];
                for (let p of availablePlayers) {
                    for (let f = 0; f < remainingTimeSlotsToday; f++) {
                        if (p.availability[gameIndex + f]) {
                            futureAvailable.push(p);
                        }
                    }
                }
                futureAvailable = shuffle(futureAvailable);
                // split future available between the two time slots, there is likely an optimization here
                let cutHere = Math.floor(futureAvailable.length / remainingTimeSlotsToday);
                futureAvailable = futureAvailable.splice(0, cutHere);
                availablePlayers = availablePlayers.filter((player) => {
                    return !futureAvailable.some((futurePlayer) => futurePlayer.unsecureID === player.unsecureID);
                });
                notSelectedPlayers = notSelectedPlayers.concat(futureAvailable);
            }
        }

        let numPlayersNeeded = courts.length * CONSTANTS.PLAYERS_PER_MATCH;

        const selectedPlayers = [];
        const remainingAvailablePlayers = [];

        notSelectedPlayers.forEach((player) => {
            player.tempAvailable = false;
        });

        availablePlayers.forEach((player) => {
            player.tempAvailable = true;
            let isUnavailableInFuture = false;
            for (let i = 1; i <= 3; i++) {
                if (player.availability[timeslotIndex + i]) {
                    if (player.availability[timeslotIndex + i] === false) {
                        isUnavailableInFuture = true;
                        break;
                    }
                }
            }
            if (
                player.missedWeeks.includes(weekIndex - 1) ||
                player.missedDays.includes(dayIndex - 1) ||
                player.missedGames.includes(gameIndex - 1) ||
                isUnavailableInFuture ||
                (gameIndex > CONSTANTS.MINIMUM_REQUIRED_MATCHES &&
                    player.gamesPlayedAcc < CONSTANTS.MINIMUM_REQUIRED_MATCHES)
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
                if (selectedPlayers[i].gamesPlayedAcc > selectedPlayers[maxIndex].gamesPlayedAcc) {
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
            const minGamesCaptained = Math.min(...group.map((player) => player.gamesCaptainedAcc));
            const playersWithLowestCaptains = group.filter((player) => player.gamesCaptainedAcc === minGamesCaptained);
            const captain = this.getRandomElement(playersWithLowestCaptains);
            captains.push(captain);
        });

        for (let captain of captains) {
            let ci = this.players.findIndex(
                (player) => player.firstName === captain.firstName && player.lastName === captain.lastName
            );
            this.players[ci].gamesCaptainedAcc += 1;
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
            let badOpponents = this.countBadPairs(team1.concat(team2), "opponents");
            // If there are no problems, return the teams
            if (badTeammates === 0 && badOpponents === 0) {
                // if (badTeammates === 0) {
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
            const totalGamesPlayed = player.gamesPlayedAcc;
            const totalGamesMissed = player.gamesMissedAcc;
            const freeGamesMissedAcc = player.freeGamesMissedAcc;
            const gamesCaptainedAcc = player.gamesCaptainedAcc;

            // Compute how often the player had the same team mate
            let frequency = {};
            // Count the frequency of each string
            player.teammates.forEach((item) => {
                if (!frequency[item]) {
                    frequency[item] = 1;
                } else {
                    frequency[item]++;
                }
            });
            const maxSameTeammate = Math.max(...Object.values(frequency)); //

            // Compute how often the player had the same opponent
            frequency = {};
            // Count the frequency of each string
            player.opponents.forEach((item) => {
                if (!frequency[item]) {
                    frequency[item] = 1;
                } else {
                    frequency[item]++;
                }
            });
            const maxSameOpponent = Math.max(...Object.values(frequency)); //

            return {
                fullName: player.fullName,
                totalGamesPlayed,
                totalGamesMissed,
                freeGamesMissedAcc,
                gamesCaptainedAcc,
                maxSameTeammate,
                maxSameOpponent,
            };
        });
        return reportCards;
    }

    ruleCheck(reportCard) {
        let passed = true;
        let failures = [];
        for (let r of reportCard) {
            if (r.totalGamesPlayed < CONSTANTS.MINIMUM_REQUIRED_MATCHES) {
                passed = false;
                failures.push(r.fullName);
            }
            if (r.gamesCaptainedAcc < CONSTANTS.MINIMUM_REQUIRED_CAPTAIN) {
                passed = false;
                failures.push(r.fullName);
            }

            // include a total avoidance method
        }
        return { passed: passed, failures: failures };
    }
}
