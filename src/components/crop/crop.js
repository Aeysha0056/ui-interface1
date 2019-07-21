import React from "react";
import "./select.css";
import { inject, observer } from "mobx-react";
import Drag from "./dragMethod";
import Resize from "./resizeMethod";
import Radius from "./radiusMethod";
@inject("store")
@inject("drawing")
@observer
class Crop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.container = React.createRef();

    this.drag = new Drag(props);
    this.resize = new Resize(props);
    this.radius = new Radius(props);
  }

  componentDidMount() {
    this.container.current.addEventListener("mousedown", this.drag.dragStart);
    this.container.current.addEventListener("touchstart", this.drag.dragStart);
  }

  render() {
    //alert("render");

    let comp = this.props.store.components[this.props.id];
    let { crop } = comp;
    let x = comp.crop.x1;
    let y = comp.crop.y1;
    let w = comp.crop.w;
    let h = comp.crop.h;

    let style = {
      position: "absolute",
      display: "flex",
      top: y + "px",
      left: x + "px",
      zIndex: comp.crop.z + 1,
      height: h + "px",
      width: w + "px",
      borderTopRightRadius: comp.crop.trr + "px",
      borderTopLeftRadius: comp.crop.tlr + "px",
      borderBottomRightRadius: comp.crop.brr + "px",
      borderBottomLeftRadius: comp.crop.blr + "px",
      border: comp.selected ? "1px dashed black" : "1px solid black",
      justifyContent: "center"
    };

    //Points adjustment

    //console.log(lty +" : "+comp.crop.tlr + " : " +   comp.crop.w  );

    let selected = comp.selected;

    return (
      <div style={style}>
        <div
          ref={this.container}
          style={{
            width: "100%",
            height: "100%"
          }}
        ></div>

        {/* Resize Componetns */}

        {selected && (
          <div
            onTouchStart={e => this.resize.resizeStart(e, true, true)}
            onMouseDown={e => this.resize.resizeStart(e, true, true)}
            className="resizeButton resizeTop resizeLeft"
            style={{
              transform: `translate(${crop.ltx || 0}px, ${crop.lty || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.resize.resizeStart(e, true, false)}
            onMouseDown={e => this.resize.resizeStart(e, true, false)}
            className="resizeButton resizeTop resizeRight"
            style={{
              transform: `translate(-${crop.rtx || 0}px, ${crop.rty || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.resize.resizeStart(e, false, false)}
            onMouseDown={e => this.resize.resizeStart(e, false, false)}
            className="resizeButton resizeBottom resizeRight"
            style={{
              transform: `translate(-${crop.rbx || 0}px, -${crop.rby || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.resize.resizeStart(e, false, true)}
            onMouseDown={e => this.resize.resizeStart(e, false, true)}
            className="resizeButton resizeBottom resizeLeft"
            style={{
              transform: `translate(${crop.lbx || 0}px, -${crop.lby || 0}px)`
            }}
          ></div>
        )}

        {/* Radius Components */}

        {selected && (
          <div
            onTouchStart={e => this.radius.resizeStart(e, true, true)}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              this.radius.resizeStart(e, true, true);
            }}
            className="resizeButton tlr"
            style={{
              transform: `translate(${crop.ltx || 0}px, ${crop.lty || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.radius.resizeStart(e, true, false)}
            onMouseDown={e => this.radius.resizeStart(e, true, false)}
            className="resizeButton trr"
            style={{
              transform: `translate(-${crop.rtx || 0}px, ${crop.rty || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.radius.resizeStart(e, false, false)}
            onMouseDown={e => this.radius.resizeStart(e, false, false)}
            className="resizeButton brr"
            style={{
              transform: `translate(-${crop.rbx || 0}px, -${crop.rby || 0}px)`
            }}
          ></div>
        )}

        {selected && (
          <div
            onTouchStart={e => this.radius.resizeStart(e, false, true)}
            onMouseDown={e => this.radius.resizeStart(e, false, true)}
            className="resizeButton blr"
            style={{
              transform: `translate(${crop.lbx || 0}px, -${crop.lby || 0}px)`
            }}
          ></div>
        )}
      </div>
    );
  }
}

export default Crop;
