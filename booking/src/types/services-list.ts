export type RoomSize = 'small' | 'medium' | 'large';

export type PetService = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'PHP';
  category: 'accommodation' | 'grooming';
  roomSize?: RoomSize; // this is only for accommodation
  duration: string;
};