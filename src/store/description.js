import { observable, action } from "mobx";
import uniqid from "uniqid";

/**
 * @class
 */
export default class Discription {
  @observable components = {};
  selected;
  zIndex = 0;
  imageId;

  @action addComponent(y1, x1, w, h, type) {
    let id = uniqid.time();
    if (!this.components[id]) this.components[id] = {};

    let obj = {
      y1: y1,
      z: this.zIndex,
      x1: x1,
      h: h,
      w: w,
      trr: 0,
      tlr: 0,
      brr: 0,
      blr: 0,
      type: type
    };
    this.components[id].id = id;
    this.components[id].selected = false;
    this.components[id].crop = obj;
    this.zIndex++;
  }

  @action select(id) {
    if (this.selected) this.components[this.selected].selected = false;

    this.selected = id;
    this.components[id].selected = true;
  }

  @action update(id, key, obj) {
    if (this.components[id]) {
      let comp = this.components[id];
      if (!comp[key]) comp[key] = {};
      let temp = comp[key];

      Object.keys(obj).map(k => {
        temp[k] = obj[k];
      });
      comp[key] = temp;
      this.components[id] = comp;
      //console.log(temp);
    }
  }

  @action setImageId(id) {
    this.imageId = id;
  }
}
