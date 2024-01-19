import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import { CheckboxControl, DataTable, Form } from '@edx/paragon';

import { modes } from './constants';
import { selectors } from '../../data/redux';
import { useBlocksSelectorHook } from './hooks';
import messages from './messages';

export const SELECT_ONE_TEST_ID = 'selectOne';

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
  // redux
  blocks,
  mode,
  candidates,
  libraries,
  savedLibraryId,
  selectedLibraryId,
  v1BlockRequests,
}) => {
  const {
    tableDataLoaded,
    data,
    initialRows,
    onSelectedRowsChanged,
  } = useBlocksSelectorHook({
    blocks,
    candidates,
    libraries,
    savedLibraryId,
    selectedLibraryId,
    v1BlockRequests,
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

  if (selectedLibraryId === null || mode !== modes.selected.value || !tableDataLoaded) {
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
        data={data}
        itemCount={data.length}
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
  blocks: [],
  candidates: [],
  libraries: [],
  mode: '',
  savedLibraryId: null,
  selectedLibraryId: null,
  v1BlockRequests: [],
};

BlocksSelector.propTypes = {
  // redux
  blocks: PropTypes.arrayOf(PropTypes.shape({})),
  candidates: PropTypes.shape([]),
  libraries: PropTypes.shape([]),
  mode: PropTypes.string,
  savedLibraryId: PropTypes.string,
  selectedLibraryId: PropTypes.string,
  v1BlockRequests: PropTypes.shape({}),
};

export const mapStateToProps = (state) => ({
  blocks: selectors.library.blocks(state),
  candidates: selectors.library.candidates(state),
  libraries: selectors.library.libraries(state),
  mode: selectors.library.mode(state),
  savedLibraryId: selectors.library.savedLibraryId(state),
  selectedLibraryId: selectors.library.selectedLibraryId(state),
  v1BlockRequests: selectors.library.v1BlockRequests(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
