import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import * as Actions from "./actions";
import { IMyPageStateRecord, MY_PAGE_CATEGORY_TYPE } from "./records";
import { Link } from "react-router-dom";
// Components
import Wallet from "./components/wallet";
// Styles
const styles = require("./myPage.scss");

interface IMyPageContainerProps extends DispatchProp<IMyPageContainerMappedState> {
  myPageState: IMyPageStateRecord;
}

interface IMyPageContainerMappedState {
  myPageState: IMyPageStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    myPageState: state.myPage,
  };
}
const mockUserName = "Miheiz";
const mockReputation = 84.7;
const mockContent = "Postech, Computer Science";
const mockArticleNum = 3;
const mockEvaluationNum = 10;

const mockTransactions = [{ id: 2, name: "1" }, { id: 3, name: "23" }, { id: 4, name: "34" }];
const mockTokenBalance = 3;
const mockWalletAddress = "0x822408EAC8C331002BE00070AFDD2A5A02065D3F";

class MyPage extends React.PureComponent<IMyPageContainerProps, {}> {
  private getLowerContainer() {
    const { myPageState } = this.props;

    switch (myPageState.category) {
      case MY_PAGE_CATEGORY_TYPE.ARTICLE: {
        return <div>ARTICLE</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.EVALUATION: {
        return <div>EVALUATION</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.SETTING: {
        return <div>SETTING</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.WALLET: {
        return (
          <Wallet transactions={mockTransactions} tokenBalance={mockTokenBalance} walletAddress={mockWalletAddress} />
        );
      }
    }
  }

  private changeCategory(category: MY_PAGE_CATEGORY_TYPE) {
    const { dispatch } = this.props;
    dispatch(Actions.changeCategory(category));
  }

  private getCategoryBtn = (type: MY_PAGE_CATEGORY_TYPE, content: string) => {
    const { category } = this.props.myPageState;

    return (
      <div
        onClick={() => {
          this.changeCategory(type);
        }}
        className={category === type ? `${styles.categoryBtn} ${styles.isClickedBtn}` : styles.categoryBtn}
      >
        {content}
      </div>
    );
  };

  public render() {
    return (
      <div>
        <div className={styles.upperContainer}>
          <div className={styles.profileContainer}>
            <Icon className={styles.avatarIconWrapper} icon="AVATAR" />
            <div className={styles.profileDescription}>
              <div className={styles.nameAndReputation}>
                <div className={styles.userName}>{mockUserName}</div>
                <div className={styles.reputationGraphIconWrapper}>
                  <Icon icon="REPUTATION_GRAPH" />
                </div>
                <div className={styles.reputation}>
                  <div className={styles.reputationTooltip}>
                    <div className={styles.reputationTooltipIconWrapper}>
                      <Icon icon="TOOLTIP" />
                    </div>
                    <div className={styles.reputationTooltipContent}>Reputation</div>
                  </div>
                  {mockReputation}
                </div>
              </div>
              <div className={styles.userDegree}>{mockContent}</div>
              <div className={styles.userHistory}>
                {`Article  ${mockArticleNum}  |   Evaluation  ${mockEvaluationNum} `}
              </div>
            </div>
            <div
              className={styles.configureIconWrapper}
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.SETTING);
              }}
            >
              <Icon icon="SETTING_BUTTON" />
            </div>
            <Link className={styles.submitArticleBtn} to="/submit">
              Submit Article
            </Link>
          </div>
          <div className={styles.categoryContainer}>
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.ARTICLE, "Article")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.EVALUATION, "Evaluation")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.WALLET, "Wallet")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.SETTING, "Setting")}
          </div>
        </div>
        <div className={styles.lowerContainer}>
          <div className={styles.innerContainer}>{this.getLowerContainer()}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyPage);
