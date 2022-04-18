import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditorContainer from '../EditorContainer';



export const ExampleEditor = ({
  onClose,
  // redux
  blockValue,
  lmsEndpointUrl,
  blockFailed,
  blockFinished,
  initializeEditor,
  // inject
  intl
}) => {
    return (
        <EditorContainer
          getContent={hooks.getContent({ editorRef })}
          onClose={onClose}
        >
          <div className="editor-body h-75 overflow-auto">
           <Toast show={blockFailed}>
              <FormattedMessage {...messages.couldNotLoadTextContext} />
            </Toast>

            {(!blockFinished)
              ? (
                <div className="text-center p-6">
                  <Spinner
                    animation="border"
                    className="m-3"
                    screenreadertext={intl.formatMessage(messages.spinnerScreenReaderText)}
                  />
                </div>
              )
              : (
                <p>Your Editor Goes here. You can get at the xblock's data with the blockValue field<p/>
              )}
          </div>

        </EditorContainer>
      );
    };
    TextEditor.defaultProps = {
      blockValue: null,
      lmsEndpointUrl: null,
    };
    TextEditor.propTypes = {
      onClose: PropTypes.func.isRequired,
      // redux
      blockValue: PropTypes.shape({
        data: PropTypes.shape({ data: PropTypes.string }),
      }),
      lmsEndpointUrl: PropTypes.string,
      blockFailed: PropTypes.bool.isRequired,
      blockFinished: PropTypes.bool.isRequired,
      initializeEditor: PropTypes.func.isRequired,
      // inject
      intl: intlShape.isRequired,
    };

    export const mapStateToProps = (state) => ({
      blockValue: selectors.app.blockValue(state),
      lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
      blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
      blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
    });

    export const mapDispatchToProps = {
      initializeEditor: actions.app.initializeEditor,
    };

    export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TextEditor));
