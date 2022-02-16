import { get, post } from './utils';

const blockUrl = (studioUrl, blockId) => `${studioUrl}/xblock/${blockId}`;

export const fetchBlockById = ({ blockId, studioEndpointUrl }) => get(
  blockUrl(studioEndpointUrl, blockId),
);

export const fetchByUnitId = ({ blockId, studioEndpointUrl }) => get(
  `${blockUrl(studioEndpointUrl, blockId)}?fields=ancestorInfo`,
);

export const normalizeContent = (blockType, content, blockId, courseId) => {
  if (blockType === 'html') {
    return {
      id: blockId,
      category: blockType,
      has_changes: true,
      data: content,
      couseKey: courseId,
    };
  }
  throw new TypeError(`No Block in V2 Editors named /"${blockType}/", Cannot Save Content.`);
};

export const saveBlock = ({
  blockId,
  studioEndpointUrl,
  // block data
  blockType,
  content,
  courseId,
}) => post([
  blockUrl(studioEndpointUrl, blockId),
  normalizeContent(blockType, content, blockId, courseId),
]);
