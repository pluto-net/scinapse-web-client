import * as React from "react";
import { Location } from "history";
import { PaperRecord } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../../model/currentUser";
import { PaperShowStateRecord } from "../records";
import SearchItem from "../../articleSearch/components/searchItem";
import CommonPagination from "../../common/commonPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
const styles = require("./relatedPapers.scss");

interface PaperReferencesProps {
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  location: Location;
  toggleAbstract: (paperId: number) => void;
  toggleAuthors: (paperId: number) => void;
  visitTitle: (paperId: number) => void;
  closeFirstOpen: (paperId: number) => void;
  fetchRelatedPapers: (page: number) => Promise<void>;
  handlePostBookmark: (paper: PaperRecord) => void;
  toggleCitationDialog: () => void;
}

@withStyles<typeof RelatedPapers>(styles)
export default class RelatedPapers extends React.PureComponent<PaperReferencesProps, {}> {
  public render() {
    const { paperShow, fetchRelatedPapers } = this.props;

    return (
      <div>
        <div>{this.mapPaperNode()}</div>
        <div>
          <CommonPagination
            type="paper_show_references"
            totalPage={paperShow.relatedPaperTotalPage}
            currentPageIndex={paperShow.relatedPaperCurrentPage}
            onItemClick={fetchRelatedPapers}
            wrapperStyle={{
              margin: "24px 0",
            }}
          />
        </div>
      </div>
    );
  }

  private mapPaperNode = () => {
    const {
      paperShow,
      currentUser,
      toggleAbstract,
      toggleAuthors,
      visitTitle,
      closeFirstOpen,
      toggleCitationDialog,
      handlePostBookmark,
    } = this.props;

    if (!paperShow.relatedPapers || paperShow.relatedPapers.isEmpty()) {
      return null;
    } else if (paperShow.isLoadingRelatedPapers) {
      return <ArticleSpinner style={{ margin: "200px auto" }} />;
    } else {
      const searchItems = paperShow.relatedPapers.map(paper => {
        const meta = paperShow.relatedPapersMeta.find(paperMeta => paperMeta.paperId === paper.id);

        if (!meta) {
          return null;
        }

        return (
          <SearchItem
            handlePostBookmark={handlePostBookmark}
            key={`paperShow_related_${paper.id || paper.cognitivePaperId}`}
            paper={paper}
            toggleCitationDialog={toggleCitationDialog}
            isAbstractOpen={meta.isAbstractOpen}
            toggleAbstract={() => {
              toggleAbstract(paper.id);
            }}
            isAuthorsOpen={meta.isAuthorsOpen}
            toggleAuthors={() => {
              toggleAuthors(paper.id);
            }}
            isTitleVisited={meta.isTitleVisited}
            visitTitle={() => {
              visitTitle(paper.id);
            }}
            searchQueryText={""}
            isFirstOpen={meta.isFirstOpen}
            closeFirstOpen={() => {
              closeFirstOpen(paper.id);
            }}
            isBookmarked={meta.isBookmarked}
            isPageLoading={paperShow.isLoadingRelatedPapers}
            currentUser={currentUser}
            withComments={false}
          />
        );
      });

      return <div className={styles.searchItems}>{searchItems}</div>;
    }
  };
}
