import { observable, action } from "mobx";
import uniqid from "uniqid";
import { thisExpression } from "@babel/types";

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
      type: type,
      x2:  x1 + w,
      y2:  y1 + h
    };
    this.components[id].id = id;
    this.components[id].selected = false;
    this.components[id].crop = obj;
    //this.components[id].parent = 0;
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
            console.log(this.components);
    }
  }

  @action setImageId(id) {
    this.imageId = id;
  }

  @action addParent(id, store) {

    let currentComp = this.components[id]
    //if the current component is the root (main screen container)
    if (currentComp.crop.z === 0) {
      currentComp.crop.parent = 0
    }
    else {
      console.log(store.components)
      let comps = store.components
      for (var key in comps) {
        let start = currentComp.crop.x1 > comps[key].crop.x1 && currentComp.crop.y1 > comps[key].crop.y1
        let end = currentComp.crop.x2 < comps[key].crop.x2 && currentComp.crop.y2 < comps[key].crop.y2
        let parentHeight = comps[key].crop.h * comps[key].crop.w
        let childHeight = currentComp.crop.h * currentComp.crop.w

        if (start && end) {//general case (child inside the parent)
          currentComp.crop.parent = comps[key].id
        }
        else if ((currentComp.crop.x1 < comps[key].crop.x1 && currentComp.crop.y1 < comps[key].crop.y1) &&
          (currentComp.crop.x2 < comps[key].crop.x2 && currentComp.crop.y2 < comps[key].crop.y2)) {

          if (parentHeight > childHeight) {
          //if (!currentComp.crop.parent) { 
          currentComp.crop.parent = comps[key].id
           }
          //}
        }
        else if ((currentComp.crop.x1 < comps[key].crop.x1 && currentComp.crop.y1 > comps[key].crop.y1) &&
          (currentComp.crop.x2 < comps[key].crop.x2 && currentComp.crop.y2 > comps[key].crop.y2)) {

          if (parentHeight > childHeight) {
           // if (!currentComp.crop.parent) { 
          currentComp.crop.parent = comps[key].id
          }
           // }
        }

        else if ((currentComp.crop.x1 > comps[key].crop.x1 && currentComp.crop.y1 < comps[key].crop.y1) &&
          (currentComp.crop.x2 > comps[key].crop.x2 && currentComp.crop.y2 < comps[key].crop.y2)) {
          if (parentHeight > childHeight) {
            //if (!currentComp.crop.parent) { 
          currentComp.crop.parent = comps[key].id
          }
            //}
        }

        else if ((currentComp.crop.x1 > comps[key].crop.x1 && currentComp.crop.y1 > comps[key].crop.y1) &&
          (currentComp.crop.x2 > comps[key].crop.x2 && currentComp.crop.y2 > comps[key].crop.y2)) {
          if (parentHeight > childHeight) {
            //if (!currentComp.crop.parent) { 
          currentComp.crop.parent = comps[key].id
          }
            //}
        }

      }
    }
  }
}
