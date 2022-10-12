import React from 'react';
import { useDispatch } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Icon } from '@edx/paragon';
import PropTypes from 'prop-types';
import { ProblemTypeKeys } from '../../../../../../data/constants/problem';
import { Check } from '@edx/paragon/icons';
import { typeRowHooks } from '../hooks';


export const TypeRow = ({
    typeKey,
    label,
    selected,
    lastRow,
}) => {

    const dispatch = useDispatch();
    const {onClick} = typeRowHooks(typeKey, dispatch);

    return (
        <>
            <Container size="xl" onClick={onClick} role='button' className="d-flex" fluid>
                <span className="flex-grow-1">{label}</span>
                <span hidden={selected}><Icon src={Check} className="text-success" /></span>
            </Container>
            <hr className={lastRow ? 'd-none' : 'd-block'} />
        </>
    );
}


TypeRow.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    lastRow: PropTypes.bool.isRequired,
};

export default TypeRow;