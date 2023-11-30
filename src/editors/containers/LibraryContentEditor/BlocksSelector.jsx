import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { CheckboxControl, DataTable } from '@edx/paragon';

import messages from './messages';
import { actions, selectors } from './data';
import { useBlocksHook } from './hooks';
import { modes } from './constants';
import { getCandidates } from './utils';

export const RowCheckbox = ({ row }) => {
  const {
    indeterminate,
    checked,
    ...toggleRowSelectedProps
  } = row.getToggleRowSelectedProps();

  return (
    <div className='text-center'>
      <CheckboxControl
        {...toggleRowSelectedProps}
        title="Toggle row selected"
        checked={checked}
        isIndeterminate={false}
      />
    </div>
  );
};

export const BlocksSelector = ({
  initialRows,
  mode,
  // redux
  blocksInSelectedLibrary,
  setCandidatesForLibrary,
  selectedLibraryId,
}) => {

  const {
    blocksTableData,
  } = useBlocksHook({
    blocksInSelectedLibrary,
    selectedLibraryId,
  });

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
    disableSortBy: true,
  };

  const onSelectedRowsChanged = useCallback(
    (selected) => {
      setCandidatesForLibrary({
        libraryId: selectedLibraryId,
        candidates: getCandidates({
          blocks: blocksInSelectedLibrary,
          rows: selected,
        }),
      })
    },
    [blocksInSelectedLibrary]
  );

  if (selectedLibraryId === null || mode !== modes.selected.value) {
    return <></>;
  }

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
        initialState={{ selectedRowIds: initialRows }}
        manualSelectColumn={selectColumn}
        onSelectedRowsChanged={onSelectedRowsChanged}
      >
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
  initialRows: {},
  mode: '',
  selectedLibraryId: null,
};

BlocksSelector.propTypes = {
  initialRows: PropTypes.shape({}),
  mode: PropTypes.string,
  // redux
  blocksInSelectedLibrary: PropTypes.arrayOf(PropTypes.shape({})),
  setCandidatesForLibrary: PropTypes.func.isRequired,
  selectedLibraryId: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  mode: selectors.mode(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
});

export const mapDispatchToProps = {
  setCandidatesForLibrary: actions.setCandidatesForLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
