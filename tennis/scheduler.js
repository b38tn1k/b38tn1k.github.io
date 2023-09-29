// TODO: hasHistory w.r.t time (favor older team mate / opponents if required to be teammate)
// TODO: break rules when necessary: if a day has people with high unavailability scores and not enough games, break the rules for that day
// RULE: NO MORE OR LESS THAN N (4 in this case)
// RULE CANT SKIP MORE THAN 2 weeks consecutivly
const CONSTANTS = {
    PLAYERS_PER_MATCH: 4,
    MINIMUM_REQUIRED_MATCHES: 4,
    MAXIMUM_ALLOWED_MATCHES: 4,
    ALLOWED_REPEATED_ATTEMPTS: 1000,
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
        this.breakRulesIfNeccessary = true;
        this.reportDiv;
        this.showReportDiv;
        this.timeslotGI = [];
        this.dayGI = [];
        this.weekGI = [];
        this.meanUnavailableScore = 0;
        this.ruleBreakCoolDown = 0;
        // this.img = createGraphics(612, 792);
        // this.img = createGraphics(1275, 1650);
        // this.img.background(color("#CC6633"));
        // drawTennisCourt(this.img, this.img.width/2, this.img.height/2, 80, 120);
    }

    draw() {
        this.scheduleGenerateMonitor();
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

    /**
     * resetGameSchedule()
     * Category: Algorithm Setup
     *
     * Purpose: This function resets the gameSchedule array, populates it with
     *          information from the gameAvailability array, and establishes an
     *          index mapping for time slots.
     *
     * Steps:
     * 1. The gameSchedule array is cleared.
     * 2. A deep copy of each object in gameAvailability is pushed to gameSchedule.
     *    This ensures changes to gameSchedule won't affect gameAvailability.
     * 3. An old variable is set to a placeholder value.
     * 4. A timeslotIndexMap is initialized to keep track of how many games fall under each timeslot.
     * 5. The function then loops over each game in gameSchedule:
     *    - If the day, timeslot, or week of the current game differs from the previous one,
     *      it updates the old variable and increases the timeslot index.
     *    - It then increments the current index in timeslotIndexMap.
     * 6. It then remaps timeslotIndexMap to expand each index by the number of times it occurs.
     * 7. Finally, it updates each game in gameSchedule to reflect the correct number of concurrent games in its time slot.
     */
    resetGameSchedule() {
        // Clear the gameSchedule array
        this.gameSchedule = [];
        for (let i = 0; i < this.gameAvailability.length; i++) {
            // Push a deep copy of each object in gameAvailability to gameSchedule
            let copiedGame = Object.assign(this.gameAvailability[i]);
            this.gameSchedule.push(copiedGame);
        }

        // Initialize the placeholders for old and timeslotIndexMap
        let old = { day: "notaday", timeslot: -1, week: -1 };
        let timeslotIndexMap = [];
        let tsIMi = -1;
        for (let game of this.gameSchedule) {
            // If a new timeslot has started
            if (game.day != old.day || game.timeslot != old.timeslot || game.week != old.week) {
                tsIMi++;
                timeslotIndexMap.push(0);
                old = { day: game.day, timeslot: game.timeslot, week: game.week };
            }
            // Increment the current index in timeslotIndexMap
            timeslotIndexMap[tsIMi]++;
        }
        // Expand each index by the number of times it occurs
        timeslotIndexMap = timeslotIndexMap.flatMap((num) => Array(num).fill(num));

        // Update each game in gameSchedule with the correct number of concurrent games
        for (let i = 0; i < timeslotIndexMap.length; i++) {
            this.gameSchedule[i].concurrentGamesInTimeSlot = timeslotIndexMap[i];
        }
    }

    /**
     * reset()
     * Category: Algorithm Setup
     *
     * Purpose: This function resets and initializes the properties of the instance to
     *          the values provided in the arguments. It prepares the instance for
     *          subsequent game scheduling or other operations.
     *
     * @param {Array} gameAvailability - The array containing availability information of games.
     * @param {Array} players - The array containing player information.
     * @param {HTMLElement} reportDiv - The div element to show the report.
     * @param {HTMLElement} showDiv - The div element to display output.
     * @param {Boolean} twoGamesAllowable - Flag to indicate if a player can play two games.
     * @param {Boolean} fairSpread - Flag to indicate if game scheduling should be spread fairly among players.
     *
     * Steps:
     * 1. It sets up several properties based on arguments.
     * 2. It deep copies the gameAvailability array into the instance's gameAvailability property.
     * 3. Calls the resetGameSchedule method to initialize gameSchedule.
     * 4. Further sets up some properties including the reportDiv and showDiv for HTML report output.
     * 5. Resets timeslotGI, dayGI, and weekGI arrays for storing index information.
     */
    reset(
        gameAvailability,
        players,
        reportDiv,
        showDiv,
        twoGamesAllowable = false,
        fairSpread = false,
        breakRules = true
    ) {
        // Initialize properties based on arguments
        this.twoGamesAllowable = twoGamesAllowable;
        this.fairSpread = fairSpread;
        this.breakRulesIfNeccessary = breakRules;
        this.gameAvailability = [];

        // Deep copy the gameAvailability array into the instance's gameAvailability property
        for (let i = 0; i < gameAvailability.length; i++) {
            for (let game of gameAvailability[i]) {
                let copiedGame = Object.assign(game);
                this.gameAvailability.push(copiedGame);
            }
        }

        // Initialize gameSchedule using the method resetGameSchedule
        this.resetGameSchedule();

        // Further set up properties
        this.generated = false;
        this.players = players;
        this.weeksInSession = gameAvailability.length;
        this.matchesPerWeek = gameAvailability[0].length;
        this.reportDiv = reportDiv;
        this.showReportDiv = showDiv;

        // Reset index arrays
        this.timeslotGI = [];
        this.dayGI = [];
        this.weekGI = [];
        this.ruleBreakCoolDown = 0;
    }

    /**
     * scheduleGenerateMonitor()
     * Category: Algorithm Procedure
     *
     * Purpose: This function controls the scheduling generation process. It repeatedly
     *          generates game schedules until it finds one that passes the rule checks or
     *          the attempts exceed the allowed repeated attempts. It then displays the
     *          best result.
     *
     * Steps:
     * 1. Checks if a schedule has already been generated. If not, generates the schedule.
     * 2. Generates a report card of the schedule and stores it.
     * 3. Initializes attempts, minFailures, and best object to keep track of the best schedule so far.
     * 4. Loops until a schedule passes the rule checks or the attempts exceed the allowed limit.
     * 5. During each loop, if a schedule is better (i.e., has fewer rule violations), it stores it as the best schedule.
     * 6. If the schedule doesn't pass the rule checks, it resets the game schedule and generates a new one.
     * 7. Once it has the best schedule, it creates time and report tables and displays them.
     */
    scheduleGenerateMonitor() {
        // Check if a schedule has been generated, if not, generate one
        if (!this.generated) {
            this.generated = true;
            this.generateSchedule();
            let res = this.generateReportCard();

            // Initialize attempts, minFailures, and best object to store the best result so far
            let attempts = 0;
            let minFailures = this.players.length;
            let best = {};

            // Loop until a schedule passes the rule checks or the attempts exceed the allowed limit
            while (attempts < CONSTANTS.ALLOWED_REPEATED_ATTEMPTS) {
                // Run rule checks on the current schedule
                const tests = this.ruleCheck(res);

                // If the current schedule is better, store it as the best schedule
                if (minFailures > tests.failures.length) {
                    best.schedule = this.simplifyGameSchedule();
                    best.report = res;
                    best.failures = tests.failures;
                    best.courts = this.computeCourtUtilization();
                    minFailures = tests.failures.length;
                }

                // If the schedule passes the rule checks, break the loop, else generate a new schedule
                if (tests.passed) {
                    break;
                } else {
                    this.resetGameSchedule();
                    this.generateSchedule();
                    res = this.generateReportCard();
                    attempts++;
                }
            }
            this.logSchedule(best.report, best.schedule, attempts)
            // Create time and report tables and display them
            createTimeAndReportTables(this.reportDiv, best.schedule, best.report, best.courts, best.failures);
            this.showReportDiv();
        }
    }

    /**
     * simplifyGameSchedule()
     * Category: Result Interpretation
     *
     * Purpose: This function transforms the detailed game schedule into a simplified format.
     *          It loops over the game schedule and for each game that has been scheduled,
     *          it creates a simplified game object that includes the timeslot, the captain,
     *          and the team members. It collects these simplified game objects into an array
     *          and returns it.
     *
     * Steps:
     * 1. Initializes an empty array 'roster' to store the simplified game objects.
     * 2. Loops over the 'gameSchedule' array. For each game:
     *    - If the game is scheduled (game.hasGame is true), it creates a simplified game object
     *      with the timeslot, captain, and team members. It pushes this object into the 'roster' array.
     * 3. Returns the 'roster' array containing simplified game objects.
     */
    simplifyGameSchedule() {
        // Initialize an empty array to store the simplified game objects
        let roster = [];

        // Loop over the 'gameSchedule' array
        for (let game of this.gameSchedule) {
            // If the game is scheduled, create a simplified game object and push it into 'roster'
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

        // Return the 'roster' array containing simplified game objects
        return roster;
    }

    /**
     * computeCourtUtilization()
     * Category: Result Interpretation
     *
     * Purpose: This function computes and returns the court utilization percentage.
     *          It calculates the percentage of games that are scheduled (hasGame property is true)
     *          out of the total games in the schedule.
     *
     * Steps:
     * 1. Get the total number of games in the 'gameSchedule' array.
     * 2. Filter the 'gameSchedule' array to get only the games that are scheduled (hasGame is true),
     *    and get the count of these games.
     * 3. Calculate the utilization percentage by dividing the number of scheduled games by the total games,
     *    and multiplying by 100 to get a percentage.
     * 4. Return the calculated utilization percentage.
     */
    computeCourtUtilization() {
        // Get the total number of games
        let totalGames = this.gameSchedule.length;

        // Filter the 'gameSchedule' array to get only the games that are scheduled and get the count
        let totalGamesWithHasGameTrue = this.gameSchedule.filter((game) => game.hasGame === true).length;

        // Calculate the utilization percentage
        let percentage = (totalGamesWithHasGameTrue / totalGames) * 100;

        // Return the calculated utilization percentage
        return percentage;
    }

    /**
     * logSchedule(res, attempts)
     * Category: Result Interpretation
     *
     * Purpose: This function logs the generated game schedule, report card,
     *          the number of attempts it took to generate the schedule, and the court utilization.
     *
     * Input:
     * - res: The report card generated by the generateReportCard() function.
     * - attempts: The number of attempts it took to generate the schedule.
     *
     * Steps:
     * 1. Simplify the game schedule using the 'simplifyGameSchedule' method.
     * 2. Log the simplified game schedule using 'console.table' for better readability.
     * 3. Log the report card using 'console.table' for better readability.
     * 4. Log the number of attempts it took to generate the schedule.
     * 5. Compute the court utilization using the 'computeCourtUtilization' method.
     * 6. Log the court utilization.
     */
    logSchedule(res, roster, attempts) {
        // Log the simplified game schedule
        console.table(roster);

        // Log the report card
        console.table(res);

        // Log the number of attempts it took to generate the schedule
        console.log(`Schedule generated in ${attempts} attempts`);

        // Compute the court utilization
        let percentage = this.computeCourtUtilization();

        // Log the court utilization
        console.log(`Court utilization is ${percentage}%`);
    }

    /**
     * initializePlayerStats()
     * Category: Algorithm Setup
     *
     * Purpose: This function initializes the player statistics, calculates
     *          each player's unavailable score, and computes the mean
     *          unavailability score across all players.
     *
     * Steps:
     * 1. Iterate over the array of players.
     * 2. Initialize each player's stats to 0 or empty array as required.
     * 3. Calculate each player's unavailable score by checking each game slot
     *    in the player's availability. If the player is not available for a
     *    particular game, increase their unavailable score.
     * 4. Extract the unavailable scores of all the players into an array.
     * 5. Calculate the mean of the unavailable scores and store it
     *    in 'this.meanUnavailableScore'.
     */
    initializePlayerStats() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].gamesPlayedAcc = 0;
            this.players[i].gamesCaptainedAcc = 0;
            this.players[i].freeGamesMissedAcc = 0;
            this.players[i].gamesMissedAcc = 0;
            this.players[i].unavailableScore = 0;

            this.players[i].missedGames = [];
            this.players[i].missedDays = [];
            this.players[i].missedWeeks = [];
            this.players[i].exceedDays = [];
            this.players[i].exceedWeeks = [];

            this.players[i].playedGames = [];
            this.players[i].playedDays = [];
            this.players[i].playedWeeks = [];

            this.players[i].teammates = [];
            this.players[i].opponents = [];

            this.players[i].unavailableScore = 0;
            let gameIndex = 0;
            // a top down attempt to reduce availability to a smaller solution space
            // let postprocess = adjustPlayerAvails(this.players);
            // for (let i = 0; i < this.players.length; i++) {
            //     for (let j = 0; j < this.players[i].availability.length; j++) {
            //         this.players[i].availability[j] = postprocess[i][j];
            //     }
            // }

            for (let k = 0; k < this.players[i].availability.length; k++) {
                if (!this.players[i].availability[k]) {
                    this.players[i].unavailableScore++;
                } else {
                    let currentTimeslot = this.gameAvailability[gameIndex].timeslot;
                    while (
                        gameIndex < this.gameAvailability.length &&
                        this.gameAvailability[gameIndex].timeslot === currentTimeslot
                    ) {
                        gameIndex++;
                    }
                }
            }

            let gamesPlayedArray = this.players.map((player) => player.unavailableScore);
            let sum = gamesPlayedArray.reduce((accumulator, value) => accumulator + value, 0);
            this.meanUnavailableScore = sum / gamesPlayedArray.length;
        }
    }

    /**
     * processTimeslot(timeslot, timeslotIndex, weekIndex, gameIndex, dayIndex, unselectedPlayers)
     * Category: Algorithm Procedure
     *
     * Purpose: This function processes a single timeslot in the schedule. It manages
     *          player selection, group creation, captain selection, match creation,
     *          and match assignment to a court.
     *
     * Steps:
     * 1. Get the group of players who are available for the given timeslot.
     * 2. For players not selected, add them to the unselectedPlayers array if they aren't already there.
     * 3. Filter the unselectedPlayers array to remove any players who were selected in this timeslot.
     * 4. Create diverse groups of players from the selected players.
     * 5. Select captains from each group.
     * 6. Build matches using the player groups and captains.
     * 7. Assign these matches to a court.
     * 8. Increment the timeslotIndex and return the updated values.
     *
     * @param {object} timeslot - The current timeslot being processed.
     * @param {number} timeslotIndex - The index of the current timeslot in the schedule.
     * @param {number} weekIndex - The index of the current week in the schedule.
     * @param {number} gameIndex - The index of the current game in the schedule.
     * @param {number} dayIndex - The index of the current day in the schedule.
     * @param {array} unselectedPlayers - The list of players who have not been selected for a match yet.
     *
     * @return {object} An object containing the updated timeslotIndex, gameIndex, and unselectedPlayers array.
     */
    processTimeslot(timeslot, timeslotIndex, weekIndex, gameIndex, dayIndex, unselectedPlayers) {
        this.timeslotGI = [];
        const players = this.getTimeSlotGroup(timeslotIndex, weekIndex, timeslot, gameIndex, dayIndex, this.players);

        players.notSelected.forEach((player) => {
            if (!unselectedPlayers.find((p) => p.unsecureID === player.unsecureID)) {
                unselectedPlayers.push(player);
            }
        });

        unselectedPlayers = unselectedPlayers.filter(
            (a1) => !players.selected.some((a2) => a1.unsecureID === a2.unsecureID)
        );

        const playerGroups = this.createPlayerGroups(players.selected);
        const captains = this.selectCaptains(playerGroups);
        const matches = this.buildMatches(playerGroups, captains, dayIndex);
        gameIndex = this.assignMatchesToCourt(matches, timeslot.length, gameIndex, unselectedPlayers);
        timeslotIndex++;
        return { timeslotIndex, gameIndex, unselectedPlayers };
    }

    /**
     * buildMatches(playerGroups, captains, dayIndex)
     * Category: Algorithm Procedure
     *
     * Purpose: This function creates matches by forming teams from player groups and
     *          assigning a captain to each team. It also updates player's game statistics.
     *
     * Steps:
     * 1. For each player group, create teams and assign a captain.
     * 2. Add the match to the list of matches.
     * 3. Update the players' game statistics (increment games played, add day index to played days).
     * 4. Save the teams for later use.
     * 5. Return the list of matches.
     *
     * @param {array} playerGroups - The groups of players from which teams will be formed.
     * @param {array} captains - The list of captains for each team.
     * @param {number} dayIndex - The index of the current day in the schedule.
     *
     * @return {array} An array of match objects, where each match object includes a captain and the teams.
     */
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

    /**
     * assignMatchesToCourt(matches, timeslotLength, gameIndex, unselectedPlayers)
     * Category: Algorithm Procedure
     *
     * Purpose: This function assigns matches to courts and updates the game schedule accordingly.
     *          It also keeps track of players who were not selected for a match.
     *
     * Steps:
     * 1. For each timeslot, assign a match to a court if a match is available.
     * 2. Mark the game as having a game or not depending on whether a match is assigned.
     * 3. Update the tracking of game indices for the timeslot, day, and week.
     * 4. For each player not selected for a match, record that they missed this game and increment their
     *    count of missed games.
     * 5. If the player was available but still missed the game, increment their count of free games missed.
     * 6. Increment the game index to move on to the next game.
     *
     * @param {array} matches - The array of matches to be assigned to courts.
     * @param {number} timeslotLength - The number of games in the current timeslot.
     * @param {number} gameIndex - The index of the current game in the game schedule.
     * @param {array} unselectedPlayers - The array of players who were not selected for a match.
     *
     * @return {number} The updated game index after assigning all matches in the timeslot.
     */
    assignMatchesToCourt(matches, timeslotLength, gameIndex, unselectedPlayers) {
        for (let i = 0; i < timeslotLength; i++) {
            if (matches[i]) {
                this.gameSchedule[gameIndex].captain = matches[i].captain;
                this.gameSchedule[gameIndex].teams = matches[i].teams;
                this.gameSchedule[gameIndex].hasGame = true;
                for (let t of matches[i].teams) {
                    for (let p of t) {
                        p.playedGames.push(gameIndex);
                    }
                }
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

    /**
     * processDay(day, timeslotIndex, weekIndex, gameIndex, dayIndex)
     * Category: Algorithm Procedure
     *
     * Purpose: This function processes each day in the game schedule. It goes through each timeslot of the day,
     *          passing them to the `processTimeslot` function for further processing. It keeps track of the
     *          players who were not selected for a game on that day and logs which players missed a day of games.
     *
     * Steps:
     * 1. Initialize an array to keep track of players who are not selected for a game.
     * 2. Group the games of the day by timeslot.
     * 3. For each timeslot, call `processTimeslot` to process the games in that timeslot.
     *    Update the timeslot index, game index, and array of unselected players based on the return value from `processTimeslot`.
     * 4. Record the players who missed a day of games.
     * 5. Increment the day index to move on to the next day.
     *
     * @param {array} day - The array of games happening in the current day.
     * @param {number} timeslotIndex - The index of the current timeslot.
     * @param {number} weekIndex - The index of the current week.
     * @param {number} gameIndex - The index of the current game in the game schedule.
     * @param {number} dayIndex - The index of the current day.
     *
     * @return {object} An object containing the updated day index, timeslot index, game index,
     *                  and array of players who were not selected for a game.
     */
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
        this.addMissed(this.dayGI, "missedDays", dayIndex);
        this.addExceeds(this.weekGI, "exceedDays", weekIndex);
        dayIndex++;
        return { dayIndex, timeslotIndex, gameIndex, unselectedPlayers };
    }

    /**
     * generateSchedule()
     * Category: Algorithm Procedure
     *
     * Purpose: This function orchestrates the generation of the game schedule. It initializes player statistics,
     *          processes each week and day of games, and tracks players who were not selected for a game
     *          during the week.
     *
     * Steps:
     * 1. Initialize player statistics.
     * 2. Group the games by week.
     * 3. For each week:
     *    - Initialize an array to keep track of players who were not selected for a game.
     *    - Group the games of the week by day.
     *    - For each day, call `processDay` to process the games in that day.
     *      Update the day index, timeslot index, and game index based on the return value from `processDay`.
     *    - Record the players who missed a week of games.
     *    - Increment the week index to move on to the next week.
     */
    generateSchedule() {
        this.initializePlayerStats();
        let timeslotIndex = 0;
        let gameIndex = 0;
        let weekIndex = 0;
        let dayIndex = 0;
        let weeks = groupBy(this.gameAvailability, "week");
        for (let week in weeks) {
            let days = groupBy(weeks[week], "day");
            let unselectedPlayers = [];
            this.weekGI = [];
            for (let day in days) {
                this.dayGI = [];
                let result = this.processDay(days[day], timeslotIndex, weekIndex, gameIndex, dayIndex);
                dayIndex = result.dayIndex;
                timeslotIndex = result.timeslotIndex;
                gameIndex = result.gameIndex;
                unselectedPlayers = result.unselectedPlayers;
            }
            this.addMissed(this.weekGI, "missedWeeks", weekIndex);
            this.addExceeds(this.weekGI, "exceedWeeks", weekIndex);
            
            weekIndex++;
        }
    }

    /**
     * addMissed(span, property, index)
     * Category: Helper
     *
     * Purpose: This function helps track the games missed by each player over a given span of time (day, week, etc.).
     *          It checks for each player if they missed all the games in the provided span, and if so,
     *          adds the provided index (representing a specific time span like a day or week index)
     *          to the specified property of the player's object (like 'missedDays' or 'missedWeeks').
     *
     * @param {Array} span - An array representing a span of game indices.
     * @param {String} property - The property of a player object to be updated (like 'missedDays' or 'missedWeeks').
     * @param {Number} index - The index of the current time span (day or week).
     *
     * Steps:
     * 1. Iterate over each player.
     * 2. Check if the player missed all the games in the provided span by checking if all values in the 'span' array are
     *    included in the player's 'missedGames' array.
     * 3. If the player missed all games in the span, add the provided index to the specified property of the player.
     */
    addMissed(span, property, index) {
        for (let p of this.players) {
            if (span.every((val) => p.missedGames.includes(val))) {
                p[property].push(index);
            }
        }
    }

    addExceeds(span, property, index) {
        for (let p of this.players) {
            let sharedItemsCount = span.filter(item => p.playedGames.includes(item)).length;
            if (sharedItemsCount > 1) {
                p[property].push(index);
            }
        }
    }

    /**
     * rememberTeams(teams)
     * Category: Helper
     *
     * Purpose: This function is used to keep track of which players have been teammates and opponents in a given game.
     *          The function updates each player's 'teammates' and 'opponents' lists based on the provided teams.
     *
     * @param {Array} teams - An array representing two teams, each of which is an array of two players.
     *
     * Steps:
     * 1. Iterate over each team in the teams array.
     * 2. For each team, iterate over each player in the team.
     * 3. For each player, add the other player in the team to the player's 'teammates' list.
     * 4. Also for each player, add both players of the opposing team to the player's 'opponents' list.
     */
    rememberTeams(teams) {
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams.length; j++) {
                teams[i][j].teammates.push(teams[i][int(!j)].unsecureID);
                teams[i][j].opponents.push(teams[int(!i)][j].unsecureID);
                teams[i][j].opponents.push(teams[int(!i)][int(!j)].unsecureID);
            }
        }
    }

    /**
     * getRemainingTimeSlotsInADay(gameIndex, courts)
     * Category: Algorithm Helper
     *
     * Purpose: This function counts remaining timeslots in a day
     *
     * @param {number} gameIndex - The index representing the current game.
     * @param {Array} courts - An array representing the available courts.
     *
     * Steps:
     * 1. while not falling off the edge of the gameSchedule array, increment a counter
     * 2. if the gameschedule[counter] week and day match the current timeslot keep going
     * 3. once they don't, stop and calculate the time slots
     * 4. knowing that courts dont count
     */

    getRemainingTimeSlotsInADay(gameIndex, courts) {
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
        return remainingTimeSlotsToday;
    }

    /**
     * singlePlaySameDay(availablePlayers, notSelectedPlayers, dayIndex, gameIndex, courts)
     * Category: Algorithm Procedure
     *
     * Purpose: This function aims to ensure that players do not play multiple times in a single day by adjusting the
     *          availablePlayers and notSelectedPlayers arrays accordingly. It also divides future available players
     *          equally between the remaining timeslots of the day.
     *
     * @param {Array} availablePlayers - An array of player objects who are available to play.
     * @param {Array} notSelectedPlayers - An array of player objects who have not been selected for a game.
     * @param {number} dayIndex - The index representing the current day.
     * @param {number} gameIndex - The index representing the current game.
     * @param {Array} courts - An array representing the available courts.
     *
     * Steps:
     * 1. Remove players from availablePlayers who have already played in the current day, and add them to notSelectedPlayers.
     * 2. Determine the remaining timeslots for the current day.
     * 3. If there is more than one timeslot remaining, find the players who are available for future timeslots of the day.
     * 4. Randomly shuffle the players who are available for future timeslots.
     * 5. Divide the players available for future timeslots equally between the remaining timeslots. There might be potential for optimization here.
     * 6. Remove the players assigned for future timeslots from the availablePlayers, and add them to notSelectedPlayers.
     * 7. Return the updated availablePlayers and notSelectedPlayers arrays.
     */
    singlePlaySameDay(availablePlayers, notSelectedPlayers, dayIndex, gameIndex, courts, full=true) {
        // get rid of people who have already played
        let alreadyPlayed = availablePlayers.filter((player) => player.playedDays.includes(dayIndex));
        notSelectedPlayers = notSelectedPlayers.concat(alreadyPlayed);
        availablePlayers = availablePlayers.filter((player) => !player.playedDays.includes(dayIndex));
        // figure out remaining time slots
        let remainingTimeSlotsToday = this.getRemainingTimeSlotsInADay(gameIndex, courts);

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
            let cutHere = 1;
            if (full) {
                cutHere = Math.floor(futureAvailable.length / remainingTimeSlotsToday);
            }
            futureAvailable = futureAvailable.splice(0, cutHere);
            availablePlayers = availablePlayers.filter((player) => {
                return !futureAvailable.some((futurePlayer) => futurePlayer.unsecureID === player.unsecureID);
            });
            notSelectedPlayers = notSelectedPlayers.concat(futureAvailable);
        }
        return { a: availablePlayers, n: notSelectedPlayers };
    }

    /**
     * reduceHighVolumePlayers(availablePlayers, notSelectedPlayers, standardDeviation, mean)
     * Category: Algorithm Procedure
     *
     * Purpose: This function aims to ensure fairness in game distribution by reducing the chances of high-volume players
     *          (players who play more often than others) from dominating the available slots. While this reduces court
     *          utilization, it improves the fairness of game distribution.
     *
     * @param {Array} availablePlayers - An array of player objects who are available to play.
     * @param {Array} notSelectedPlayers - An array of player objects who have not been selected for a game.
     * @param {number} standardDeviation - The standard deviation of games played across all players.
     * @param {number} mean - The mean number of games played across all players.
     *
     * Steps:
     * 1. Iterate over each player in the availablePlayers array.
     * 2. Check if the player's unavailabilityScore is greater than the average unavailability score, or if the player has played
     *    more games than one standard deviation above the mean.
     * 3. If the above condition is met, remove the player from availablePlayers and add them to a list of removedPlayers.
     * 4. Concatenate the removed players to the notSelectedPlayers array.
     * 5. Return the updated availablePlayers and notSelectedPlayers arrays.
     */
    reduceHighVolumePlayers(availablePlayers, notSelectedPlayers, standardDeviation, mean) {
        let removedPlayers = [];
        // remove abnormally popular players, reduces court utilization but increases fair game distribution
        availablePlayers = availablePlayers.reduce((acc, player) => {
            if (
                player.gamesPlayedAcc > mean + standardDeviation 
                // (player.unavailableScore < this.meanUnavailableScore && player.gamesPlayedAcc > mean)
            ) {
                removedPlayers.push(player);
            } else {
                acc.push(player);
            }
            return acc;
        }, []);
        notSelectedPlayers = notSelectedPlayers.concat(removedPlayers);
        return { a: availablePlayers, n: notSelectedPlayers };
    }
    /**
     * getPlayerGroupStats(players)
     * Category: Result Interpretation
     *
     * Purpose: This function calculates and returns the mean, variance, and standard deviation of the
     *          accumulated games played ('gamesPlayedAcc') by a group of players. This information can
     *          be useful to analyze the distribution of games among players.
     *
     * @param {Array} players - An array of player objects. Each player object is assumed to have a
     *                          'gamesPlayedAcc' property which is a number indicating the total number
     *                          of games that the player has played.
     *
     * Steps:
     * 1. Extract the 'gamesPlayedAcc' property from each player object into a separate array (gamesPlayedArray).
     * 2. Calculate the mean of the 'gamesPlayedAcc' numbers in the gamesPlayedArray.
     * 3. Calculate the variance of the 'gamesPlayedAcc' numbers in the gamesPlayedArray.
     * 4. Calculate the standard deviation by taking the square root of the variance.
     * 5. Return an object containing the calculated mean, variance, and standard deviation.
     */
    getPlayerGroupStats(players) {
        // First, extract the gamesPlayed array from each player
        let gamesPlayedArray = players.map((player) => player.gamesPlayedAcc);

        // Calculate the mean
        let sum = gamesPlayedArray.reduce((accumulator, value) => accumulator + value, 0);
        let mean = sum / gamesPlayedArray.length;

        // Calculate the variance
        let variance =
            gamesPlayedArray.reduce((accumulator, value) => accumulator + Math.pow(value - mean, 2), 0) /
            gamesPlayedArray.length;
        let sd = Math.sqrt(variance);
        return { mean: mean, variance: variance, standardDeviation: sd };
    }

    /**
     * processPlayersForAvailability(players, timeslotIndex, weekIndex, dayIndex, gameIndex)
     * Category: Player Availability
     *
     * Purpose: This function is used to process the list of players and separate them into two arrays:
     *          one for selected players who have priority due to absence in the previous matches or
     *          unavailability in the future, and another one for remaining available players.
     *
     * @param {Array<Object>} players - An array of player objects.
     * @param {number} timeslotIndex - The index of the current time slot in the schedule.
     * @param {number} weekIndex - The index of the current week in the schedule.
     * @param {number} dayIndex - The index of the current day in the schedule.
     * @param {number} gameIndex - The index of the current game in the schedule.
     *
     * @returns {Object} - An object containing arrays of `selectedPlayers` and `remainingAvailablePlayers`.
     *
     * Steps:
     * 1. For each player in `players`, check their availability for the current time slot and future time slots.
     * 2. If a player was absent in the previous week, day, or game, or will be unavailable in the next three time slots,
     *    or if a player has played less than the minimum required matches and the current game index is more than
     *    the minimum required matches, the player is added to `selectedPlayers`.
     * 3. Otherwise, the player is added to `remainingAvailablePlayers`.
     * 4. Return an object containing `selectedPlayers` and `remainingAvailablePlayers` arrays.
     */

    processPlayersForAvailability(players, timeslotIndex, weekIndex, dayIndex, gameIndex) {
        const selectedPlayers = [];
        const remainingAvailablePlayers = [];

        players.forEach((player) => {
            player.tempAvailable = player.availability[timeslotIndex] ?? false;
            let isUnavailableInFuture = false;
            for (let i = 1; i <= 3; i++) {
                if (player.availability[timeslotIndex + i]) { // dumb but was failiing
                    if (player.availability[timeslotIndex + i] === false) {
                        isUnavailableInFuture = true;
                        break;
                    }
                }
            }
            if (
                player.unavailableScore < this.meanUnavailableScore ||
                (player.missedWeeks.includes(weekIndex - 1)  &&
                player.gamesPlayedAcc < CONSTANTS.MINIMUM_REQUIRED_MATCHES)||
                // player.missedDays.includes(dayIndex - 1) ||
                // player.missedGames.includes(gameIndex - 1) ||
                isUnavailableInFuture ||
                (gameIndex*4 > CONSTANTS.MINIMUM_REQUIRED_MATCHES &&
                    player.gamesPlayedAcc < CONSTANTS.MINIMUM_REQUIRED_MATCHES)
            ) {
                selectedPlayers.push(player);
            } else {
                remainingAvailablePlayers.push(player);
            }
        });

        return { selectedPlayers, remainingAvailablePlayers };
    }

    /**
     * handlePlayerGroupSizes(selectedPlayers, availablePlayers, notSelectedPlayers, numPlayersNeeded)
     * Category: Player Grouping
     *
     * Purpose: This function is used to handle the size of the selected players group according to predefined requirements. It ensures
     *          there are enough players to create matches, and manages the overflow of selected players based on their previous match
     *          appearances and the number of players needed.
     *
     * @param {Array<Object>} selectedPlayers - An array of selected player objects.
     * @param {Array<Object>} availablePlayers - An array of available player objects.
     * @param {Array<Object>} notSelectedPlayers - An array of player objects who are not selected for this round.
     * @param {number} numPlayersNeeded - The number of players needed for matches.
     *
     * @returns {Object} - An object containing updated arrays of `selectedPlayers` and `notSelectedPlayers`.
     *
     * Steps:
     * 1. If the total number of `selectedPlayers` and `availablePlayers` is greater or equal to `numPlayersNeeded`, add players
     *    from `availablePlayers` to `selectedPlayers` until `selectedPlayers` has the required number of players.
     * 2. If the total number of players is less than `numPlayersNeeded`, issue a warning.
     * 3. If the number of `selectedPlayers` is not a multiple of 4, find and remove the player with the most appearances in previous matches.
     * 4. If the number of `selectedPlayers` is greater than `numPlayersNeeded`, move the extra players to `notSelectedPlayers`.
     * 5. Return the updated `selectedPlayers` and `notSelectedPlayers` arrays.
     */

    handlePlayerGroupSizes(selectedPlayers, availablePlayers, notSelectedPlayers, numPlayersNeeded) {
        if (selectedPlayers.length + availablePlayers.length >= numPlayersNeeded) {
            while (selectedPlayers.length < numPlayersNeeded) {
                selectedPlayers.push(availablePlayers.pop());
            }
        } else {
            console.warn(`Not enough players available.`);
        }

        while (selectedPlayers.length % 4 != 0) {
            let maxIndex = 0;
            for (let i = 1; i < selectedPlayers.length; i++) {
                if (selectedPlayers[i].gamesPlayedAcc > CONSTANTS.MINIMUM_REQUIRED_MATCHES || (selectedPlayers[i].gamesPlayedAcc > selectedPlayers[maxIndex].gamesPlayedAcc && selectedPlayers[i].unavailableScore < this.meanUnavailableScore)) {
                    maxIndex = i;
                }
            }
            selectedPlayers.splice(maxIndex, 1);
        }
        while (selectedPlayers.length > numPlayersNeeded) {
            notSelectedPlayers.push(selectedPlayers.pop());
        }

        return { selectedPlayers, notSelectedPlayers };
    }
    /**
     * getTimeSlotGroup(timeslotIndex, weekIndex, courts, gameIndex, dayIndex, players)
     * Category: Algorithm Procedure
     *
     * Purpose: This function divides a given set of players into two groups: those who are selected to play
     *          in a specific timeslot (selectedPlayers), and those who are not selected (notSelectedPlayers).
     *          The selection is based on several factors including each player's availability, the fairness
     *          settings, and the need to ensure a certain minimum number of players for each game.
     *
     * @param {Number} timeslotIndex - The index of the current timeslot in the game schedule.
     * @param {Number} weekIndex - The index of the current week in the game schedule.
     * @param {Array} courts - An array representing the courts available for play.
     * @param {Number} gameIndex - The index of the current game in the game schedule.
     * @param {Number} dayIndex - The index of the current day in the game schedule.
     * @param {Array} players - An array of player objects. Each player object should have properties indicating
     *                          the player's availability, number of games played, and other related information.
     *
     * Steps:
     * 1. Filter the available players based on their availability for the given timeslot.
     * 2. If the fairSpread setting is enabled, reduce the number of high-volume players.
     * 3. If the twoGamesAllowable setting is disabled, ensure that each player only plays once per day.
     * 4. Determine the number of players needed for the given timeslot, based on the number of courts and
     *    the predefined constant for players per match.
     * 5. Select players based on their recent play history and availability for future timeslots.
     * 6. Sort the remaining available players based on their unavailability score.
     * 7. If there are not enough players available, adjust the number of players needed and warn about the situation.
     * 8. Select players from the available players group until the number of selected players meets the need.
     * 9. Ensure that the number of selected players is a multiple of 4 (the number of players in a game),
     *    and that the number does not exceed the number of players needed.
     * 10. Combine the not selected players with the remaining available players.
     * 11. Return an object containing the selected and not selected players.
     */
    getTimeSlotGroup(timeslotIndex, weekIndex, courts, gameIndex, dayIndex, players) {
        let availablePlayers = players.filter((player) => player.availability[timeslotIndex]);
        availablePlayers = shuffle(availablePlayers);

        let notSelectedPlayers = players.filter((player) => !player.availability[timeslotIndex]);
        let numPlayersNeeded = courts.length * CONSTANTS.PLAYERS_PER_MATCH;
        // copy the canon rules so we can break them if need be
        let fairSpread = this.fairSpread;
        let twoGamesAllowable = this.twoGamesAllowable;
        let fullCut = true;
        if (this.breakRulesIfNeccessary) {
            let riskyPlayersBehind = availablePlayers
                .filter((player) => player.unavailableScore > this.meanUnavailableScore)
                .map((player) => player.gamesPlayedAcc).some((sc) => sc < weekIndex);
            if (riskyPlayersBehind) {
                twoGamesAllowable = true;
                fullCut = false;
            }
        }

        if (fairSpread) {
            let stats = this.getPlayerGroupStats(players);
            const unpacker2 = this.reduceHighVolumePlayers(
                availablePlayers,
                notSelectedPlayers,
                stats.standardDeviation,
                stats.mean
            );
            availablePlayers = unpacker2.a;
            notSelectedPlayers = unpacker2.n;
        }

        if (!twoGamesAllowable) {
            const unpacker1 = this.singlePlaySameDay(availablePlayers, notSelectedPlayers, dayIndex, gameIndex, courts, fullCut);
            availablePlayers = unpacker1.a;
            notSelectedPlayers = unpacker1.n;
        }

        let processedPlayers = this.processPlayersForAvailability(
            availablePlayers,
            timeslotIndex,
            weekIndex,
            dayIndex,
            gameIndex
        );
        availablePlayers = processedPlayers.remainingAvailablePlayers;
        let selectedPlayers = processedPlayers.selectedPlayers;

        availablePlayers.sort((a, b) => a.unavailableScore - b.unavailableScore);

        let numAvailablePlayers = selectedPlayers.length + availablePlayers.length;

        while (numAvailablePlayers < numPlayersNeeded) {
            numPlayersNeeded -= CONSTANTS.PLAYERS_PER_MATCH;
        }

        let handledGroups = this.handlePlayerGroupSizes(
            selectedPlayers,
            availablePlayers,
            notSelectedPlayers,
            numPlayersNeeded
        );
        selectedPlayers = handledGroups.selectedPlayers;
        notSelectedPlayers = handledGroups.notSelectedPlayers;

        notSelectedPlayers = notSelectedPlayers.concat(availablePlayers);

        return { selected: selectedPlayers, notSelected: notSelectedPlayers };
    }

    /**
     * hasHistory(player1, player2)
     * Category: Helper
     *
     * Purpose: This function checks if two players have a history of either being teammates or opponents in past games.
     *          This is done by looking at the 'teammates' and 'opponents' lists of the first player and seeing if the
     *          second player's ID is present in either list.
     *
     * @param {Object} player1 - The first player object. This object should have 'teammates' and 'opponents' properties
     *                           which are arrays containing the IDs of the players that the first player has been
     *                           teammates or opponents with in past games.
     * @param {Object} player2 - The second player object. This object should have a 'unsecureID' property which
     *                           is the ID of the player.
     *
     * Steps:
     * 1. Check if the second player's ID is present in either the 'teammates' or 'opponents' list of the first player.
     * 2. Return a boolean result indicating whether a history between the two players exists.
     */
    hasHistory(player1, player2) {
        const res = player1.teammates.includes(player2.unsecureID) || player1.opponents.includes(player2.unsecureID);
        return res;
    }

    /**
     * createInitialGroups(selectedPlayers, numGroups)
     * Category: Player Grouping
     *
     * Purpose: This function is used to create an initial distribution of players into a number of groups.
     *
     * @param {Array<Object>} selectedPlayers - An array of selected players to be distributed into groups.
     * @param {number} numGroups - The number of groups that the players need to be distributed into.
     *
     * @returns {Object} - An object containing two fields:
     * 1. `selectedPlayers` - This is an array containing the remaining players that have not been distributed into any group.
     * 2. `playerGroups` - This is an array of arrays where each inner array represents a group of players.
     *
     * Steps:
     * 1. Create an empty array for each group. This is done using the Array constructor with `numGroups` as an argument. Each element of the array is initialized as null and mapped to an empty array.
     * 2. In the first round, one player from the `selectedPlayers` array is assigned to each group, in order. This is done by popping a player from the `selectedPlayers` array and pushing it to each group one by one.
     * 3. Return the `selectedPlayers` array and `playerGroups` array as properties of an object.
     */

    createInitialGroups(selectedPlayers, numGroups) {
        let playerGroups = new Array(numGroups).fill(null).map(() => []);

        // First round: assign one player to each group
        for (let i = 0; i < numGroups; i++) {
            playerGroups[i].push(selectedPlayers.pop());
        }

        return { selectedPlayers, playerGroups };
    }
    /**
     * assignRemainingPlayers(selectedPlayers, playerGroups)
     * Category: Player Grouping
     *
     * Purpose: This function is used to assign the remaining players to the groups that they have the least common history with.
     *
     * @param {Array<Object>} selectedPlayers - An array of the remaining players that need to be assigned to groups.
     * @param {Array<Array<Object>>} playerGroups - An array of arrays where each inner array represents a group of players.
     *
     * @returns {Array<Array<Object>>} - The updated `playerGroups` array with all players assigned.
     *
     * Steps:
     * 1. Loop while there are still players in `selectedPlayers` array.
     * 2. In each iteration, remove a player from the `selectedPlayers` array.
     * 3. For each group in `playerGroups`, calculate a "strangeness" score. This score is a sum of the player's history with each other player in the group. If the player has no history with another player, a point is added to the score.
     * 4. Select the group with the smallest strangeness score (i.e., the group with the least common history with the player).
     * 5. Add the player to the selected group.
     * 6. Repeat until there are no more players left in the `selectedPlayers` array.
     * 7. Return the updated `playerGroups` array.
     */

    assignRemainingPlayers(selectedPlayers, playerGroups) {
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

        return playerGroups;
    }

    /**
     * correctOverfilledGroups(playerGroups)
     * Category: Player Grouping
     *
     * Purpose: This function is used to correct the size of the groups by moving players from overfilled groups to underfilled ones.
     *
     * @param {Array<Array<Object>>} playerGroups - An array of arrays where each inner array represents a group of players.
     *
     * @returns {Array<Array<Object>>} - The updated `playerGroups` array with corrected group sizes.
     *
     * Steps:
     * 1. Create two arrays: `overfilledGroups` and `underfilledGroups`, which contain groups that have more and less players than `CONSTANTS.PLAYERS_PER_MATCH`, respectively.
     * 2. While there are still both overfilled and underfilled groups, take a player from an overfilled group and add them to an underfilled group.
     * 3. Update the `overfilledGroups` and `underfilledGroups` arrays.
     * 4. Repeat until there are no more overfilled or underfilled groups.
     * 5. Return the updated `playerGroups` array.
     */

    correctOverfilledGroups(playerGroups) {
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

    /**
     * createPlayerGroups(selectedPlayers)
     * Category: Algorithm Procedure
     *
     * Purpose: This function distributes the selected players into groups of a specified size, aiming to minimize the number
     *          of times players are grouped with others they have a history with. The function uses the 'hasHistory' helper
     *          function to determine if two players have been teammates or opponents in previous games.
     *
     * @param {Array} selectedPlayers - An array of selected player objects. Each player object should have properties
     *                                  including 'teammates' and 'opponents', which are arrays containing the IDs of
     *                                  players that the player has been teammates or opponents with in past games.
     *
     * Steps:
     * 1. Initialize an array of empty groups.
     * 2. Assign one player to each group.
     * 3. For the remaining players, calculate the 'strangeness score' for each group (i.e., the number of group members
     *    the player has no history with) and assign the player to the group with the highest strangeness score.
     * 4. If a group ends up with too many players, move players from this group to groups that have too few players until
     *    all groups have the right number of players.
     */

    createPlayerGroups(selectedPlayers) {
        const numPlayersNeeded = selectedPlayers.length;
        const numGroups = numPlayersNeeded / CONSTANTS.PLAYERS_PER_MATCH;

        let result = this.createInitialGroups(selectedPlayers, numGroups);
        selectedPlayers = result.selectedPlayers;
        let playerGroups = result.playerGroups;

        playerGroups = this.assignRemainingPlayers(selectedPlayers, playerGroups);
        playerGroups = this.correctOverfilledGroups(playerGroups);

        return playerGroups;
    }

    /**
     * selectCaptains(playerGroups)
     * Category: Result Interpretation
     *
     * Purpose: This function selects a captain for each group of players from a list of groups. The captain is the player
     *          in the group who has captained the fewest games so far. In case of a tie, a captain is randomly selected
     *          from among the players who have captained the fewest games.
     *
     * @param {Array} playerGroups - An array of groups, each of which is an array of player objects. Each player object
     *                               should have a 'gamesCaptainedAcc' property indicating the number of games the player
     *                               has captained.
     *
     * Steps:
     * 1. For each group, find the players who have captained the fewest games.
     * 2. Randomly select a captain from among these players.
     * 3. Update the 'gamesCaptainedAcc' property for each selected captain.
     */

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

    /**
     * createTeams(playersInMatch)
     * Category: Algorithm Procedure
     *
     * Purpose: This function attempts to divide a given set of players into two teams for a match. It starts by randomly
     *          assigning the players to the two teams, and then repeatedly swaps players between the teams until either
     *          there are no "bad" pairings (i.e., pairings of players who have been teammates or opponents too many times)
     *          or a certain maximum number of iterations is reached.
     *
     * @param {Array} playersInMatch - An array of four player objects. Each player object should have a 'teammates'
     *                                 property (a list of player IDs representing players the player has been a teammate
     *                                 with) and an 'opponents' property (a list of player IDs representing players the
     *                                 player has been an opponent of).
     *
     * Steps:
     * 1. Randomly assign players to two teams.
     * 2. While the maximum number of iterations has not been reached and there are still "bad" pairings:
     *    a. Count the number of "bad" teammate pairings in each team and the number of "bad" opponent pairings across
     *       both teams.
     *    b. If there are no "bad" pairings, return the current arrangement of teams.
     *    c. Randomly select a player from each team and swap them.
     * 3. If no perfect arrangement is found within the maximum number of iterations, return the last arrangement.
     */
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

    /**
     * countBadPairs(list, history)
     * Category: Helper function
     *
     * Purpose: This function counts the number of times a player in a list has a "history" with another player in the
     *          same list. The "history" could be either being teammates or opponents in previous matches.
     *
     * @param {Array} list - A list of player objects. Each player object should have a 'teammates' property (a list of
     *                       player IDs representing players the player has been a teammate with) and an 'opponents'
     *                       property (a list of player IDs representing players the player has been an opponent of).
     * @param {String} history - A string that should be either 'teammates' or 'opponents', indicating the type of history
     *                           that should be considered.
     *
     * @returns {Number} count - The total number of pairs of players in the list that have the specified type of history
     *                           with each other.
     *
     * Steps:
     * 1. Loop over each pair of distinct players in the list.
     * 2. For each pair, if player1's history includes player2, increment the count.
     * 3. Return the count.
     */

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
    /**
     * getRandomElement(array)
     * Category: Helper function
     *
     * Purpose: This function selects a random element from a given array.
     *
     * @param {Array} array - The array from which a random element should be selected.
     *
     * @returns {*} - Returns a random element from the array.
     *
     * Steps:
     * 1. Generate a random index between 0 and the length of the array (exclusive).
     * 2. Use this index to access and return a random element from the array.
     */

    getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    /**
     * generateReportCard()
     * Category: Report Generation
     *
     * Purpose: This function generates a report card for each player. The report card includes:
     * 1. The player's full name.
     * 2. The total number of games the player played.
     * 3. The total number of games the player missed.
     * 4. The number of free games the player missed.
     * 5. The number of games the player captained.
     * 6. The maximum number of times the player had the same teammate.
     * 7. The maximum number of times the player had the same opponent.
     *
     * @returns {Array<Object>} - An array of objects, each representing a player's report card.
     *
     * Steps:
     * 1. Map over each player to create an object with their stats.
     * 2. For each player, count the number of times they had the same teammate and opponent by iterating over their 'teammates' and 'opponents' arrays and creating frequency counts.
     * 3. Find the maximum count from these frequency counts to determine the maximum number of times the player had the same teammate or opponent.
     * 4. Return the array of report cards.
     */

    generateReportCard() {
        const reportCards = this.players.map((player) => {
            const totalGamesPlayed = player.gamesPlayedAcc;
            const totalGamesMissed = player.gamesMissedAcc;
            const freeGamesMissedAcc = player.freeGamesMissedAcc;
            const gamesCaptainedAcc = player.gamesCaptainedAcc;
            const daysExceeded = player.exceedDays.length;
            const fullName = player.fullName;

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
                fullName,
                totalGamesPlayed,
                totalGamesMissed,
                freeGamesMissedAcc,
                gamesCaptainedAcc,
                maxSameTeammate,
                maxSameOpponent,
                daysExceeded
            };
        });
        return reportCards;
    }
    /**
     * ruleCheck(reportCard)
     * Category: Rules Check
     *
     * Purpose: This function checks whether all the players have met the tournament rules.
     * The function checks if:
     * 1. The player has played at least the minimum required matches.
     * 2. The player has captained at least the minimum required times.
     *
     * @param {Array<Object>} reportCard - An array of player report cards generated by the generateReportCard() function.
     *
     * @returns {Object} - An object containing two fields:
     * 1. `passed` is a boolean representing whether all players have met the rules.
     * 2. `failures` is an array of the names of the players who have failed to meet the rules.
     *
     * Steps:
     * 1. Initialize the `passed` variable as true, and the `failures` variable as an empty array.
     * 2. For each player's report card, check if the player has played the minimum required matches and captained the minimum required times.
     * 3. If a player fails to meet a rule, set `passed` to false and add the player's name to `failures`.
     * 4. Return the `passed` and `failures`.
     */
    ruleCheck(reportCard) {
        let passed = true;
        let failures = [];
        for (let r of reportCard) {
            if (r.totalGamesPlayed < CONSTANTS.MINIMUM_REQUIRED_MATCHES || r.totalGamesPlayed > CONSTANTS.MAXIMUM_ALLOWED_MATCHES) {
                passed = false;
                failures.push(r.fullName);
            }
            if (r.gamesCaptainedAcc < CONSTANTS.MINIMUM_REQUIRED_CAPTAIN) {
                passed = false;
                failures.push(r.fullName);
            }

            // TODO: include a total avoidance method
        }
        return { passed: passed, failures: failures };
    }
}
