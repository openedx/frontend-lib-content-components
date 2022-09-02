import { ProblemTypeKeys } from "../../../data/constants/problem";

const groupFeedbackWordMapping = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));

function getHints(markdown) {
  if (!markdown || !markdown.trim()) {
    return [];
  }
  const hints = [];

  function getHint(row) {
    let hint = '';
    if (row.startsWith('||')) {
      const hintStart = row.indexOf('||');
      const hintEnd = row.slice(hintStart + 2).indexOf('||');
      hint = row.slice(hintStart + 2, hintEnd + 2);
    }
    return hint;
  }
  for (const d in markdown.split('\n')) {
    const row = markdown.split('\n')[d];
    const hint = getHint(row);
    if (hint.length) {
      hints.push({
        id: Math.random(),
        value: hint,
      });
    }
  }
  return hints;
}

function getShortAnswerOptions(markdown) {
// TODO: Include tolerence for number it fails for now.
  if ((!markdown || !markdown.trim())) {
    return {
      shortAnswersList: [],
    };
  }
  const markdownListData = markdown.split('\n');
  const shortAnswersList = [];
  let gotAnswer = false;
  for (const i in markdownListData) {
    const row = markdownListData[i].trim();
    const feedbackStart = row.indexOf('{{');
    const feedbackEnd = row.indexOf('}}');
    let feedback = '';
    let answer = '';
    let correct = true;
    if (row.startsWith('=') && !gotAnswer) {
      gotAnswer = true;
      if (feedbackStart > -1) {
        feedback = row.slice(feedbackStart + 2, feedbackEnd);
        answer = row.slice(1, feedbackStart).trim();
      } else {
        answer = row.slice(1).trim();
      }
    } else if (row.startsWith('=') && gotAnswer) {
      break;
    } else if (gotAnswer && row.startsWith('or=')) { // the next correct answer
      if (feedbackStart > -1) {
        answer = row.slice(3, feedbackStart).trim();
        feedback = row.slice(feedbackStart + 2, feedbackEnd);
      } else {
        answer = row.slice(3).trim();
      }
    } else if (gotAnswer && row.startsWith('not=')) { // the incorrect answer
      if (feedbackStart > -1) {
        answer = row.slice(4, feedbackStart).trim();
        feedback = row.slice(feedbackStart + 2, feedbackEnd);
      } else {
        answer = row.slice(4).trim();
      }
      correct = false;
    }
    const problemType = isFinite(answer) ? ProblemTypeKeys.NUMERIC : ProblemTypeKeys.TEXTINPUT;
    if (answer) {
      shortAnswersList.push({
        id: Math.random(),
        value: answer,
        problemType,
        feedback,
        correct,
      });
    }
  }
  return {
    shortAnswersList,
  };
}

function getMultipleChoiceOptions(markdown) {
  const multipleChoiceOptions = [];
  const data = {
    multiSelectAnswersList: multipleChoiceOptions,
    problemType: ProblemTypeKeys.MULTISELECT,
    groupFeedbackList: [],
  };
  if (!markdown || !markdown.trim()) {
    return data;
  }
  const markdownListData = markdown.split('\n');
  let feedback = '';
  for (const d in markdownListData) {
    const row = markdownListData[d];
    // multiple choices
    if (row.startsWith('[ ]') || row.startsWith('[x]')) {
      // title
      let title = row.slice(row.indexOf(']') + 1).trim();

      const feedbacksStart = row.indexOf('{{');
      const selectedFeedbackStart = row.indexOf(' selected:') || row.indexOf('{selected:'); // two ways to define selected feedback
      const selectedFeedbackEnd = row.slice(selectedFeedbackStart + 1).indexOf('}') + selectedFeedbackStart;
      const unselectedFeedbackStart = row.indexOf('unselected:');
      const unselectedFeedbackEnd = row.slice(unselectedFeedbackStart + 1).indexOf('}}') + unselectedFeedbackStart;

      let selectedFeedback = '';
      let unselectedFeedback = '';
      let titleChanged = false;
      if (feedbacksStart !== -1 && selectedFeedbackStart !== -1) {
        selectedFeedback = row.slice(selectedFeedbackStart + 10, selectedFeedbackEnd);
        title = row.slice(row.indexOf(']') + 1, feedbacksStart).trim();
        titleChanged = true;
      }
      if (feedbacksStart !== -1 && unselectedFeedbackStart !== -1) {
        unselectedFeedback = row.slice(unselectedFeedbackStart + 12, unselectedFeedbackEnd + 1);
        if (!titleChanged) {
          title = row.slice(row.indexOf(']') + 1, feedbacksStart).trim();
        }
      }
      multipleChoiceOptions.push({
        id: Math.random(),
        title,
        correct: !row.startsWith('[ ]'),
        selectedFeedback,
        unselectedFeedback,
      });
    }
    // group Feedback
    if (multipleChoiceOptions.length) {
      if (row.startsWith('{{')) {
        const groupFeedbackEnd = row.indexOf('}}');
        const goupStart = row.indexOf('((');
        const groupEnd = row.indexOf('))');
        const group = row.slice(goupStart + 2, groupEnd).split(' ');
        const groupChoices = [];
        for (const i in group) {
          const letter = group[i];
          if (multipleChoiceOptions[groupFeedbackWordMapping.indexOf(letter)]) {
            groupChoices.push(multipleChoiceOptions[groupFeedbackWordMapping.indexOf(letter)].id);
          }
        }
        feedback = row.slice(groupEnd + 2, groupFeedbackEnd).trim();

        if (groupChoices.length && feedback) {
          data.groupFeedbackList.push({
            id: Math.random(),
            answers: groupChoices,
            feedback,
          });
        }
      }
    }
  }
  return data;
}

