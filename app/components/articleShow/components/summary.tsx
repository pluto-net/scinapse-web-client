import * as React from "react";
import { IArticleRecord } from "../../../model/article";
import CircularProgress from "material-ui/CircularProgress";
import LinearProgress from "material-ui/LinearProgress";
import { EVALUATION_TYPES } from "../../../model/evaluation";
import formatNumber from "../../../helpers/formatNumber";
const styles = require("./summary.scss");

export interface IEvaluateSummaryProps {
  article: IArticleRecord;
}

interface IPointGraphNodeProps {
  field: EVALUATION_TYPES;
  point: number;
}

const PointGraphNode = ({ field, point }: IPointGraphNodeProps) => {
  let progressColor: string;
  switch (field) {
    case "Originality":
      progressColor = "#ff6e8f";
      break;

    case "Contribution":
      progressColor = "#ffcf48";
      break;

    case "Analysis":
      progressColor = "#6096ff";
      break;

    case "Expressiveness":
      progressColor = "#44c0c1";
      break;

    default:
      break;
  }

  return (
    <div className={styles.pointGraphItem}>
      <span className={styles.pointFieldText}>{field}</span>
      <span className={styles.linearProgressWrapper}>
        <LinearProgress color={progressColor} max={10} mode="determinate" value={point} />
      </span>
      <span className={styles.pointFieldPoint}>{formatNumber(point, 2)}</span>
    </div>
  );
};

const EvaluateSummary = (props: IEvaluateSummaryProps) => {
  const { article } = props;

  let totalPoint: number = 0;
  let originalityPoint: number = 0;
  let contributionPoint: number = 0;
  let analysisPoint: number = 0;
  let expressivenessPoint: number = 0;

  if (article.point) {
    totalPoint = article.point.total;
    originalityPoint = article.point.originality;
    contributionPoint = article.point.contribution;
    analysisPoint = article.point.analysis;
    expressivenessPoint = article.point.expressiveness;
  }

  return (
    <div className={styles.summaryContainer}>
      <a target="_blank" href={article.link} className={styles.articleButton}>
        Go to read the article
      </a>
      <div className={styles.summaryWrapper}>
        <div className={styles.totalPointWrapper}>
          <CircularProgress color="#d5e1f7" mode="determinate" value={totalPoint} max={10} size={130} thickness={4} />
          <div className={styles.circularProgressWrapper}>
            <div className={styles.totalPoint}>{formatNumber(totalPoint, 2)}</div>
            <div className={styles.totalPointText}>Pointed</div>
          </div>
        </div>
        <div className={styles.pointGraphWrapper}>
          <PointGraphNode point={originalityPoint} field="Originality" />
          <PointGraphNode point={contributionPoint} field="Contribution" />
          <PointGraphNode point={analysisPoint} field="Analysis" />
          <PointGraphNode point={expressivenessPoint} field="Expressiveness" />
        </div>
        <div className={styles.moreButton}>More Detail</div>
      </div>
    </div>
  );
};

export default EvaluateSummary;
