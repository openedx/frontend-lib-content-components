import { block } from "../../../data/services/cms/urls";

export const v1Libraries = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/contentstore/v1/home/libraries`
);

export const v2Libraries = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/libraries/v2/`
);

export const v2LibraryContent = ({ studioEndpointUrl, libraryId }) => (
  `${studioEndpointUrl}/api/libraries/v2/${libraryId}/blocks/`
);

export const blockChildren = ({ studioEndpointUrl, blockId }) => (
  `${block({ studioEndpointUrl, blockId })}?fields=childrenInfo`
);