function getSingleChoiceOptions(markdown) {
  if (!markdown || !markdown.trim()) {
    return {
      singleSelectAnswersList: [],
      problemType: ProblemTypeKeys.DROPDOWN,
    };
  }

  const singleChoiceOptions = [];
  let dropDownMode = false;
  const markdownListData = markdown.split('\n');
  for (const d in markdownListData) {
    const row = markdownListData[d].trim();
    if (row.startsWith('[[')) {
      dropDownMode = true;
      continue;
    }
    if (row.startsWith(']]')) {
      break;
    }
    if (dropDownMode) {
      if (row.startsWith('(')) {
        let feedback = '';
        let title = row.slice(row.indexOf('(') + 1, row.indexOf(')')).trim();
        const feedbackStart = row.indexOf('{{');
        const feedbackEnd = row.indexOf('}}');
        if (feedbackStart !== -1 && feedbackEnd !== -1 && feedbackEnd > feedbackStart) { // assum the row contains feedback
          feedback = row.slice(feedbackStart + 2, feedbackEnd).trim();
          title = title.slice(0, feedbackStart).trim();
        }
        const correct = true;
        singleChoiceOptions.push({
          id: Number(d),
          title,
          correct,
          feedback,
        });
      } else {
        let feedback = '';
        let title = '';
        // let title = row.slice(row.indexOf(')') + 1).trim();

        const feedbackStart = row.indexOf('{{');
        const feedbackEnd = row.indexOf('}}');
        if (feedbackStart !== -1 && feedbackEnd !== -1 && feedbackEnd > feedbackStart) { // assum the row contains feedback
          feedback = row.slice(feedbackStart + 2, feedbackEnd).trim();
          title = row.slice(0, feedbackStart).trim();
        } else {
          title = row.trim();
        }
        const correct = false;
        singleChoiceOptions.push({
          id: Number(d),
          title,
          correct,
          feedback,
        });
      }
    } else if (row.startsWith('( )') || row.startsWith('(x)')) {
      let feedback = '';
      let title = row.slice(row.indexOf(')') + 1).trim();
      const feedbackStart = row.indexOf('{{');
      const feedbackEnd = row.indexOf('}}');
      if (feedbackStart !== -1 && feedbackEnd !== -1 && feedbackEnd > feedbackStart) { // assum the row contains feedback
        feedback = row.slice(feedbackStart + 2, feedbackEnd).trim();
        title = title.slice(0, feedbackStart - 4).trim();
      }
      const correct = !!row.startsWith('(x)');
      singleChoiceOptions.push({
        id: Number(d),
        title,
        correct,
        feedback,
      });
    }
  }

  return {
    singleSelectAnswersList: singleChoiceOptions,
    problemType: dropDownMode ? ProblemTypeKeys.DROPDOWN : ProblemTypeKeys.SINGLESELECT,
  };
}

function getEditorData(markdown) {
  // TODO: Prase heading in this function.
  if (!markdown || !markdown.trim()) {
    return '';
  }
  let description = '';
  const markdownData = markdown.trim().split('\n');
  for (const i in markdownData) {
    const row = markdownData[i];
    if (['{', '(', '[', '=', '|'].indexOf(row.trim()[0]) === -1) {
      const questionTextStart = row.indexOf('>>');
      const questionTextEnd = row.indexOf('<<');
      let questionText = row;
      if (questionTextStart !== -1 && questionTextEnd !== -1 && (questionTextEnd > questionTextStart)) {
        questionText = row.replace('>>', '<p>').replace('<<', '</p>');
      }
      description += `${questionText}\n`;
    } else {
      break;
    }
  }
  return description;
}

function getScorringSettings() {
  return {
    selectedAttemptsOption: window.LXCData.max_attempts,
    selectedPointOption: window.LXCData.weight,
  };
}

export {
  getMultipleChoiceOptions,
  getSingleChoiceOptions,
  getEditorData,
  getHints,
  getScorringSettings,
  getShortAnswerOptions,
};
