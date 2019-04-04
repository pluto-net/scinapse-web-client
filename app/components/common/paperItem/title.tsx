import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import EnvChecker from "../../../helpers/envChecker";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./title.scss");

export interface TitleProps {
  title: string;
  paperId: number;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  searchQueryText?: string;
}

class Title extends React.PureComponent<TitleProps, {}> {
  public render() {
    const { title, paperId, searchQueryText, source } = this.props;

    if (!title) {
      return null;
    }
    // for removing first or last space or trash value of content
    const trimmedTitle = title
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const noSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);
    if (noSearchQueryText) {
      return (
        <div>
          <Link
            to={{
              pathname: `/papers/${paperId}`,
            }}
            onClick={() => {
              this.trackEvent(false);
            }}
            className={styles.title}
          >
            <span dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(title) }} />
          </Link>
          <a
            onClick={() => {
              this.trackEvent(true);
            }}
            className={styles.newTabIconWrapper}
            href={`/papers/${paperId}`}
            target="_blank"
            rel="noopener"
          >
            <Icon className={styles.newTabIcon} icon="NEW_TAB" />
          </a>
        </div>
      );
    }
    return (
      <div>
        <HighLightedContent
          content={trimmedTitle}
          highLightContent={searchQuery}
          className={styles.title}
          onClickFunc={() => {
            this.trackEvent();
          }}
          href={source}
          to={{
            pathname: `/papers/${paperId}`,
          }}
        />
        <a
          onClick={() => {
            this.trackEvent(true);
          }}
          className={styles.newTabIconWrapper}
          href={`/papers/${paperId}`}
          target="_blank"
          rel="noopener"
        >
          <Icon className={styles.newTabIcon} icon="NEW_TAB" />
        </a>
      </div>
    );
  }

  private trackEvent = (newTab?: boolean) => {
    const { pageType, actionArea, paperId } = this.props;

    if (!EnvChecker.isOnServer()) {
      actionTicketManager.trackTicket({
        pageType,
        actionType: "fire",
        actionArea: actionArea || pageType,
        actionTag: "paperShow",
        actionLabel: String(paperId),
      });
      trackEvent({
        category: "Flow to Paper Show",
        action: newTab ? "Click Title New Tab" : "Click Title",
        label: JSON.stringify({ referer: pageType, refererLocation: location.pathname }),
      });
    }
  };
}

export default withStyles<typeof Title>(styles)(Title);
