import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  countLabel: {
    id: 'authoring.library_content.count.label',
    defaultMessage: 'Enter the number of components to display to each student. Set it to -1 to display all components.',
    description: 'label for number of blocks to show',
  },
  modeRandom: {
    id: 'authoring.library_content.mode.random',
    defaultMessage: 'Random Blocks',
    description: 'name of mode for selecting content from a library to put in a course',
  },
  modeSelected: {
    id: 'authoring.library_content.mode.selected',
    defaultMessage: 'Selected Blocks',
    description: 'name of mode for selecting content from a library to put in a course',
  },
  modeRandomDescription: {
    id: 'authoring.library_content.mode.random.description',
    defaultMessage: 'Show a number of components to display at random from the library.',
    description: 'description of mode for selecting content from a library to put in a course',
  },
  modeSelectedDescription: {
    id: 'authoring.library_content.mode.selected.description',
    defaultMessage: 'Show the selected blocks of the library to all users.',
    description: 'description of mode for selecting content from a library to put in a course',
  },
  resetButton: {
    id: 'authoring.library_content.reset.button',
    defaultMessage: 'Show Reset Button',
    description: 'name of button for allowing users to reset answers and reshuffle selected items',
  },
  resetButtonDescription: {
    id: 'authoring.library_content.reset.button.description',
    defaultMessage: "Determines whether a 'Reset Problems' button is shown, so users may reset their answers and reshuffle selected items.",
    description: 'description of button for allowing users to reset answers and reshuffle selected items',
  },
  tableInstructionLabel: {
    id: 'authoring.library_content.table.instruction.label',
    defaultMessage: 'Select the components you want to display:',
    description: 'label for block selection table to instruct users to select the blocks to show',
  },
  tableViewButton: {
    id: 'authoring.library_content.table.view.button',
    defaultMessage: 'View',
    description: 'button on block selection table for viewing block in a separate browser tab',
  },
});

export default messages;