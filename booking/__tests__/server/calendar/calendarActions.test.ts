import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchBookings } from "@/app/api/calendar/CalendarActions";

// Mock the Supabase client
const mockSupabaseClient = {
  from: vi.fn(),
};

const mockSelect = vi.fn();
const mockNeq = vi.fn();
const mockOrder = vi.fn();
const mockIn = vi.fn();


vi.mock("@/lib/supabase/CreateClientSideClient", () => ({
  createClientSideClient: vi.fn(() => mockSupabaseClient),
}));

describe("fetchBookings", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Set up the default mock chain
    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    });

    mockSelect.mockReturnValue({
      neq: mockNeq,
    });

    mockNeq.mockReturnValue({
      order: mockOrder,
    });

    mockOrder.mockReturnValue({
      data: [],
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful scenarios", () => {
    it("should return empty array when no bookings exist", async () => {
      mockOrder.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("Booking");
    });

    it("should handle booking with grooming service only", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-1",
          status: "confirmed",
          owner_details: {
            name: "John Doe",
            contact_number: "123-456-7890",
          },
          pet_uuid: [
            {
              name: "Fluffy",
              pet_type: "cat",
              breed: "Persian",
              GroomingPet: {
                id: "grooming-1",
                service_date: "2024-02-15",
                service_time: "10:00:00",
              },
            },
          ],
          special_requests: "Handle with care",
          total_amount: 100.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "booking-1",
        title: "Fluffy - John Doe",
        allDay: false,
        extendedProps: {
          bookingId: "booking-1",
          ownerName: "John Doe",
          contactNumber: "123-456-7890",
          status: "confirmed",
          specialRequests: "Handle with care",
          totalAmount: 100.0,
          serviceType: "Grooming",
          pets: [
            {
              petName: "Fluffy",
              petBreed: "Persian",
              petType: "cat",
              mealInstructions: null,
            },
          ],
        },
      });
    });

    it("should handle booking with boarding service and meal instructions", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-2",
          status: "confirmed",
          owner_details: {
            name: "Jane Smith",
            contact_number: "987-654-3210",
          },
          pet_uuid: [
            {
              name: "Rex",
              pet_type: "dog",
              breed: "Golden Retriever",
              BoardingPet: {
                id: "boarding-1",
                check_in_date: "2024-02-20",
                check_in_time: "09:00:00",
                check_out_date: "2024-02-22",
                check_out_time: "17:00:00",
              },
            },
          ],
          special_requests: "Needs medication",
          total_amount: 200.0,
        },
      ];

      const mockMealInstructions = [
        {
          food: "Premium dog food",
          notes: "Twice daily",
          meal_type: "breakfast",
          time: "08:00:00",
          boarding_pet_meal_instructions: "boarding-1",
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      // Mock the meal instructions query
      const mockMealSelect = vi.fn();
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === "Booking") {
          return { select: mockSelect };
        } else if (table === "MealInstructions") {
          return { select: mockMealSelect };
        }
      });

      mockMealSelect.mockReturnValue({
        in: mockIn,
      });

      mockIn.mockResolvedValue({
        data: mockMealInstructions,
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0].extendedProps.serviceType).toBe("Boarding");
      expect(result[0].extendedProps.pets[0].mealInstructions).toEqual({
        food: "Premium dog food",
        notes: "Twice daily",
        mealType: "breakfast",
        time: "08:00:00",
      });
    });

    it("should handle booking with both boarding and grooming services", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-3",
          status: "confirmed",
          owner_details: {
            name: "Bob Wilson",
            contact_number: "555-123-4567",
          },
          pet_uuid: [
            {
              name: "Buddy",
              pet_type: "dog",
              breed: "Labrador",
              BoardingPet: {
                id: "boarding-2",
                check_in_date: "2024-02-25",
                check_in_time: "08:00:00",
                check_out_date: "2024-02-27",
                check_out_time: "18:00:00",
              },
              GroomingPet: {
                id: "grooming-2",
                service_date: "2024-02-26",
                service_time: "14:00:00",
              },
            },
          ],
          special_requests: "",
          total_amount: 300.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      // Mock empty meal instructions
      const mockMealSelect = vi.fn();
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === "Booking") {
          return { select: mockSelect };
        } else if (table === "MealInstructions") {
          return { select: mockMealSelect };
        }
      });

      mockMealSelect.mockReturnValue({
        in: mockIn,
      });

      mockIn.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0].extendedProps.serviceType).toBe("Boarding, Grooming");
    });

    it("should handle multiple pets in one booking", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-4",
          status: "confirmed",
          owner_details: {
            name: "Alice Brown",
            contact_number: "444-555-6666",
          },
          pet_uuid: [
            {
              name: "Cat1",
              pet_type: "cat",
              breed: "Siamese",
              GroomingPet: {
                id: "grooming-3",
                service_date: "2024-03-01",
                service_time: "10:00:00",
              },
            },
            {
              name: "Cat2",
              pet_type: "cat",
              breed: "Maine Coon",
              GroomingPet: {
                id: "grooming-4",
                service_date: "2024-03-01",
                service_time: "11:00:00",
              },
            },
          ],
          special_requests: "Both cats are nervous",
          total_amount: 150.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Cat1, Cat2 - Alice Brown");
      expect(result[0].extendedProps.pets).toHaveLength(2);
    });
  });

  describe("error scenarios", () => {
    it("should handle Supabase booking fetch error", async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Supabase error fetching bookings:",
        { message: "Database connection failed" }
      );

      consoleSpy.mockRestore();
    });

    it("should handle meal instructions fetch error", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-5",
          status: "confirmed",
          owner_details: {
            name: "Test Owner",
            contact_number: "123-123-1234",
          },
          pet_uuid: [
            {
              name: "TestPet",
              pet_type: "dog",
              breed: "Test Breed",
              BoardingPet: {
                id: "boarding-3",
                check_in_date: "2024-03-01",
                check_in_time: "10:00:00",
                check_out_date: "2024-03-02",
                check_out_time: "10:00:00",
              },
            },
          ],
          special_requests: "",
          total_amount: 100.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      // Mock meal instructions error
      const mockMealSelect = vi.fn();
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === "Booking") {
          return { select: mockSelect };
        } else if (table === "MealInstructions") {
          return { select: mockMealSelect };
        }
      });

      mockMealSelect.mockReturnValue({
        in: mockIn,
      });

      mockIn.mockResolvedValue({
        data: null,
        error: { message: "Meal instructions fetch failed" },
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Supabase error fetching meal instructions:",
        { message: "Meal instructions fetch failed" }
      );

      consoleSpy.mockRestore();
    });

    it("should handle unexpected errors gracefully", async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "CRITICAL ERROR in fetchBookings:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("edge cases and data validation", () => {
    it("should skip bookings with missing owner details", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-6",
          status: "confirmed",
          owner_details: null,
          pet_uuid: [
            {
              name: "TestPet",
              pet_type: "dog",
              breed: "Test Breed",
            },
          ],
          special_requests: "",
          total_amount: 100.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should skip bookings with no pets", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-7",
          status: "confirmed",
          owner_details: {
            name: "Test Owner",
            contact_number: "123-123-1234",
          },
          pet_uuid: [],
          special_requests: "",
          total_amount: 100.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should handle invalid date/time strings", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-8",
          status: "confirmed",
          owner_details: {
            name: "Test Owner",
            contact_number: "123-123-1234",
          },
          pet_uuid: [
            {
              name: "TestPet",
              pet_type: "dog",
              breed: "Test Breed",
              BoardingPet: {
                id: "boarding-4",
                check_in_date: "invalid-date",
                check_in_time: "invalid-time",
                check_out_date: "invalid-date-2",
                check_out_time: "invalid-time-2",
              },
            },
          ],
          special_requests: "",
          total_amount: 100.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      // Mock empty meal instructions since we have a boarding pet
      const mockMealSelect = vi.fn();
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === "Booking") {
          return { select: mockSelect };
        } else if (table === "MealInstructions") {
          return { select: mockMealSelect };
        }
      });

      mockMealSelect.mockReturnValue({
        in: mockIn,
      });

      mockIn.mockResolvedValue({
        data: [],
        error: null,
      });

      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should handle null booking data", async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: null,
      });

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      const result = await fetchBookings();

      expect(result).toEqual([]);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "No bookings found in Supabase."
      );

      consoleLogSpy.mockRestore();
    });

    it("should handle single pet object instead of array", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-9",
          status: "confirmed",
          owner_details: {
            name: "Single Pet Owner",
            contact_number: "999-888-7777",
          },
          pet_uuid: {
            name: "SinglePet",
            pet_type: "cat",
            breed: "Persian",
            GroomingPet: {
              id: "grooming-5",
              service_date: "2024-03-05",
              service_time: "15:00:00",
            },
          },
          special_requests: "",
          total_amount: 75.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("SinglePet - Single Pet Owner");
      expect(result[0].extendedProps.pets).toHaveLength(1);
    });

    it("should handle owner details as array instead of object", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-10",
          status: "confirmed",
          owner_details: [
            {
              name: "Array Owner",
              contact_number: "111-222-3333",
            },
          ],
          pet_uuid: [
            {
              name: "ArrayPet",
              pet_type: "dog",
              breed: "Beagle",
              GroomingPet: {
                id: "grooming-6",
                service_date: "2024-03-06",
                service_time: "12:00:00",
              },
            },
          ],
          special_requests: "",
          total_amount: 85.0,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const result = await fetchBookings();

      expect(result).toHaveLength(1);
      expect(result[0].extendedProps.ownerName).toBe("Array Owner");
    });
  });

  describe("database query validation", () => {
    it("should call Supabase with correct query parameters", async () => {
      await fetchBookings();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("Booking");
      expect(mockSelect).toHaveBeenCalledWith(
        expect.stringContaining("booking_uuid")
      );
      expect(mockNeq).toHaveBeenCalledWith("status", "pending");
      expect(mockOrder).toHaveBeenCalledWith("booking_uuid", {
        ascending: true,
      });
    });

    it("should query meal instructions when boarding pets exist", async () => {
      const mockBookings = [
        {
          booking_uuid: "booking-11",
          status: "confirmed",
          owner_details: { name: "Test", contact_number: "123" },
          pet_uuid: [
            {
              name: "TestPet",
              pet_type: "dog",
              breed: "Test",
              BoardingPet: {
                id: "boarding-5",
                check_in_date: "2024-03-01",
                check_in_time: "10:00:00",
                check_out_date: "2024-03-02",
                check_out_time: "10:00:00",
              },
            },
          ],
          special_requests: "",
          total_amount: 100,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockBookings,
        error: null,
      });

      const mockMealSelect = vi.fn();
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === "Booking") {
          return { select: mockSelect };
        } else if (table === "MealInstructions") {
          return { select: mockMealSelect };
        }
      });

      mockMealSelect.mockReturnValue({
        in: mockIn,
      });

      mockIn.mockResolvedValue({
        data: [],
        error: null,
      });

      await fetchBookings();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("MealInstructions");
      expect(mockMealSelect).toHaveBeenCalledWith(
        "food, notes, meal_type, time, boarding_pet_meal_instructions"
      );
      expect(mockIn).toHaveBeenCalledWith("boarding_pet_meal_instructions", [
        "boarding-5",
      ]);
    });
  });
});
