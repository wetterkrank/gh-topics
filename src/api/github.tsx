import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";


type TopicFreqs = { [key: string]: number };
type TopicRepos = { [key: string]: string[] };
type RepoList = { key: string, name: string, url: string }[];
type QueryState = "new" | "started" | "done" | "error";


class GithubApi {
  private gh: Octokit;
  private resultFn: (repoName: string, topics: string[]) => void;
  private statusFn: (status: QueryState, err?: any) => void;
  private emergency: boolean;
  private test_data: TopicFreqs;

  constructor(
    resultFn: (repoName: string, topics: string[]) => void,
    statusFn: (status: QueryState) => void,
    test_data = {}) {
    this.gh = new Octokit();
    this.test_data = test_data;
    this.resultFn = resultFn; // Callback pushing each result back to App
    this.statusFn = statusFn; // Callback that updates the App status
    this.emergency = false;
  }

  // Returns the array of username's repos
  async getUserRepos(username: string): Promise<RepoList> {
    let repoList: RepoList = [];
    try {
      const repos = await this.gh.paginate(this.gh.repos.listForUser, { username: username });
      repoList = repos.map(repo => ({ key: repo.name, name: repo.name, url: repo.html_url }));
    } catch (err) {
      if (err instanceof RequestError) {
        console.log(`OORGH: ${err}`);
        this.statusFn("error", err);
      } else {
        throw (err);
      }
    }
    return repoList;
  }

  // Takes the list of user repos and retrieves each repo's topics, sending API calls in batches
  async sendTopicsRequests(username: string, userRepos: RepoList, chunkSize: number, ms: number): Promise<void> {
    // TODO: Implement mock data usage
    // userRepos = userRepos.slice(0,3); // Use only first 3 repos
    // if (Object.keys(this.test_data).length !== 0) return this.test_data;
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

    let promises: Promise<void>[] = [];
    let counter = 0;
    for (const repo of userRepos) {
      counter++;
      promises.push(
        this.gh.repos.getAllTopics({ owner: username, repo: repo.name })
          .then(response => { this.resultFn(repo.name, response.data.names); })
          .catch(err => {
            if (err instanceof RequestError) {
              console.log(`AARGH: ${err}`);
              this.emergency = true;
              this.statusFn("error", err);
            } else {
              throw (err);
            }
          })
      );
      if (counter % chunkSize === 0) {
        await delay(ms);
        counter = 0;
      }
      if (this.emergency) {
        promises = [];
        break;
      }
    }
    await Promise.all(promises).then(() => { this.statusFn("done"); });
  };
}


export type { TopicFreqs, TopicRepos, RepoList, QueryState, RequestError };
export default GithubApi;
