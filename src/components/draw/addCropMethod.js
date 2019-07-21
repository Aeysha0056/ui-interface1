import store from "../../store/store";
const ds = store.drawing;
export const draw = type => {
  if (!ds.state.draw) {
    ds.setState({ draw: true, h: 0, w: 0, type: type });

    document.addEventListener("mousedown", startDraw);
    document.addEventListener("touchstart", startDraw);
  }
};

export const drawing = e => {
  let tempY = e.clientY || e.touches[0].clientY;
  let tempX = e.clientX || e.touches[0].clientX;

  let state = ds.state;
  let dy = tempY - state.y1;
  let dx = tempX - state.x1;

  if (dy >= 0) state.h = dy;
  else state.h = 0;

  if (dx >= 0) state.w = dx;
  else state.w = 0;

  ds.setState(state);
};

export var drawingFinished = e => {
  document.removeEventListener("mousedown", startDraw);
  document.removeEventListener("mousemove", drawing);
  document.removeEventListener("mouseup", drawingFinished);

  document.removeEventListener("touchstart", startDraw);
  document.removeEventListener("touchmove", drawing);
  document.removeEventListener("touchend", drawingFinished);
  /*let components = this.state.components;
  let comp=

    <Description selected={true} index={this.index} y1={this.state.y1} x1={this.state.x1}
                 w={this.state.w} h={this.state.h} key={this.index} />;
components = components.concat(comp,components)
*/

  store.store.addComponent(
    ds.state.y1,
    ds.state.x1,
    ds.state.w,
    ds.state.h,
    ds.state.type
  );
  ds.setState({ draw: false, show: false });
};

export const startDraw = e => {
  ds.setState({
    x1: e.clientX || e.touches[0].clientX,
    y1: e.clientY || e.touches[0].clientY,
    show: true
  });

  document.addEventListener("mousemove", drawing);
  document.addEventListener("mouseup", drawingFinished);

  document.addEventListener("touchmove", drawing);
  document.addEventListener("touchend", drawingFinished);
};
