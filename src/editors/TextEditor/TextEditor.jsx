import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

import 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/icons/default';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/autoresize';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  useToggle,
  Spinner,
  Toast,
} from '@edx/paragon';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import ImageUploadModal from './ImageUpload/Wizard/ImageUploadModal';

export const messages = {
  couldNotLoadTextContext: {
    id: 'authoring.texteditor.load.error',
    defaultMessage: 'Error: Could Not Load Text Content',
    description: 'Error Message Dispayed When HTML content fails to Load',
  },
};

export const nullMethod = () => {};

export const editorSetup = (openUploadModal) => (editor) => {
  editor.ui.registry.addButton('imageuploadbutton', {
    icon: 'image',
    onAction: () => openUploadModal(),
  });
};

export const initializeEditor = (setEditorRef) => (evt, editor) => setEditorRef(editor);

export const TextEditor = ({
  setEditorRef,
  // redux
  blockValue,
  blockFailed,
  blockFinished,
}) => {
  const [isImageUploadModalOpen, openUploadModal, closeUploadModal] = useToggle(false);

  return (
    <div className="editor-body h-75">
      <ImageUploadModal
        isOpen={isImageUploadModalOpen}
        close={closeUploadModal}
      />

      <Toast show={blockFailed} onClose={module.nullMethod}>
        <FormattedMessage {...messages.couldNotLoadTextContext} />
      </Toast>

      {(!blockFinished)
        ? (
          <div className="text-center p-6">
            <Spinner animation="border" className="m-3" screenreadertext="loading" />
          </div>
        )
        : (
          <Editor
            onInit={module.initializeEditor}
            initialValue={blockValue ? blockValue.data.data : ''}
            init={{
              setup: module.editorSetup(openUploadModal),
              plugins: 'link codesample emoticons table charmap code autoresize',
              menubar: false,
              toolbar: 'undo redo | formatselect | '
            + 'bold italic backcolor | alignleft aligncenter '
            + 'alignright alignjustify | bullist numlist outdent indent |'
            + 'imageuploadbutton | link | emoticons | table | codesample | charmap |'
            + 'removeformat | hr |code',
              height: '100%',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              min_height: 1000,
              branding: false,
            }}
          />
        )}
    </div>
  );
};
TextEditor.propTypes = {
  setEditorRef: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.string.isRequired,
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),

});

export default connect(mapStateToProps)(TextEditor);
