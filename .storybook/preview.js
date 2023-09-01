import React from 'react';
import './index.scss';
import { IntlProvider } from 'react-intl';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <IntlProvider locale='en-us' messages={{}}>
        <Story />
      </IntlProvider>
    ),
  ],
};

export default preview;