class TimedLog {
    constructor() {
        this.time = millis();
        this.logs = {};
    }

    log(caller, msg=' ', interval=1) {
        if (caller in this.logs) {
            this.logs[caller].msg = msg;
            this.logs[caller].updated = true;
        } else {
            this.logs[caller] = {}
            this.logs[caller].msg = msg;
            this.logs[caller].interval = interval;
            this.logs[caller].trigger = millis();
            this.logs[caller].updated = true;
        }
    }

    update() {
        for (key in this.logs) {
            if (this.logs[key].trigger < millis() && this.logs[key].updated == true){
                console.log(key, this.logs[key].msg);
                this.logs[key].trigger = millis() + (this.logs[key].interval * 1000);
                this.logs[key].updated = false;
            }
        }
    }
    

}