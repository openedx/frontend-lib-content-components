import React from 'react';
import PropTypes from 'prop-types';

import {
  ActionRow, Dropdown, Form, Icon, IconButton,
} from '@edx/paragon';
import { Close, Search } from '@edx/paragon/icons';

import * as sortUtils from './sortUtils';

export const SearchSort = ({
  searchString,
  setSearchString,
  sortFilter,
  setSortFilter,
}) => (
  <ActionRow>
    <Form.Group style={{ margin: 0 }}>
      <Form.Control
        autoFocus
        onChange={hooks.onInputValue(setSearchString)}
        placeholder="Search"
        trailingElement={
            searchString
              ? (
                <IconButton
                  iconAs={Icon}
                  invertColors
                  isActive
                  onClick={() => setSearchString('')}
                  size="sm"
                  src={Close}
                />
              )
              : <Icon src={Search} />
          }
        value={searchString}
      />
    </Form.Group>
    <ActionRow.Spacer />
    <Dropdown>
      <Dropdown.Toggle id="img-sort-button" variant="tertiary">
        {sortFilter}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {sortUtils.OPTIONS.map(
          (el) => (
            <Dropdown.Item onClick={() => setSortFilter(el)}>{el}</Dropdown.Item>
          ),
        )}
      </Dropdown.Menu>
    </Dropdown>
  </ActionRow>
);

SearchSort.propTypes = {
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  sortFilter: PropTypes.number.isRequired,
  setSortFilter: PropTypes.func.isRequired,
};

export default SearchSort;
