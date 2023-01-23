import React from 'react';
import { Collapsible, Icon, Card } from '@edx/paragon';
import { KeyboardArrowUp, KeyboardArrowDown } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { showFullCard } from './hooks';

export const SettingsOption = ({
  title,
  summary,
  children,
  className,
}) => {
  const { isCardCollapsed, toggleCardCollapse } = showFullCard();

  return (
    <Card className={`${className} settingsOption border border-light-700 shadow-none`}>
      <Card.Section className="settingsCardTitleSection">
        <Collapsible.Advanced
          open={isCardCollapsed}
          onToggle={toggleCardCollapse}
        >
          <Collapsible.Trigger className="collapsible-trigger d-flex">
            <span className="flex-grow-1">{title}</span>
            <Collapsible.Visible whenClosed>
              <Icon src={KeyboardArrowDown} />
            </Collapsible.Visible>
            <Collapsible.Visible whenOpen>
              <Icon src={KeyboardArrowUp} />
            </Collapsible.Visible>
          </Collapsible.Trigger>
        </Collapsible.Advanced>
      </Card.Section>
      <Card.Section className="px-4 pb-4 pt-3">
        <Collapsible.Advanced
          open={!isCardCollapsed}
        >
          <Collapsible.Body className="collapsible-body">
            <span>{summary}</span>
          </Collapsible.Body>
        </Collapsible.Advanced>
        <Collapsible.Advanced
          open={isCardCollapsed}
        >
          <Collapsible.Body className="collapsible-body">
            {children}
          </Collapsible.Body>
        </Collapsible.Advanced>
      </Card.Section>
    </Card>
  );
};

SettingsOption.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
SettingsOption.defaultProps = {
  className: '',
};

export default SettingsOption;
