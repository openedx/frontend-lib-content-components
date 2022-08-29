import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Collapsible, Icon, IconButton } from '@edx/paragon';
import { ExpandLess, ExpandMore, Info } from '@edx/paragon/icons';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import messages from './messages';

/**
 * Simple Wrapper for a Form Widget component in the Video Settings modal
 * Takes a title element and children, and produces a collapsible widget container
 * <CollapsibleFormWidget title={<h1>My Title</h1>}>
 *   <div>My Widget</div>
 * </CollapsibleFormWidget>
 */
export const CollapsibleFormWidget = ({
  children,
  error,
  subtitle,
  title,
}) => (
  <Collapsible.Advanced
    className="collapsible-card rounded mb-3 px-3 py-2"
    defaultOpen
    open={error || undefined}
  >
    <Collapsible.Trigger
      className="collapsible-trigger d-flex border-0 align-items-center"
      style={{ justifyContent: 'unset' }}
    >
      <Collapsible.Visible whenClosed>
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex flex-grow-1 w-75">{title}</div>
          {subtitle}
        </div>
        <div className="d-flex flex-row align-self-start">
          {error && <Icon className="alert-icon" src={Info} />}
          <IconButton alt="TODOformatted" src={ExpandMore} iconAs={Icon} variant="dark" />
        </div>
      </Collapsible.Visible>
      <Collapsible.Visible whenOpen>
        <div className="d-flex flex-grow-1 w-75">{title}</div>
        <div className="align-self-start">
          <IconButton alt="TODOformatted" src={ExpandLess} iconAs={Icon} variant="dark" />
        </div>
      </Collapsible.Visible>
    </Collapsible.Trigger>
    <Collapsible.Body className="collapsible-body rounded px-0">
      <Alert
        icon={Info}
        show={error}
        variant="danger"
      >
        {/* <FormattedMessage {...messages.couldNotLoadTextContext} /> */}
        {error}
      </Alert>
      {children}
    </Collapsible.Body>
  </Collapsible.Advanced>
);

CollapsibleFormWidget.defaultProps = {
  error: null,
  subtitle: null,
};

CollapsibleFormWidget.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
  subtitle: PropTypes.node,
  title: PropTypes.node.isRequired,
};

export default CollapsibleFormWidget;
