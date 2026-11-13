import { SFProductSchema } from '../src/models/storefront/sf-product';

/**
 * The product's per-marketplace details (appengine sales-channel/listing-details.ts reads and checks them; the
 * product form's marketplace sections write them). Each marketplace keeps its own block under the product.
 */
describe('product marketplace details', () => {
  const props: any = (SFProductSchema() as any).properties;

  it('Facebook & Instagram Shop keeps a condition in Meta\'s own values and a brand Meta accepts', () => {
    const fb = props.facebook;
    expect(fb).toMatchObject({ type: 'object', title: 'Facebook & Instagram Shop details', group: 'channels' });
    expect(fb.properties.condition).toMatchObject({ type: 'string', enum: ['new', 'refurbished', 'used'] });
    expect(fb.properties.brand).toMatchObject({ type: 'string', maxLength: 100 });
    // Meta has no required category: nothing to pick.
    expect(Object.keys(fb.properties).sort()).toEqual(['brand', 'condition']);
  });

  it('eBay keeps its site, category, condition and item specifics', () => {
    expect(props.ebay).toMatchObject({ type: 'object', title: 'eBay details', group: 'channels' });
    expect(props.ebay.properties).toHaveProperty('marketplaceId');
    expect(props.ebay.properties).toHaveProperty('aspects');
  });

  it('marketplace detail blocks are only for marketplaces the platform sells on', () => {
    const blocks = Object.keys(props).filter((k) => props[k]?.group === 'channels' && /details$/i.test(String(props[k]?.title || '')));
    expect(blocks.sort()).toEqual(['ebay', 'facebook']);
  });
});
