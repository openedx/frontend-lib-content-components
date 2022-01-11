import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { ActionStates, normalizeContent } from './constants';

async function getAsync(setValue, setError, setLoading, params) {
  try {
    setLoading(ActionStates.IN_PROGRESS);
    const result = await getAuthenticatedHttpClient().get(...params);
    setValue(result);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(ActionStates.FINISHED);
  }
}

async function saveAsync(setInProgress, setResponse, params) {
  try {
    const result = await getAuthenticatedHttpClient().post(...params);
    setResponse(result);
  } catch (e) {
    setResponse(e);
  } finally {
    setInProgress(ActionStates.FINISHED);
  }
}

export function fetchBlockById(setValue, setError, setLoading, blockId, studioEndpointUrl) {
  const url = `${studioEndpointUrl}/xblock/${blockId}`;
  getAsync(setValue, setError, setLoading, [url]);
}

export function fetchUnitById(setValue, setError, setLoading, blockId, studioEndpointUrl) {
  const url = `${studioEndpointUrl}/xblock/${blockId}?fields=ancestorInfo`;
  getAsync(setValue, setError, setLoading, [url]);
}

export function saveBlock(blockId, blockType, courseId, studioEndpointUrl, content, setInProgress, setResponse) {
  const normalizedContent = normalizeContent(blockType, content, blockId, courseId);
  const url = `${studioEndpointUrl}/xblock/${encodeURI(blockId)}`;
  const params = [url, normalizedContent];
  saveAsync(setInProgress, setResponse, params);
}
