import React, { useState } from 'react';
import { BaseModal } from '../editors/containers/VideoEditor/components/BaseModal';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Components/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
};

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => {
            setOpen(!open);
          }}
        >
          Toggle Modal
        </button>
        <BaseModal
          {...args}
          isOpen={open}
          close={() => {
            setOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    isOpen: false,
    close: () => {},
    title: 'Modal',
    children: 'Content',
    confirmAction: 'Confirm',
  },
};
