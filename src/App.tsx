import { Component } from 'react';

import './App.css';
import SearchBar from './components/search_bar';
import ViewPanel from './components/view_panel';
import GithubApi, { TopicFreqs, TopicRepos, RepoList } from './api/github';


interface AppProps {}
interface AppState {
  repos: RepoList | null,
  tFreqs: TopicFreqs | null,
  tRepos: TopicRepos | null
  activeTopic: string | null,
  error: null 
}

class App extends Component<AppProps, AppState> {
  private api: GithubApi;
  private static zeroState = {
    repos: null,
    tFreqs: null,
    tRepos: null,
    activeTopic: null,
    error: null
  }

  constructor(props: AppProps) {
    super(props);
    this.api = new GithubApi(this.processResponse);
    this.state = {...App.zeroState}
  }

  startSearch = async (query: string): Promise<void> => {
    // TODO: Clear the view?
    this.setState (App.zeroState);
    const reposList: RepoList = await this.api.getUserRepos(query);
    this.api.sendTopicsRequests(query, reposList, 1, 200);
    this.setState({repos: reposList});
  }

  processResponse = (repoName: string, repoTopics: string[]): void => {
    // TODO: Save results in Local Storage when complete
    if (repoTopics.length > 0) {
      const tFreqsNew = {...this.state.tFreqs};
      const tReposNew = {...this.state.tRepos};
      repoTopics.forEach(topic => {
        tFreqsNew[topic] ? tFreqsNew[topic] += 1 : tFreqsNew[topic] = 1;
        tReposNew[topic] ? tReposNew[topic].push(repoName) : tReposNew[topic] = [repoName];
      });
      this.setState({tFreqs: tFreqsNew});
      this.setState({tRepos: tReposNew});
    }
  }

  render() {
    const {repos, tFreqs, tRepos, activeTopic} = this.state;
    return (
      <div className="App">
        <SearchBar searchFn={this.startSearch} btnState={repos? "Reload" : "Search"}/>
        <ViewPanel repos={repos} tFreqs={tFreqs} tRepos={tRepos} activeTopic={activeTopic}/>
      </div>
    );
  
  }
}

export default App;
