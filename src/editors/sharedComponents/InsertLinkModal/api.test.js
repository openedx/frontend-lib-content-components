import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { getBlocksFromCourse } from './api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  camelCaseObject: jest.fn((obj) => obj),
}));

describe('getTopicsList function', () => {
  const mockCourseId = 'course123';
  const mockBlocks = {
    block_key: {
      id: 'block-key',
      block_id: 'edx_block-1',
      lms_web_url: 'http://localhost/weburl',
      legacy_web_url: 'http://localhost/legacy',
      student_view_url: 'http://localhost/studentview',
      type: 'sequential',
      display_name: 'Any display name',
      children: ['block_children_1', 'block_children_2'],
    },
    block_children_1: {
      id: 'block-children-1',
      block_id: 'edx_block-1',
      lms_web_url: 'http://localhost/weburl',
      legacy_web_url: 'http://localhost/legacy',
      student_view_url: 'http://localhost/studentview',
      type: 'sequential',
      display_name: 'Block children 1',
    },
    block_children_2: {
      id: 'block-children-2',
      block_id: 'edx_block-2',
      lms_web_url: 'http://localhost/weburl',
      legacy_web_url: 'http://localhost/legacy',
      student_view_url: 'http://localhost/studentview',
      type: 'sequential',
      display_name: 'Block children 2',
    },
  };

  const mockResponseData = { data: { root: 'block_key', blocks: mockBlocks } };
  const mockConfig = { LMS_BASE_URL: 'http://localhost' };

  beforeEach(() => {
    getConfig.mockReturnValue(mockConfig);
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponseData),
    });
  });

  test('successfully fetches teams list with default parameters', async () => {
    const response = await getBlocksFromCourse(mockCourseId);
    expect(response).toEqual(mockResponseData.data);
    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      `http://localhost/api/courses/v1/blocks/?course_id=${mockCourseId}&all_blocks=true&depth=all&requested_fields=name,parent, display_name,block_type,children`,
    );
  });

  test('handles empty response', async () => {
    const mockEmptyResponse = { data: { root: 'block_key', blocks: {} } };
    getAuthenticatedHttpClient().get.mockResolvedValue(mockEmptyResponse);

    const response = await getBlocksFromCourse(mockCourseId);
    expect(response).toEqual(mockEmptyResponse.data);
  });

  test('handles an API error', async () => {
    const errorMessage = 'Network error';
    getAuthenticatedHttpClient().get.mockRejectedValue(new Error(errorMessage));

    await expect(getBlocksFromCourse(mockCourseId)).rejects.toThrow(errorMessage);
  });
});
