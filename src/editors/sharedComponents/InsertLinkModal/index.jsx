import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { logError } from '@edx/frontend-platform/logging';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Tabs,
  Tab,
} from '@openedx/paragon';
import { actions, selectors } from '../../data/redux/insertlink';
import BaseModal from '../BaseModal';
import BlocksList from './BlocksList';
import BlockLink from './BlockLink';
import SearchBlocks from './SearchBlocks';
import { formatBlocks, isValidURL } from './utils';
import { getBlocksFromCourse } from './api';

import messages from './messages';
import './index.scss';

const InsertLinkModal = ({
  courseId,
  isOpen,
  onClose,
  editorRef,
}) => {
  const intl = useIntl();
  const [searchField, setSearchField] = useState('');
  const [blocksSearched, setBlocksSearched] = useState(false);
  const [blockSelected, setBlocksSelected] = useState(null);
  const [blocksList, setBlocksList] = useState(null);
  const [, setInvalidUrlInput] = useState(false);
  const [inputUrlValue, setInputUrlValue] = useState('');
  const dispatch = useDispatch();
  const { selectedBlocks } = useSelector(selectors.insertlinkState);

  const handleSearchedBlocks = (isSearched) => {
    setBlocksSearched(isSearched);
  };

  const handleSelectedBlock = (blockSelectedFromList) => {
    setBlocksSelected(blockSelectedFromList);
    setInputUrlValue('');
  };

  const handleCloseLink = () => {
    setSearchField('');
    setBlocksSelected(null);
  };

  /* istanbul ignore next */
  const handleSave = () => {
    const editor = editorRef.current;
    const urlPath = blockSelected?.lmsWebUrl || inputUrlValue;
    const blockId = blockSelected?.blockId;
    const linkRegex = /<a\b[^>]*><\/a>/gi;
    if (editor && urlPath) {
      const validateUrl = isValidURL(urlPath);

      if (!validateUrl) {
        setInvalidUrlInput(true);
        return;
      }

      const selectedRange = editor.selection.getRng();
      const selectedNode = editor.selection.getNode();
      const textContent = editor.selection.getContent({ format: 'text' });
      const selectedText = textContent || selectedNode.textContent;

      const newLinkNode = editor.dom.create('a', {
        href: urlPath,
        'data-mce-href': urlPath,
        'data-block-id': blockId,
        target: '_blank',
      });

      if (textContent) {
        // If the selected node is a text node, replace the selection with the new link
        newLinkNode.textContent = selectedText;

        selectedRange.deleteContents();
        selectedRange.insertNode(newLinkNode);
      } else {
        // If the selected node is an element node, wrap its text content in the new link
        newLinkNode.textContent = selectedNode.textContent;
        selectedNode.textContent = '';
        selectedNode.appendChild(newLinkNode);
      }

      // Remove empty "a" tags after replacing URLs (if needed)
      const editorContent = editor.getContent();
      const modifiedContent = editorContent.replace(linkRegex, '');
      editor.setContent(modifiedContent);

      dispatch(actions.addBlock({ [blockId]: blockSelected }));
    }

    if (editor && !blockId) {
      const selectedNode = editor.selection.getNode();

      if (selectedNode.nodeName === 'A') {
        // If the selected node is a link, unwrap it
        editor.dom.remove(selectedNode, true);
      } else {
        // If the selected node contains links, remove them
        const links = selectedNode.querySelectorAll('a');
        links.forEach(link => editor.dom.remove(link, true));
      }
      // Update the editor content
      editor.setContent(editor.getContent());
    }

    onClose();
  };

  useEffect(() => {
    const getBlocksList = async () => {
      try {
        const blocksData = await getBlocksFromCourse(courseId);
        const { blocks: blocksResponse, root: rootBlocksResponse } = blocksData;
        const blockListFormatted = formatBlocks(
          blocksResponse,
          rootBlocksResponse,
        );
        setBlocksList(blockListFormatted);
      } catch (error) {
        logError(error);
      }
    };

    getBlocksList();
  }, []);

  useEffect(() => {
    /* istanbul ignore next */
    const editor = editorRef.current;
    if (editor) {
      const selectionNode = editor.selection.getNode();
      const selectedHTML = editor.selection.getContent({ format: 'html' }) || selectionNode.outerHTML;
      const regexDataBlockId = /data-block-id="([^"]+)"/;
      const regexHref = /href="([^"]+)"/;
      const matchDataBlockId = selectedHTML.match(regexDataBlockId);
      const matchHreUrl = selectedHTML.match(regexHref);

      // Extracting the value from the match
      const dataBlockId = matchDataBlockId ? matchDataBlockId[1] : null;
      const hrefUrl = matchHreUrl ? matchHreUrl[1] : null;
      const blockSelectedUrl = selectedBlocks?.[dataBlockId]?.lmsWebUrl;
      const hasExternalUrl = hrefUrl !== blockSelectedUrl;

      if (selectedHTML && !dataBlockId) {
        const selectedNode = editor.selection.getNode();
        const parentNode = editor.dom.getParent(selectedNode, 'a');
        if (parentNode) {
          const dataBlockIdParent = parentNode.getAttribute('data-block-id');
          const url = parentNode.getAttribute('href');
          const blockIsValid = dataBlockIdParent in selectedBlocks;
          const blockIdFormat = blockSelectedUrl ?? selectedBlocks?.[dataBlockIdParent]?.lmsWebUrl;
          const hasValidUrl = url === blockIdFormat;
          if (dataBlockIdParent && blockIsValid && hasValidUrl) {
            setBlocksSelected(selectedBlocks[dataBlockIdParent]);
          } else {
            setBlocksSelected(null);
          }
        }
      }

      if (dataBlockId && hasExternalUrl) {
        setBlocksSelected(null);
      }

      if (dataBlockId && !hasExternalUrl) {
        const blockIsValid = dataBlockId in selectedBlocks;
        if (dataBlockId && blockIsValid) {
          setBlocksSelected(selectedBlocks[dataBlockId]);
        }
      }
    }
  }, []);

  return (
    <BaseModal
      isOpen={isOpen}
      close={onClose}
      title={intl.formatMessage(messages.insertLinkModalTitle)}
      confirmAction={(
        <Button variant="primary" onClick={handleSave}>
          {intl.formatMessage(messages.insertLinkModalButtonSave)}
        </Button>
      )}
    >
      {blockSelected ? (
        <BlockLink path={blockSelected.path} onCloseLink={handleCloseLink} />
      ) : (
        <Tabs
          variant="tabs"
          defaultActiveKey="course-pages"
          id="uncontrolled-tab-example"
          className="mt-3 justify-content-around w-100"
        >
          <Tab
            eventKey="course-pages"
            title={intl.formatMessage(messages.insertLinkModalCoursePagesTabTitle)}
            className="col-12 w-100 tabs-container"
          >

            <SearchBlocks
              blocks={blocksList || {}}
              onSearchFilter={handleSearchedBlocks}
              searchInputValue={searchField}
              onBlockSelected={handleSelectedBlock}
            />
            {!blocksSearched && (
              <BlocksList
                blocks={blocksList || {}}
                onBlockSelected={handleSelectedBlock}
              />
            )}
          </Tab>
        </Tabs>
      )}
    </BaseModal>
  );
};

InsertLinkModal.propTypes = {
  courseId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editorRef: PropTypes.shape({
    current: PropTypes.shape({
      selection: PropTypes.shape({
        getContent: PropTypes.func,
        setContent: PropTypes.func,
        getRng: PropTypes.func,
        getNode: PropTypes.func,
      }),
      getContent: PropTypes.func,
      setContent: PropTypes.func,
      dom: PropTypes.shape({
        create: PropTypes.func,
        getParent: PropTypes.func,
        remove: PropTypes.func,
      }),
    }),
  }).isRequired,
};

export default InsertLinkModal;
