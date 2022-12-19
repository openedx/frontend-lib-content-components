import React from 'react';

import { injectIntl } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { ReactStateSettingsParser } from '../../data/ReactStateSettingsParser';
import { ReactStateOLXParser } from '../../data/ReactStateOLXParser';
import { Col, Container, Row } from '@edx/paragon';
import { AdvanceProblemKeys } from '../../../../data/constants/problem';


export const EditProblemView = ({
  problemType,
  problemState,
}) => {
  const parseSate = (problemState) => () => {
    const reactSettingsParser = new ReactStateSettingsParser(problemState);
    const reactOLXParser = new ReactStateOLXParser({ problem: problemState });
    return {
      settings: reactSettingsParser.getSettings(),
      olx: reactOLXParser.buildOLX(),
    };
  };
  if (Object.values(AdvanceProblemKeys).includes(problemType)) {
    return `hello raw editor with ${problemType}`
  }
  return (
    <EditorContainer getContent={parseSate(problemState)}>
      <Container fluid>
        <Row>
          <Col xs={9}>
            <QuestionWidget />
            <AnswerWidget problemType={problemType} />
          </Col>
          <Col xs={3}>
            <SettingsWidget problemType={problemType} />
          </Col>
        </Row>
      </Container>
    </EditorContainer>
  );
};

export const mapStateToProps = (state) => ({
  problemType: selectors.problem.problemType(state),
  problemState: selectors.problem.completeState(state),
});

export default injectIntl(connect(mapStateToProps)(EditProblemView));
