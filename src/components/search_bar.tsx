import { Component } from "react";
import { QueryState } from "../api/github";

import "./search_bar.css";

type SearchBarProps = {
  queryState: QueryState,
  statusFn: (status: QueryState) => void;
  searchFn: (query: string) => void,
}

type SearchBarState = {
  prevSearch: string
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  state: SearchBarState = {
    prevSearch: ""
  }

  submitInput = (event: React.FormEvent): void => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector("#search-input") as HTMLInputElement;
    this.props.searchFn(input.value);
    this.setState({ prevSearch: input.value });
  }

  resetState = (event: React.FormEvent): void => {
    if (this.props.queryState !== "new") {
      const input = event.currentTarget as HTMLInputElement;
      if (input.value !== this.state.prevSearch) this.props.statusFn("new");
    }
  }

  spinner = () => (<span>&nbsp;<div className="SearchBar__loader"></div></span>);

  render() {
    const { queryState } = this.props;
    const showSpinner = (queryState === "started") ? true : false;
    const btnText = (queryState === "done") ? "Reload" : "Search";

    return (
      <div className="SearchBar">
        <form className="pure-form" onSubmit={(e: React.FormEvent) => { this.submitInput(e); }}>
          <fieldset>
            <input type="text" id="search-input" required placeholder="wetterkrank" onChange = {this.resetState} />
            {" "}
            <button type="submit" className="pure-button pure-button-primary">
              {btnText}
              {showSpinner ? this.spinner() : null}
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBar;
