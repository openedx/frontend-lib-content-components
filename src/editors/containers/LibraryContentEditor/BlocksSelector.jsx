import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Button, DataTable, Form } from '@edx/paragon';
import { actions, selectors } from './data';
import { useBlocksHook } from './hooks';

export const BlocksSelector = ({
  studioEndpointUrl,

  // redux
  blocksInSelectedLibrary,
  loadBlocksInLibrary,
  selectedLibrary,
}) => {
  if (selectedLibrary === null || !blocksInSelectedLibrary) return <></>;

  const {
    blockLinks,
    blocksTableData,
  } = useBlocksHook({
    blocksInSelectedLibrary,
    loadBlocksInLibrary,
    studioEndpointUrl,
  });

  return (
    <div className='mb-5'>
      <label>Select the blocks you want to show: </label>
      <DataTable
        isSelectable
        initialState={{
          pageSize: 1,
        }}
        columns={[
          { Header: 'Name', accessor: 'display_name' },
          { Header: 'Block Type', accessor: 'block_type'},
        ]}
        isSortable
        itemCount={blocksTableData.length}
        data={blocksTableData}
        // additionalColumns={[
        //   {
        //     id: 'view',
        //     Header: 'View',
        //     Cell: ({ row }) => {
        //       <Button variant="link" onClick={() => console.log("View", row)}>
        //         View
        //       </Button>
        //     }
        //   }
        // ]}
      >
        <DataTable.Table />
        <DataTable.EmptyTable content="No blocks" />
      </DataTable>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  blocksInSelectedLibrary: selectors.blocksInSelectedLibrary(state),
  selectedLibrary: selectors.selectedLibrary(state),
})

export const mapDispatchToProps = {
  loadBlocksInLibrary: actions.loadBlocksInLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlocksSelector));
