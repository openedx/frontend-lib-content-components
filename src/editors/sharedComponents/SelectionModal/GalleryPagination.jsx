import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@openedx/paragon';


const GalleryPagination = ({
  assetCount,
  displayList,
  fetchNextPage,
  currentPage,
  setCurrentPage,
  isSearching,
}) => {
  const handlePageChange = (page) => {
    fetchNextPage({ pageNumber: page });
    setCurrentPage(page);
  };

  if (displayList.length <= 50 && assetCount <= 50 || isSearching && displayList.length <= 50) {
    return null;
  }

  return (
    <div className='row justify-content-center py-3'>
      <Pagination
        paginationLabel="pagination navigation"
        pageCount={Math.ceil(assetCount/50)}
        currentPage={currentPage}
        onPageSelect={(page) => handlePageChange(page)}
        size="small"
      />
    </div>
  );
};

export default GalleryPagination;