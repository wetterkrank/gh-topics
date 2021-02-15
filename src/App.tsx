import React, { Component } from 'react';

import './App.css';
import SearchBar from './components/search_bar';
import ViewPanel from './components/view_panel';
import GithubApi, { TopicsList, RepoList } from './api/github';


interface AppProps {}
interface AppState {
  repos: RepoList | null,
  topics: TopicsList | null,
  activeTopic: string | null,
  error: null 
}

class App extends Component<AppProps, AppState> {
  private api: GithubApi;

  state = {
    repos: null,
    topics: null,
    activeTopic: null,
    error: null
  }

  constructor(props: AppProps) {
    super(props);
    this.api = new GithubApi(this.processResponse);
  }

  startSearch = async (query: string): Promise<void> => {
    const reposList: RepoList = await this.api.getUserRepos(query);
    this.setState({repos: reposList});
    this.api.sendTopicsRequests(query, reposList);
  }

  processResponse = (repoName: string, topics: string[]): void => {
    console.log(`${repoName}: ${topics}`);
  }

  render() {
    const {repos, topics, activeTopic} = this.state;
    return (
      <div className="App">
        <SearchBar searchFn={this.startSearch} btnState={repos? "Reload" : "Search"}/>
        <ViewPanel repos={repos} topics={topics} activeTopic={activeTopic}/>
      </div>
    );
  
  }
}

export default App;
