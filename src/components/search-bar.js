import React, { Component } from "react";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", placeHolder: "Tapez votre film..." };
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8 input-group">
          <input
            className="form-control input-lg"
            onChange={this.handleChange.bind(this)}
            placeholder={this.state.placeHolder}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-secondary"
              onClick={this.handleOnClick.bind(this)}
            >
              Go
            </button>
          </span>
        </div>
      </div>
    );
  }

  handleOnClick() {
    this.search();
  }

  search() {
    this.props.callback(this.state.searchText);
    this.setState({ lockRequest: false })
  }

  handleChange(event) {
    this.setState({ searchText: event.target.value });
    if (!this.state.lockRequest) {
      // Lock request
      this.setState({ lockRequest: true });

      // Now we make a request at each interval of time
      setTimeout(
        function() {
          this.search();
        }.bind(this),
        this.state.intervalBeforeRequest
      );
    }
  }
}

export default SearchBar;
