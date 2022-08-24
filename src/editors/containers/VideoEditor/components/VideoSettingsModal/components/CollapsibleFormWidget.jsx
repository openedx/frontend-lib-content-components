import React from 'react';
import PropTypes from 'prop-types';

import { Collapsible, Icon, IconButton } from '@edx/paragon';
import { ExpandLess, ExpandMore } from '@edx/paragon/icons';

/**
 * Simple Wrapper for a Form Widget component in the Video Settings modal
 * Takes a title element and children, and produces a collapsible widget container
 * <CollapsibleFormWidget title={<h1>My Title</h1>}>
 *   <div>My Widget</div>
 * </CollapsibleFormWidget>
 */
export const CollapsibleFormWidget = ({
  children,
  title,
}) => (
  <Collapsible.Advanced
    className="collapsible-card rounded mb-3 px-3 py-2"
    defaultOpen
  >
    <Collapsible.Trigger
      className="collapsible-trigger d-flex border-0 align-items-center"
      style={{ justifyContent: 'unset' }}
    >
      <div className="d-flex flex-grow-1 w-75">{title}</div>
      <Collapsible.Visible whenClosed>
        <div className="align-self-start">
          <IconButton alt="TODO" src={ExpandMore} iconAs={Icon} variant="dark" />
        </div>
      </Collapsible.Visible>
      <Collapsible.Visible whenOpen>
        <div className="align-self-start">
          <IconButton alt="TODO" src={ExpandLess} iconAs={Icon} variant="dark" />
        </div>
      </Collapsible.Visible>
    </Collapsible.Trigger>
    <Collapsible.Body className="collapsible-body rounded px-0">
      {children}
    </Collapsible.Body>
  </Collapsible.Advanced>
);
CollapsibleFormWidget.propTypes = {
  children: PropTypes.node.isRequired,
  collapsedDisplay: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
};

export default CollapsibleFormWidget;
