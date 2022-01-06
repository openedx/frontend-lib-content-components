import React,  {useState, useRef, createContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import { fetchBlockById, fetchUnitUrl, saveBlock } from './data/api';

export const EditorPageContext = createContext();

const EditorPageProvider = ({courseId, blockId,studioEndpointUrl, children})=>{
    const editorRef = useRef(null);
    const [blockValue, setBlockValue] = useState(null);
    const [blockError, setBlockError] = useState(null);
    const [blockLoading, setBlockLoading] = useState(true);
    const [unitUrl, setUnitUrl ] = useState(null);
    const [unitUrlError, setunitUrlError] = useState(null);
    const [unitUrlLoading, setunitUrlLoading] = useState(true);
    const [blockContent, setBlockContent] = useState(null);
    const [saveResponse, setSaveResponse]= useState(null);
    const [saveUnderway, setSaveUnderway] = useState("false");

    useEffect(() => {
        fetchBlockById(setBlockValue,setBlockError, setBlockLoading, courseId, blockId,studioEndpointUrl);
        fetchUnitUrl(setUnitUrl,setunitUrlError,setunitUrlLoading,courseId, blockId,studioEndpointUrl);
        if(saveUnderway){
            saveBlock(courseId, blockId,studioEndpointUrl,blockContent,setSaveResponse,setSaveUnderway)
        }
    })

    return (
        <EditorPageContext.Provider
        value ={{
            blockValue: blockValue,
            blockError: blockError,
            blockLoading: blockLoading,
            unitUrl: unitUrl,
            unitUrlError: unitUrlError,
            unitUrlLoading: unitUrlLoading,
            setBlockContent: setBlockContent,
            saveResponse: saveResponse,
            setSaveUnderway: setSaveUnderway,
            saveUnderway: saveUnderway,
            editorRef: editorRef,
        }}
        >
            {children}
        </EditorPageContext.Provider>
    )
}
EditorPageProvider.propTypes = {
    courseId: PropTypes.string,
    blockId: PropTypes.string,
    studioEndpointUrl: PropTypes.string,
    children: PropTypes.node.isRequired,
  }
EditorPageProvider.defaultProps = {
    courseId: null,
    blockId: null,
    studioEndpointUrl: null,
}

export default EditorPageProvider