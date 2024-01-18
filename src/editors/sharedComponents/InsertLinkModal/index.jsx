import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { logError } from '@edx/frontend-platform/logging';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Tabs,
  Tab,
  Form,
} from '@edx/paragon';
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
  const [invalidUrlInput, setInvalidUrlInput] = useState(false);
  const [inputUrlValue, setInputUrlValue] = useState('');

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

  const handleChangeInputUrl = ({ target: { value } }) => {
    setInputUrlValue(value);
  };

  /* istanbul ignore next */
  const handleSave = () => {
    const editor = editorRef.current;
    const urlPath = blockSelected?.lmsWebUrl || inputUrlValue;
    if (editor && urlPath) {
      const validateUrl = isValidURL(urlPath);

      if (!validateUrl) {
        setInvalidUrlInput(true);
        return;
      }

      const selectedText = editor.selection.getContent({ format: 'text' });

      if (selectedText.trim() !== '') {
        const linkHtml = `<a href="${urlPath}" data-mce-href="${urlPath}" target="_blank">${selectedText}</a>`;
        editor.selection.setContent(linkHtml);
      }
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
          <Tab
            eventKey="url"
            title={intl.formatMessage(messages.insertLinkModalUrlTabTitle)}
            className="col-12 tabs-container"
          >
            <Form.Group isInvalid={invalidUrlInput} className="my-4">
              <Form.Control
                placeholder={intl.formatMessage(messages.insertLinkModalInputPlaceholder)}
                onChange={handleChangeInputUrl}
              />
              {invalidUrlInput && (
                <Form.Control.Feedback type="invalid">
                  {intl.formatMessage(messages.insertLinkModalInputErrorMessage)}
                </Form.Control.Feedback>
              )}
            </Form.Group>
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
      }),
    }),
  }).isRequired,
};

export default InsertLinkModal;
