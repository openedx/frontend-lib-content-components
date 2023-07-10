import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { formatMessage } from '../testUtils';
import Footer from './Footer';
import messages from './messages';

const renderComponent = (
  termsOfServiceUrl,
  privacyPolicyUrl,
  supportEmail,
  showAccessibilityPage,
) => {
  render(
    <IntlProvider locale="en">
      <Footer
        marketingBaseUrl="#"
        termsOfServiceUrl={termsOfServiceUrl}
        privacyPolicyUrl={privacyPolicyUrl}
        supportEmail={supportEmail}
        platformName="Test Platform"
        lmsBaseUrl="#"
        studioBaseUrl="#"
        showAccessibilityPage={showAccessibilityPage || false}
        intl={{ formatMessage }}
      />
    </IntlProvider>,
  );
};

describe('Footer', () => {
  describe('help section default view', () => {
    it('help button should read Looking for help with Studio?', () => {
      renderComponent();
      expect(screen.getByText(messages.openHelpButtonLabel.defaultMessage))
        .toBeVisible();
    });
    it('help button link row should not be visible', () => {
      renderComponent();
      expect(screen.queryByTestId('helpButtonRow')).toBeNull();
    });
  });
  describe('help section expanded view', () => {
    it('help button should read Hide Studio help', () => {
      renderComponent();
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByText(messages.closeHelpButtonLabel.defaultMessage))
        .toBeVisible();
    });
    it('help button link row should be visible', () => {
      renderComponent();
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByTestId('helpButtonRow')).toBeVisible();
    });
    it('should not show contect us button', () => {
      renderComponent();
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.queryByTestId('contactUsButton')).toBeNull();
    });
    it('should not show contect us button', () => {
      renderComponent(null, null, 'support@email.com', false);
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByTestId('contactUsButton')).toBeVisible();
    });
  });
  describe('policy link row', () => {
    it('should only show LMS link', () => {
      renderComponent();
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show terms of service link', () => {
      renderComponent('termsofserviceurl', null, null, false);
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeVisible();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show privacy policy link', () => {
      renderComponent(null, 'privacypolicyurl', null, false);
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeVisible();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show accessibilty request link', () => {
      renderComponent(null, null, null, true);
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeVisible();
    });
  });
});
