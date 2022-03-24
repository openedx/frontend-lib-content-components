import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Scrollable, SelectableBox, Spinner,
} from '@edx/paragon';

import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { selectors } from '../../../../data/redux';
import { RequestKeys } from '../../../../data/constants/requests';

import GalleryCard from './GalleryCard';

export const Gallery = ({
  displayList,
  highlighted,
  onHighlightChange,
  // redux
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
          {displayList.map(img => <GalleryCard img={img} />)}
        </SelectableBox.Set>
      </div>
    </Scrollable>
  );
};

Gallery.defaultProps = {
  isFinishedLoadingImages: false,
};
Gallery.propTypes = {
  displayList: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlighted: PropTypes.string.isRequired,
  onHighlightChange: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  isFinishedLoadingImages: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  isFinishedLoadingImages: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchImages }),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Gallery));
