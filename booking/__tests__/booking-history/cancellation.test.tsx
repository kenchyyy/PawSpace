import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/app/api/history/cancel-booking/route';

// Mock Supabase and Next.js headers
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

describe('POST /cancel-booking', () => {
  const mockEq = vi.fn();
  const mockUpdate = vi.fn();
  const mockInsert = vi.fn();
  const mockFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup the .eq() mock to return a resolved promise simulating Supabase response
    mockEq.mockResolvedValue({ error: null });

    // Setup the .update() mock to return an object with .eq() method
    mockUpdate.mockReturnValue({ eq: mockEq });

    // Mock the supabase.from() method to return update or insert mocks
    mockFrom.mockImplementation((tableName: string) => {
      if (tableName === 'Booking') {
        return { update: mockUpdate };
      }
      if (tableName === 'CancelMessages') {
        return { insert: mockInsert };
      }
      return {};
    });

    (createRouteHandlerClient as unknown as import('vitest').Mock).mockReturnValue({
      from: mockFrom,
    });

    (cookies as unknown as import('vitest').Mock).mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'mock-session' }),
    });
  });

  // Helper to create a mock NextRequest-like object for testing
  interface MockRequest {
    json: () => Promise<object>;
  }

  const mockRequest = (body: object): MockRequest => ({
    json: async () => body,
  });

  it('returns 400 if bookingId or cancelMessage are invalid', async () => {
    const invalidRequests = [
      {},
      { bookingId: '' },
      { cancelMessage: '' },
      { bookingId: 123, cancelMessage: 'text' },
      { bookingId: 'id', cancelMessage: '' },
    ];

    for (const body of invalidRequests) {
      const res = await POST(mockRequest(body) as unknown as import('next/server').NextRequest);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toBe('Booking ID and a cancellation message are required.');
    }
  });

  it('successfully cancels booking and inserts cancel message', async () => {
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });

    const res = await POST(
      mockRequest({ bookingId: 'abc123', cancelMessage: 'Need to cancel' }) as unknown as import('next/server').NextRequest
    );

    expect(mockUpdate).toHaveBeenCalledWith({ status: 'cancelled' });
    expect(mockEq).toHaveBeenCalledWith('booking_uuid', 'abc123');

    expect(mockInsert).toHaveBeenCalledWith({
      booking_uuid: 'abc123',
      message: 'Need to cancel',
      date_submitted: expect.any(String),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe('Booking cancelled successfully.');
  });

  it('handles update error', async () => {
    mockEq.mockResolvedValue({ error: { message: 'Update failed' } });

    const res = await POST(mockRequest({ bookingId: 'abc123', cancelMessage: 'Canceling' }) as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe('Failed to update booking status.');
  });

  it('handles insert error', async () => {
    mockEq.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: { message: 'Insert failed' } });

    const res = await POST(mockRequest({ bookingId: 'abc123', cancelMessage: 'Canceling' }) as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe('Failed to save cancellation message.');
  });

  it('handles unexpected errors', async () => {
    mockUpdate.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const res = await POST(mockRequest({ bookingId: 'abc123', cancelMessage: 'Canceling' }) as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe('An unexpected error occurred.');
  });
});
