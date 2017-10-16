import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IArticleFeedStateRecord, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import { IAppState } from "../../reducers";
import FeedNavbar from "./components/feedNavbar";
import { changeSortingOption, openCategoryPopover, closeCategoryPopover, changeCategory, getArticles } from "./actions";
import FeedItem from "./components/feedItem";
import selectArticles from "./select";
import { IArticlesRecord } from "../../model/article";
const styles = require("./articleFeed.scss");

export interface IArticleFeedContainerProps extends DispatchProp<IArticleContainerMappedState> {
  feedState: IArticleFeedStateRecord;
  feed: IArticlesRecord;
}

interface IArticleContainerMappedState {
  articleFeedState: IArticleFeedStateRecord;
  feed: IArticlesRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    feedState: state.articleFeed,
    feed: selectArticles(state.articles, state.articleFeed.feedItemsToShow),
  };
}

class ArticleFeed extends React.PureComponent<IArticleFeedContainerProps, null> {
  private handleChangeCategory = (category: FEED_CATEGORIES) => {
    const { dispatch } = this.props;

    dispatch(changeCategory(category));
  };

  private handleOpenCategoryPopover = (element: React.ReactInstance) => {
    const { dispatch } = this.props;

    dispatch(openCategoryPopover(element));
  };

  private handleCloseCategoryPopover = () => {
    const { dispatch } = this.props;

    dispatch(closeCategoryPopover());
  };

  private handleClickSortingOption = (sortingOption: FEED_SORTING_OPTIONS) => {
    const { dispatch } = this.props;

    dispatch(changeSortingOption(sortingOption));
  };

  private mapArticleNode = (feed: IArticlesRecord) => {
    return feed.map(article => {
      return <FeedItem key={`article_${article.id}`} article={article} />;
    });
  };

  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getArticles());
  }

  public render() {
    const { feed, feedState } = this.props;

    if (feed.isEmpty() || feedState.isLoading) {
      return null;
    }

    return (
      <div className={styles.feedContainer}>
        <FeedNavbar
          currentSortingOption={feedState.sortingOption}
          currentCategory={feedState.category}
          categoryPopoverAnchorElement={feedState.categoryPopoverAnchorElement}
          isCategoryPopOverOpen={feedState.isCategoryPopOverOpen}
          handleClickSortingOption={this.handleClickSortingOption}
          handleOpenCategoryPopover={this.handleOpenCategoryPopover}
          handleCloseCategoryPopover={this.handleCloseCategoryPopover}
          handleChangeCategory={this.handleChangeCategory}
        />
        <div className={styles.contentContainer}>
          <div className={styles.feedContentWrapper}>
            <div>{this.mapArticleNode(feed)}</div>
          </div>
          <div className={styles.feedSideWrapper}>
            <div className={styles.submitBoxWrapper}>
              <div className={styles.submitBoxTitle}>Share your article</div>
              <div className={styles.submitBoxSubtitle}>Share worthy academic contents then get a reputation</div>
              <Link to="/articles/new" className={styles.articleSubmitLinkButton}>
                Go to Submit
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
