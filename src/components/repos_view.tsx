import { Component } from 'react';
import Modal from 'react-modal';
import type { RepoList } from '../api/github';

type ReposViewProps = {
  reposToShow: RepoList,
  selectedTopic: string,
  isOpen: boolean,
  closeFn: () => void,
}

class ReposView extends Component<ReposViewProps, {}> {
  constructor(props: ReposViewProps) {
    super(props);
    Modal.setAppElement('#root');
  }

  list(repos: RepoList) {
    return repos.map(elt => <li className="repo-name" key={elt.key}> {elt.name} </li>)
  }

  render() {
    const modalStyle: Modal.Styles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        maxWidth: '100%',
        minHeight: '150px',
        maxHeight: '50%'
      }
    };

    const closeBtnStyle: React.CSSProperties = { 
      position: 'absolute',
      top: '10px',
      right: '10px',
    };
    
    const { isOpen, closeFn, reposToShow, selectedTopic } = this.props;
    return (
      <div>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeFn}
          style={modalStyle}
          contentLabel="Repositories marked with this topic"
        >
          <button onClick={closeFn} style={closeBtnStyle} className="pure-button pure-button-primary">×</button>
          <h4>Repos tagged {selectedTopic}</h4>
          <ul>
            {reposToShow.map(r => <li className="repo-name" key={r.key}> {r.name} </li>)}
          </ul>
        </Modal>
      </div>
    );
  }
}

export default ReposView;
