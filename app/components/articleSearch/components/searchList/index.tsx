import { List } from "immutable";
import * as React from "react";
import SearchItem from "../searchItem";
import { PaperList, PaperRecord } from "../../../../model/paper";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import MemberAPI, { CheckBookmarkedResponseList, CheckBookmarkedResponse } from "../../../../api/member";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./searchList.scss");

interface SearchListProps {
  currentUser: CurrentUserRecord;
  papers: PaperList;
  searchQueryText: string;
  handlePostBookmark: (paper: PaperRecord) => Promise<void>;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  setActiveCitationDialog?: (paperId: number) => void;
  toggleCitationDialog: () => void;
  checkVerifiedUser: () => boolean;
}

interface SearchListStates {
  bookmarkedStatusList: CheckBookmarkedResponseList;
}

class SearchList extends React.PureComponent<SearchListProps, SearchListStates> {
  public constructor(props: SearchListProps) {
    super(props);

    this.state = { bookmarkedStatusList: List() };
  }

  public async componentDidMount() {
    const { currentUser, papers } = this.props;

    if (currentUser.isLoggedIn && papers && !papers.isEmpty()) {
      const bookmarkStatusList = await MemberAPI.checkBookmarkedList(papers);

      this.setState({
        bookmarkedStatusList: bookmarkStatusList,
      });
    }
  }

  public async componentWillReceiveProps(nextProps: SearchListProps) {
    const authStatusWillChange = this.props.currentUser.isLoggedIn !== nextProps.currentUser.isLoggedIn;

    if (authStatusWillChange && nextProps.currentUser.isLoggedIn) {
      const bookmarkStatusArray = await MemberAPI.checkBookmarkedList(nextProps.papers);

      this.setState({
        bookmarkedStatusList: bookmarkStatusArray,
      });
    }
  }

  public render() {
    const { currentUser, papers, searchQueryText } = this.props;
    const { bookmarkedStatusList } = this.state;

    const searchItems = papers.map(paper => {
      const bookmarkStatus = bookmarkedStatusList.find(status => status.paperId === paper.id);

      return (
        <SearchItem
          key={`paper_${paper.id}`}
          paper={paper}
          isBookmarked={bookmarkStatus ? bookmarkStatus.bookmarked : false}
          checkVerifiedUser={this.props.checkVerifiedUser}
          setActiveCitationDialog={this.props.setActiveCitationDialog}
          toggleCitationDialog={this.props.toggleCitationDialog}
          handlePostBookmark={this.handlePostBookmark}
          handleRemoveBookmark={this.handleRemoveBookmark}
          withComments={true}
          searchQueryText={searchQueryText}
          currentUser={currentUser}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  }

  private handleRemoveBookmark = async (targetPaper: PaperRecord) => {
    const { handleRemoveBookmark } = this.props;
    const targetKey = this.state.bookmarkedStatusList.findKey(status => status.paperId === targetPaper.id);
    const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };

    this.setState({
      bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
    });

    try {
      await handleRemoveBookmark(targetPaper);
    } catch (err) {
      alertToast({
        type: "error",
        message: "Sorry. Failed to remove bookmark.",
      });
      const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };
      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
      });
    }
  };

  private handlePostBookmark = async (targetPaper: PaperRecord) => {
    const { handlePostBookmark } = this.props;
    const targetKey = this.state.bookmarkedStatusList.findKey(status => status.paperId === targetPaper.id);
    const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };

    this.setState({
      bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
    });

    try {
      await handlePostBookmark(targetPaper);
    } catch (err) {
      alertToast({
        type: "error",
        message: "Sorry. Failed to make bookmark.",
      });
      const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };
      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
      });
    }
  };
}

export default withStyles<typeof SearchList>(styles)(SearchList);
