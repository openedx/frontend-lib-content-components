import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, CheckboxControl, DataTable, DataTableContext, Form } from '@edx/paragon';

import messages from './messages';
import { actions, selectors } from './data';
import { useBlocksHook } from './hooks';
import { modes } from './constants';
import { getCandidates, getSelectedRows } from './utils';

export const RowCheckbox = ({ row }) => {
  // const { id } = row;
  const {
    indeterminate,
    checked,
    ...toggleRowSelectedProps
  } = row.getToggleRowSelectedProps();


  // console.log('testcheckbox', selectedRows, toggleRowSelectedProps)

  return (
    <div className='text-center'>
      <CheckboxControl
        {...toggleRowSelectedProps}
        title="Toggle row selected"
        // checked={selectedRows[id]}
        // checked={true}
        checked={checked}
        isIndeterminate={false}
        // data-testid={SELECT_ONE_TEST_ID}
      />
    </div>
  );
};

export const BlocksSelector = ({
  initialRows,
  // candidates,
  mode,
  // redux
  blocksInSelectedLibrary,
  setCandidatesForLibrary,
  selectedLibraryId,
}) => {

  const {
    blockUrls,
    blocksTableData,
    // selectedRows,
    // setSelectedRows,
  } = useBlocksHook({
    blocksInSelectedLibrary,
    // candidates,
    mode,
    selectedLibraryId,
  });

  // const initialRows = useMemo(() => {
  //   getSelectedRows({
  //   blocks: blocksInSelectedLibrary,
  //   candidates,
  // })}, [blocksInSelectedLibrary]);

  // const selectedRows = getSelectedRows(candidates)

  const columns = [
    {
      Header: 'Name',
      accessor: 'display_name',
    },
    {
      Header: 'Block Type',
      accessor: 'block_type',
    },
  ];

  const selectColumn = {
    id: 'selection',
    Header: () => null,
    Cell: RowCheckbox,
    // Cell: (props) => <RowCheckbox {...props} 
    // // selectedRows={selectedRows} 
    // />,
    disableSortBy: true,
  };

  const onSelectedRowsChanged = 
  useCallback(
    (selected) => {
      console.log('testonselectedrowchanged', selected, getCandidates({
        blocks: blocksInSelectedLibrary,
        rows: selected,
      }))

      // const selectedCandidates = getCandidates({
      //   blocks: blocksInSelectedLibrary,
      //   rows: selected,
      // })
      // console.log('testselectedcandidates', selectedCandidates)

      // let run = false
      // Object.values(selected).forEach(val => {
      //   if (val) { run = true }
      // })
      // if (Object.keys(selected).length === 0) { run = false }
      
      // if (run) {
      //   console.log('testonselectedrowchanged has run!', selected)
        setCandidatesForLibrary({
          libraryId: selectedLibraryId,
          candidates: getCandidates({
            blocks: blocksInSelectedLibrary,
            rows: selected,
          }),
        })
      // }
      
    },
    [blocksInSelectedLibrary]
  //   [setCandidatesForLibrary],
  );

  // const ViewAction = ({ row }) => (
  //   <Button
  //     className='p-0'
  //     onClick={() => {
  //       window.open(blockLinks[row.id], '_blank')
  //     }}
  //     size='sm'
  //     variant='link'
  //   >
  //     <FormattedMessage {...messages.tableViewButton} />
  //   </Button>
  // );

  if (selectedLibraryId === null || mode !== modes.selected.value) return <></>;

  return (
    <div className='mb-5 pt-3 border-top'>
      <label>
        <FormattedMessage {...messages.tableInstructionLabel} />
      </label>
      <DataTable
        key={selectedLibraryId}
        columns={columns}
        data={blocksTableData}
        itemCount={blocksTableData.length}
        isSelectable
        isPaginated
        isSortable
        // initialState={{ selectedRowIds: {}}}
        initialState={{ selectedRowIds: initialRows }}
        // initialState={{ selectedRowIds: getSelectedRows({
        //   blocks: blocksInSelectedLibrary,
        //   candidates,
        // }) }}
        manualSelectColumn={selectColumn}
        // onSelectedRowsChanged={props => console.log('testselected', props)}
        onSelectedRowsChanged={onSelectedRowsChanged}
        // onSelectedRowsChanged={selected => setSelectedRows(selected)}
        // onSelectedRowsChanged={selectedRows => 
        //   setCandidatesForLibrary({
        //     libraryId: selectedLibraryId,
        //     candidates: getCandidates({
        //       blocks: blocksInSelectedLibrary,
        //       rows: selectedRows,
        //     }),
        //   })
        // }
      >
      {/* <DataTable
        isSelectable
        isPaginated
        isSortable
        itemCount={blocksTableData.length}
        data={blocksTableData}
        // initialState={{ selectedRowIds: selectedRows }}
        initialState={{ selectedRowIds: {0: true}}}
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
        // additionalColumns={[
        //   {
        //     id: 'action',
        //     Header: 'View',
        //     Cell: ({ row }) => ViewAction({ row }),
        //   }
        // ]}
        // onSelectedRowsChanged={selected => setSelectedRows(selected)}
        // onSelectedRowsChanged={selectedRows => 
        //   setCandidatesForLibrary({
        //     libraryId: selectedLibraryId,
        //     candidates: getCandidates({
        //       blocks: blocksInSelectedLibrary,
        //       rows: selectedRows,
        //     }),
        //   })
        // }
      > */}
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content="No blocks found." />
        <DataTable.TableFooter />
      </DataTable>
    </div>
  );
};

BlocksSelector.defaultProps = {
  blocksInSelectedLibrary: [],
  candidates: [],
  mode: '',
  selectedLibraryId: null,
};

BlocksSelector.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.string),
  mode: PropTypes.string,
  // redux
  blocksInSelectedLibrary: PropTypes.arrayOf(PropTypes.shape({})),
  setCandidatesForLibrary: PropTypes.func.isRequired,
  selectedLibraryId: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  // candidates: selectors.candidates(state),
  mode: selectors.mode(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
});

export const mapDispatchToProps = {
  setCandidatesForLibrary: actions.setCandidatesForLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
