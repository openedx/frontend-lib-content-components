import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchBlockById, fetchUnitById, saveBlock } from './data/api';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';

const EditorPageProvider = ({
  blockType, courseId, blockId, studioEndpointUrl, children,
}) => {
  const editorRef = useRef(null);
  const [blockValue, setBlockValue] = useState(null); // this is the intial block, as called in from the api.
  const [blockError, setBlockError] = useState(null);
  const [blockLoading, setBlockLoading] = useState(ActionStates.NOT_BEGUN);
  const [unitUrl, setUnitUrlValue] = useState(null);
  const [unitUrlError, setUnitUrlError] = useState(null);
  const [unitUrlLoading, setUnitUrlLoading] = useState(ActionStates.NOT_BEGUN);
  const [blockContent, setBlockContent] = useState(null); // This is the updated content to be saved via api call
  const [saveResponse, setSaveResponse] = useState(null);
  const [saveUnderway, setSaveUnderway] = useState(ActionStates.NOT_BEGUN);
  useEffect(() => {
    if (unitUrlLoading === ActionStates.NOT_BEGUN) {
      fetchUnitById(setUnitUrlValue, setUnitUrlError, setUnitUrlLoading, blockId, studioEndpointUrl);
    }
    if (blockLoading === ActionStates.NOT_BEGUN) {
      fetchBlockById(setBlockValue, setBlockError, setBlockLoading, blockId, studioEndpointUrl);
    }
    if (saveUnderway === ActionStates.IN_PROGRESS) {
      saveBlock(blockId, blockType, courseId, studioEndpointUrl, blockContent, setSaveUnderway, setSaveResponse);
    }
  }, [saveUnderway]);

  return (
    <EditorPageContext.Provider
      value={{
        editorRef,
        blockValue,
        blockError,
        blockLoading,
        unitUrl,
        unitUrlError,
        unitUrlLoading,
        setBlockContent,
        saveResponse,
        setSaveUnderway,
        saveUnderway,
        studioEndpointUrl,
        blockId,
        courseId,
        blockType,
      }}
    >
      {children}
    </EditorPageContext.Provider>
  );
};
EditorPageProvider.propTypes = {
  blockType: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
  studioEndpointUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
};
EditorPageProvider.defaultProps = {

  studioEndpointUrl: null,
};

export default EditorPageProvider;
