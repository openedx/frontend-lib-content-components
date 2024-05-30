import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * get(url)
 * simple wrapper providing an authenticated Http client get action
 * @param {string} url - target url
 */
export const get = (...args) => getAuthenticatedHttpClient().get(...args);
/**
 * post(url, data)
 * simple wrapper providing an authenticated Http client post action
 * @param {string} url - target url
 * @param {object|string} data - post payload
 */
export const post = (...args) => getAuthenticatedHttpClient().post(...args);
/**
 * delete(url, data)
 * simple wrapper providing an authenticated Http client delete action
 * @param {string} url - target url
 * @param {object|string} data - delete payload
 */
export const deleteObject = (...args) => getAuthenticatedHttpClient().delete(...args);

export const client = getAuthenticatedHttpClient;

/**
 * Replaces all relative image URLs in the given text with absolute URLs.
 *
 * This function searches for relative URLs in `src` attributes of image tags within the provided text,
 * and replaces them with absolute URLs by prefixing them with the specified LMS endpoint URL.
 *
 * @param {string} text - The input text containing image tags with relative URLs.
 * @param {string} lmsEndpointUrl - The base URL to prepend to each relative URL to form an absolute URL.
 * @returns {string} The text with all relative image URLs replaced by absolute URLs.
 */
export const replaceRelativeImageUrlsByAbsolute = (text, lmsEndpointUrl) => {
  const relativeSrcRegExp = /(?<=src=")(\/.*?)(?=")/g;
  const replaceRelativeToAbsoluteUrl = (relativeUrl) => `${lmsEndpointUrl}${relativeUrl}`;
  return (text || '').replaceAll(relativeSrcRegExp, replaceRelativeToAbsoluteUrl);
};
