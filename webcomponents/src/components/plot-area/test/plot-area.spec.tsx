import { newSpecPage } from '@stencil/core/testing';
import { PlotArea } from '../plot-area';

describe('plot-area', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PlotArea],
      html: `<plot-area></plot-area>`,
    });
    expect(page.root).toEqualHtml(`
      <plot-area>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </plot-area>
    `);
  });
});
