import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Button, Col, Container, Form, Icon, IconButton, Row } from '@edx/paragon'
import { Add, Delete } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';

const HintRow = ({ value, handleChange, handleDelete, intl }) => (
    <Container fluid>
        <Row>
            <Col xs={10}>
                <Form.Group>
                    <Form.Control
                        value={value}
                        onChange={handleChange}
                        floatingLabel={intl.formatMessage(messages.hintInputLabel)}
                    />
                </Form.Group>
            </Col>

            <Col xs={2} >
                <IconButton
                    src={Delete}
                    iconAs={Icon}
                    alt={intl.formatMessage(messages.settingsDeleteIconAltText)}
                    onClick={handleDelete}
                    variant="secondary"
                />
            </Col>
        </Row>
    </Container>
)

export const HintsCard = ({
    hints,
    updateSettings,
    intl,
}) => {
    const [summary, setSummary] = useState("")
    const handleChange = (id, value) => {
        hints = hints.map(hint => {
            if (hint.id === id) {
                return { ...hint, value };
            }
            return hint;
        });
        updateSettings({ hints })
    }
    const handleDelete = (id) => {
        hints = hints.filter((hint) => (hint.id != id));
        updateSettings({ hints })
    }
    const handleAdd = () => {
        let newId = Math.max(...hints.map(hint => hint.id)) + 1
        const hint = { id: newId, value: "" }
        hints = [...hints, hint]
        updateSettings({ hints })
    }

    useEffect(() => {
        const hintsNumber = hints.length
        if (hintsNumber == 0) {
            setSummary(intl.formatMessage(messages.noHintSummary))
        } else {
            setSummary(intl.formatMessage(messages.hintSummary, { hint: hints[0].value, count: (hintsNumber - 1) }))
        }
    })

    return (
        <SettingsOption
            title={intl.formatMessage(messages.hintSettingTitle)}
            summary={summary}
        >
            {hints.map((hint) => (
                <HintRow
                    key={hint.id}
                    value={hint.value}
                    handleChange={(e) => handleChange(hint.id, e.target.value)}
                    handleDelete={() => handleDelete(hint.id)}
                    intl={intl}
                />
            ))}
            <Button
                className="my-3 ml-2"
                iconBefore={Add}
                variant="tertiary"
                onClick={handleAdd}
            >
                <FormattedMessage {...messages.addHintButtonText} />
            </Button>
        </SettingsOption>
    )
}

HintsCard.propTypes = {
    hints: problemDataProps.settings.hints,
    updateSettings: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(HintsCard);