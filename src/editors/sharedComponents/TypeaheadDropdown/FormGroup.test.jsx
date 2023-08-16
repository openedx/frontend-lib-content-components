import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormGroup from './FormGroup';

jest.unmock('@edx/paragon');

const mockHandleChange = jest.fn();
const mockHandleFocus = jest.fn();
const mockHandleClick = jest.fn();
const mockHandleBlur = jest.fn();
const props = {
  as: 'input',
  errorMessage: '',
  borderClass: '',
  autoComplete: null,
  readOnly: false,
  handleBlur: mockHandleBlur,
  handleChange: mockHandleChange,
  handleFocus: mockHandleFocus,
  handleClick: mockHandleClick,
  helpText: 'helpText text',
  options: null,
  trailingElement: null,
  type: 'text',
  children: null,
  className: '',
  floatingLabel: 'floatingLabel text',
  name: 'title',
  value: '',
};

const renderComponent = (errorMessage) => {
  props.errorMessage = errorMessage;
  render(<FormGroup {...props} />);
};

describe('FormGroup', () => {
  it('renders component without error', () => {
    renderComponent();
    expect(screen.getByText(props.floatingLabel)).toBeVisible();
    expect(screen.getByText(props.helpText)).toBeVisible();
    expect(screen.queryByTestId('errorMessage')).toBeNull();
  });
  // fit('renders component with error', () => {
  //   renderComponent('error message');
  //   expect(screen.getByText(props.floatingLabel)).toBeVisible();
  //   expect(screen.queryByText(props.helpText)).toBeNull();
  //   expect(screen.getByTestId('errorMessage')).toBeVisible();
  // });
  it('handles element focus', async () => {
    renderComponent();
    const formInput = screen.getByTestId('formControl');
    fireEvent.focus(formInput);
    expect(mockHandleFocus).toHaveBeenCalled();
  });

  it('handles element blur', () => {
    renderComponent();
    const formInput = screen.getByTestId('formControl');
    fireEvent.focus(formInput);
    fireEvent.focusOut(formInput);
    expect(mockHandleBlur).toHaveBeenCalled();
  });

  it('handles element click', () => {
    renderComponent();
    const formInput = screen.getByTestId('formControl');
    fireEvent.click(formInput);
    expect(mockHandleClick).toHaveBeenCalled();
  });
});
