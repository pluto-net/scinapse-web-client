import * as React from "react";
import { range } from "lodash";
import * as classNames from "classnames";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { LocationDescriptor } from "../../../../node_modules/@types/history";
import { trackEvent } from "../../../helpers/handleGA";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
const styles = require("./desktopPagination.scss");

interface CommonPaginationProps
  extends RouteComponentProps,
    Readonly<{
      type: string;
      currentPageIndex: number;
      totalPage: number;
      itemStyle?: React.CSSProperties;
      wrapperStyle?: React.CSSProperties;
    }> {}

interface LinkPaginationProps
  extends CommonPaginationProps,
    Readonly<{
      getLinkDestination: (page: number) => LocationDescriptor;
    }> {}

export interface EventPaginationProps
  extends CommonPaginationProps,
    Readonly<{
      onItemClick: (page: number) => void;
    }> {}

type DesktopPaginationProps = LinkPaginationProps | EventPaginationProps;

function isLinkPagination(props: DesktopPaginationProps): props is LinkPaginationProps {
  return (props as LinkPaginationProps).getLinkDestination !== undefined;
}

export function makePageNumberArray(props: DesktopPaginationProps): number[] {
  const totalPage = props.totalPage;
  const currentPage = props.currentPageIndex + 1;

  let startPage: number;
  let endPage: number;

  if (currentPage - 5 <= 1) {
    startPage = 1;
    endPage = totalPage >= 10 ? 10 + 1 : totalPage + 1;
  } else if (totalPage > currentPage + 5) {
    startPage = currentPage - 5;
    endPage = currentPage + 5;
  } else {
    startPage = totalPage - 6;
    endPage = totalPage + 1;
  }

  return range(startPage, endPage);
}

function getFirstPageIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <Link to={(props as LinkPaginationProps).getLinkDestination(1)} className={styles.pageIconButton}>
        <Icon icon="LAST_PAGE" />
      </Link>
    );
  } else {
    return (
      <span onClick={() => (props as EventPaginationProps).onItemClick(1)} className={styles.pageIconButton}>
        <Icon icon="LAST_PAGE" />
      </span>
    );
  }
}

function getNextIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex + 1 === props.totalPage || props.totalPage === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <div className={styles.nextButtons}>
        <Link
          onClick={async e => {
            e.preventDefault();

            const isBlocked =
              props.currentPageIndex >= 0 &&
              (await blockUnverifiedUser({
                authLevel: AUTH_LEVEL.VERIFIED,
                actionArea: "searchResult",
                actionLabel: "nextPageFromSearch",
                userActionType: "nextPageFromSearch",
              }));

            if (isBlocked) {
              return;
            }

            props.history.push(`${(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex + 2)}`);
          }}
          to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex + 2)}
          className={styles.pageIconButton}
        >
          <Icon icon="NEXT_PAGE" />
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.nextButtons}>
        <span
          onClick={async e => {
            e.preventDefault();

            const isBlocked = await blockUnverifiedUser({
              authLevel: AUTH_LEVEL.VERIFIED,
              actionArea: "searchResult",
              actionLabel: "nextPageFromSearch",
              userActionType: "nextPageFromSearch",
            });

            if (isBlocked && props.currentPageIndex === 2) {
              return;
            } else {
              (props as EventPaginationProps).onItemClick(props.currentPageIndex + 2);
            }
          }}
          className={styles.pageIconButton}
        >
          <Icon icon="NEXT_PAGE" />
        </span>
      </div>
    );
  }
}

function getPrevIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <Link
        to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex)}
        className={styles.pageIconButton}
      >
        <Icon icon="NEXT_PAGE" />
      </Link>
    );
  } else {
    return (
      <span
        onClick={() => (props as EventPaginationProps).onItemClick(props.currentPageIndex)}
        className={styles.pageIconButton}
      >
        <Icon icon="NEXT_PAGE" />
      </span>
    );
  }
}

const getEventPageItem = (props: EventPaginationProps, pageNumber: number, currentPage: number) => {
  return (
    <span
      onClick={async e => {
        e.preventDefault();

        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: "searchResult",
          actionLabel: "nextPageFromSearch",
          userActionType: "nextPageFromSearch",
        });

        if (isBlocked && currentPage === 1 && pageNumber > currentPage) {
          return;
        } else {
          props.onItemClick(pageNumber);
          trackEvent({ category: "Search", action: "Pagination", label: `${pageNumber}` });
        }
      }}
      key={`${props.type}_${pageNumber}`}
      style={props.itemStyle}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: pageNumber === currentPage,
      })}
    >
      {pageNumber}
    </span>
  );
};

const getLinkPageItem = (props: LinkPaginationProps, pageNumber: number, currentPage: number) => {
  return (
    <Link
      onClick={async e => {
        e.preventDefault();

        const isBlocked =
          currentPage === 1 &&
          pageNumber > currentPage &&
          (await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "searchResult",
            actionLabel: "nextPageFromSearch",
            userActionType: "nextPageFromSearch",
          }));

        if (isBlocked) {
          return;
        } else {
          trackEvent({ category: "Search", action: "Pagination", label: `${pageNumber}` });
          props.history.push(`${props.getLinkDestination(pageNumber)}`);
        }
      }}
      to={props.getLinkDestination(pageNumber)}
      style={props.itemStyle}
      key={`${props.type}_${pageNumber}`}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: currentPage === pageNumber,
      })}
    >
      {pageNumber}
    </Link>
  );
};

const DesktopPagination = (props: DesktopPaginationProps) => {
  const pageNumberArray = makePageNumberArray(props);
  const pageNodes = pageNumberArray.map(pageNumber => {
    if (isLinkPagination(props)) {
      return getLinkPageItem(props, pageNumber, props.currentPageIndex + 1);
    } else {
      return getEventPageItem(props, pageNumber, props.currentPageIndex + 1);
    }
  });

  return (
    <div style={props.wrapperStyle} className={styles.paginationWrapper}>
      <div className={styles.prevButtons}>
        {getFirstPageIcon(props)}
        {getPrevIcon(props)}
      </div>
      {pageNodes}
      {getNextIcon(props)}
    </div>
  );
};

export default withRouter(withStyles<typeof DesktopPagination>(styles)(DesktopPagination));
