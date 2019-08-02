import React from 'react';
import classNames from 'classnames';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import YearFilterDropdown from '../../components/yearFilterDropdown';
import JournalFilterDropdown from '../../components/journalFilterDropdown';
import FOSFilterDropdown from '../../components/fosFilterDropdown';
import SortingDropdown from '../../components/sortingDropdown';
import Icon from '../../icons';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import { UserDevice } from '../../components/layouts/records';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { useEnvHook } from '../../hooks/useEnvHook';

const s = require('./filterBox.scss');

type FilterBoxProps = RouteComponentProps &
  ReturnType<typeof mapStateToProps> & {
    dispatch: Dispatch<SearchActions>;
    query?: string;
  };

function setBodyOverflowToPreventScrolling(isOnClient: boolean, hasActiveButton: boolean) {
  // TODO: below code can make side effect to overflow styles. should change later
  if (isOnClient && hasActiveButton) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
    document.body.style.marginRight = '0';
  } else if (isOnClient && !hasActiveButton) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '0';
    document.body.style.marginRight = '0';
  }
}

const FilterBox: React.FC<FilterBoxProps> = props => {
  const { isOnClient } = useEnvHook();
  const filterBoxRef = React.useRef(null);

  React.useEffect(() => {
    const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
    const filters = SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter);
    props.dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS,
      payload: {
        filters,
        sorting: currentQueryParams.sort || 'Relevance',
      },
    });
  }, []);

  React.useEffect(
    () => {
      if (props.detectedYear) {
        ActionTicketManager.trackTicket({
          pageType: 'searchResult',
          actionType: 'fire',
          actionArea: 'autoYearFilter',
          actionTag: 'autoYearFilterQuery',
          actionLabel: props.query || '',
        });
      }
    },
    [props.detectedYear, props.query]
  );

  if (props.isMobile) return null;

  setBodyOverflowToPreventScrolling(isOnClient, !!props.activeButton);

  return (
    <>
      <div
        ref={filterBoxRef}
        className={classNames({
          [s.wrapper]: true,
          [s.activeWrapper]: !!props.activeButton,
        })}
      >
        <div className={s.controlBtns}>
          <span className={s.btnWrapper}>
            <YearFilterDropdown />
          </span>
          <span className={s.btnWrapper}>
            <JournalFilterDropdown />
          </span>
          <span className={s.btnWrapper}>
            <FOSFilterDropdown />
          </span>
          <span className={s.divider}>{'|'}</span>
          <span className={s.sortText}>{`Sort By`}</span>
          <span className={s.btnWrapper}>
            <SortingDropdown />
          </span>
        </div>
        {props.isFilterApplied && (
          <Link
            onClick={() => {
              if (props.enableAutoYearFilter && props.detectedYear) {
                ActionTicketManager.trackTicket({
                  pageType: 'searchResult',
                  actionType: 'fire',
                  actionArea: 'autoYearFilter',
                  actionTag: 'cancelAutoYearFilter',
                  actionLabel: props.query || '',
                });
                props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_DISABLE_AUTO_YEAR_FILTER });
              }
            }}
            to={makeNewFilterLink(
              {
                yearFrom: undefined,
                yearTo: undefined,
                fos: [],
                journal: [],
              },
              props.location
            )}
            className={s.clearButton}
          >
            <Icon icon="X_BUTTON" className={s.xIcon} />
            <span>Clear All</span>
          </Link>
        )}
      </div>
      <div
        className={classNames({
          [s.backdrop]: true,
          [s.activeBackdrop]: !!props.activeButton,
        })}
      />
    </>
  );
};

function mapStateToProps(state: AppState) {
  const { searchFilterState, layout } = state;

  return {
    isMobile: layout.userDevice === UserDevice.MOBILE,
    detectedYear: searchFilterState.detectedYear,
    enableAutoYearFilter: searchFilterState.enableAutoYearFilter,
    activeButton: searchFilterState.activeButton,
    isFilterApplied:
      !!searchFilterState.currentYearFrom ||
      !!searchFilterState.currentYearTo ||
      searchFilterState.selectedFOSIds.length > 0 ||
      searchFilterState.selectedJournalIds.length > 0 ||
      (searchFilterState.detectedYear && searchFilterState.enableAutoYearFilter),
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof FilterBox>(s)(FilterBox)));
