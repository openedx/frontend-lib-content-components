import React from 'react';
import PropTypes from 'prop-types';

import {
  Image, Scrollable, SelectableBox, Spinner,
} from '@edx/paragon';

export const Gallery = ({
  loading,
  imgList,
  highlighted,
  setHighlighted,
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
          onChange={e => setHighlighted(e.target.value)}
          type={type}
          value={highlighted}
        >
          {imgList.map(
            img => (
              <SelectableBox className="card bg-white" key={img.externalUrl} type={type} value={img.id}>
                <div className="card-div d-flex flex-row flex-nowrap">
                  <Image
                    style={{ width: '100px', height: '100px' }}
                    src={img.externalUrl}
                  />
                  <div className="img-text p-3">
                    <h3>{img.displayName}</h3>
                    <p>Added {img.dateAdded}</p>
                  </div>
                </div>
              </SelectableBox>
            ),
          )}
        </SelectableBox.Set>
      </div>
    </Scrollable>
  );
};

Gallery.propTypes = {
  loading: PropTypes.bool.isRequired,
  imgList: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlighted: PropTypes.string.isRequired,
  setHighlighted: PropTypes.func.isRequired,
};

export default Gallery;
