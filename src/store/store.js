import Description from "./description";
import DrawingStore from "./draw";

const ds = new Description();
const drawing = new DrawingStore();
console.log(ds);

var store = {
  store: ds,
  drawing: drawing
};

export default store;
