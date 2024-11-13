import { newE2EPage } from '@stencil/core/testing';

describe('car-park', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<car-park></car-park>');

    const element = await page.find('car-park');
    expect(element).toHaveClass('hydrated');
  });
});
