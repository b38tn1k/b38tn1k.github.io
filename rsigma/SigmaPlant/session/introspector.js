class ReportFilter {
    constructor() {
        this.criterea = criteria;
        this.action = action;
      }

}

class Introspector {
  constructor() {
    this.reportFilters = [];
  }

  selfDescribe() {
    let info = {};
    info['this'] = this.constructor.name;
    // console.log(this.g.constructor.name);
    info['subclasses'] = {};
    if (this.g) {
      info['subclasses'][this.g.constructor.name] = this.g.selfDescribe();
    }

    if (this.buttons) {
      info['subclasses']['buttons'] = [];
      for (let button of this.buttons) {
        info['subclasses']['buttons'].push(button.selfDescribe());
      }
    }

    if (this.dataLabels) {
      info['subclasses']['dataLabels'] = {};
      for (let label in this.dataLabels) {
        info['subclasses']['dataLabels'][label] =
          this.dataLabels[label].selfDescribe();
      }
    }

    info['properties'] = {};
    Object.keys(this).forEach((key) => {
      if (this[key] instanceof p5.Vector) {
        info['properties'][key] = {
          x: this[key].x,
          y: this[key].y,
          z: this[key].z
        };
      } else if (key == 'g') {
        info['properties'][key] = this.g.constructor.name;
      } else if (key == 'action') {
        1;
      } else if (key == 'buttons') {
        1;
      } else if (key == 'dataLabels') {
        1;
      } else if (key == 'anchors') {
        info['properties'][key] = {};
        info['properties'][key]['Input'] = this[key]['Input'].id;
        info['properties'][key]['Output'] = this[key]['Output'].id;
      } else if (key == 'input') {
        1; //TODO;
      } else if (key == 'output') {
        1; //TODO;
      } else if (key == 'buses') {
        1; //TODO;
      } else if (key == 'children') {
        1; //TODO;
      } else if (key == 'plant') {
        info['properties'][key] = [];
        info['properties'][key].push(this.plant.selfDescribe());
      } else {
        info['properties'][key] = this[key];
      }
    });

    return info;
  }
}
