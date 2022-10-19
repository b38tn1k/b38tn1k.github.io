var GPS_QUEUE_LENGTH = 3;
var positionRaw = [];

function getPosition(position) {
  if (position) {
    positionRaw = [position.coords.latitude, position.coords.longitude];
  }
}

class lgeGPSStream {
  constructor() {
    jlog('lgeGPSStream', 'constructor');
    this.heading = 0;
    this.gpsQueue = [];
    this.initialise();
  }

  initialise() {
    while (this.gpsQueue.length < GPS_QUEUE_LENGTH) {
      this.getCurrentCoords();
      this.gpsQueue.push(positionRaw);
    }
  }

  get lat() {
    return this.gpsQueue[0][0];
  }

  get lon() {
    return this.gpsQueue[0][1];
  }

  getCurrentCoords() {
    let pos;
    if (this.source == null) {
      navigator.geolocation.getCurrentPosition(getPosition);
      getPosition();
      pos = positionRaw;
    } else {
      pos = this.source();
    }
    return pos;
  }

  update () {
    this.getCurrentCoords();
    this.gpsQueue.unshift(positionRaw);
    this.gpsQueue.pop();
  }

}
