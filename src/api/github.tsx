import { Octokit } from "@octokit/rest";
// import { OctokitResponse } from "@octokit/types";

type TopicsList = { [key: string]: { count: number, repos: string[] } };
type RepoList = { key: string, name: string, url: string }[];


class GithubApi {
  private gh: Octokit;
  private resultFn: (repoName: string, topics: string[]) => void;
  private test_data: TopicsList;

  constructor(resultFn: (repoName: string, topics: string[]) => void, test_data = {}) {
    this.gh = new Octokit();
    this.test_data = test_data;
    this.resultFn = resultFn;
  }

  async getUserRepos(username: string): Promise<RepoList> {
    const repos = await this.gh.repos.listForUser({ username: username });
    const repoList: RepoList = repos.data.map(repo => ({ key: repo.name, name: repo.name, url: repo.url }));
    return repoList;
  }

  async sendTopicsRequests(username: string, userRepos: RepoList): Promise<void> {
    // if (Object.keys(this.test_data).length !== 0) return this.test_data;

    const repoNames = userRepos.map(repo => repo.name);
    const dataCalls = repoNames.map(repo => this.gh.repos
      .getAllTopics({ owner: username, repo: repo })
      .then(response => { this.resultFn(repo, response.data.names) })
    );

    await Promise.all(dataCalls);

    // const flatTopicsList: string[] = results.reduce((all: string[], one: string[]) => all.concat(one));

    // const countedTopics: RepoList = flatTopicsList.reduce((freqs, value) => {
    //   freqs[value] ? freqs[value]++ : freqs[value] = 1;
    //   return freqs;
    // }, {} as RepoList);
    // return countedTopics;
  }
}


export type { TopicsList, RepoList };
export default GithubApi;
