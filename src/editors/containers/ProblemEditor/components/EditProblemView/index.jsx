import React from 'react';

import { injectIntl } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { ReactStateParser } from '../../data/ReactStateParser';
import { ReactStateOLXParser } from '../../data/ReactStateOLXParser';
import { Col, Container, Row } from '@edx/paragon';


export const EditProblemView = ({
  problemType,
  problemState,
}) => {
  const parseSate = (problemState) => () => {
  //   const reactParser = new ReactStateParser(problemState);
  //   const reactOLXParser = new ReactStateOLXParser({ problem: problemState });
  //   return {
  //     markdown: reactParser.getMarkdown(),
  //     olx: reactOLXParser.buildOLX(),
  //   };
  // };
  // return (
  //   <EditorContainer getContent={parseSate(problemState)}>
  //     <QuestionWidget />
  //     <AnswerWidget problemType={problemType} />
  //     <SettingsWidget />
  //   </EditorContainer>
      let reactParser = new ReactStateParser(problemState);
      return reactParser.getMetadata();
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
