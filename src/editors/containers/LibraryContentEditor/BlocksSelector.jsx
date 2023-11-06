import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, DataTable, Form } from '@edx/paragon';

import messages from './messages';
import { actions, selectors } from './data';
import { useBlocksHook } from './hooks';
import { modes } from './constants';

export const BlocksSelector = ({
  candidates,
  mode,
  studioEndpointUrl,
  // redux
  blocksInSelectedLibrary,
  onCandidatesChange,
  selectedLibraryId,
}) => {
  if (selectedLibraryId === null) return <></>;

  const {
    blockLinks,
    blocksTableData,
    tempCandidates,
    setTempCandidates,
    isSelectable,
  } = useBlocksHook({
    blocksInSelectedLibrary,
    candidates,
    mode,
    onCandidatesChange,
    // settings,
    selectedLibraryId,
    studioEndpointUrl,
  });

  const selectColumn = {
    id: 'selection',
    Header: DataTable.ControlledSelectHeader,
    Cell: DataTable.ControlledSelect,
    disableSortBy: true,
  };

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
        mode === modes.selected.value
        // isSelectable
        ? (
          <>
            <label><FormattedMessage {...messages.tableInstructionLabel} /></label>
            <DataTable
              // showFiltersInSidebar
              // isFilterable
              isPaginated
              isSelectable
              // manualSelectColumn={selectColumn}
              // SelectionStatusComponent={DataTable.ControlledSelectionStatus}
              isSortable
              itemCount={blocksTableData.length}
              data={blocksTableData}
              initialState={{ selectedRowIds: tempCandidates }}
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
              onSelectedRowsChanged={selected => setTempCandidates(selected)}
            >
              <DataTable.TableControlBar />
              <DataTable.Table />
              <DataTable.EmptyTable content="No blocks found." />
              <DataTable.TableFooter />
            </DataTable>
          </>
        )
        : (
          <DataTable
            // showFiltersInSidebar
            // isFilterable
            isPaginated
            isSortable
            itemCount={blocksTableData.length}
            data={blocksTableData}
            initialState={{ selectedRowIds: tempCandidates }}
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
            onSelectedRowsChanged={selected => setTempCandidates(selected)}
          >
            <DataTable.TableControlBar />
            <DataTable.Table />
            <DataTable.EmptyTable content="No blocks found." />
            <DataTable.TableFooter />
          </DataTable>
        )
      }
      {/* <DataTable
        // showFiltersInSidebar
        // isFilterable
        isPaginated
        // isSelectable
        isSelectable={isSelectable}
        // isSelectable={mode === modes.selected.value}
        isSortable
        itemCount={blocksTableData.length}
        data={blocksTableData}
        initialState={{ selectedRowIds: tempCandidates }}
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
        onSelectedRowsChanged={selected => setTempCandidates(selected)}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content="No blocks found." />
        <DataTable.TableFooter />
      </DataTable> */}
    </div>
  );
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  libraries: selectors.libraries(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
});

export const mapDispatchToProps = {
  onCandidatesChange: actions.onCandidatesChange,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
