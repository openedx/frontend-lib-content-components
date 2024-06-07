import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@openedx/paragon';

const GalleryPagination = ({
  assetCount,
  displayListLength,
  fetchNextPage,
  currentPage,
  setCurrentPage,
  isSearching,
}) => {
  const handlePageChange = (page) => {
    fetchNextPage({ pageNumber: page });
    setCurrentPage(page);
  };

  if ((displayListLength <= 50 && assetCount <= 50) || (isSearching && displayListLength <= 50)) {
    return null;
  }

  return (
    <div className="row justify-content-center py-3">
      <Pagination
        paginationLabel="pagination navigation"
        pageCount={Math.ceil(assetCount / 50)}
        currentPage={currentPage}
        onPageSelect={(page) => handlePageChange(page)}
        size="small"
      />
    </div>
  );
};

GalleryPagination.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  assetCount: PropTypes.number.isRequired,
  displayListLength: PropTypes.number.isRequired,
  fetchNextPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default GalleryPagination;
