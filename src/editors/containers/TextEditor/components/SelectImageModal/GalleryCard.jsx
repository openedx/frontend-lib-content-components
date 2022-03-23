import React from 'react';
import PropTypes from 'prop-types';

import { Image, SelectableBox } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const GalleryCard = ({
  img,
  // inject
  intl,
}) => (
  <SelectableBox className="card bg-white" key={img.externalUrl} type="radio" value={img.id}>
    <div className="card-div d-flex flex-row flex-nowrap">
      <Image
        style={{ width: '100px', height: '100px' }}
        src={img.externalUrl}
      />
      <div className="img-text p-3">
        <h3>{img.displayName}</h3>
        <p>
          <FormattedMessage {...messages.addedDatePart1Label} />
          {intl.formatDate(img.jsDate)}
          <FormattedMessage {...messages.addedDatePart2Label} />
          {intl.formatTime(img.jsDate)}
        </p>
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
};

export default injectIntl(GalleryCard);
