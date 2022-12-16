import React from 'react';
import PropTypes from 'prop-types';

import ProblemTypeSelect from './content/ProblemTypeSelect';
import Preview from './content/Preview';
import SelectTypeWrapper from './SelectTypeWrapper';
import hooks from './hooks';
import { ProblemTypeKeys } from '../../../../data/constants/problem';
import { Col, Container, Row } from '@edx/paragon';

export const SelectTypeModal = ({
  onClose,
}) => {
  const { selected, setSelected } = hooks.selectHooks();

  return (
    <SelectTypeWrapper onClose={onClose} selected={selected}>
      <Container className="mx-4 my-3 px-3 py-2">
        <Row>
          <Col>
            <ProblemTypeSelect selected={selected} setSelected={setSelected} />
          </Col>
          <Col>
            <Preview problemType={selected} />
          </Col>
        </Row>
      </Container>
    </SelectTypeWrapper>
  );
};

SelectTypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SelectTypeModal;
