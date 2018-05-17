import { IWallet, WalletFactory } from "../model/wallet";
import { IMember, recordifyMember } from "../model/member";
import { IComment, recordifyComment, recordifyComments } from "../model/comment";
import { IFos, FosFactory } from "../model/fos";
import { IJournal, JournalFactory } from "../model/journal";
import { Paper, PaperFactory } from "../model/paper";
import { IPaperSource, PaperSourceFactory } from "../model/paperSource";
import { PaperAuthor, PaperAuthorFactory } from "../model/author";
import { CurrentUser, CurrentUserFactory } from "../model/currentUser";
import { BookmarkDataListFactory } from "../model/bookmark";
import { GetMyBookmarksResponse } from "../api/member";

export const RAW = {
  AUTHOR: require("./author.json") as PaperAuthor,
  COMMENT: require("./comment.json") as IComment,
  CURRENT_USER: require("./currentUser.json") as CurrentUser,
  FOS: require("./fos.json") as IFos,
  JOURNAL: require("./journal.json") as IJournal,
  MEMBER: require("./member.json") as IMember,
  PAPER: require("./paper.json") as Paper,
  PAPER_SOURCE: require("./paperSource.json") as IPaperSource,
  WALLET: require("./wallet.json") as IWallet,
  COMMENTS_RESPONSE: require("./commentsResponse.json"),
  AGGREGATION_RESPONSE: require("./aggregation.json"),
};

const mockBookmarkData: GetMyBookmarksResponse = {
  content: BookmarkDataListFactory([
    {
      bookmarked: false,
      created_at: "2018-04-03T08:13:09.898",
      paper: RAW.PAPER,
      paper_id: 123,
    },
  ]),
  totalElements: 1,
  last: true,
  totalPages: 1,
  sort: null,
  first: true,
  numberOfElements: 1,
  size: 10,
  number: 1,
};

export const RECORD = {
  AUTHOR: PaperAuthorFactory(RAW.AUTHOR),
  COMMENT: recordifyComment(RAW.COMMENT),
  CURRENT_USER: CurrentUserFactory(RAW.CURRENT_USER),
  FOS: FosFactory(RAW.FOS),
  JOURNAL: JournalFactory(RAW.JOURNAL),
  MEMBER: recordifyMember(RAW.MEMBER),
  PAPER: PaperFactory(RAW.PAPER),
  PAPER_SOURCE: PaperSourceFactory(RAW.PAPER_SOURCE),
  WALLET: WalletFactory(RAW.WALLET),
  COMMENTS_RESPONSE: {
    comments: recordifyComments(RAW.COMMENTS_RESPONSE.content),
    first: RAW.COMMENTS_RESPONSE.first,
    last: RAW.COMMENTS_RESPONSE.last,
    number: RAW.COMMENTS_RESPONSE.number,
    numberOfElements: RAW.COMMENTS_RESPONSE.numberOfElements,
    size: RAW.COMMENTS_RESPONSE.size,
    sort: RAW.COMMENTS_RESPONSE.sort,
    totalElements: RAW.COMMENTS_RESPONSE.totalElements,
    totalPages: RAW.COMMENTS_RESPONSE.totalPages,
  },
  BOOKMARK_RESPONSE: mockBookmarkData,
};
