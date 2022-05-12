import React from 'react';

export default function ProblemEditor({
  // Redux
  hasEntry,
}) {
  // TODO: This layer will hold onto the navigation between steps

  return (
    <div>
      <div>
        <h1>
          Problem
        </h1>
      </div>
      <div>
        {hasEntry ? (
          <EditProblemView />
        )
          : (
            <SelectTypeModal />
          )}
      </div>
    </div>
  );

  // selectors.problem.hasEntry
}
