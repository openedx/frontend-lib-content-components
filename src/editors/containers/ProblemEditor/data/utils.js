/* eslint-disable import/prefer-default-export */
import { replaceRelativeImageUrlsByAbsolute } from '../../../data/services/cms/utils';

export const preprocessProblemData = (problemData, state) => {
  if (problemData?.settings?.hints) {
    problemData.settings.hints = problemData.settings.hints.map(
      hint => ({ ...hint, value: replaceRelativeImageUrlsByAbsolute(hint.value, state.app.lmsEndpointUrl) }),
    );
  }

  if (problemData?.answers) {
    problemData.answers = problemData.answers.map(
      answer => ({ ...answer, title: replaceRelativeImageUrlsByAbsolute(answer.title, state.app.lmsEndpointUrl) }),
    );
  }
};
