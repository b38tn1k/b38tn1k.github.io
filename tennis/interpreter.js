class Interpreter {
    constructor(players, gameSchedule, img) {
        this.players = players;
        this.gameSchedule = gameSchedule;
        this.img = img;
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
        console.table(reportCards);
        return reportCards;
    }

    calculateOptimalConfiguration(numOfWeeks, mainBorderSize) {
        let optimalCols = 1;
        let optimalRows = numOfWeeks;
        let optimalRatio = this.img.width / this.img.height;
        for (let cols = 1; cols <= numOfWeeks; cols++) {
            let rows = Math.ceil(numOfWeeks / cols);
            let cellWidth = (this.img.width - mainBorderSize * (cols + 1)) / cols;
            let cellHeight = (this.img.height - mainBorderSize * (rows + 1)) / rows;
            let ratio = cellWidth / cellHeight;
            if (Math.abs(1 - ratio) < Math.abs(1 - optimalRatio)) {
                optimalCols = cols;
                optimalRows = rows;
                optimalRatio = ratio;
            }
        }
        return { optimalCols, optimalRows };
    }

    drawMainGrid(optimalRows, optimalCols, mainBorderSize, rectWidth, rectHeight, largeTextSize) {
        let numOfWeeks = this.gameSchedule.length;
        let mainGrid = [];
        for (let i = 0; i < optimalRows; i++) {
            for (let j = 0; j < optimalCols; j++) {
                if (numOfWeeks > 0) {
                    const x = mainBorderSize + j * (rectWidth + mainBorderSize);
                    const y = mainBorderSize + i * (rectHeight + mainBorderSize);
                    mainGrid.push({
                        x: x,
                        y: y,
                        w: rectWidth,
                        h: rectHeight,
                        tx: x + rectWidth / 2,
                        ty: y + this.img.textSize() * 2,
                    });
                    this.img.noFill();
                    this.img.stroke(230, 150, 100);
                    this.img.rect(x, y, rectWidth, rectHeight);
                    numOfWeeks--;
                }
            }
        }
        return mainGrid;
    }

    calculateInnerGridDimensions(mainGrid, i, innerBorderSize, shrinker, desiredRatio) {
        let numGames = this.gameSchedule[i].length;
        let numGamesTemp = numGames;
        let optimalInnerCols = Math.round(Math.sqrt(numGamesTemp / desiredRatio));
        let optimalInnerRows = Math.ceil(numGamesTemp / optimalInnerCols);

        let availableWidth = mainGrid[i].w - innerBorderSize * (optimalInnerCols + 1);
        let availableHeight = mainGrid[i].h - innerBorderSize * (optimalInnerRows + 1);

        let rawInnerWidth = availableWidth / optimalInnerCols;
        let rawInnerHeight = availableHeight / optimalInnerRows;

        let innerWidth, innerHeight;
        if (rawInnerWidth / rawInnerHeight > desiredRatio) {
            innerHeight = rawInnerHeight;
            innerWidth = innerHeight * desiredRatio;
        } else {
            innerWidth = rawInnerWidth;
            innerHeight = innerWidth / desiredRatio;
        }

        innerWidth *= shrinker;
        innerHeight *= shrinker;

        return { innerWidth, innerHeight, optimalInnerCols, optimalInnerRows, numGamesTemp };
    }

    drawInnerGrid(
        mainGrid,
        i,
        smallTextSize,
        optimalInnerRows,
        optimalInnerCols,
        innerWidth,
        innerHeight,
        horizontalBorderSize,
        verticalBorderSize,
        startX,
        startY,
        numGamesTemp
    ) {
        for (let j = 0; j < optimalInnerRows; j++) {
            for (let k = 0; k < optimalInnerCols; k++) {
                if (numGamesTemp > 0) {
                    let x = startX + k * (innerWidth + horizontalBorderSize);
                    let y = startY + j * (innerHeight + verticalBorderSize);
                    this.drawInnerGridItem(mainGrid, i, j, k, x, y, innerWidth, innerHeight);
                    numGamesTemp--;
                }
            }
        }
    }

    drawInnerGridItem(mainGrid, i, j, k, x, y, innerWidth, innerHeight) {
        let tyTop = y - this.img.textSize() * 3;
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
        drawTennisCourt(this.img, x, y, innerWidth, innerHeight);
    }

    drawPoster() {
        this.img.background(color("#CC6633"));
        this.img.textAlign(CENTER, CENTER);
        if (this.gameSchedule && Array.isArray(this.gameSchedule)) {
            let numOfWeeks = this.gameSchedule.length;
            let mainBorderSize = 20;
            let innerBorderSize = 10;
            let shrinker = 0.5;
            let desiredRatio = 2 / 3;

            let { optimalCols, optimalRows } = this.calculateOptimalConfiguration(numOfWeeks, mainBorderSize);
            let rectWidth = (this.img.width - mainBorderSize * (optimalCols + 1)) / optimalCols;
            let rectHeight = (this.img.height - mainBorderSize * (optimalRows + 1)) / optimalRows;
            let largeTextSize = 0.05 * rectWidth;

            let mainGrid = this.drawMainGrid(
                optimalRows,
                optimalCols,
                mainBorderSize,
                rectWidth,
                rectHeight,
                largeTextSize
            );

            this.img.noStroke();
            this.img.fill(255);
            for (let i = 0; i < mainGrid.length; i++) {
                this.img.textSize(largeTextSize);
                this.img.fill(255);
                this.img.text("Week " + String(i + 1), mainGrid[i].tx, mainGrid[i].ty);

                let { innerWidth, innerHeight, optimalInnerCols, optimalInnerRows, numGamesTemp } =
                    this.calculateInnerGridDimensions(mainGrid, i, innerBorderSize, shrinker, desiredRatio);

                let totalCourtsWidth = optimalInnerCols * innerWidth;
                let totalCourtsHeight = optimalInnerRows * innerHeight;
                let remainingWidth = mainGrid[i].w - totalCourtsWidth;
                let remainingHeight = mainGrid[i].h - totalCourtsHeight;
                let horizontalBorderSize = Math.max(10, remainingWidth / (optimalInnerCols + 1));
                let verticalBorderSize = Math.max(10, remainingHeight / (optimalInnerRows + 1));
                let totalInnerWidth = innerWidth * optimalInnerCols + horizontalBorderSize * (optimalInnerCols - 1);
                let totalInnerHeight = innerHeight * optimalInnerRows + verticalBorderSize * (optimalInnerRows - 1);
                let startX = mainGrid[i].x + (mainGrid[i].w - totalInnerWidth) / 2;
                let startY = this.img.textSize() * 0.5 + mainGrid[i].y + (mainGrid[i].h - totalInnerHeight) / 2;

                let smallTextSize = innerWidth * 0.15;
                this.img.textSize(smallTextSize);

                this.drawInnerGrid(
                    mainGrid,
                    i,
                    smallTextSize,
                    optimalInnerRows,
                    optimalInnerCols,
                    innerWidth,
                    innerHeight,
                    horizontalBorderSize,
                    verticalBorderSize,
                    startX,
                    startY,
                    numGamesTemp
                );
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
}
