import React from 'react'
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Container, Icon } from '@edx/paragon';
import PropTypes from 'prop-types';
import { ProblemTypeKeys, ProblemTypes } from '../../../../../../data/constants/problem';
import { Check } from '@edx/paragon/icons';
import messages from '../messages';


const TypeRow = ({ name, selected, onClick, lastRow }) => (
    <>
        <Container size="xl" onClick={onClick} role='button' className="d-flex" fluid>
            <span className="flex-grow-1">{name}</span>
            <span hidden={selected}><Icon src={Check} className="text-success" /></span>
        </Container>
        <hr className={lastRow ? 'd-none' : 'd-block'} />
    </>
)


export const TypeCard = ({
    problemType,
    updateField,
    intl,
}) => {
    const problemTypeKeysArray = Object.values(ProblemTypeKeys);

    return (
        <SettingsOption
            title={intl.formatMessage(messages.typeSettingTitle)}
            summary={ProblemTypes[problemType].title}
        >
            {problemTypeKeysArray.map((typeKey, i) => (
                <TypeRow
                    key={i}
                    name={ProblemTypes[typeKey].title}
                    onClick={() => updateField({ problemType: typeKey })}
                    selected={typeKey !== problemType}
                    lastRow={(i + 1) == problemTypeKeysArray.length}
                />
            ))}
        </SettingsOption>
    )
}

TypeCard.propTypes = {
    hints: ProblemTypeKeys.isRequired,
    updateField: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(TypeCard);