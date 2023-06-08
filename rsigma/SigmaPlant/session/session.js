function slerp(start, end, t) {
    t = 0.5 * (1 - Math.cos(Math.PI * t)); // Sinusoidal easing
    return start * (1 - t) + end * t;
}

function calculateStringSimilarity(str1, str2) {
    const m = str1.length;
    const n = str2.length;

    // Create a 2D array to store the distances
    const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));

    // Initialize the first row and column of the array
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    // Calculate the Levenshtein distance
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // Deletion
                    dp[i][j - 1] + 1, // Insertion
                    dp[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }

    // Return the similarity score (1 - normalized Levenshtein distance)
    const maxLen = Math.max(m, n);
    const similarity = 1 - dp[m][n] / maxLen;
    return similarity;
}

function compressString(input, keyMap) {
    let compressed = input;
    for (let key in keyMap) {
        if (keyMap.hasOwnProperty(key)) {
            const regex = new RegExp(key, 'g');
            compressed = compressed.replace(regex, keyMap[key]);
        }
    }
    return compressed;
}

function decompressString(compressed, keyMap) {
    let decompressed = compressed;
    for (let key in keyMap) {
        if (keyMap.hasOwnProperty(key)) {
            const regex = new RegExp(keyMap[key], 'g');
            decompressed = decompressed.replace(regex, key);
        }
    }
    return decompressed;
}

class Session {
    constructor() {
        this.plants = [new Plant()];
        this.plantsPointer = 0;
        this.mode = 'idle';
        this.transitionTimer = 0;
        this.transitionDuration = 15;
        this.history = [];
        this.undoCursor = 1;
    }

    get plant() {
        return this.plants[this.plantsPointer];
    }

    beginTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(zoom, 0.2, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'do_transition';
            this.transitionTimer = 0;
        }
    }

    doTransition(zoom) {
        let targetPlant = this.plant.targetPlant;
        this.plant.targetPlant = null;
        this.plantsPointer = targetPlant;
        this.plant.enter();
        scrollX = 0;
        scrollY = 0;
        this.plant.update(zoom);
        this.mode = 'end_transition';
        fpsEvent();
    }

    endTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(0.2, 1.0, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'idle';
            this.transitionTimer = 0;
        }
    }

    saveSerializedPlant() {
        const description = this.plants[0].selfDescribe();
        try {
            saveJSON(description, 'myData.json');
        } catch (error) {
            console.error(error);
            console.log(description);
        }
    }

    loadFromObject(info) {
        this.plants[0].selfConstruct(info, this);
    }

    update(zoom) {
        this.plant.update(zoom);
        if (this.plant.mode == 'transition_plant') {
            this.mode = 'begin_transition';
            this.plant.mode = 'idle';
            fpsEvent();
        }

        switch (this.mode) {
            case 'begin_transition':
                this.beginTransition(zoom);
                break;
            case 'do_transition':
                this.doTransition(zoom);
                break;
            case 'end_transition':
                this.endTransition(zoom);
                break;
        }
        if (this.plant.changed === true) {
            this.plant.setChangedFalse();
        }
        if (this.plant.command.length > 0) {
            this.history.push({
                plant: this.plantsPointer,
                command: this.plant.command
            });
            this.plant.command = [];
        }
    }

    doUndo() {
        // console.log(this.history);
        if (this.history.length >= this.undoCursor) {
            let lastItem = this.history.pop();
            // console.log(lastItem.command);
            for (let i = 0; i < lastItem.command.length; i++) {
                let target = this.plants[lastItem.plant].findID(lastItem.command[i].id);
                // console.log(target);
                switch (lastItem.command[i].command) {
                    case 'move':
                        target.move(lastItem.command[i].reverse[0],lastItem.command[i].reverse[1], false)
                        break;
                    default:
                        break;
                }
            }
        }
    }

    serializePlant() {
        const description = this.plants[0].selfDescribe();
        let res = ' ';
        try {
            res = JSON.stringify(description);
        } catch (error) {
            console.error(error);
            console.log(description);
        }
        return res;
    }

    draw(zoom, cnv) {
        this.plant.draw(zoom, cnv);
    }

    addProcess(x, y) {
        let newPlant = new Plant();
        newPlant.addSource(0, -246);
        newPlant.addMetric(0, 0);
        newPlant.addSink(0, 246);
        newPlant.addConnector(0, 0, newPlant.features[1], newPlant.features[0]);
        newPlant.addConnector(0, 0, newPlant.features[2], newPlant.features[1]);
        let parentLink = new ParentLink(-196, 0);
        parentLink.targetPlant = this.plantsPointer;
        newPlant.features.push(parentLink);
        for (let i = 0; i < newPlant.features.length; i++) {
            // why isnt this working
            newPlant.features[i].turnOffAnimations();
        }
        this.plants.push(newPlant);
        let newProcess = new Process(
            x,
            y,
            400,
            280,
            newPlant,
            this.plants.length - 1
        );
        this.plant.features.push(newProcess);
    }

    addSink(x, y) {
        this.plant.addSink(x, y);
        // this.plant.features.push(new Sink(x, y));
    }

    addSource(x, y) {
        this.plant.addSource(x, y);
        // this.plant.features.push(new Source(x, y));
    }

    addZone(x, y) {
        this.plant.addZone(x, y);
        // this.plant.features.push(new Zone(x, y));
    }

    addMetric(x, y) {
        this.plant.addMetric(x, y);
        // this.plant.features.push(new Metric(x, y));
    }

    addSplit(x, y) {
        this.plant.addSplit(x, y);
        // this.plant.features.push(new Split(x, y));
    }

    addMerge(x, y) {
        this.plant.addMerge(x, y);
        // this.plant.features.push(new Merge(x, y));
    }

    addConnector(x, y, input, output) {
        this.plant.addConnector(x, y, input, output);
        // this.plant.features.push(new Connector(x, y, input, output));
    }
}
