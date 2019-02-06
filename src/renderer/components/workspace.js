import PropTypes from 'prop-types';
import { ipcRenderer as ipc } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import GlobalStyles from './global-styles';
import SavingModal from './saving-modal';
import ArchiveSearch from '../containers/archive/archive-search';
import { NoArchiveSelected, WelcomeScreen } from './empty-view';
import spinner from '../styles/img/spinner.svg';
import PasswordModal from './password-modal';

const Primary = styled(Flex)`
  position: relative;
`;

class Workspace extends PureComponent {
  static propTypes = {
    currentArchive: PropTypes.object,
    archivesCount: PropTypes.number,
    columnSizes: PropTypes.object,
    condencedSidebar: PropTypes.bool,
    archivesLoading: PropTypes.bool,
    savingArchive: PropTypes.bool,
    isArchiveSearchVisible: PropTypes.bool,
    setColumnSize: PropTypes.func,
    onUnlockArchive: PropTypes.func
  };

  state = {
    unlockRequest: null,
    passwordChangeRequest: null
  };

  componentDidMount() {
    ipc.on('load-archive', (e, payload) => {
      console.log(payload);
    });

    ipc.on('set-current-archive', (e, payload) => {
      this.setState({
        unlockRequest: payload
      });
    });
  }

  handleUnlockSuccess = () => {
    this.setState({
      unlockRequest: null
    });
  };

  handlePasswordModalCancel = () => {
    this.setState({
      unlockRequest: null,
      passwordChangeRequest: null
    });
  };

  render() {
    const {
      currentArchive,
      archivesCount,
      setColumnSize,
      columnSizes,
      condencedSidebar,
      archivesLoading,
      savingArchive,
      isArchiveSearchVisible,
      onUnlockArchive
    } = this.props;

    return (
      <React.Fragment>
        <GlobalStyles />
        <Flex flexAuto>
          <If condition={archivesCount > 0}>
            <Sidebar condenced={condencedSidebar} />
          </If>
          <Primary flexAuto>
            <Choose>
              <When condition={archivesLoading}>
                <Flex align="center" justify="center" flexColumn flexAuto>
                  <img width="64" src={spinner} alt="Loading" />
                </Flex>
              </When>
              <Otherwise>
                <Choose>
                  <When condition={archivesCount === 0}>
                    <WelcomeScreen />
                  </When>
                  <When
                    condition={archivesCount > 0 && currentArchive === null}
                  >
                    <NoArchiveSelected />
                  </When>
                  <Otherwise>
                    <Archive
                      columnSizes={columnSizes}
                      onColumnSizeChange={setColumnSize}
                    />
                  </Otherwise>
                </Choose>
              </Otherwise>
            </Choose>
          </Primary>
          <If condition={isArchiveSearchVisible}>
            <ArchiveSearch />
          </If>
          <If condition={savingArchive}>
            <SavingModal />
          </If>
        </Flex>
        <If condition={this.state.unlockRequest}>
          <PasswordModal
            onValidate={password =>
              onUnlockArchive(this.state.unlockRequest, password)
            }
            onCancel={this.handlePasswordModalCancel}
            onSuccess={this.handleUnlockSuccess}
          />
        </If>
      </React.Fragment>
    );
  }
}

export default Workspace;
