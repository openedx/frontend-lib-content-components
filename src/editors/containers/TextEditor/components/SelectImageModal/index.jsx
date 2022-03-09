import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ActionRow, Button, Dropdown, Form, Icon, IconButton, Image, Stack, Scrollable, SelectableBox, Spinner } from '@edx/paragon';
import { Close, Search } from '@edx/paragon/icons';

import { thunkActions } from '../../../../data/redux';
import BaseModal from '../BaseModal';
import hooks from './hooks';
import * as sortUtils from './sortUtils';

export const SelectImageModal = ({
  fetchImages,
  uploadImage,
  isOpen,
  close,
  setSelection,
}) => {
  const {
    loading,
    imgList,
    searchString, setSearchString,
    sortFilter, setSortFilter,
    selected,
    selectImg,
    onConfirmSelection,
  } = hooks.imgHooks({fetchImages, setSelection});
  const {
    addFileRef,
    addFileClick,
    addFile,
  } = hooks.uploadHooks({uploadImage});
  
  return (
    <BaseModal
      close={close}
      confirmAction={
        <Button 
          variant="primary" 
          onClick={onConfirmSelection}>
            Next
        </Button>
      }
      handleUpload={addFileClick}
      isOpen={isOpen}
      showUploadButton
      title="Add an image"
    >
      <Stack gap={3}>

        {/* Search Filtering */}
        <ActionRow>
          <Form.Group style={{margin: 0}}>
            <Form.Control
              autoFocus
              onChange={e => setSearchString(e.target.value)}
              placeholder="Search"
              trailingElement={
                searchString
                  ? <IconButton 
                      iconAs={Icon} 
                      invertColors 
                      isActive 
                      onClick={() => setSearchString("")} 
                      size="sm"
                      src={Close} />
                  : <Icon src={Search} />
              }
              value={searchString}
            />
          </Form.Group>
          <ActionRow.Spacer/>
          <Dropdown>
            <Dropdown.Toggle id="img-sort-button" variant="light">
              {sortUtils.OPTIONS[sortFilter]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {sortUtils.OPTIONS.map(
                (el, ind) => (
                  <Dropdown.Item onClick={() => setSortFilter(ind)}>{el}</Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </ActionRow>

        {/* Content Selection */}
        {loading
          ? <Spinner animation="border" className="mie-3" screenReaderText="loading" />
          : <Scrollable style={{height: '375px'}}>
              <div className="p-4">
                <SelectableBox.Set
                  columns={1}
                  name='images'
                  onChange={selectImg}
                  type='radio'
                  value={selected}
                >
                  {imgList.map(
                    img => (
                      <SelectableBox type='radio' value={img.id}>
                        <div key={img.externalUrl} style={{display: 'flex', flexFlow: 'row nowrap'}}>
                          <Image style={{ width: '100px', height: '100px' }} src={img.externalUrl} />
                          <div className="img-desc align-baseline" style={{padding: '10px 15px'}}>
                            <h3>{img.displayName}</h3>
                            <p>Added {img.dateAdded}</p>
                          </div>
                        </div>
                      </SelectableBox>
                    )
                  )}
                </SelectableBox.Set>
              </div>
            </Scrollable>
        }

        <input 
          accept=".gif,.jpg,.jpeg,.png,.tif,.tiff"
          onChange={e => addFile(e.target.files[0])} 
          ref={addFileRef} 
          style={{display: 'none'}} 
          type='file'
        />
      </Stack>
    </BaseModal>
  );
};

SelectImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  // redux
  fetchImages: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export const mapStateToProps = () => ({});
export const mapDispatchToProps = {
  fetchImages: thunkActions.app.fetchImages,
  uploadImage: thunkActions.app.uploadImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectImageModal);
