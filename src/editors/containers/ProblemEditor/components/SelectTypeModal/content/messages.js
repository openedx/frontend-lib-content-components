export const messages = {
  previewTitle: {
    id: 'authoring.problemEditor.preview.title',
    defaultMessage: '{previewTitle}',
    description: 'Title for the problem preview column',
  },
  previewAltText: {
    id: 'authoring.problemEditor.preview.altText',
    defaultMessage: `A preview illustration of a {problemType, select,
      multiplechoiceresponse {single select}
      stringreponse {text input}
      numericalresponse {numerical input}
      optionresponse {dropdown}
      choiceresponse {multiple select}
      other {null}
    } problem`,
    description: 'Alt text for the illustration of the problem preview',
  },
  previewDescription: {
    id: 'authoring.problemEditor.preview.description',
    defaultMessage: '{previewDescription}',
    description: 'Description of the selected problem type',
  },
  learnMoreButtonLabel: {
    id: 'authoring.problemEditor.learnMoreButtonLabel.label',
    defaultMessage: 'Learn More',
    description: 'Label for Learn More button',
  },
};

export default messages;
