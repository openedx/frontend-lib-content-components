export const libraryV1 = ({ studioEndpointUrl, learningContextId }) => (
  `${studioEndpointUrl}/library/${learningContextId}`
);

export const unit = ({ studioEndpointUrl, unitUrl }) => (
  `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`
);

export const returnUrl = ({ studioEndpointUrl, unitUrl, learningContextId }) => {
  if (learningContextId && learningContextId.includes('library-v1')) {
    return libraryV1({ studioEndpointUrl, learningContextId });
  }
  return unitUrl ? unit({ studioEndpointUrl, unitUrl }) : '';
};

export const block = ({ studioEndpointUrl, blockId }) => (
  `${studioEndpointUrl}/xblock/${blockId}`
);

export const blockAncestor = ({ studioEndpointUrl, blockId }) => (
  `${block({ studioEndpointUrl, blockId })}?fields=ancestorInfo`
);

export const courseAssets = ({ studioEndpointUrl, learningContextId }) => (
  `${studioEndpointUrl}/assets/${learningContextId}/`
);

export const courseImages = ({ studioEndpointUrl, learningContextId }) => (
  `${courseAssets({ studioEndpointUrl, learningContextId })}?sort=uploadDate&direction=desc&asset_type=Images`
);
