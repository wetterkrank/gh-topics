import { Component } from "react";

import './search_bar.css';

type SearchBarProps = {
  btnState: "Search" | "Reload",
  searchFn: (query: string) => void
}

class SearchBar extends Component<SearchBarProps, {}> {
  // shouldComponentUpdate() {
  //   return false;
  // }

  submitInput = (event: React.FormEvent): void => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('#search-input') as HTMLInputElement;
    this.props.searchFn(input.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <form className="search-form" onSubmit={(e: React.FormEvent) => { this.submitInput(e); }}>
          <input type="text" className="search-input" id="search-input" required />
          <input type="submit" className="search-button" value={this.props.btnState} />
        </form>
      </div>
    );
  }
}

export default SearchBar;
