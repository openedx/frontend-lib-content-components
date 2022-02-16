import { feedbackRequirement } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testState = {
  app: {
    showReview: false,
    showRubric: false,
    isGrading: false,
    courseMetadata: {
      courseId: 'test-course-id',
    },
    oraMetadata: {
      name: 'test-ora-name',
      prompt: 'test-ora-prompt',
      type: 'test-ora-type',
      fileUploadResponseConfig: 'file-upload-response-config',
      rubricConfig: {
        feedback: 'optional',
        criteria: [
          {
            orderNum: 0,
            name: 'critERia0',
            feedback: 'optional',
          },
          {
            orderNum: 1,
            name: 'critEriA1',
            feedback: 'disabled',
          },
          {
            orderNum: 2,
            name: 'cRIteria2',
            feedback: 'required',
          },
        ],
      },
    },
  },
};

describe('app selectors unit tests', () => {
  const { appSelector, simpleSelectors, rubric } = selectors;
  describe('appSelector', () => {
    it('returns the app data', () => {
      expect(appSelector(testState)).toEqual(testState.app);
    });
  });
  describe('simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const { preSelectors, cb } = simpleSelectors[key];
      expect(preSelectors).toEqual([appSelector]);
      expect(cb(testState.app)).toEqual(testState.app[key]);
    };
    test('simple selectors link their values from app store', () => {
      [
        'showReview',
        'showRubric',
        'isGrading',
        'courseMetadata',
        'oraMetadata',
      ].map(testSimpleSelector);
    });
  });
  const testReselect = ({
    selector,
    preSelectors,
    args,
    expected,
  }) => {
    expect(selector.preSelectors).toEqual(preSelectors);
    expect(selector.cb(args)).toEqual(expected);
  };
  describe('courseId selector', () => {
    it('returns course id from courseMetadata', () => {
      testReselect({
        selector: selectors.courseId,
        preSelectors: [simpleSelectors.courseMetadata],
        args: testState.app.courseMetadata,
        expected: testState.app.courseMetadata.courseId,
      });
    });
  });
  describe('ora metadata selectors', () => {
    const { oraMetadata } = testState.app;
    const testOraSelector = (selector, expected) => (
      testReselect({
        selector,
        preSelectors: [simpleSelectors.oraMetadata],
        args: oraMetadata,
        expected,
      })
    );
    test('ora.name selector returns name from oraMetadata', () => {
      testOraSelector(selectors.ora.name, oraMetadata.name);
    });
    test('ora.prompt selector returns prompt from oraMetadata', () => {
      testOraSelector(selectors.ora.prompt, oraMetadata.prompt);
    });
    test('ora.type selector returns type from oraMetadata', () => {
      testOraSelector(selectors.ora.type, oraMetadata.type);
    });
    test('rubricConfig selector returns rubricConfig from oraMetadata', () => {
      testOraSelector(selectors.rubric.config, oraMetadata.rubricConfig);
    });
    test('fileUploadResponseConfig returns fileUploadResponseconfig from oraMetadata', () => {
      testOraSelector(
        selectors.ora.fileUploadResponseConfig,
        oraMetadata.fileUploadResponseConfig,
      );
    });
  });
  describe('rubricConfig selectors', () => {
    const { rubricConfig } = testState.app.oraMetadata;
    const testRubricSelector = (selector, expected, args = null) => (
      testReselect({
        selector,
        preSelectors: [selectors.rubric.config],
        args: args === null ? rubricConfig : args,
        expected,
      })
    );
    test('hasConfig', () => {
      testReselect({
        selector: rubric.hasConfig,
        preSelectors: [selectors.rubric.config],
        args: rubricConfig,
        expected: true,
      });
      testReselect({
        selector: rubric.hasConfig,
        preSelectors: [selectors.rubric.config],
        args: undefined,
        expected: false,
      });
    });
    test('feedbackConfig', () => {
      testRubricSelector(rubric.feedbackConfig, rubricConfig.feedback);
    });
    test('criteria', () => {
      testRubricSelector(rubric.criteria, rubricConfig.criteria);
    });
    describe('criteria selectors', () => {
      let criteria;
      beforeEach(() => {
        criteria = rubric.criteria;
        rubric.criteria = jest.fn(({ app }) => app.oraMetadata.rubricConfig.criteria);
      });
      afterEach(() => {
        rubric.criteria = criteria;
      });
      test('criterionConfig returns config by orderNum/index', () => {
        const testCriterion = (orderNum) => {
          expect(
            rubric.criterionConfig(testState, { orderNum }),
          ).toEqual(rubricConfig.criteria[orderNum]);
        };
        [0, 1, 2].map(testCriterion);
      });
      test('criterionFeedbackConfig', () => {
        const testCriterion = (orderNum) => {
          expect(
            rubric.criterionFeedbackConfig(testState, { orderNum }),
          ).toEqual(rubricConfig.criteria[orderNum].feedback);
        };
        [0, 1, 2].map(testCriterion);
      });
      test('criteriaIndices returns ordered list of orderNum values', () => {
        testReselect({
          selector: rubric.criteriaIndices,
          preSelectors: [criteria],
          args: rubricConfig.criteria,
          expected: [0, 1, 2],
        });
      });
    });
  });
  describe('emptyGrade selector', () => {
    const { rubricConfig } = testState.app.oraMetadata;
    let preSelectors;
    let cb;
    beforeEach(() => {
      ({ preSelectors, cb } = selectors.emptyGrade);
    });
    it('is a memoized selector based on rubric.[hasConfig, criteria, feedbackConfig]', () => {
      expect(preSelectors).toEqual([
        rubric.hasConfig,
        rubric.criteria,
        rubric.feedbackConfig,
      ]);
    });
    describe('If the config is not loaded (hasConfig = undefined)', () => {
      it('returns null', () => {
        expect(cb(false, {}, '')).toEqual(null);
      });
    });
    describe('The generated object', () => {
      it('loads an overallFeedback field iff feedbackConfig is optional or required', () => {
        let gradeData = cb(true, rubricConfig.criteria, feedbackRequirement.optional);
        expect(gradeData.overallFeedback).toEqual('');
        gradeData = cb(true, rubricConfig.criteria, feedbackRequirement.required);
        expect(gradeData.overallFeedback).toEqual('');
        gradeData = cb(true, rubricConfig.criteria, feedbackRequirement.disabled);
        expect(gradeData.overallFeedback).toEqual(undefined);
      });
      it('loads criteria with feedback field based on requirement config', () => {
        const gradeData = cb(true, rubricConfig.criteria, rubricConfig.feedback);
        const { criteria } = rubricConfig;
        expect(gradeData.criteria).toEqual([
          {
            orderNum: criteria[0].orderNum,
            name: criteria[0].name,
            selectedOption: '',
            feedback: '',
          },
          {
            orderNum: criteria[1].orderNum,
            name: criteria[1].name,
            selectedOption: '',
          },
          {
            orderNum: criteria[2].orderNum,
            name: criteria[2].name,
            selectedOption: '',
            feedback: '',
          },
        ]);
      });
    });
  });
});
