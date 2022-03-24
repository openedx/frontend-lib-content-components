import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {injectIntl} from '@edx/frontend-platform/i18n';
import {
  Scrollable, SelectableBox, Spinner,
} from '@edx/paragon';

import { selectors } from '../../../../data/redux';
import { RequestKeys } from '../../../../data/constants/requests';

import GalleryCard from './GalleryCard';

export const Gallery = ({
  imgList,
  highlighted,
  onHighlightChange,
  //redux
  isFinishedLoadingImages,
}) => {
  if (!isFinishedLoadingImages) {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }
  return (
    <Scrollable className="gallery bg-gray-100" style={{ height: '375px' }}>
      <div className="p-4">
        <SelectableBox.Set
          columns={1}
          name="images"
          onChange={onHighlightChange}
          type="radio"
          value={highlighted}
        >
          {imgList.map(img => <GalleryCard img={img} />)}
        </SelectableBox.Set>
      </div>
    </Scrollable>
  );
};

Gallery.propTypes = {
  isFinishedLoadingImages: PropTypes.bool.isRequired,
  imgList: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlighted: PropTypes.string.isRequired,
  onHighlightChange: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isFinishedLoadingImages: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchImages }),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Gallery));
