export const ACTION_TYPES = {
  GLOBAL_LOCATION_CHANGE: "@@router/LOCATION_CHANGE",
  GLOBAL_DIALOG_OPEN: Symbol("GLOBAL_DIALOG_OPEN"),
  GLOBAL_DIALOG_CLOSE: Symbol("GLOBAL_DIALOG_CLOSE"),
  GLOBAL_CHANGE_DIALOG_TYPE: Symbol("GLOBAL_CHANGE_DIALOG_TYPE"),
  GLOBAL_ALERT_NOTIFICATION: Symbol("GLOBAL_ALERT_NOTIFICATION"),
  GLOBAL_CLEAR_NOTIFICATION: Symbol("GLOBAL_CLEAR_NOTIFICATION"),

  SIGN_IN_CHANGE_EMAIL_INPUT: Symbol("SIGN_IN.CHANGE_EMAIL_INPUT"),
  SIGN_IN_CHANGE_PASSWORD_INPUT: Symbol("SIGN_IN.CHANGE_PASSWORD_INPUT"),
  SIGN_IN_ON_FOCUS_INPUT: Symbol("SIGN_IN.ON_FOCUS_INPUT"),
  SIGN_IN_ON_BLUR_INPUT: Symbol("SIGN_IN.ON_BLUR_INPUT"),
  SIGN_IN_FORM_ERROR: Symbol("SIGN_IN.FORM_ERROR"),

  SIGN_IN_START_TO_SIGN_IN: Symbol("SIGN_IN.START_TO_SIGN_IN"),
  SIGN_IN_FAILED_TO_SIGN_IN: Symbol("SIGN_IN.FAILED_TO_SIGN_IN"),
  SIGN_IN_SUCCEEDED_TO_SIGN_IN: Symbol("SIGN_IN.SUCCEEDED_TO_SIGN_IN"),

  SIGN_UP_CHANGE_EMAIL_INPUT: Symbol("SIGN_UP.CHANGE_EMAIL_INPUT"),
  SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL: Symbol("SIGN_UP.SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL"),
  SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL: Symbol("SIGN_UP.FAILED_TO_CHECK_DUPLICATED_EMAIL"),

  SIGN_UP_CHANGE_PASSWORD_INPUT: Symbol("SIGN_UP.CHANGE_PASSWORD_INPUT"),
  SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT: Symbol("SIGN_UP.CHANGE_REPEAT_PASSWORD_INPUT"),
  SIGN_UP_CHANGE_NAME_INPUT: Symbol("SIGN_UP.CHANGE_NAME_INPUT"),

  SIGN_UP_FORM_ERROR: Symbol("SIGN_UP.FORM_ERROR"),
  SIGN_UP_REMOVE_FORM_ERROR: Symbol("SIGN_UP.REMOVE_FORM_ERROR"),

  SIGN_UP_ON_FOCUS_INPUT: Symbol("SIGN_UP.ON_FOCUS_INPUT"),
  SIGN_UP_ON_BLUR_INPUT: Symbol("SIGN_UP.ON_BLUR_INPUT"),

  SIGN_UP_START_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.START_TO_CREATE_ACCOUNT"),
  SIGN_UP_FAILED_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.FAILED_TO_CREATE_ACCOUNT"),
  SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.SUCCEEDED_TO_CREATE_ACCOUNT"),

  AUTH_SUCCEEDED_TO_SIGN_OUT: Symbol("AUTH.SUCCEEDED_TO_SIGN_OUT"),
  AUTH_FAILED_TO_SIGN_OUT: Symbol("AUTH.FAILED_TO_SIGN_OUT"),

  AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: Symbol("AUTH.SUCCEEDED_TO_CHECK_LOGGED_IN"),
  AUTH_FAILED_TO_CHECK_LOGGED_IN: Symbol("AUTH.FAILED_TO_CHECK_LOGGED_IN"),

  PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER: Symbol("PROFILE.SYNC_SETTING_INPUT_WITH_CURRENT_USER"),
  PROFILE_UPDATE_CURRENT_USER_PROFILE_IMAGE: Symbol("PROFILE.UPDATE_CURRENT_USER_PROFILE_IMAGE"),
  PROFILE_UPDATE_CURRENT_USER_INSTITUTION: Symbol("PROFILE.UPDATE_CURRENT_USER_INSTITUTION"),
  PROFILE_UPDATE_CURRENT_USER_MAJOR: Symbol("PROFILE.UPDATE_CURRENT_USER_MAJOR"),
  PROFILE_CHANGE_PROFILE_IMAGE_INPUT: Symbol("PROFILE.CHANGE_PROFILE_IMAGE_INPUT"),
  PROFILE_CHANGE_INSTITUTION_INPUT: Symbol("PROFILE.CHANGE_INSTITUTION_INPUT"),
  PROFILE_CHANGE_MAJOR_INPUT: Symbol("PROFILE.CHANGE_MAJOR_INPUT"),

  ARTICLE_SHOW_CHANGE_EVALUATION_TAB: Symbol("ARTICLE.SHOW_CHANGE_EVALUATION_TAB"),
  ARTICLE_SHOW_CHANGE_EVALUATION_STEP: Symbol("ARTICLE.SHOW_CHANGE_EVALUATION_STEP"),
  ARTICLE_SHOW_CHANGE_EVALUATION_SCORE: Symbol("ARTICLE.SHOW_CHANGE_EVALUATION_SCORE"),
  ARTICLE_SHOW_CHANGE_EVALUATION_COMMENT: Symbol("ARTICLE.SHOW_CHANGE_EVALUATION_COMMENT"),
  ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION: Symbol("ARTICLE.SHOW_START_TO_SUBMIT_EVALUATION"),
  ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION: Symbol("ARTICLE.SHOW_FAILED_TO_SUBMIT_EVALUATION"),
  ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION: Symbol("ARTICLE.SHOW_SUCCEEDED_SUBMIT_EVALUATION"),
  ARTICLE_SHOW_START_TO_GET_ARTICLE: Symbol("ARTICLE.SHOW_START_TO_GET_ARTICLE"),
  ARTICLE_SHOW_FAILED_TO_GET_ARTICLE: Symbol("ARTICLE.SHOW_FAILED_TO_GET_ARTICLE"),
  ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE: Symbol("ARTICLE.SHOW_SUCCEEDED_TO_GET_ARTICLE"),
  ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT: Symbol("ARTICLE.SHOW_TOGGLE_PEER_EVALUATION_COMPONENT"),
  ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT: Symbol("ARTICLE.SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT"),
  ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT: Symbol(
    "ARTICLE.SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT",
  ),
  ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT: Symbol(
    "ARTICLE.SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT",
  ),

  ARTICLE_CREATE_CHANGE_CREATE_STEP: Symbol("ARTICLE.CREATE_CHANGE_CREATE_STEP"),
  ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN: Symbol("ARTICLE.CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN"),
  ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY: Symbol("ARTICLE.CREATE_SELECT_ARTICLE_CATEGORY"),
  ARTICLE_CREATE_PLUS_AUTHOR: Symbol("ARTICLE_CREATE.PLUS_AUTHOR"),
  ARTICLE_CREATE_MINUS_AUTHOR: Symbol("ARTICLE_CREATE.MINUS_AUTHOR"),
  ARTICLE_CREATE_CHANGE_ARTICLE_LINK: Symbol("ARTICLE_CREATE.CHANGE_ARTICLE_LINK"),
  ARTICLE_CREATE_CHANGE_ARTICLE_TITLE: Symbol("ARTICLE_CREATE.CHANGE_ARTICLE_TITLE"),
  ARTICLE_CREATE_CHANGE_AUTHOR_NAME: Symbol("ARTICLE_CREATE.CHANGE_AUTHOR_NAME"),
  ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION: Symbol("ARTICLE_CREATE.CHANGE_AUTHOR_INSTITUTION"),
  ARTICLE_CREATE_CHANGE_ABSTRACT: Symbol("ARTICLE_CREATE.CHANGE_ABSTRACT"),
  ARTICLE_CREATE_CHANGE_NOTE: Symbol("ARTICLE_CREATE.CHANGE_NOTE"),
  ARTICLE_CREATE_FORM_ERROR: Symbol("ARTICLE_CREATE.FORM_ERROR"),
  ARTICLE_CREATE_AUTHOR_INPUT_ERROR: Symbol("ARTICLE_CREATE.AUTHOR_INPUT_ERROR"),
  ARTICLE_CREATE_REMOVE_FORM_ERROR: Symbol("ARTICLE_CREATE.REMOVE_FORM_ERROR"),

  HEADER_REACH_SCROLL_TOP: Symbol("HEADER.REACH_SCROLL_TOP"),
  HEADER_LEAVE_SCROLL_TOP: Symbol("HEADER.LEAVE_SCROLL_TOP"),

  ARTICLE_FEED_CHANGE_CATEGORY: Symbol("ARTICLE_FEED.CHANGE_CATEGORY"),
  ARTICLE_FEED_CHANGE_SORTING_OPTION: Symbol("ARTICLE_FEED.CHANGE_SORTING_OPTION"),
  ARTICLE_FEED_OPEN_CATEGORY_POPOVER: Symbol("ARTICLE_FEED.OPEN_CATEGORY_POPOVER"),
  ARTICLE_FEED_CLOSE_CATEGORY_POPOVER: Symbol("ARTICLE_FEED.CLOSE_CATEGORY_POPOVER"),
  ARTICLE_FEED_START_TO_GET_ARTICLES: Symbol("ARTICLE_FEED_START_TO_GET_ARTICLES"),
  ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES: Symbol("ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES"),
  ARTICLE_FEED_FAILED_TO_GET_ARTICLES: Symbol("ARTICLE_FEED_FAILED_TO_GET_ARTICLES"),
};
