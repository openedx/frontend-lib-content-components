// TODO: Add translations here?
export function mapBlockTypeToName(blockType) {
  if (blockType === 'html') {
    return 'Text'; // or a translation
  }
  return blockType[0].toUpperCase() + blockType.substring(1);
}
// States for async processes
export const ActionStates = {
  NOT_BEGUN: 'not_begun',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
};

export function normalizeContent(blockType, content, blockId, courseId) {
  switch (blockType) {
    case 'html':
      return {
        id: blockId,
        category: blockType,
        has_changes: true,
        data: content,
        couseKey: courseId,
      };
    default: return {};
  }
}
