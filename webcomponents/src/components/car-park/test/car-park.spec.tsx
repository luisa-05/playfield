import { newSpecPage } from '@stencil/core/testing';
import { CarPark } from '../car-park';

describe('car-park', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CarPark],
      html: `<car-park></car-park>`,
    });
    expect(page.root).toEqualHtml(`
      <car-park>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </car-park>
    `);
  });
});
