declare namespace Scinapse {
  namespace ArticleSearch {
    type SEARCH_SORT_OPTIONS = "RELEVANCE" | "MOST_CITATIONS" | "OLDEST_FIRST" | "NEWEST_FIRST";

    interface RawQueryParams {
      query: string;
      filter: string;
      page: string;
      sort: SEARCH_SORT_OPTIONS;
    }
  }

  namespace Alert {
    type NotieAlertTypes = "success" | "warning" | "error" | "info" | "neutral";

    interface NotieAlertOptions {
      text: string;
      stay: boolean; // default = false
      time: number; // default = 3, minimum = 1,
      position: "top" | "bottom"; // default = 'top', enum: ['top', 'bottom']
    }

    interface NotificationActionPayload {
      type: NotieAlertTypes;
      message: string;
      title?: string;
      options?: NotieAlertOptions;
    }
  }

  namespace ActionTicket {
    type ActionTagType =
      | "pageView"
      | "authorShow"
      | "paperShow"
      | "refList"
      | "citedList"
      | "journalShow"
      | "query"
      | "downloadPdf"
      | "source"
      | "addToCollection"
      | "removeFromCollection"
      | "citePaper"
      | "signUp"
      | "signIn"
      | "fos"
      | "copyDoi"
      | "signInViaCollection"
      | "blogPost"
      | "journalHomepage"
      | "queryInJournal"
      | "authorEntityItem"
      | "paperSorting"
      | "collectionSharing"
      | "extendAbstract"
      | "collapseAbstract"
      | "";

    type ActionArea =
      | "topBar"
      | "refList"
      | "citedList"
      | "paperList"
      | "paperDescription"
      | "otherPaperList"
      | "relatedPaperList"
      | "fosSuggestion"
      | "ourStory"
      | "coAuthor"
      | "topFos"
      | "authorDialog"
      | "allPublications"
      | "authorEntity"
      | "sortBox"
      | "shareBox"
      | "innerSearchBox"
      | "readingNowPaperList";

    type PageType =
      | "paperShow"
      | "authorShow"
      | "home"
      | "searchResult"
      | "journalShow"
      | "collectionShow"
      | "collectionList"
      | "signIn"
      | "signUp"
      | "resetPassword"
      | "emailVerification"
      | "terms"
      | "unknown";
  }
}
