/* eslint-disable no-import-assign */
import * as api from './api';
import * as mockApi from './mockApi';
import * as urls from './urls';
import { get } from '../../../data/services/cms/utils';

jest.mock('./urls', () => ({
  v1Libraries: jest.fn().mockName('urls.v1Libraries'),
  v2Libraries: jest.fn().mockName('urls.v2Libraries'),
  v1LibraryContent: jest.fn().mockName('urls.v1LibraryContent'),
  v2LibraryContent: jest.fn().mockName('urls.v2LibraryContent'),
  blockChildren: jest.fn().mockName('urls.blockChildren'),
}));

jest.mock('../../../data/services/cms/utils', () => ({
  get: jest.fn().mockName('get'),
}));

const { apiMethods } = api;

const studioEndpointUrl = 'hortus.coa';
const libraryId = 'lb:DeveloperInc:test3:html:0aa6a843-fd86-4ecf-84cb-4640cf8bebdd';
const blockId = 'block-v1-Id-Test';

describe('library api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('apiMethods', () => {
    describe('v1Libraries', () => {
      it('should call get with urls.v1Libraries', () => {
        apiMethods.fetchV1Libraries({ studioEndpointUrl });
        expect(get).toHaveBeenCalledWith(urls.v1Libraries({ studioEndpointUrl }));
      });
    });
    describe('v2Libraries', () => {
      it('should call get with urls.v2Libraries', () => {
        apiMethods.fetchV2Libraries({ studioEndpointUrl });
        expect(get).toHaveBeenCalledWith(urls.v2Libraries({ studioEndpointUrl }));
      });
    });
    describe('v1LibraryContent', () => {
      it('should call get with urls.v1LibraryContent', () => {
        apiMethods.fetchV1LibraryContent({ studioEndpointUrl });
        expect(get).toHaveBeenCalledWith(urls.v1LibraryContent({ studioEndpointUrl, libraryId }));
      });
    });
    describe('v2LibraryContent', () => {
      it('should call get with urls.v2LibraryContent', () => {
        apiMethods.fetchV2LibraryContent({ studioEndpointUrl, libraryId });
        expect(get).toHaveBeenCalledWith(urls.v2LibraryContent({ studioEndpointUrl, libraryId }));
      });
    });
    describe('fetchChildrenInfo', () => {
      it('should call get with urls.blockChildren', () => {
        apiMethods.fetchChildrenInfo({ studioEndpointUrl, blockId });
        expect(get).toHaveBeenCalledWith(urls.blockChildren({ studioEndpointUrl, blockId }));
      });
    });
  });
  describe('checkMockApi', () => {
    const envTemp = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...envTemp };
    });
    afterEach(() => {
      process.env = envTemp;
    });
    describe('if REACT_APP_DEVGALLERY is true', () => {
      it('should return the mockApi version of a call when it exists', () => {
        process.env.REACT_APP_DEVGALLERY = true;
        expect(api.checkMockApi('fetchV1Libraries')).toEqual(mockApi.fetchV1Libraries);
      });
      it('should return an empty mock when the call does not exist', () => {
        process.env.REACT_APP_DEVGALLERY = true;
        expect(api.checkMockApi('someRAnDomThINg')).toEqual(mockApi.emptyMock);
      });
    });
    describe('if REACT_APP_DEVGALLERY is not true', () => {
      it('should return the appropriate call', () => {
        expect(api.checkMockApi('fetchV1Libraries')).toEqual(apiMethods.fetchV1Libraries);
      });
    });
  });
});
