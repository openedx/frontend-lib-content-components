import React from 'react';
import PropTypes from 'prop-types';
import { selectors, actions } from '../../../../../data/redux';
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import ScoringCard from './settingsComponents/ScoringCard';
import ShowAnswerCard from './settingsComponents/ShowAnswerCard';
import HintsCard from './settingsComponents/HintsCard';
import ResetCard from './settingsComponents/ResetCard';
import MatlabCard from './settingsComponents/MatlabCard';
import RandomizationCard from './settingsComponents/RandomizationCard';
import TimerCard from './settingsComponents/TimerCard';
import { Button, Col, Collapsible, Container, Row } from '@edx/paragon';
import TypeCard from './settingsComponents/TypeCard';
import messages from './messages';
import { showAdvancedSettingsCards } from './hooks';

import './index.scss';

// This widget should be connected, grab all settings from store, update them as needed.
export const SettingsWidget = ({
  problemType,
  // redux
  settings,
  updateSettings,
  updateField,
}) => {
  const { isAdvancedCardsVisible, showAdvancedCards } = showAdvancedSettingsCards();
  return (
    <div>
      <div>
        <h3>
          <FormattedMessage {...messages.settingsWidgetTitle} />
        </h3>
        <Container>
          <Row>
            <Col>
              <Row className='my-2'>
                <TypeCard problemType={problemType} updateField={updateField} />
              </Row>
              <Row className='my-2'>
                <ScoringCard scoring={settings.scoring} updateSettings={updateSettings} />
              </Row>
              <Row className='mt-2'>
                <HintsCard hints={settings.hints} updateSettings={updateSettings} />
              </Row>

              <Row>
                <Collapsible.Advanced open={!isAdvancedCardsVisible} >
                  <Collapsible.Body className="collapsible-body">
                    <Button
                      className="my-3 ml-2"
                      variant="link"
                      size="inline"
                      onClick={showAdvancedCards}
                    >
                      <FormattedMessage {...messages.showAdvanceSettingsButtonText} />
                    </Button>
                  </Collapsible.Body>
                </Collapsible.Advanced>
              </Row>

              <Collapsible.Advanced open={isAdvancedCardsVisible} >
                <Collapsible.Body className="collapsible-body">
                  <Row className='my-2'>
                    <RandomizationCard randomization={settings.randomization} />
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
  problemType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  settings: selectors.problem.settings(state),
});

export const mapDispatchToProps = {
  updateSettings: actions.problem.updateSettings,
  updateField: actions.problem.updateField,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SettingsWidget));
