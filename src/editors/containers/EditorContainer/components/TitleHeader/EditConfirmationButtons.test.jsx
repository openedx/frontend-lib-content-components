import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../testUtils';
import * as module from './EditConfirmationButtons';

describe('EditConfirmationButtons', () => {
  const props = {
    intl: { formatMessage },
    updateTitle: jest.fn().mockName('args.updateTitle'),
    cancelEdit: jest.fn().mockName('args.cancelEdit'),
  };
  // let el;
  // beforeEach(() => {
  //   el = shallow(<module.EditConfirmationButtons {...props} />);
  // });

  describe('snapshot', () => {
    test('snapshot', () => {
      expect(shallow(<module.EditConfirmationButtons {...props} />)).toMatchSnapshot();
    });
    // test('displays Edit Icon', () => {
    //   const formControl = el.find(Form.Control);
    //   expect(formControl.props().trailingElement).toMatchObject(
    //     <EditConfirmationButtons updateTitle={props.updateTitle} cancelEdit={props.cancelEdit} />,
    //   );
    // });
  });
});
