
// Tennis League Matchmaking Tool
class Scheduler {
    constructor(players) {
        this.players = players;
        this.gameSchedule = [];
        this.numWeeks = 6;
        this.numMatchesPerWeek = 2;
        this.numPlayersPerMatch = 4;
        this.modeHandOff = -1;
    }

    draw() {
        
    }

    generateSchedule() {
        // Initialize player statistics
        this.players.forEach((player) => {
            player.gamesPlayed = 0;
            player.gamesCaptained = 0;
            player.gamesMissed = 0;
        });

        // Create game schedule
        for (let week = 0; week < this.numWeeks; week++) {
            const matches = [];

            const availablePlayers = this.getAvailablePlayers(week);
            const selectedPlayers = this.selectPlayers(availablePlayers);
            const playerGroups = this.createPlayerGroups(selectedPlayers);
            const captains = this.selectCaptains(playerGroups);

            for (let i = 0; i < this.numMatchesPerWeek; i++) {
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
        return this.players.filter(
            (player) => player.availability[week] && player.gamesPlayed < this.numMatchesPerWeek
        );
    }

    selectPlayers(availablePlayers) {
      const numAvailablePlayers = availablePlayers.length;
      const numPlayersNeeded = Math.min(
        numAvailablePlayers,
        this.numPlayersPerMatch * this.numMatchesPerWeek
      );
    
      if (numPlayersNeeded >= this.numPlayersPerMatch) {
        return availablePlayers.slice(0, numPlayersNeeded);
      } else {
        console.warn(`Not enough players available for week `);
        return [];
      }
    }

    createPlayerGroups(selectedPlayers) {
        const numPlayersNeeded = this.numPlayersPerMatch * this.numMatchesPerWeek;
        const numGroups = numPlayersNeeded / this.numPlayersPerMatch;

        const playerGroups = [];

        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * this.numPlayersPerMatch;
            const endIndex = startIndex + this.numPlayersPerMatch;
            const group = selectedPlayers.slice(startIndex, endIndex);
            playerGroups.push(group);
        }

        return playerGroups;
    }

    selectCaptains(playerGroups) {
        const captains = [];

        playerGroups.forEach((group) => {
            const playersWithoutCaptains = group.filter((player) => player.gamesCaptained === 0);
            let captain;

            if (playersWithoutCaptains.length > 0) {
                captain = this.getRandomElement(playersWithoutCaptains);
            } else {
                captain = this.getRandomElement(group);
            }

            captains.push(captain);
        });

        return captains;
    }

    createTeams(playersInMatch, captain) {
        const teams = [[captain], []];

        playersInMatch.forEach((player) => {
            if (player !== captain) {
                const randomIndex = Math.floor(Math.random() * 2);
                teams[randomIndex].push(player);
            }
        });

        return teams;
    }

    getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}