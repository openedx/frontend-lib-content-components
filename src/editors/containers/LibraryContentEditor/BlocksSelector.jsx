import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, DataTable, Form } from '@edx/paragon';

import messages from './messages';
import { actions, selectors } from './data';
import { useBlocksHook } from './hooks';
import { modes } from './constants';

export const BlocksSelector = ({
  studioEndpointUrl,

  // redux
  blocksInSelectedLibrary,
  libraries,
  loadBlocksInLibrary,
  onSelectCandidates,
  selectedLibrary,
  selectionMode,
}) => {
  const {
    blockLinks,
    blocksTableData,
    selectCandidates,
  } = useBlocksHook({
    blocksInSelectedLibrary,
    loadBlocksInLibrary,
    onSelectCandidates,
    selectedLibraryId: (selectedLibrary !== null) ? libraries[selectedLibrary].library_key : null,
    studioEndpointUrl,
  });

  if (selectedLibrary === null || !blocksInSelectedLibrary) return <></>;

  const ViewAction = ({ row }) => (
    <Button
      className='p-0'
      onClick={() => {
        window.open(blockLinks[row.id])
      }}
      size='sm'
      variant='link'
    >
      <FormattedMessage {...messages.tableViewButton} />
    </Button>
  );

  return (
    <div className='mb-5 pt-3 border-top'>
      {
        selectionMode === modes.selected.value
        ? <label><FormattedMessage {...messages.tableInstructionLabel} /></label>
        : null
      }
      <DataTable
        // showFiltersInSidebar
        // isFilterable
        isPaginated
        isSelectable
        // isSelectable={selectionMode === modes.selected.value}
        isSortable
        // defaultColumnValues={{ Filter: TextFilter }}
        itemCount={blocksTableData.length}
        data={blocksTableData}
        columns={[
          {
            Header: 'Name',
            accessor: 'display_name',
          },
          {
            Header: 'Block Type',
            accessor: 'block_type',
          },
        ]}
        additionalColumns={[
          {
            id: 'action',
            Header: 'View',
            Cell: ({ row }) => ViewAction({ row }),
          }
        ]}
        onSelectedRowsChanged={(selected) => selectCandidates({ selected })}
        // maxSelectedRows={2}
        // onMaxSelectedRows={() => console.log('hey3 this is the last row allowed')}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content="No blocks found." />
      </DataTable>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  libraries: selectors.libraries(state),
  selectedLibrary: selectors.selectedLibrary(state),
  selectionMode: selectors.selectionMode(state),
})

export const mapDispatchToProps = {
  loadBlocksInLibrary: actions.loadBlocksInLibrary,
  onSelectCandidates: actions.onSelectCandidates,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
