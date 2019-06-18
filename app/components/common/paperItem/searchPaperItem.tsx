import * as React from 'react';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as format from 'date-fns/format';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import VenueAndAuthors from './venueAndAuthors';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { SEARCH_ITEM_IMPROVEMENT_TEST } from '../../../constants/abTestGlobalValue';
import { STOP_WORDS } from '../highLightedContent';
import { PaperSource } from '../../../api/paper';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  savedAt: number | null; // unix time
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  searchQueryText: string;
  wrapperClassName: string;
  currentUser: CurrentUser;
  sourceDomain?: PaperSource;
}

export function getMissingWords(sentence: string, source: string): string[] {
  return Array.from(new Set(sentence.toLowerCase().split(' '))).filter(
    word => !STOP_WORDS.includes(word) && !source.toLowerCase().includes(word)
  );
}

const NotIncludedWords: React.FC<{ title: string; abstract: string; searchKeyword: string }> = React.memo(props => {
  const { title, abstract, searchKeyword } = props;
  const missingWordsFromTitle = getMissingWords(searchKeyword, title);
  const missingWordsFromAbstract = getMissingWords(searchKeyword, abstract);
  const missingWords = new Set(missingWordsFromTitle.filter(word => missingWordsFromAbstract.includes(word)));

  if (missingWords.size === 0) return null;

  const wordComponents = Array.from(missingWords).map((word, i) => {
    return (
      <React.Fragment key={i}>
        <span className={styles.missingWord}>{word}</span>
        {i !== missingWords.size - 1 && ` `}
      </React.Fragment>
    );
  });

  return (
    <div className={styles.missingWordsWrapper}>
      {`Not included: `}
      {wordComponents}
    </div>
  );
});

const PaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { searchQueryText, paper, wrapperClassName, currentUser, pageType, actionArea, savedAt, sourceDomain } = props;
  const { authors, publishedDate, doi, urls, journal, conferenceInstance, relation } = paper;

  const [shouldShowVisitHistory, setShouldShowVisitHistory] = React.useState(false);
  const [shouldShowNotIncludedWords, setShouldShowNotIncludedWords] = React.useState(false);

  React.useEffect(() => {
    setShouldShowVisitHistory(getUserGroupName(SEARCH_ITEM_IMPROVEMENT_TEST) === 'visitHistory');
    setShouldShowNotIncludedWords(getUserGroupName(SEARCH_ITEM_IMPROVEMENT_TEST) === 'notIncludedWords');
  }, []);

  let historyContent = null;
  if (shouldShowVisitHistory && savedAt) {
    const lastVisitDate = format(savedAt, 'MMM DD, YYYY');
    const lastVisitFrom = distanceInWordsToNow(savedAt);
    historyContent = (
      <div className={styles.visitedHistory}>{`You visited at ${lastVisitDate} (${lastVisitFrom} ago)`}</div>
    );
  }

  let source;
  if (!!doi) {
    source = `https://doi.org/${doi}`;
  } else if (urls && urls.length > 0) {
    source = urls[0].url;
  } else {
    source = '';
  }

  return (
    <div className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
      <div className={styles.contentSection}>
        {!!relation && relation.savedInCollections.length >= 1 ? (
          <SavedCollections collections={relation.savedInCollections} />
        ) : null}
        {historyContent}
        <Title
          paperId={paper.id}
          paperTitle={paper.title}
          highlightTitle={paper.titleHighlighted}
          highlightAbstract={paper.abstractHighlighted}
          pageType={pageType}
          actionArea={actionArea}
          source={source}
        />
        <VenueAndAuthors
          pageType={pageType}
          actionArea={actionArea}
          paper={paper}
          journal={journal}
          conferenceInstance={conferenceInstance}
          publishedDate={publishedDate}
          authors={authors}
        />
        <Abstract
          paperId={paper.id}
          pageType={pageType}
          actionArea={actionArea}
          abstract={paper.abstractHighlighted || paper.abstract}
          searchQueryText={searchQueryText}
        />
        {shouldShowNotIncludedWords && (
          <NotIncludedWords
            title={paper.title}
            abstract={paper.abstract || paper.abstractHighlighted || ''}
            searchKeyword={searchQueryText}
          />
        )}
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          hasCollection={false}
          sourceDomain={sourceDomain}
        />
      </div>
    </div>
  );
});

export default withStyles<typeof PaperItem>(styles)(PaperItem);