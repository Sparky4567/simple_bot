import React, { Component } from "react";
import PouchDB from "pouchdb/dist/pouchdb";
import Swal from "sweetalert2";

class ImportComponent extends Component {
  constructor(props) {
    super(props);
    this.options = {
      textAreaStyle: {
        width: 100 + `%`,
      },
      dbname: "mainbase",
      messages: {
        dbUpdate: `Database was updated successfully !`,
        placeHolder: `Paste your data here and click "Import"`,
      },
      buttonText: {
        importButtonText: "Import",
        textFieldID: "importField",
      },
    };

    this.state = {
      database: new PouchDB(this.options.dbname),
      dbData: null,
      fieldValue: null,
    };
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.updateDb = this.updateDb.bind(this);
  }

  updateFieldValue(text) {
    if (text !== "") {
      this.setState({ fieldValue: JSON.parse(text) });
    }
  }

  updateDb() {
    if (this.state.fieldValue !== null) {
      this.state.fieldValue.forEach((element) => {
        this.state.database.post({
          searchId: element.searchId,
          title: element.title,
        });
      });

      Swal.fire({
        text: this.options.messages.dbUpdate,
        icon: `success`,
        confirmButtonText: "Ok",
      });
    }
  }

  render() {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto">
            <textarea
              placeholder={this.options.messages.placeHolder}
              id={this.options.textFieldID}
              style={this.options.textAreaStyle}
              rows={10}
              className="form-control form-control-lg my-4"
              onChange={(event) => {
                let text = event.target.value;
                this.updateFieldValue(text);
              }}
            />
            <button className="btn btn-lg btn-dark" onClick={this.updateDb}>
              <i className="fa fa-file-text"></i>{" "}
              {this.options.buttonText.importButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ImportComponent;
