import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { MIN_YEAR } from "./constants";
import Slider from "./slider";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { goToYearFilteredSearchResultPage, GoToYearFilteredSearchResultPageParams } from "./helper";
import FilterButton from "../filterButton";
const styles = require("./yearRangeSlider.scss");

interface YearSet {
  year: number;
  docCount: number;
}

interface YearRangeSliderProps extends RouteComponentProps<null> {
  yearInfo: YearSet[];
  filteredYearInfo: YearSet[];
}

interface ColumnProps {
  width: string;
  height: string;
  active: boolean;
  yearSet: YearSet;
  isSelecting: boolean;
  isSelectMode: boolean;
  filteredYearSet: YearSet | undefined;
  filterHeight: string;
  destinationParams: GoToYearFilteredSearchResultPageParams;
}

const Column: React.FunctionComponent<ColumnProps> = React.memo(props => {
  const baseColumnStyle: React.CSSProperties = {
    width: props.width,
    borderRight: "solid 1px #f9f9fa",
  };
  const filterColumnStyle: React.CSSProperties = {
    ...baseColumnStyle,
    height: props.filterHeight,
    backgroundColor: "#3e7fff",
  };
  const normalColumnStyle: React.CSSProperties = {
    ...baseColumnStyle,
    height: props.height,
  };

  return (
    <>
      {props.filteredYearSet &&
        props.filteredYearSet.docCount > 0 && (
          <div
            style={filterColumnStyle}
            className={styles.filterColumn}
            onClick={() => {
              goToYearFilteredSearchResultPage(props.destinationParams);
            }}
          />
        )}
      <div
        style={normalColumnStyle}
        className={classNames({
          [styles.column]: true,
          [styles.activeColumn]: props.active,
        })}
        onClick={() => {
          goToYearFilteredSearchResultPage(props.destinationParams);
        }}
      >
        <div
          className={classNames({
            [styles.columnLabel]: true,
            [styles.isSelectMode]: props.isSelectMode,
            [styles.isSelecting]: props.isSelecting,
          })}
        >
          <div className={styles.docCount}>{`${props.yearSet.docCount} Papers`}</div>
          <div className={styles.yearNum}>{`${props.yearSet.year} Year`}</div>
        </div>
      </div>
    </>
  );
});

const YearRangeSlider: React.FunctionComponent<YearRangeSliderProps> = props => {
  const currentYear = new Date().getFullYear();
  const yearSetListToShow: YearSet[] = React.useMemo(
    () =>
      new Array(currentYear - MIN_YEAR).fill("").map((_, i) => {
        const yearSet = props.yearInfo.find(ys => ys.year === MIN_YEAR + i);
        return {
          year: MIN_YEAR + i,
          docCount: yearSet ? yearSet.docCount : 0,
        };
      }),
    [props.yearInfo]
  );

  const queryParamsStr = props.location.search;
  const qp: SearchPageQueryParams = getQueryParamsObject(queryParamsStr);
  const filter = PapersQueryFormatter.objectifyPapersFilter(qp.filter);
  const minYear =
    filter.yearFrom && !isNaN(filter.yearFrom as number) ? (filter.yearFrom as number) : yearSetListToShow[0].year;
  const maxYear =
    filter.yearTo && !isNaN(filter.yearTo as number)
      ? (filter.yearTo as number)
      : yearSetListToShow[yearSetListToShow.length - 1].year;

  const [values, setValues] = React.useState([minYear, maxYear]);
  const [selectingColumn, setSelectingColumn] = React.useState(0);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const maxDocCount = React.useMemo(() => Math.max(...yearSetListToShow.map(yearSet => yearSet.docCount)), [
    yearSetListToShow,
  ]);
  const columnBoxNode = React.useRef<HTMLDivElement | null>(null);
  const boxWidth = columnBoxNode.current ? columnBoxNode.current.offsetWidth : 321;
  const stepWidth = Math.floor(boxWidth / yearSetListToShow.length);

  return (
    <div className={styles.yearFilter}>
      <div className={styles.content}>
        <div className={styles.title}>
          Published Year
          <div
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: queryParamsStr,
                history: props.history,
                max: currentYear,
                min: MIN_YEAR,
                fromBtn: true,
              });
            }}
            className={styles.resetBtn}
          >
            Reset
          </div>
        </div>

        <div className={styles.btnsWrapper}>
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: queryParamsStr,
                history: props.history,
                max: currentYear,
                min: currentYear,
                fromBtn: true,
              });
            }}
            isActive={minValue === currentYear && maxValue === currentYear}
            text="This Year"
          />
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: queryParamsStr,
                history: props.history,
                max: currentYear,
                min: currentYear - 2,
                fromBtn: true,
              });
            }}
            isActive={minValue === currentYear - 2 && maxValue === currentYear}
            text="Last 3 Years"
          />
          <FilterButton
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: queryParamsStr,
                history: props.history,
                max: currentYear,
                min: currentYear - 4,
                fromBtn: true,
              });
            }}
            isActive={minValue === currentYear - 4 && maxValue === currentYear}
            text="Last 5 Years"
          />
        </div>

        <div className={styles.yearFilterBox}>
          <div ref={columnBoxNode} className={styles.columnBox}>
            {yearSetListToShow.map(yearSet => {
              const filteredYearSet = props.filteredYearInfo.find(ys => ys.year === yearSet.year);
              const filterHeight = filteredYearSet
                ? `${Math.max(Math.round((filteredYearSet.docCount / maxDocCount) * 100), 4.5)}%`
                : "0px";

              return (
                <Column
                  key={yearSet.year}
                  width={`${stepWidth}px`}
                  height={`${Math.round((yearSet.docCount / maxDocCount) * 100)}%`}
                  active={minValue <= yearSet.year && yearSet.year <= maxValue}
                  isSelecting={selectingColumn === yearSet.year}
                  isSelectMode={selectingColumn !== 0}
                  yearSet={yearSet}
                  filteredYearSet={filteredYearSet}
                  filterHeight={filterHeight}
                  destinationParams={{
                    qs: queryParamsStr,
                    min: yearSet.year,
                    max: yearSet.year,
                    history: props.history,
                  }}
                />
              );
            })}
          </div>
          <Slider
            minValue={minValue}
            maxValue={maxValue}
            values={values}
            setValues={setValues}
            step={stepWidth}
            onSelectingColumn={setSelectingColumn}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(withStyles<typeof YearRangeSlider>(styles)(YearRangeSlider));