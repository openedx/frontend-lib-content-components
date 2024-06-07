import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@openedx/paragon';
import {
  FormattedMessage,
  useIntl,
} from '@edx/frontend-platform/i18n';

// SelectableBox in paragon has a bug where you can't change selection. So we override it
import SelectableBox from '../SelectableBox';
import messages from './messages';
import GalleryCard from './GalleryCard';
import GalleryPagination from './GalleryPagination';

export const Gallery = ({
  galleryIsEmpty,
  searchIsEmpty,
  displayList,
  highlighted,
  onHighlightChange,
  emptyGalleryLabel,
  showIdsOnCards,
  height,
  isLoaded,
  thumbnailFallback,
  allowPagination,
  fetchNextPage,
  assetCount,
  isSearching,
}) => {
  const intl = useIntl();
  const [currentPageList, setCurrentPageList] = useState(displayList);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (allowPagination) {
      if (displayList.length <= 50 && isSearching) {
        setCurrentPage(1);
        setCurrentPageList(displayList);
      } else {
        const start = 50 * (currentPage - 1);
        const end = 50 * currentPage;
        const newPageList = displayList.slice(start, end);
        setCurrentPageList(newPageList);
      }
    } else {
      setCurrentPageList(displayList);
    }
  }, [displayList]);

  if (!isLoaded) {
    return (
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      >
        <Spinner
          animation="border"
          className="mie-3"
          screenReaderText={intl.formatMessage(messages.loading)}
        />
      </div>
    );
  }
  if (galleryIsEmpty) {
    return (
      <div className="gallery p-4 bg-light-400" style={{ height, margin: '0 -1.5rem' }}>
        <FormattedMessage {...emptyGalleryLabel} />
      </div>
    );
  }
  if (searchIsEmpty) {
    return (
      <div className="gallery p-4 bg-light-400" style={{ height, margin: '0 -1.5rem' }}>
        <FormattedMessage {...messages.emptySearchLabel} />
      </div>
    );
  }
  return (
    <div className="p-4 gallery bg-light-400" style={{ height, margin: '0 -1.5rem' }}>
      <SelectableBox.Set
        columns={1}
        name="images"
        onChange={onHighlightChange}
        type="radio"
        value={highlighted}
      >
        { currentPageList.map(asset => (
          <GalleryCard
            key={asset.id}
            asset={asset}
            showId={showIdsOnCards}
            thumbnailFallback={thumbnailFallback}
          />
        )) }
      </SelectableBox.Set>
      {allowPagination && (
        <GalleryPagination
          {...{
            fetchNextPage,
            assetCount,
            displayListLength: displayList.length,
            currentPage,
            setCurrentPage,
            isSearching,
          }}
        />
      )}
    </div>
  );
};

Gallery.defaultProps = {
  highlighted: '',
  showIdsOnCards: false,
  height: '375px',
  show: true,
  thumbnailFallback: undefined,
  allowPagination: false,
  fetchNextPage: null,
  assetCount: 0,
};
Gallery.propTypes = {
  show: PropTypes.bool,
  isLoaded: PropTypes.bool.isRequired,
  galleryIsEmpty: PropTypes.bool.isRequired,
  searchIsEmpty: PropTypes.bool.isRequired,
  displayList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  highlighted: PropTypes.string,
  onHighlightChange: PropTypes.func.isRequired,
  emptyGalleryLabel: PropTypes.shape({}).isRequired,
  showIdsOnCards: PropTypes.bool,
  height: PropTypes.string,
  thumbnailFallback: PropTypes.element,
  allowPagination: PropTypes.bool,
  fetchNextPage: PropTypes.func,
  assetCount: PropTypes.number,
  isSearching: PropTypes.bool.isRequired,
};

export default Gallery;
