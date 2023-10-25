export const contentStore = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/libraries/v1/home/`
);

export const libraryContent = ({ studioEndpointUrl, libraryId }) => (
  `${studioEndpointUrl}/api/libraries/v2/${libraryId}/blocks/`
);

export const blockContent = ({ studioEndpointUrl, blockId }) => (
  `${studioEndpointUrl}/library/${blockId}/`
);
