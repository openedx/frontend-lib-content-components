/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export const getBlocksFromCourse = async (courseId) => {
  try {
    const courseIdFormat = encodeURIComponent(courseId);
    const { data } = await getAuthenticatedHttpClient().get(
      `${
        getConfig().LMS_BASE_URL
      }/api/courses/v1/blocks/?course_id=${courseIdFormat}&all_blocks=true&depth=all&requested_fields=name,parent, display_name,block_type,children`,
    );

    const { blocks } = data;
    const blocksFormat = Object.keys(blocks).reduce(
      (prevBlocks, key) => ({
        ...prevBlocks,
        [key]: camelCaseObject(blocks[key]),
      }),
      {},
    );

    data.blocks = blocksFormat;

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
