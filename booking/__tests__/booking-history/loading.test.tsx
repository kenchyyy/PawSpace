// tests/load-more.route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/app/api/history/load-more/route';
import { type NextRequest } from 'next/server';

// Mocks
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: () => undefined,
  })),
}));

const mockGetSession = vi.fn();
const mockFrom = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: mockGetSession,
    },
    from: mockFrom,
  })),
}));

// Setup chaining for supabase query builder
mockFrom.mockReturnValue({
  select: () => ({
    eq: () => ({
      order: mockOrder,
    }),
    order: mockOrder,
  }),
});
mockOrder.mockReturnValue({
  range: mockRange,
});

describe('GET /api/history/load-more', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with formatted bookings on success', async () => {
    const fakeRequest = {
      nextUrl: {
        searchParams: new URLSearchParams('page=1'),
      },
    } as unknown as NextRequest;

    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null,
    });

    mockRange.mockResolvedValue({
      data: [
        {
          booking_uuid: 'booking-1',
          date_booked: '2023-01-01',
          service_date_start: '2023-01-02',
          service_date_end: '2023-01-03',
          status: 'confirmed',
          special_requests: null,
          total_amount: 100,
          discount_applied: null,
          Owner: { id: 'owner-1', name: 'John Doe', address: '123 St', contact_number: '555', email: 'john@example.com' },
          Pet: [],
        },
      ],
      error: null,
    });

    const response = await GET(fakeRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.bookings).toHaveLength(1);
    expect(json.bookings[0].booking_uuid).toBe('booking-1');
  });

  it('returns 500 if supabase query returns error', async () => {
    const fakeRequest = {
      nextUrl: {
        searchParams: new URLSearchParams('page=1'),
      },
    } as unknown as NextRequest;

    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null,
    });

    mockRange.mockResolvedValue({
      data: null,
      error: new Error('DB error'),
    });

    const response = await GET(fakeRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Failed to fetch booking details');
  });

  it('returns 401 if requiresAuth but no userId', async () => {
    // Simulate no session user but session present
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockRange.mockResolvedValue({
      data: [],
      error: null,
    });
    
  });

  it('logs session error but continues', async () => {
    const fakeRequest = {
      nextUrl: {
        searchParams: new URLSearchParams('page=1'),
      },
    } as unknown as NextRequest;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Session failed'),
    });

    mockRange.mockResolvedValue({
      data: [],
      error: null,
    });

    const response = await GET(fakeRequest);
    const json = await response.json();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Supabase session error:', expect.any(Error));
    expect(response.status).toBe(401);
    expect(json.error).toBe('Authentication error');

    consoleErrorSpy.mockRestore();
  });

  it('returns 500 on unexpected error', async () => {
    const fakeRequest = {
      nextUrl: {
        searchParams: new URLSearchParams('page=1'),
      },
    } as unknown as NextRequest;

    mockGetSession.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const response = await GET(fakeRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('An unexpected error occurred');
  });
});
