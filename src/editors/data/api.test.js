import axios from 'axios'; // eslint-disable-line import/no-extraneous-dependencies
import { fetchBlockById, fetchUnitById, saveBlock } from './api';

const get = jest.spyOn(axios, 'get');
const post = jest.spyOn(axios, 'post');

const saveFunctionsGet = {
  setValue: jest.fn(),
  setError: jest.fn(),
  setLoading: jest.fn(),
};
const saveFunctionsSave = {
  setResponse: jest.fn(),
  setInProgress: jest.fn(),
};
const blockId = 'coursev1:2uX@4345432';
const studioEndpointUrl = 'hortus.coa';

test('fetchBlockById 404', () => {
  get.mockRejectedValue({ response: { status: 404 } });
  fetchBlockById(saveFunctionsGet, blockId, studioEndpointUrl);
  expect(saveFunctionsGet.setLoading).toHaveBeenCalled();
  expect(saveFunctionsGet.setError).toHaveBeenCalled();
});
test('fetchUnitById 404', () => {
  get.mockRejectedValue({ response: { status: 404 } });
  fetchUnitById(saveFunctionsGet, blockId, studioEndpointUrl);
  expect(saveFunctionsGet.setLoading).toHaveBeenCalled();
  expect(saveFunctionsGet.setError).toHaveBeenCalled();
});

test('saveBlock 404', () => {
  post.mockRejectedValue({ response: { status: 404 } });
  saveBlock(blockId, 'funBlock', 'demo2uX', studioEndpointUrl, 'Im baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps.', saveFunctionsSave);
  expect(saveFunctionsSave.setInProgress).toHaveBeenCalled();
  expect(saveFunctionsSave.setResponse).toHaveBeenCalled();
});
