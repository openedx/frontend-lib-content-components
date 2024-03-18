import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  insertLinkModalTitle: {
    id: 'insert.link.modal.title',
    defaultMessage: 'Link to',
    description: 'Title for the modal',
  },
  insertLinkModalButtonSave: {
    id: 'insert.link.modal.button.save',
    defaultMessage: 'Save',
    description: 'Button save in the modal',
  },
  insertLinkModalCoursePagesTabTitle: {
    id: 'insert.link.modal.course.pages.tab.title',
    defaultMessage: 'Course pages',
    description: 'Title for course pages tab',
  },
  insertLinkModalUrlTabTitle: {
    id: 'insert.link.modal.url.tab.title',
    defaultMessage: 'URL',
    description: 'Title for url tab',
  },
  insertLinkModalInputPlaceholder: {
    id: 'insert.link.modal.input.placeholder',
    defaultMessage: 'http://www.example.com',
    description: 'Placeholder for url input',
  },
  insertLinkModalInputErrorMessage: {
    id: 'insert.link.modal.input.error.message',
    defaultMessage: 'The url provided is invalid',
    description: 'Feedback message error for url input',
  },
  insertLinkModalUrlNotSelectedErrorMessage: {
    id: 'insert.link.modal.url.not.selected.error.message',
    defaultMessage: 'The text for the URL was not selected',
    description: 'Feedback message error when user does not select a text for the link',
  },
});

export default messages;
