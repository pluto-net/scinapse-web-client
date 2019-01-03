import * as React from "react";
import { escapeRegExp } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./suggestionList.scss");

export interface SuggestionListProps {
  userInput: string | undefined;
  isOpen: boolean;
  suggestionList: string[];
  isLoadingKeyword: boolean;
  handleClickSuggestionKeyword: (suggestion: string | undefined) => void;
}

function getWordsFromUserInput(userInput: string) {
  const words = userInput
    .split(" ")
    .map(word => {
      if (!!word && word.length > 0) {
        return escapeRegExp(word.trim());
      }
    })
    .join("|");

  return new RegExp(`(${words})`, "i");
}

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLAnchorElement>,
  handleEnter: (suggestion: string) => void,
  keyword: string
) => {
  switch (e.keyCode) {
    case 40: {
      // Down arrow
      e.preventDefault();
      const target: any = e.currentTarget.nextSibling;
      if (target) {
        target.focus();
      }
      break;
    }

    case 38: {
      // up arrow
      e.preventDefault();
      const target: any = e.currentTarget.previousSibling;
      if (target) {
        target.focus();
      }
      break;
    }

    case 13: {
      // enter
      e.preventDefault();
      handleEnter(keyword);
      break;
    }

    default:
      break;
  }
};

function getHighlightedList(suggestionList: string[], regExP: RegExp) {
  return suggestionList.map(suggestion => {
    const suggestionWords = suggestion.split(" ").map(word => word.trim());
    return suggestionWords.map(word => word && word.replace(regExP, matchWord => `<b>${matchWord}</b>`)).join(" ");
  });
}

class SuggestionList extends React.PureComponent<SuggestionListProps> {
  public render() {
    const { userInput, suggestionList, isOpen, handleClickSuggestionKeyword, children } = this.props;

    if (!userInput) {
      return null;
    }

    const regExP = getWordsFromUserInput(userInput);
    const highlightedList = getHighlightedList(suggestionList, regExP);

    const highlightedContent = highlightedList.map((suggestion, index) => (
      <a
        onMouseDown={e => {
          e.preventDefault();
          handleClickSuggestionKeyword(suggestionList[index]);
        }}
        className={styles.keywordCompletionItem}
        onKeyDown={e => {
          handleKeyDown(e, handleClickSuggestionKeyword, suggestionList[index]);
        }}
        tabIndex={-1}
        key={`keyword_completion_${suggestion}${index}`}
      >
        <span className={styles.keywordCompletionItemContext} dangerouslySetInnerHTML={{ __html: suggestion }} />
      </a>
    ));

    return (
      <div style={{ display: isOpen ? "block" : "none" }} className={styles.keywordCompletionWrapper}>
        {highlightedContent}
        {children && (
          <a
            onMouseDown={e => {
              e.preventDefault();
              handleClickSuggestionKeyword(userInput);
            }}
            className={styles.keywordCompletionItem}
            onKeyDown={e => {
              handleKeyDown(e, handleClickSuggestionKeyword, userInput || "");
            }}
            tabIndex={-1}
          >
            {children}
          </a>
        )}
      </div>
    );
  }
}

export default withStyles<typeof SuggestionList>(styles)(SuggestionList);
