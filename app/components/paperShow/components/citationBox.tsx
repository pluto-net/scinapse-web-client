import * as React from 'react';
import * as classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import ButtonSpinner from '../../common/spinner/buttonSpinner';
import copySelectedTextToClipboard from '../../../helpers/copySelectedTextToClipboard';
import { AvailableCitationType, AvailableExportCitationType } from '../../../containers/paperShow/records';
import { trackEvent } from '../../../helpers/handleGA';
import Icon from '../../../icons';
import { exportCitationText } from '../../../helpers/exportCitationText';
const styles = require('./citationBox.scss');

export interface CitationBoxProps {
  paperId: number;
  activeTab: AvailableCitationType;
  isLoading: boolean;
  citationText: string;
  handleClickCitationTab: (tab: AvailableCitationType) => void;
  fetchCitationText: () => void;
  closeCitationDialog: () => void;
}

class CitationBox extends React.PureComponent<CitationBoxProps> {
  public componentDidMount() {
    this.props.fetchCitationText();
  }

  public render() {
    const { paperId, closeCitationDialog } = this.props;

    return (
      <div className={styles.boxContainer}>
        <div className={styles.boxWrapper}>
          <div style={{ marginTop: 0 }} className={styles.header}>
            <div className={styles.title}>Cite</div>
            <div onClick={closeCitationDialog} className={styles.iconWrapper}>
              <Icon icon="X_BUTTON" />
            </div>
          </div>
          {this.getTabs()}
          {this.getTextBox()}
        </div>
        <div className={styles.downloadBtnWrapper}>
          <span className={styles.orSyntax}>or</span> Download as
          <button
            className={styles.downloadBtn}
            onClick={() => exportCitationText(AvailableExportCitationType.RIS, [paperId])}
          >
            RIS
          </button>
          <button
            className={styles.downloadBtn}
            onClick={() => exportCitationText(AvailableExportCitationType.RIS, [paperId])}
          >
            BibTeX
          </button>
        </div>
      </div>
    );
  }

  private getFullFeatureTabs = () => {
    const { handleClickCitationTab, activeTab } = this.props;

    return (
      <span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.MLA);
            trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'MLA' });
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.MLA,
          })}
        >
          MLA
        </span>

        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.IEEE);
            trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'IEEE' });
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.IEEE,
          })}
        >
          IEEE
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.VANCOUVER);
            trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'VANCOUVER' });
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.VANCOUVER,
          })}
        >
          VANCOUVER
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.CHICAGO);
            trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'CHICAGO' });
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.CHICAGO,
          })}
        >
          CHICAGO
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.ACS);
            trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'ACS' });
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.ACS,
          })}
        >
          ACS
        </span>
      </span>
    );
  };

  private getTabs = () => {
    const { handleClickCitationTab, activeTab } = this.props;

    return (
      <div className={styles.tabBoxWrapper}>
        <div className={styles.normalTabWrapper}>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.APA);
              trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'APA' });
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.APA,
            })}
          >
            APA
          </span>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.HARVARD);
              trackEvent({ category: 'Additional Action', action: 'Click Citation Tab', label: 'HARVARD' });
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.HARVARD,
            })}
          >
            HARVARD
          </span>

          {this.getFullFeatureTabs()}
        </div>
      </div>
    );
  };

  private getTextBox = () => {
    const { isLoading, activeTab, citationText } = this.props;

    if (isLoading) {
      return (
        <div
          className={styles.textBoxWrapper}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ButtonSpinner />
        </div>
      );
    } else {
      return (
        <div
          style={{
            borderTopLeftRadius: activeTab === AvailableCitationType.BIBTEX ? '0' : '3px',
          }}
          className={styles.textBoxWrapper}
        >
          <textarea value={citationText} className={styles.textArea} readOnly={true} />
          <div className={styles.copyButtonWrapper}>
            <div
              onClick={() => {
                this.handleClickCopyButton(citationText);
                trackEvent({ category: 'Additional Action', action: 'Copy Citation Button' });
              }}
              className={styles.copyButton}
            >
              Copy <Icon className={styles.copyIcon} icon="COPY" />
            </div>
          </div>
        </div>
      );
    }
  };

  private handleClickCopyButton = (citationText: string) => {
    copySelectedTextToClipboard(citationText);
  };
}

export default withStyles<typeof CitationBox>(styles)(CitationBox);
