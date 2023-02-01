import React from 'react';
import { Collapsible, Icon, Card } from '@edx/paragon';
import { KeyboardArrowUp, KeyboardArrowDown } from '@edx/paragon/icons';
import {
  arrayOf, bool, string, node,
} from 'prop-types';
import { useFullCard } from '../containers/ProblemEditor/components/EditProblemView/SettingsWidget/hooks';

const CardSection = ({
  children, none, isCardCollapsibleOpen, summary,
}) => {
  const show = isCardCollapsibleOpen || summary;
  if (!show) { return null; }

  return (
    <Card.Section className="px-4 pb-4 pt-3">
      <Collapsible.Advanced
        open={!isCardCollapsibleOpen}
      >
        <Collapsible.Body className="collapsible-body">
          <span className={`small ${none ? 'text-gray-500' : 'text-primary-500'}`}>{summary}</span>
        </Collapsible.Body>
      </Collapsible.Advanced>
      <Collapsible.Advanced
        open={isCardCollapsibleOpen}
      >
        <Collapsible.Body className="collapsible-body">
          {children}
        </Collapsible.Body>
      </Collapsible.Advanced>
    </Card.Section>
  );
};
CardSection.propTypes = {
  none: bool,
  children: node.isRequired,
  summary: string,
  isCardCollapsibleOpen: bool.isRequired,
};
CardSection.defaultProps = {
  none: false,
  summary: null,
};

/** CollapsibleCard
 *
 * You can pass an array of sections to this component, in place of children.
 * The elements of the sections array will each be rendered in their own CardSection.
 */
export const CollapsibleCard = ({
  title, className, children, summary, sections, ...passThroughProps
}) => {
  const { isCardCollapsibleOpen, toggleCardCollapse } = useFullCard();
  const content = children ? [children, ...sections] : sections;

  return (
    <Card className={`${className} CollapsibleCard border border-light-700 shadow-none`}>
      <Card.Section className="settingsCardTitleSection">
        <Collapsible.Advanced
          open={isCardCollapsibleOpen}
          onToggle={toggleCardCollapse}
        >
          <Collapsible.Trigger className="collapsible-trigger d-flex">
            <span className="flex-grow-1 text-primary-500 x-small">{title}</span>
            <Collapsible.Visible whenClosed>
              <Icon src={KeyboardArrowDown} />
            </Collapsible.Visible>
            <Collapsible.Visible whenOpen>
              <Icon src={KeyboardArrowUp} />
            </Collapsible.Visible>
          </Collapsible.Trigger>
        </Collapsible.Advanced>
      </Card.Section>
      {content.map((section, index) => (
        <>
          {index !== 0 && isCardCollapsibleOpen && <hr />}
          <BodySection
            {...passThroughProps}
            isCardCollapsibleOpen={isCardCollapsibleOpen}
            // eslint-disable-next-line react/no-array-index-key
            key={`CollapsibleCard-${title}-${index}`}
            summary={index === 0 ? summary : undefined}
          >
            {section}
          </BodySection>
        </>
      ))}
    </Card>
  );
};
CollapsibleCard.propTypes = {
  title: string.isRequired,
  children: node,
  sections: arrayOf(node),
  className: string,
  summary: string.isRequired,
};
CollapsibleCard.defaultProps = {
  className: '',
  children: null,
  sections: [],
};

export default CollapsibleCard;
