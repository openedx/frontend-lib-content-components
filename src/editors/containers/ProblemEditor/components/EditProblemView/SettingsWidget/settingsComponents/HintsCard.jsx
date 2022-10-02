import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Button, Col, Container, Form, Icon, IconButton, Row } from '@edx/paragon'
import { Add, Delete } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

const HintRow = ({ value, handleChange, handleDelete, }) => (
    <Container fluid>
        <Row>
            <Col xs={10}>
                <Form.Group>
                    <Form.Control
                        value={value}
                        onChange={handleChange}
                        floatingLabel="Hint"
                    />
                </Form.Group>
            </Col>

            <Col xs={2} >
                <IconButton
                    src={Delete}
                    iconAs={Icon}
                    // alt={intl.formatMessage(messages.answerDeleteIconAltText)}
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
        console.log(hints);
        updateSettings({ hints })
    }
    const createSummary = () => {
        let text = ""
        const hintsNumber = hints.length
        if (hintsNumber == 0) {
            text = "No Hints"
        } else {
            text = hints[0].value
            if (hintsNumber > 1) {
                text += " (+" + (hintsNumber - 1) + " more)"
            }
        }
        setSummary(text)
    }
    const addAnswer = () => {
        let newId = Math.max(...hints.map(hint => hint.id)) + 1
        const hint = { id: newId, value: "" }
        hints = [...hints, hint]
        updateSettings({ hints })
    }

    useEffect(() => {
        createSummary()
    })

    return (
        <SettingsOption title="Hints" summary={summary}>
            {hints.map((hint) => (
                <HintRow
                    key={hint.id}
                    value={hint.value}
                    handleChange={(e) => handleChange(hint.id, e.target.value)}
                    handleDelete={(e) => handleDelete(hint.id)}
                />
            ))}
            <Button
                className="my-3 ml-2"
                iconBefore={Add}
                variant="tertiary"
                onClick={addAnswer}
            >
                Add hint
            </Button>
        </SettingsOption>
    )
}

HintsCard.propTypes = {
    hints: problemDataProps.settings.hints,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(HintsCard);