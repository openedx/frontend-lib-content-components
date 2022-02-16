export const unit = ({ studioEndpointUrl, unitUrl }) => (
  `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`
);

export const block = ({ studioEndpointUrl, blockId }) => (
  `${studioEndpointUrl}/xblock/${blockId}`
);
