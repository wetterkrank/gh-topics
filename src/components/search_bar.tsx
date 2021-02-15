import { Component } from "react";

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
      <div className="search-bar">
        <form className="search-form" onSubmit={(e: React.FormEvent) => { this.submitInput(e); }}>
          <input type="text" className="search-input" id="search-input" required />
          <input type="submit" value={this.props.btnState} className="search-button"/>
        </form>
      </div>
    );
  }
}

export default SearchBar;
