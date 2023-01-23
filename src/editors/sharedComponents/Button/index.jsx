import React from 'react';
import { string, node, arrayOf } from 'prop-types';

import { getButtonProps } from './hooks';

const Button = ({
  variant, className, text, children, ...props
}) => (
  <Button
    {...getButtonProps({ variant, className })}
    {...props}
  >
    {children || text}
  </Button>
);
Button.propTypes = {
  variant: string,
  className: string,
  text: string,
  children: node || arrayOf(node),
};
Button.defaultProps = {
  variant: 'default',
  className: null,
  text: null,
  children: null,
};

export default Button;
