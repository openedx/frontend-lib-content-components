import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

async function getAsync(setValue, setError, setLoading, params) {
  try {
    setLoading(true);
    const result = await new Promise(r => setTimeout(r, 2000)); //getAuthenticatedHttpClient().get(...params);
    setValue({
      data: "<p>Im baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps.</p>",
      parentUrl: "ahiuhaknkanda",
    }) //(result);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
}

async function saveAsync(setInProgress, setResponse, params) {
  try {
    const result = await new Promise(r => setTimeout(r, 2000)); //getAuthenticatedHttpClient().post(...params);
    setResponse(
      true
    ) //(result);
  } catch (e) {
    setResponse(e);
  } finally {
    setInProgress('complete');
  }
}

export function fetchBlockById(setValue, setError, setLoading, courseId, blockId, studioEndpointUrl) {
  const url = `${studioEndpointUrl}/api/v2/???????/${courseId}/${blockId}`;
  const params = [url];
  const block = getAsync(setValue, setError, setLoading, params);
  return block;
}
export function fetchUnitUrl(setValue, setError, setLoading, blockId, courseId, studioEndpointUrl) {
  const url = `${studioEndpointUrl}/api/v2/???????/${courseId}/${blockId}`;
  const params = [url];
  const unit = getAsync(setValue, setError, setLoading, params);
  return unit;
}

export function saveBlock(blockId, courseId, studioEndpointUrl, content, setInProgress, setResponse) {
  const url = `${studioEndpointUrl}/api/v2/???????/${courseId}/${blockId}`;
  const params = [url, content];
  const saveResponse = saveAsync(setInProgress, setResponse, params);
  return saveResponse;
}
