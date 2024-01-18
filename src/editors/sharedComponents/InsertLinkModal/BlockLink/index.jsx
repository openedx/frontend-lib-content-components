import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { LinkOff } from '@edx/paragon/icons';
import { formatBlockPath } from '../utils';

import './index.scss';

const BlockLink = ({ path, onCloseLink }) => {
  const { title, subTitle } = formatBlockPath(path);
  return (
    <div className="link-container d-flex row p-4 rounded border border-gray-400 mx-4 mt-3">
      <div className="col-10">
        <p className="text-left">{subTitle}</p>
        <p className="h2 w-20 title">{title}</p>
      </div>
      <div className="col-2">
        <Button
          variant="tertiary"
          className="d-flex justify-content-center align-items-center"
          data-testid="close-link-button"
          size="lg"
          iconBefore={LinkOff}
          onClick={onCloseLink}
        >
         &nbsp;
        </Button>
      </div>
    </div>
  );
};

BlockLink.defaultProps = {
  onCloseLink: () => {},
};

BlockLink.propTypes = {
  path: PropTypes.string.isRequired,
  onCloseLink: PropTypes.func,
};

export default BlockLink;
