import React, { Component } from "react";
import * as unicodeEmoji from "unicode-emoji";
import PouchDB from "pouchdb/dist/pouchdb";
import NavigationComponent from "../navigation/navigationcomponent";
import FadeIn from "react-fade-in";

class MainComponent extends Component {
  constructor() {
    super();
    this.options = {
      messages: {
        buttonMessage: `Send`,
        noInput: `No messages yet.`,
        emptyInput: `Write something into an input field`,
      },
      dbname: "mainbase",
      style: {
        paragpraphStyle: {
          fontSize: 24 + `px`,
        },
      },
    };
    this.state = {
      inputFieldState: null,
      queryText: null,
      messageArray: [],
      database: new PouchDB(this.options.dbname),
      dbData: null,
      counter: 0,
    };
    this.textUpdate = this.textUpdate.bind(this);
    this.sendPress = this.sendPress.bind(this);
    this.changeState = this.changeState.bind(this);
    this.docRows = this.docRows.bind(this);
    this.searchDb = this.searchDb.bind(this);
    this.scrollToPageBottom = this.scrollToPageBottom.bind(this);
    this.counterIncrease = this.counterIncrease.bind(this);
    this.componentReturn = this.componentReturn.bind(this);
  }

  textUpdate(fieldValue) {
    this.setState({ inputFieldState: fieldValue });
  }

  scrollToPageBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  counterIncrease() {
    this.setState({ counter: this.state.counter + 1 });
  }

  searchDb(passedString) {
    let searchResult;
    let valueArray = [];
    let foundFlag = false;
    passedString = String(passedString)
      .trim()
      .toLowerCase()
      .replaceAll(/\s/g, "");

    if (this.state.dbData !== null) {
      this.state.dbData.forEach((element) => {
        if (String(element.doc.searchId).includes(passedString)) {
          searchResult = element.doc.title;
          valueArray.push(searchResult);
          foundFlag = true;
        } else if (
          String(element.doc.searchId) === `response-to:${passedString}`
        ) {
          searchResult = element.doc.title;
          valueArray.push(searchResult);
          foundFlag = true;
        }
      });
      if (foundFlag === true) {
        return valueArray;
      } else {
        return [false];
      }
    } else {
      return [false];
    }
  }

  changeState(passedData) {
    this.setState({ dbData: passedData });
  }

  docRows() {
    let base = this.state.database;
    base
      .allDocs({
        include_docs: true,
        attachments: true,
      })
      .then((data, error) => {
        if (data) {
          if (data["rows"].length > 0) {
            this.changeState(data["rows"]);
          }
        } else {
          console.log(error);
        }
      });
  }

  sendPress() {
    let emojiList = unicodeEmoji.getEmojis();
    function randomEmoji() {
      return emojiList[Math.floor(Math.random() * emojiList.length)]["emoji"];
    }

    if (this.state.inputFieldState !== null) {
      let messagesList;
      let searchResult;
      if (this.state.messageArray.length > 11) {
        this.setState({ messageArray: [] }, () => {
          messagesList = this.state.messageArray;
          messagesList.push(`${this.state.inputFieldState} ${randomEmoji()}`);
          searchResult = this.searchDb(this.state.inputFieldState);

          searchResult.forEach((element) => {
            if (element === false) {
              messagesList.push(`No results ${randomEmoji()}`);
            } else {
              messagesList.push(`${element} ${randomEmoji()}`);
            }
          });
          this.setState(
            {
              messageArray: messagesList.slice(0, 2),
            },
            () => {
              this.setState(
                { queryText: this.state.messageArray.at(-1) },
                () => {
                  this.scrollToPageBottom();
                }
              );
            }
          );
        });
      } else {
        messagesList = this.state.messageArray;
        messagesList.push(`${this.state.inputFieldState} ${randomEmoji()}`);
        searchResult = this.searchDb(this.state.inputFieldState);
        searchResult.forEach((element) => {
          if (element === false) {
            messagesList.push(`No results ${randomEmoji()}`);
          } else {
            messagesList.push(`${element} ${randomEmoji()}`);
          }
        });

        this.setState(
          {
            messageArray: messagesList,
          },
          () => {
            this.setState({ queryText: this.state.messageArray.at(-1) }, () => {
              this.scrollToPageBottom();
            });
          }
        );
      }
    } else {
      this.setState({ queryText: this.options.messages.emptyInput }, () => {
        this.scrollToPageBottom();
      });
    }
  }

  componentReturn() {
    let arr = [];
    for (
      let index = 0;
      index < this.state.counter &&
      this.state.counter < this.state.messageArray.length;
      index++
    ) {
      arr.push(
        <div key={index}>
          <FadeIn delay={600}>
            <div
              key={this.state.counter}
              className="col-lg-12 col-md-12 col-sm-12 col-xs-12 my-4"
            >
              <div className="bg-dark rounded">
                <hr />
                <p
                  style={this.options.style.paragpraphStyle}
                  className="py-3 px-2"
                >
                  {`Question: ${this.state.messageArray[0]}`}
                </p>
                <hr />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={600}>
            <div
              key={this.state.counter}
              className="col-lg-12 col-md-12 col-sm-12 col-xs-12 my-4"
            >
              <div className="bg-dark rounded">
                <hr />
                <p
                  style={this.options.style.paragpraphStyle}
                  className="py-3 px-2"
                >
                  {`Answer: ${this.state.messageArray[this.state.counter]}`}
                </p>
                <hr />
              </div>
            </div>
          </FadeIn>
        </div>
      );
    }

    return arr;
  }

  componentDidMount() {
    //all db row results
    this.docRows();
  }

  render() {
    return (
      <>
        <NavigationComponent />
        <div className="container-fluid">
          <div className="row">
            {this.state.queryText !== null ? (
              <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto my-4 text-white">
                {this.state.messageArray.length !== 0
                  ? this.state.messageArray.map((val, ind) => {
                      if (ind === 0) {
                        return (
                          <div key={ind}>
                            <FadeIn delay={600}>
                              <div className="bg-dark rounded">
                                <p
                                  style={this.options.style.paragpraphStyle}
                                  className="py-3 px-2"
                                >
                                  {this.state.queryText}
                                </p>
                              </div>
                            </FadeIn>
                            {this.componentReturn()}
                            <button
                              className="btn btn-md btn-success"
                              onClick={this.counterIncrease}
                            >
                              Load more
                            </button>
                          </div>
                        );
                      } else {
                        return "";
                      }
                    })
                  : ""}
              </div>
            ) : (
              <div
                className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto my-4 text-white"
                key={0}
              >
                <div className="bg-dark rounded">
                  <p
                    style={this.options.style.paragpraphStyle}
                    className="py-3 px-2"
                  >
                    {this.options.messages.noInput}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 text-left my-4 mx-auto">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your text"
                  onKeyUp={(event) => {
                    let textValue = String(
                      event.target.value
                    ).toLocaleLowerCase();
                    this.textUpdate(textValue);
                  }}
                />
              </div>
              <div className="text-right my-4">
                <button
                  className="btn btn-lg btn-success"
                  onClick={this.sendPress}
                >
                  <i className="fa fa-send"></i>{" "}
                  {this.options.messages.buttonMessage}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MainComponent;
