/**
 * @class
 */
class Resize {
  constructor(props) {
    this.props = props;
  }

  initialX = 0;
  initialY = 0;
  x2 = 0;
  y2 = 0;
  isTop = false;
  isLeft = false;

  checkRadius() {}

  /**
   * @method
   * @param {object} e
   */
  resize = e => {
    // e.preventDefault();

    let comp = this.props.store.components[this.props.id];
    let x = comp.crop.x1;
    let y = comp.crop.y1;
    let w = comp.crop.w;
    let h = comp.crop.h;
    let x2 = comp.crop.x2;
    let y2 = comp.crop.y2;

    if (this.isTop) {
      h += this.initialY - (e.clientY || e.touches[0].clientY);
      y = e.clientY || e.touches[0].clientY;
      y2 = y + h

      if (y < this.y2 && h > 0) {
        this.props.store.update(this.props.id, "crop", { y1: y, h: h , y2: y2 });
        this.initialY = e.clientY || e.touches[0].clientY;
      }
    } else {
      h += (e.clientY || e.touches[0].clientY) - this.initialY;
      y2 = y + h
      if (h > 0) {
        this.props.store.update(this.props.id, "crop", { h: h , y2: y2 });
        this.initialY = e.clientY || e.touches[0].clientY;
      }
    }

    if (this.isLeft) {
      //let tempx = x;

      w += this.initialX - (e.clientX || e.touches[0].clientX);
      x = e.clientX || e.touches[0].clientX;
      x2 = x + w;

      if (x < this.x2 && w > 0) {
        this.props.store.update(this.props.id, "crop", { x1: x, w: w , x2: x2 });
        this.initialX = e.clientX || e.touches[0].clientX;
      }
    } else {
      w += (e.clientX || e.touches[0].clientX) - this.initialX;
      x2 = x + w;

      if (w > 0) {
        this.props.store.update(this.props.id, "crop", { w: w , x2: x2 });
        this.initialX = e.clientX || e.touches[0].clientX;
      }
    }
  };

  /**
   * @method
   * @param {object} e
   */
  resizeEnd = e => {
    document.removeEventListener("mousemove", this.resize);
    document.removeEventListener("mouseup", this.resizeEnd);
    document.removeEventListener("touchmove", this.resize);
    document.removeEventListener("touchend", this.resizeEnd);
  };

  /**
   * @method
   * @param {object} e
   * @param {boolean} isTop
   * @param {boolean} isLeft
   */
  resizeStart = (e, isTop, isLeft) => {
    if (!this.props.drawing.state.draw) {
      //  e.preventDefault();
      //this.select();
      console.log(e);
      this.isTop = isTop;
      this.isLeft = isLeft;
      this.initialX = e.clientX || e.touches[0].clientX;
      this.initialY = e.clientY || e.touches[0].clientY;
      let comp = this.props.store.components[this.props.id];
      this.y2 = comp.crop.y1 + comp.crop.h;
      this.x2 = comp.crop.x1 + comp.crop.w;

      document.addEventListener("mouseup", this.resizeEnd, false);
      document.addEventListener("touchend", this.resizeEnd, false);

      document.addEventListener("mousemove", this.resize, false);
      document.addEventListener("touchmove", this.resize, false);
    }
  };
}

export default Resize
