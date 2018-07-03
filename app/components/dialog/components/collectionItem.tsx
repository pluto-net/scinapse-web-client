import * as React from "react";
import * as classNames from "classnames";
import Icon from "../../../icons";
import Spinner from "../../common/spinner/buttonSpinner";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import {
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams
} from "../../../api/collection";
const styles = require("./collectionItem.scss");

interface CollectionItemProps {
  collectionDialogPaperId: number;
  collection: Collection;
  handleAddingPaperToCollections: (
    params: AddPaperToCollectionParams
  ) => Promise<void>;
  handleRemovingPaperFromCollection: (
    params: RemovePapersFromCollectionParams
  ) => Promise<void>;
}

interface CollectionItemStates {
  isLoading: boolean;
  hasFailed: boolean;
}

@withStyles<typeof CollectionItem>(styles)
class CollectionItem extends React.PureComponent<
  CollectionItemProps,
  CollectionItemStates
> {
  public constructor(props: CollectionItemProps) {
    super(props);

    this.state = {
      isLoading: false,
      hasFailed: false
    };
  }

  public render() {
    const { collection } = this.props;

    return (
      <li
        className={classNames({
          [`${styles.collectionItem}`]: true,
          [`${styles.selected}`]: collection.contains_selected
        })}
        key={`collection_modal_${collection.id}`}
        onClick={() => {
          this.handleSelectCollectionItem(collection);
        }}
      >
        <div className={styles.collectionTitle}>{collection.title}</div>
        <div className={styles.paperCount}>
          {`${collection.paper_count} papers`}
        </div>

        <div className={styles.collectionIconWrapper}>
          {this.getCollectionItemIcon(collection)}
        </div>
      </li>
    );
  }

  private getCollectionItemIcon = (collection: Collection) => {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Spinner />;
    } else if (collection.contains_selected) {
      return <Icon icon="MINUS" />;
    } else {
      return <Icon icon="SMALL_PLUS" />;
    }
  };

  private handleSelectCollectionItem = async (collection: Collection) => {
    const {
      handleAddingPaperToCollections,
      handleRemovingPaperFromCollection,
      collectionDialogPaperId
    } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return;
    }

    try {
      this.setState({ isLoading: true, hasFailed: false });

      if (collection.contains_selected) {
        await handleRemovingPaperFromCollection({
          collection,
          paperIds: [collectionDialogPaperId]
        });
      } else {
        await handleAddingPaperToCollections({
          collection,
          paperId: collectionDialogPaperId
        });
      }

      this.setState({ isLoading: false, hasFailed: false });
    } catch (err) {
      this.setState({ isLoading: false, hasFailed: true });
    }
  };
}
export default CollectionItem;
