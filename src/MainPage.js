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

/**
 * @class
 * @extends React
 */
class MainPage extends React.Component {

  /**
   * @constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      ...props
    };

    /** global project ID */
    this.projectId = "5d39acacc3609924e0a5b81f"; // TODO: change it later

  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyHandler);
  }

  /**
   * @method
   * @param  {object} e
   */
  keyHandler = e => {
    if (e.key === "Escape") {
      if (this.state.drawing.state.draw)
        this.state.drawing.setState({ draw: false });
    }
  };

  /**
   * display the uploaded image
   *
   * @method
   * @param  {opject} event
   */
  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {

      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });

      this.getImageId(event.target.files[0].name)

    }
  };

  /**
   * send the image name to the database and get an id
   *
   * @method
   * @param  {string} imageName the name of uploaded image
   */
  getImageId = imageName => {
    let requestBody = {
      projectId: this.projectId,
      img: imageName,
      store: {}
    }

    // create a doc for image in db and save the id
    fetch("http://localhost:5000/import", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          alert('Please check your connection!')
        }
        return res.json();
      })
      .then(resData => {
        this.state.store.setImageId(resData.import._id)
      })
      .catch(err => {
        this.setState({ fetching: false, errorMsg: "Something Wrong!" });
      });
  }

  /**
   * save the selected crop Type
   *
   * @method
   * @param {"dynamic" | "fixed"} option
   */
  selectedOption = option => {
    let selectedCrop = this.state.store.selected;
    this.state.store.update(selectedCrop, "crop", { type: option });
  };

  /**
   * @method
   */
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
              onClick={() => this.selectedOption("dynamic")}
            />
            <OptionText
              text="Fixed"
              isSelected={selectedCrop && selectedCrop.crop.type === "fixed"}
              onClick={() => this.selectedOption("fixed")}
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

export default MainPage;
