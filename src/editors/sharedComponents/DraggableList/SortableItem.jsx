import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from '@edx/frontend-platform/i18n';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon, IconButtonWithTooltip, Row } from '@edx/paragon';
import { DragIndicator } from '@edx/paragon/icons';
import messages from './messages';

const SortableItem = ({
  id,
  componentStyle,
  buttonClassName,
  children,
  // injected
  intl,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...componentStyle,
  };

  return (
    <Row
      ref={setNodeRef}
      style={style}
      className="mx-0"
    >
      {children}
      <IconButtonWithTooltip
        className={buttonClassName}
        key="drag-to-reorder-icon"
        tooltipPlacement="top"
        tooltipContent={intl.formatMessage(messages.tooltipContent)}
        src={DragIndicator}
        iconAs={Icon}
        variant="secondary"
        alt={intl.formatMessage(messages.tooltipContent)}
        {...attributes}
        {...listeners}
      />
    </Row>
  );
};
SortableItem.defaultProps = {
  componentStyle: null,
  buttonClassName: null,
};
SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  componentStyle: PropTypes.shape({}),
  buttonClassName: PropTypes.string,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(SortableItem);
