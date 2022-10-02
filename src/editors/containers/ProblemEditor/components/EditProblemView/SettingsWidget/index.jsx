import React, { useState } from 'react';
import { selectors, actions } from '../../../../../data/redux';
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ScoringCard from './settingsComponents/ScoringCard';
import ShowAnswerCard from './settingsComponents/ShowAnswerCard';
import { ProblemTypeKeys } from '../../../../../data/constants/problem';
import { problemDataProps } from '../../../../../data/services/cms/types';
import HintsCard from './settingsComponents/HintsCard';
import ResetCard from './settingsComponents/ResetCard';
import MatlabCard from './settingsComponents/MatlabCard';
import RandomizationCard from './settingsComponents/RandomizationCard';
import TimerCard from './settingsComponents/TimerCard';
import { Button, Col, Collapsible, Container, Row } from '@edx/paragon';

// This widget should be connected, grab all settings from store, update them as needed.
export const SettingsWidget = ({
  problemType,
  // redux
  settings,
  updateSettings,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  return (
    <div>
      <div>
        <h1>
          Settings
        </h1>
        <Container>
          <Row>
            <Col>
              <Row className='my-2'>
                <ScoringCard scoring={settings.scoring} updateSettings={updateSettings} />
              </Row>
              <Row className='mt-2'>
                <HintsCard hints={settings.hints} updateSettings={updateSettings} />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Collapsible.Advanced open={!showAdvanced} >
                <Collapsible.Body className="collapsible-body">
                  <Button
                    className="my-3 ml-2"
                    variant="link"
                    size="inline"
                    onClick={() => setShowAdvanced(true)}
                  >
                    Show advanced settings
                  </Button>
                </Collapsible.Body>
              </Collapsible.Advanced>
            </Col>
          </Row>
          <Row>
            <Col>
              <Collapsible.Advanced open={showAdvanced} >
                <Collapsible.Body className="collapsible-body">
                  <Row className='my-2'>
                    <RandomizationCard randomization={settings.randomization} updateSettings={updateSettings} />
                  </Row>
                  <Row className='my-2'>
                    <ShowAnswerCard showAnswer={settings.showAnswer} updateSettings={updateSettings} />
                  </Row>
                  <Row className='my-2'>
                    <ResetCard showResetButton={settings.showResetButton} updateSettings={updateSettings} />
                  </Row>
                  <Row className='my-2'>
                    <TimerCard timeBetween={settings.timeBetween} updateSettings={updateSettings} />
                  </Row>
                  <Row className='my-2'>
                    <MatlabCard matLabApiKey={settings.matLabApiKey} updateSettings={updateSettings} />
                  </Row>
                </Collapsible.Body>
              </Collapsible.Advanced>
            </Col>
          </Row>
        </Container>
      </div>

    </div>
  );
}

SettingsWidget.propTypes = {
  problemType: ProblemTypeKeys.isRequired,
  settings: problemDataProps.settings.isRequired,
  updateSettings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  settings: selectors.problem.settings(state),
});

const mapDispatchToProps = {
  updateSettings: actions.problem.updateSettings,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SettingsWidget));