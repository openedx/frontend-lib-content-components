import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import { CheckboxControl, DataTable, Form } from '@edx/paragon';

import messages from './messages';
import { actions, selectors } from './data';
import { useBlocksSelectorHook } from './hooks';
import { modes } from './constants';
import { getCandidates } from './utils';

export const SELECT_ONE_TEST_ID = 'selectOne';
export const SELECT_ALL_TEST_ID = 'selectAll';

export const RowCheckbox = ({ row }) => {
  const {
    indeterminate,
    checked,
    ...toggleRowSelectedProps
  } = row.getToggleRowSelectedProps();

  return (
    <div className="text-center">
      <CheckboxControl
        {...toggleRowSelectedProps}
        title="Toggle row selected"
        checked={checked}
        isIndeterminate={false}
        data-testid={SELECT_ONE_TEST_ID}
      />
    </div>
  );
};

export const BlocksSelector = ({
  initialRows,
  mode,
  // redux
  blocksInSelectedLibrary,
  savedChildren,
  savedLibraryId,
  setCandidatesForLibrary,
  selectedLibraryId,
  v1LibraryBlockIds,
}) => {
  const {
    blocksTableData,
  } = useBlocksSelectorHook({
    blocksInSelectedLibrary,
    savedChildren,
    savedLibraryId,
    selectedLibraryId,
    v1LibraryBlockIds,
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
    (selected) => setCandidatesForLibrary({
      libraryId: selectedLibraryId,
      candidates: getCandidates({
        blocks: blocksInSelectedLibrary,
        rows: selected,
      }),
    }),
    [blocksInSelectedLibrary],
  );

  if (selectedLibraryId === null || mode !== modes.selected.value) {
    return null;
  }

  return (
    <div className="mb-5 pt-3 border-top">
      <Form.Label>
        <FormattedMessage {...messages.tableInstructionLabel} />
      </Form.Label>
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

RowCheckbox.defaultProps = {
  row: {},
};

RowCheckbox.propTypes = {
  row: PropTypes.shape({
    getToggleRowSelectedProps: PropTypes.func.isRequired,
  }),
};

BlocksSelector.defaultProps = {
  blocksInSelectedLibrary: [],
  initialRows: {},
  mode: '',
  savedChildren: [],
  savedLibraryId: null,
  selectedLibraryId: null,
  v1LibraryBlockIds: [],
};

BlocksSelector.propTypes = {
  initialRows: PropTypes.shape({}),
  mode: PropTypes.string,
  // redux
  blocksInSelectedLibrary: PropTypes.arrayOf(PropTypes.shape({})),
  savedChildren: PropTypes.arrayOf(PropTypes.shape({})),
  savedLibraryId: PropTypes.string,
  setCandidatesForLibrary: PropTypes.func.isRequired,
  selectedLibraryId: PropTypes.string,
  v1LibraryBlockIds: PropTypes.arrayOf(PropTypes.shape({})),
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  mode: selectors.mode(state),
  savedChildren: selectors.savedChildren(state),
  savedLibraryId: selectors.savedLibraryId(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
  v1LibraryBlockIds: selectors.v1LibraryBlockIds(state),
});

export const mapDispatchToProps = {
  setCandidatesForLibrary: actions.setCandidatesForLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
