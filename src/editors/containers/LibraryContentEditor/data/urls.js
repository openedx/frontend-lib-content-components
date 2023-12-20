export const v1Libraries = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/contentstore/v1/home/libraries`
);

export const v2Libraries = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/libraries/v2/`
);

export const v2LibraryContent = ({ studioEndpointUrl, libraryId }) => (
  `${studioEndpointUrl}/api/libraries/v2/${libraryId}/blocks/`
);
