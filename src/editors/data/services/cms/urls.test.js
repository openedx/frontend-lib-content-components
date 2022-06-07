import {
  unit,
  block,
  blockAncestor,
  courseAssets,
  courseImages,
} from './urls';

describe('cms url methods', () => {
  const studioEndpointUrl = 'urLgoeStOstudiO';
  const blockId = 'blOckIDTeST123';
  const learningContextId = 'learningContextId321';
  describe('unit', () => {
    const unitUrl = {
      data: {
        ancestors: [
          {
            id: 'unItUrlTEST',
          },
        ],
      },
    };
    it('returns url with studioEndpointUrl and unitUrl', () => {
      expect(unit({ studioEndpointUrl, unitUrl }))
        .toEqual(`${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`);
    });
  });
  describe('block', () => {
    it('returns url with studioEndpointUrl and blockId', () => {
      expect(block({ studioEndpointUrl, blockId }))
        .toEqual(`${studioEndpointUrl}/xblock/${blockId}`);
    });
  });
  describe('blockAncestor', () => {
    it('returns url with studioEndpointUrl, blockId and ancestor query', () => {
      expect(blockAncestor({ studioEndpointUrl, blockId }))
        .toEqual(`${block({ studioEndpointUrl, blockId })}?fields=ancestorInfo`);
    });
  });
  describe('courseAssets', () => {
    it('returns url with studioEndpointUrl and learningContextId', () => {
      expect(courseAssets({ studioEndpointUrl, learningContextId }))
        .toEqual(`${studioEndpointUrl}/assets/${learningContextId}/`);
    });
  });
  describe('courseImages', () => {
    it('returns url with studioEndpointUrl, learningContextId and courseAssets query', () => {
      expect(courseImages({ studioEndpointUrl, learningContextId }))
        .toEqual(`${courseAssets({ studioEndpointUrl, learningContextId })}?sort=uploadDate&direction=desc&asset_type=Images`);
    });
  });
});
