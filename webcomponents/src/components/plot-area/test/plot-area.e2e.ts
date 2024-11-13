import { newE2EPage } from '@stencil/core/testing';

describe('plot-area', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<plot-area></plot-area>');

    const element = await page.find('plot-area');
    expect(element).toHaveClass('hydrated');
  });
});
