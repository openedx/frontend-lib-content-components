import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
    modeAll: {
      id: 'authoring.library_content.mode.all',
      defaultMessage: 'Show all content from the library to every learner',
      description: 'mode of selecting content from a library to put in a course',
    },
    modeRandom: {
      id: 'authoring.library_content.mode.random',
      defaultMessage: 'Show X problems at random from the Library',
      description: 'mode of selecting content from a library to put in a course',
    },
    modeSelected: {
      id: 'authoring.library_content.mode.selected',
      defaultMessage: 'Show a specfic portion of the library to all users',
      description: 'mode of selecting content from a library to put in a course',
    },

});

export default messages;