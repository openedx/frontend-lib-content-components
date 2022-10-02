import React, { useState } from 'react'
import { Collapsible, Icon, Card, } from '@edx/paragon'
import { KeyboardArrowUp, KeyboardArrowDown } from '@edx/paragon/icons'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

export const SettingsOption = ({
    title,
    summary,
    children
}) => {
    const [cardCollapsed, setCardCollapsed] = useState(false)

    const toggleFeedback = () => {
        setCardCollapsed(!cardCollapsed);
    };
    return (
        <Card>
            <Card.Section>
                <Collapsible.Advanced
                    open={cardCollapsed}
                    onToggle={toggleFeedback}
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
            <Card.Section>
                <Collapsible.Advanced
                    open={!cardCollapsed}
                >
                    <Collapsible.Body className="collapsible-body">
                        <span>{summary}</span>
                    </Collapsible.Body>
                </Collapsible.Advanced>
                <Collapsible.Advanced
                    open={cardCollapsed}
                >
                    <Collapsible.Body className="collapsible-body">
                        {children}
                    </Collapsible.Body>
                </Collapsible.Advanced>
            </Card.Section>
        </Card>
    )
}

SettingsOption.propTypes = {
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default injectIntl(SettingsOption);