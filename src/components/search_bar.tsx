import { Component } from "react";

import { QueryState } from "../api/github";
import "./search_bar.css";

type SearchBarProps = {
  queryState: QueryState,
  statusFn: (status: QueryState) => void,
  searchFn: (query: string) => void,
}

type SearchBarState = {
  prevSearch: string
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  state: SearchBarState = {
    prevSearch: ""
  }

  // Calls the App's searchFn and stores the search query
  submitInput = (event: React.FormEvent): void => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector("#search-input") as HTMLInputElement;
    this.props.searchFn(input.value);
    this.setState({ prevSearch: input.value });
  }

  // Sets the search state to "new" when we edit the input -- just to show correct text on button
  resetState = (event: React.FormEvent): void => {
    if (this.props.queryState !== "new") {
      const input = event.currentTarget as HTMLInputElement;
      if (input.value !== this.state.prevSearch) this.props.statusFn("new");
    }
  }

  spinner = () => (<span>&nbsp;<div className="SearchBar__loader"></div></span>);

  render() {
    const { queryState } = this.props;
    const btnBusy = (queryState === "started") ? true : false; // Show spinner and disable button for ongoing search
    const btnText = (queryState === "done") ? "Refresh" : "Load"; // Button text is "Reload" when the search is complete

    return (
      <div className="SearchBar">
        <p>Enter a GitHub username:</p>
        <form className="pure-form SearchBar__form" onSubmit={(e: React.FormEvent) => { this.submitInput(e); }}>
          <input type="text" className="SearchBar__form-input" id="search-input" required placeholder="wetterkrank" onChange={this.resetState} />
          {" "}
          <button type="submit" className="SearchBar__form-button pure-button pure-button-primary" disabled={btnBusy}>
            {btnText}
            {btnBusy ? this.spinner() : null}
          </button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
