/* eslint-disable import/prefer-default-export */
export const getButtonProps = ({ variant, className }) => {
  const variantClasses = {
    default: '',
    add: 'pl-0 text-primary-500 button-variant-add',
  };
  const variantMap = {
    add: 'tertiary',
  };
  const classes = [variantClasses[variant]];
  if (className) { classes.push(className); }

  return {
    className: classes.join(' '),
    variant: variantMap[variant] || variant,
  };
};
