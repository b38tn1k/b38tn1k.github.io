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
    }

    draw(availability) {
        this.generateUIResponse();
    }

    // to tell the user that something is happening
    generateUIResponse() {
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
                                    const team0Display =
                                        team0Names && team0Names.length ? team0Names.join(", ") : "N/A";
                                    console.log(`Team 0: ${team0Display}`);
                                } else {
                                    console.log("Team 0: N/A");
                                }

                                if (Array.isArray(team1Players)) {
                                    const team1Names = team1Players.map((player) => player?.firstName);
                                    const team1Display =
                                        team1Names && team1Names.length ? team1Names.join(", ") : "N/A";
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
            }, 100); // Delay of 1000 milliseconds (adjust as needed)
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

            for (let i = 0; i < playerGroups.length ; i++) {
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
        const numPlayersNeeded = this.numMatchesPerWeek * this.numPlayersPerMatch;

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
