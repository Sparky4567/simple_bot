import React, { Component } from "react";
import Swal from "sweetalert2";
import PouchDB from "pouchdb/dist/pouchdb";

class LearningComponent extends Component {
  constructor() {
    super();
    this.options = {
      dbname: "mainbase",
      placeholders: {
        questionPlaceHolder: `Enter your question`,
        responsePlaceHolder: `Enter a response`,
      },
      messages: {
        storingError: `Storing error`,
      },
      buttonsText: {
        submitButtontext: `Submit`,
      },
    };
    this.state = {
      questionField: null,
      responseField: [],
      responsesCount: 1,
      database: new PouchDB(this.options.dbname),
      inputElements: [],
    };
    this.updateDb = this.updateDb.bind(this);
    this.questionFieldChange = this.questionFieldChange.bind(this);
    this.responseFieldChange = this.responseFieldChange.bind(this);
    this.increaseResponseCount = this.increaseResponseCount.bind(this);
    this.responseFieldChange = this.responseFieldChange.bind(this);
  }

  questionFieldChange(passedString) {
    if (passedString === "") {
      this.setState({ questionField: null });
    } else {
      this.setState({ questionField: passedString });
    }
  }

  responseFieldChange(passedString) {
    if (passedString !== "") {
      let arr = this.state.responseField;
      if (passedString !== null) {
        arr.push(passedString);
        this.setState({
          responseField: arr,
        });
      }
    }
  }

  increaseResponseCount() {
    this.setState({ responsesCount: this.state.responsesCount + 1 });
  }

  returnInputfields() {
    let arr = [];
    for (let index = 0; index < this.state.responsesCount; index++) {
      arr.push(
        <input
          key={index}
          className="form-control form-control-lg my-4 inputFields"
          type="text"
          placeholder={this.options.placeholders.responsePlaceHolder}
          // onChange={(event) => {
          //   let textValue = String(event.target.value).toLowerCase();
          //   this.responseFieldChange(textValue);
          // }}
        />
      );
    }
    return arr;
  }

  updateDb() {
    if (
      this.state.questionField !== null &&
      this.state.responseField !== null
    ) {
      let allResponseFields = document.getElementsByClassName("inputFields");
      for (let index = 0; index < allResponseFields.length; index++) {
        const element = allResponseFields[index];
        this.responseFieldChange(String(element.value));
      }
      this.state.responseField.forEach((element, index) => {
        this.state.database.post({
          searchId: `response-to:${String(
            this.state.questionField.trim().toLowerCase().replaceAll(/\s/g, "")
          )}`,
          title: String(element).toLowerCase(),
        });
      });
      Swal.fire({
        title: "Db was updated",
        text: "Success!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      if (this.state.questionField === null) {
        Swal.fire({
          title: `Question field is empty !`,
          text: `You can not leave empty fields`,
          icon: "error",
          confirmButtonText: `Ok`,
        });
      } else if (this.state.responseField === null) {
        Swal.fire({
          title: `Response field is empty !`,
          text: `You can not leave empty fields`,

          icon: "error",
          confirmButtonText: `Ok`,
        });
      }
    }
  }

  render() {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto">
            <input
              className="form-control form-control-lg my-4"
              type="text"
              placeholder={this.options.placeholders.questionPlaceHolder}
              onChange={(event) => {
                let textValue = String(event.target.value).toLowerCase();
                this.questionFieldChange(textValue);
              }}
            />
            <button
              className="btn btn-lg btn-success mx-2"
              onClick={this.increaseResponseCount}
            >
              <i className="fa fa-plus"></i> Add one more response field
            </button>
            {this.returnInputfields()}

            <button className="btn btn-lg btn-success" onClick={this.updateDb}>
              <i className="fa fa-send"></i>{" "}
              {this.options.buttonsText.submitButtontext}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LearningComponent;
