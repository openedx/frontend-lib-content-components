import React from 'react';
import PropTypes from 'prop-types';

import {
  Scrollable, SelectableBox, Spinner,
} from '@edx/paragon';

import GalleryCard from './GalleryCard';

export const Gallery = ({
  loading,
  imgList,
  highlighted,
  onHighlightChange,
}) => {
  const type = 'radio';
  
  if (loading) {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }
  return (
    <Scrollable className="gallery bg-gray-100" style={{ height: '375px' }}>
      <div className="p-4">
        <SelectableBox.Set
          columns={1}
          name="images"
          onChange={onHighlightChange}
          type={type}
          value={highlighted}
        >
          {imgList.map(img => <GalleryCard img={img} type={type} />)}
        </SelectableBox.Set>
      </div>
    </Scrollable>
  );
};

Gallery.propTypes = {
  loading: PropTypes.bool.isRequired,
  imgList: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlighted: PropTypes.string.isRequired,
  onHighlightChange: PropTypes.func.isRequired,
};

export default Gallery;
