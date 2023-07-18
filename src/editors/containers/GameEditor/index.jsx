import React from 'react';
import { connect } from 'react-redux';
import EditorContainer from '../EditorContainer';

export const GamesEditor = ({
  // TODO fill with inputs and redux here if needed
}) => {
  // TODO if logic is needed (it is), create a hooks.js file
  return (
    <EditorContainer>
      hello world
    </EditorContainer>
  );
};

export const mapStateToProps = (state) => ({
  // TODO fill with redux state here if needed
});

export const mapDispatchToProps = {
  // TODO fill with dispatches here if needed
};

export default connect(mapStateToProps, mapDispatchToProps)(GamesEditor);
