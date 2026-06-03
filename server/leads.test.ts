import { describe, expect, it } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('leads router', () => {
  it('getBySlug returns lead data for la-letizia-dubai-marina', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const lead = await caller.leads.getBySlug({ slug: 'la-letizia-dubai-marina' });

    expect(lead).toBeTruthy();
    expect(lead?.storeName).toBe('La Letizia');
    expect(lead?.area).toBe('Dubai Marina');
    expect(lead?.slug).toBe('la-letizia-dubai-marina');
    expect(lead?.heroTagline).toBe('Marina Daylight, Slow Coffee');
    expect(lead?.heroSubtitle).toContain('marble counter');
    expect(lead?.frameCountLandscape).toBe(241);
    expect(lead?.frameUrlsLandscape).toBeTruthy();
    expect(Array.isArray(lead?.frameUrlsLandscape)).toBe(true);
    expect(lead?.frameUrlsLandscape?.length).toBe(241);
    // Verify menu items
    expect(lead?.menuItems).toBeTruthy();
    const menu = typeof lead?.menuItems === 'string' ? JSON.parse(lead.menuItems) : lead?.menuItems;
    expect(Array.isArray(menu)).toBe(true);
    expect(menu.length).toBeGreaterThan(0);
    expect(menu[0].name).toBe('Espresso');
  });

  it('getBySlug returns null for non-existent slug', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const lead = await caller.leads.getBySlug({ slug: 'non-existent-slug' });

    expect(lead).toBeNull();
  });
});
