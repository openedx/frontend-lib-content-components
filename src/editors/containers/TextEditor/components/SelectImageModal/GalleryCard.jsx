import React from 'react';
import PropTypes from 'prop-types';

import { Image, SelectableBox } from '@edx/paragon';

export const GalleryCard = ({
  img,
  type,
}) => (
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
);

GalleryCard.propTypes = {
  img: PropTypes.shape({
    contentType: PropTypes.string,
    dateAdded: PropTypes.string,
    displayName: PropTypes.string,
    externalUrl: PropTypes.string,
    id: PropTypes.string,
    jsDate: PropTypes.number,
    locked: PropTypes.bool,
    portableUrl: PropTypes.string,
    thumbnail: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default GalleryCard;
