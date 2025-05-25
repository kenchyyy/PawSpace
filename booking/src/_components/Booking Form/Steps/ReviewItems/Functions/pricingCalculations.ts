import {
  PetType,
  GroomingVariant,
  BoardingPet,
  BoardingType,
  RoomSize,
  pricing,
  calculateNights,
  parseDate,
  isSameDay
} from "../../../types";

export type PriceDetails = {
  basePrice: number;
  total: number;
  discount: number;
  nights?: number;
  hours?: number;
  boarding_type?: BoardingType;
  surcharge: number;
};

export const getGroomingPrice = (
  petType: PetType,
  variant: GroomingVariant,
  size?: string
): number => {
  if (petType === "cat") {
    return pricing.grooming.cat.cat;
  } else if (petType === "dog" && variant === "basic" && size) {
    return (
      pricing.grooming.dog.basic[size as keyof typeof pricing.grooming.dog.basic] || 0
    );
  } else if (petType === "dog" && variant === "deluxe" && size) {
    return (
      pricing.grooming.dog.deluxe[size as keyof typeof pricing.grooming.dog.deluxe] || 0
    );
  }
  return 0;
};

export const getBoardingPrice = (boardingPet: BoardingPet): PriceDetails => {
  const checkInDateTime = parseDate(boardingPet.check_in_date);
  const checkOutDateTime = parseDate(boardingPet.check_out_date);

  if (checkInDateTime && boardingPet.check_in_time) {
    const [hours, minutes] = boardingPet.check_in_time.split(':').map(Number);
    checkInDateTime.setHours(hours, minutes, 0, 0);
  }
  if (checkOutDateTime && boardingPet.check_out_time) {
    const [hours, minutes] = boardingPet.check_out_time.split(':').map(Number);
    checkOutDateTime.setHours(hours, minutes, 0, 0);
  }

  let nights = 0;
  let hoursCalculated = 0;

  if (boardingPet.boarding_type === "overnight" && checkInDateTime && checkOutDateTime) {
    if (checkOutDateTime.getTime() > checkInDateTime.getTime()) {
        if (isSameDay(checkInDateTime, checkOutDateTime)) {
            nights = 0;
        } else {
            nights = calculateNights(checkInDateTime, checkOutDateTime);
        }
    }
  }

  let basePrice = 0;
  let discount = 0;
  let surcharge = 0;

  if (boardingPet.boarding_type === "day" && boardingPet.room_size) {
    const checkInHour = parseInt(boardingPet.check_in_time.split(":")[0], 10);
    const checkOutHour = parseInt(boardingPet.check_out_time.split(":")[0], 10);

    if (!isNaN(checkInHour) && !isNaN(checkOutHour)) {
      hoursCalculated = checkOutHour - checkInHour;
      hoursCalculated = Math.max(0, hoursCalculated);

      const hourlyRate =
        pricing.boarding.day[
          boardingPet.room_size as keyof typeof pricing.boarding.day
        ];
      if (hourlyRate !== undefined) {
        basePrice = hourlyRate * hoursCalculated;
      }
    }
  } else if (boardingPet.boarding_type === "overnight" && boardingPet.room_size) {
    basePrice =
      pricing.boarding.overnight[
        boardingPet.room_size as keyof typeof pricing.boarding.overnight
      ] * nights;

    if (nights >= 15) {
      discount = 20;
    } else if (nights >= 7) {
      discount = 10;
    }
  }

  const checkInTimeHour = boardingPet.check_in_time ? parseInt(boardingPet.check_in_time.split(":")[0], 10) : null;
  const checkOutTimeHour = boardingPet.check_out_time ? parseInt(boardingPet.check_out_time.split(":")[0], 10) : null;

  if (checkInTimeHour !== null && checkInTimeHour < 9) {
    surcharge += 200;
  }

  if (checkOutTimeHour !== null && checkOutTimeHour > 19) {
    surcharge += 200;
  }

  const total = (basePrice * (1 - discount / 100)) + surcharge;

  return {
    basePrice,
    total,
    discount,
    nights: nights,
    hours: hoursCalculated,
    boarding_type: boardingPet.boarding_type,
    surcharge,
  };
};