import { observable, action } from "mobx";

/**
 * @class
 */
export default class DrawingStore {
  @observable state = { draw: false, x1: 0, y1: 0, h: 0, w: 0 };

  @action setState(data) {
    this.state = { ...this.state, ...data };
  }
}
