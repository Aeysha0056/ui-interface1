import React from "react";
import { inject, observer } from "mobx-react";

import Draw from "./components/draw/draw";
import Crop from "./components/crop/crop";
import { draw } from "./components/draw/addCropMethod";
import Tabs from "./components/tab/Tabs";
import { OptionText } from "./components/Text";
import "./styles/MainPage.css";

@inject("store")
@inject("drawing")
@observer

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      ...props
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyHandler);
  }

  keyHandler = e => {
    if (e.key === "Escape") {
      if (this.state.drawing.state.draw)
        this.state.drawing.setState({ draw: false });
    }
  };

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }
  };

  selectOption = option => {
    let selectedCrop = this.state.store.selected;
    this.state.store.update(selectedCrop, "crop", { type: option });
  };

  render() {
    let state = this.props.drawing.state;
    let { selectedCrop } = this.state;
    let selected = this.state.store.components[this.state.store.selected];

    return (
      <div
        className="row full-height dark-background"
        style={{ margin: "auto" }}
      >
        {/** Left side Col */}

        <div className="col-8 pt-5">
          <div className="row justify-content-center align-content-center">
            <OptionText text="NewCrop" onClick={() => draw("")} />
            <OptionText
              text="Dynamic"
              isSelected={selectedCrop && selectedCrop.crop.type === "dynamic"}
              onClick={() => this.selectOption("dynamic")}
            />
            <OptionText
              text="Fixed"
              isSelected={selectedCrop && selectedCrop.crop.type === "fixed"}
              onClick={() => this.selectOption("fixed")}
            />

            <label htmlFor="image-upload" className="col-2 light-creamy-text">
              Import
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={this.onImageChange}
            />
          </div>
          <div className="row justify-content-center pt-5">
            {this.state.image && (
              <img src={this.state.image} alt="img" className="border" />
            )}
          </div>

          <div className={state.draw === true ? "App draw" : "App"}>
            <Draw
              h={state.h + "px"}
              w={state.w + "px"}
              y1={state.y1 + "px"}
              x1={state.x1 + "px"}
              show={state.show}
            />

            {Object.keys(this.state.store.components).map(key => {
              let item = this.state.store.components[key];

              return (
                <Crop
                  id={item.id}
                  key={item.id}
                  onClick={() => this.setState({ selectedCrop: item })}
                />
              );
            })}
          </div>
        </div>

        {/** Right side Col: Options Bar */}
        <div className="col-4 p-0 m-0 pt-5 light-background">
          <Tabs />
        </div>
      </div>
    );
  }
}

export default Main;
