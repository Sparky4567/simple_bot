import React, { Component } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import PouchDB from "pouchdb/dist/pouchdb";

class NavigationComponent extends Component {
  constructor() {
    super();
    this.options = {
      navigationButtons: {
        homeButton: "Home",
        learningButton: "Learning mode",
        deleteButton: "Delete data",
        exportButton: "Export data",
        transcriptButton: "Transcripts from Youtube",
        importButton: "Import data",
      },
      deletionConfirmation: `Database was deleted !`,
      dbname: "mainbase",
    };
    this.state = {
      database: new PouchDB(this.options.dbname),
    };
    this.deleteDatabase = this.deleteDatabase.bind(this);
  }

  deleteDatabase() {
    this.state.database.destroy().then(() => {
      Swal.fire({
        text: this.options.deletionConfirmation,
        icon: "success",
        confirmButtonText: `Ok`,
      }).then((res) => {
        if (res.isConfirmed) {
          window.location.href = "/";
        }
      });
    });
  }
  render() {
    return (
      <>
        <div className="container-fluid py-4 bg-dark">
          <div className="row my-4 text-center">
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mx-auto">
              <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12 mx-auto">
                <Link to={{ pathname: "/" }}>
                  <button className="btn btn-sm btn-light mx-2 my-2">
                    <i className="fa fa-4x fa-home"></i>{" "}
                    {this.options.navigationButtons.homeButton}
                  </button>
                </Link>
                <Link to={{ pathname: "/learning" }}>
                  <button className="btn btn-sm btn-light mx-2 my-2">
                    <i className="fa fa-4x fa-book"></i>{" "}
                    {this.options.navigationButtons.learningButton}
                  </button>
                </Link>
                <Link to={{ pathname: "/export" }}>
                  <button className="btn btn-sm btn-light mx-2 my-2">
                    <i className="fa fa-4x fa-file"></i>{" "}
                    {this.options.navigationButtons.exportButton}
                  </button>
                </Link>
                {/* <Link to={{ pathname: "/transcript" }}>
                  <button className="btn btn-sm btn-light mx-2 my-2">
                    <i className="fa fa-4x fa-youtube"></i>{" "}
                    {this.options.navigationButtons.transcriptButton}
                  </button>
                </Link> */}
                <Link to={{ pathname: "/import" }}>
                  <button className="btn btn-sm btn-light mx-2 my-2">
                    <i className="fa fa-4x fa-file-text"></i>{" "}
                    {this.options.navigationButtons.importButton}
                  </button>
                </Link>
                <Link>
                  <button
                    className="btn btn-sm btn-light mx-2 my-2"
                    onClick={this.deleteDatabase}
                  >
                    <i className="fa fa-4x fa-trash"></i>{" "}
                    {this.options.navigationButtons.deleteButton}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NavigationComponent;
