import React, { Component } from "react";
import PouchDB from "pouchdb/dist/pouchdb";

class ExportComponent extends Component {
  constructor(props) {
    super(props);
    this.options = {
      textAreaStyle: {
        width: 100 + `%`,
      },
    };
    this.options = {
      dbname: "mainbase",
      textFieldID: "exportField",
      messages: {
        noData: "The database is empty",
      },
    };
    this.state = {
      database: new PouchDB(this.options.dbname),
      dbData: null,
    };
    this.docRows = this.docRows.bind(this);
    this.changeState = this.changeState.bind(this);
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
          } else {
            document.getElementById(this.options.textFieldID).innerText =
              JSON.stringify(this.options.messages.noData);
          }
        } else {
          console.log(error);
        }
      });
  }

  changeState(passedData) {
    this.setState({ dbData: passedData }, () => {
      let dataArray = [];
      this.state.dbData.forEach((element) => {
        dataArray.push({
          searchId: element.doc.searchId,
          title: element.doc.title,
        });
      });
      document.getElementById(this.options.textFieldID).innerText =
        JSON.stringify(dataArray);
    });
  }

  componentDidMount() {
    this.docRows();
  }

  render() {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto">
            <textarea
              id={this.options.textFieldID}
              style={this.options.textAreaStyle}
              rows={10}
              className="form-control form-control-lg my-4"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ExportComponent;
