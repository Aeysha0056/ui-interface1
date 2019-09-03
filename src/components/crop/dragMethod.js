/**
 * @class
 */
class Drag {
  constructor(props) {
    this.props = props;
  }

  initialX = 0;
  initialY = 0;

  /**
   * @method
   */
  select = () => {
    this.props.store.select(this.props.id);
    this.props.store.addParent(this.props.id , this.props.store)
    //this.container.current.addEventListener("mousedown",dragStart,false)
  };

  /**
   * @method
   * @param {object} e
   */
  drag = e => {
    // e.preventDefault();

    let comp = this.props.store.components[this.props.id];
    let { crop } = comp;
    let x = comp.crop.x1 + (e.clientX || e.touches[0].clientX) - this.initialX;
    let y = comp.crop.y1 + (e.clientY || e.touches[0].clientY) - this.initialY;
    let x2 = x + comp.crop.w;
    let y2 = y + comp.crop.h
    this.props.store.update(this.props.id, "crop", { x1: x, y1: y, x2: x2, y2: y2 });
    this.props.store.addParent(this.props.id , this.props.store)

    this.initialX = e.clientX || e.touches[0].clientX;
    this.initialY = e.clientY || e.touches[0].clientY;
  };

  /**
   * @method
   * @param {object} e
   */
  dragEnd = e => {
    document.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.dragEnd);
    document.removeEventListener("touchmove", this.drag);
    document.removeEventListener("touchend", this.dragEnd);
  };

  /**
   * @method
   * @param {object} e
   */
  dragStart = e => {
    if (!this.props.drawing.state.draw) {
      //  e.preventDefault();
      this.select();
      this.initialX = e.clientX || e.touches[0].clientX;
      this.initialY = e.clientY || e.touches[0].clientY;

      document.addEventListener("mouseup", this.dragEnd, false);
      document.addEventListener("touchend", this.dragEnd, false);

      document.addEventListener("mousemove", this.drag, false);
      document.addEventListener("touchmove", this.drag, false);
    }
  };
}

export default Drag;
