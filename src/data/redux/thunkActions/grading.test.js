import { actions, selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import * as thunkActions from './grading';

jest.mock('./requests', () => ({
  fetchSubmission: (args) => ({ fetchSubmission: args }),
  fetchSubmissionResponse: (args) => ({ fetchSubmissionResponse: args }),
  fetchSubmissionStatus: (args) => ({ fetchSubmissionStatus: args }),
  setLock: (args) => ({ setLock: args }),
  submitGrade: (args) => ({ submitGrade: args }),
}));

jest.mock('data/redux/app/selectors', () => ({
  emptyGrade: (state) => ({ emptyGrade: state }),
}));

jest.mock('data/redux/grading/selectors', () => ({
  prev: {
    doesExist: jest.fn((state) => ({ prevDoesExist: state })),
  },
  next: {
    doesExist: jest.fn((state) => ({ nextDoesExist: state })),
  },
  selected: {
    gradeData: jest.fn((state) => ({ gradeData: state })),
    isGrading: jest.fn((state) => ({ isGrading: state })),
    submissionUUID: (state) => ({ selectedsubmissionUUID: state }),
    lockStatus: (state) => ({ lockStatus: state }),
  },
}));

describe('grading thunkActions', () => {
  const testState = { some: 'testy-state' };
  const selectedUUID = selectors.grading.selected.submissionUUID(testState);
  const response = 'test-response';
  const objResponse = { response };
  let dispatch;
  let actionArgs;
  const getState = () => testState;

  const getDispatched = (calledAction) => {
    calledAction(dispatch, getState);
  };

  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });

  describe('loadSubmission', () => {
    beforeEach(() => {
      getDispatched(thunkActions.loadSubmission());
      actionArgs = dispatch.mock.calls[1][0].fetchSubmission;
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
    });
    test('dispatches fetchSubmission', () => {
      expect(actionArgs).not.toEqual(undefined);
    });
    describe('fetchSubmissionArgs', () => {
      test('submissionUUID: selectors.grading.selected.submisssionUUID', () => {
        expect(actionArgs.submissionUUID).toEqual(
          selectedUUID,
        );
      });
      test('onSuccess: dispatches loadSubmission with response and submissionUUID', () => {
        dispatch.mockClear();
        actionArgs.onSuccess(objResponse);
        expect(dispatch).toHaveBeenCalledWith(
          actions.grading.loadSubmission({ ...objResponse, submissionUUID: selectedUUID }),
        );
      });
    });
  });

  describe('loadSubmission inheritors', () => {
    let loadSubmission;
    beforeAll(() => {
      loadSubmission = thunkActions.loadSubmission;
      thunkActions.loadSubmission = args => ({ loadSubmission: args });
    });
    afterAll(() => {
      thunkActions.loadSubmission = loadSubmission;
    });
    describe('loadNext', () => {
      test('dispatches actions.grading.loadNext and then loadSubmission', () => {
        thunkActions.loadNext()(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles })],
          [actions.grading.loadNext()],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
    describe('loadPrev', () => {
      test('clears submitGrade status and dispatches actions.grading.loadPrev and then loadSubmission', () => {
        thunkActions.loadPrev()(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles })],
          [actions.grading.loadPrev()],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
    describe('loadSelectionForReview', () => {
      const submissionUUIDs = [
        'submission-id-0',
        'submission-id-1',
        'submission-id-2',
        'submission-id-3',
      ];
      test('dispatches actions.grading.updateSelection, actions.app.setShowReview(true), and then loadSubmission', () => {
        thunkActions.loadSelectionForReview(submissionUUIDs)(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.grading.updateSelection(submissionUUIDs)],
          [actions.app.setShowReview(true)],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
  });

  describe('startGrading', () => {
    beforeEach(() => {
      getDispatched(thunkActions.startGrading());
      actionArgs = dispatch.mock.calls[1][0].setLock;
    });
    test('dispatches setLock with selected submissionUUID and value: true', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(true);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.selected.submissionUUID(testState));
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
    });
    describe('onSuccess', () => {
      const gradeData = { some: 'test grade data' };
      const startResponse = { other: 'fields', gradeData };
      beforeEach(() => {
        dispatch.mockClear();
      });
      test('dispatches startGrading with selected gradeData if truthy', () => {
        actionArgs.onSuccess(startResponse);
        expect(dispatch.mock.calls).toContainEqual([
          actions.grading.startGrading({
            ...startResponse,
            gradeData: selectors.grading.selected.gradeData(testState),
          }),
        ]);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
      });
      test('dispatches startGrading with empty grade if selected gradeData is not truthy', () => {
        const emptyGrade = selectors.app.emptyGrade(testState);
        const expected = [
          actions.grading.startGrading({ ...startResponse, gradeData: emptyGrade }),
        ];
        selectors.grading.selected.gradeData.mockReturnValue({});
        actionArgs.onSuccess({ ...startResponse, gradeData: {} });
        expect(dispatch.mock.calls).toContainEqual(expected);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
        dispatch.mockClear();
        actionArgs.onSuccess({ ...startResponse, gradeData: null });
        expect(dispatch.mock.calls).toContainEqual(expected);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
      });
    });
  });

  describe('cancelGrading', () => {
    let stopGrading;
    beforeAll(() => {
      stopGrading = thunkActions.stopGrading;
      thunkActions.stopGrading = () => 'stop grading';
    });
    beforeEach(() => {
      getDispatched(thunkActions.cancelGrading());
      actionArgs = dispatch.mock.calls[1][0].setLock;
    });
    afterAll(() => {
      thunkActions.stopGrading = stopGrading;
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
    });
    test('dispatches setLock with selected submissionUUID and value: false', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(false);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.selected.submissionUUID(testState));
    });
    describe('onSuccess', () => {
      beforeEach(() => {
        dispatch.mockClear();
      });
      test('dispatches stopGrading thunkAction', () => {
        actionArgs.onSuccess();
        expect(dispatch.mock.calls).toContainEqual([thunkActions.stopGrading()]);
      });
    });
  });

  describe('stopGrading', () => {
    it('dispatches grading.stopGrading', () => {
      thunkActions.stopGrading()(dispatch, getState);
      expect(dispatch.mock.calls).toEqual([
        [actions.grading.stopGrading()],
      ]);
    });
  });
});
