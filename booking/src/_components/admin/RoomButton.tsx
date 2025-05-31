import { RoomData } from "../serverSide/FetchRoomData";
import { PetSummary } from "./PetRoomAssignment";

interface RoomButtonProps {
  room: RoomData;
  isSelected: boolean;
  onSelect: (room: { name: string; id: string }) => void;
  petsInRoom: PetSummary[];
  loadingPets: boolean;
  errorPets: string | null;
}

export const RoomButton: React.FC<RoomButtonProps> = ({
  room,
  isSelected,
  onSelect,
  petsInRoom,
  loadingPets,
  errorPets,
}) => (
  <div>
    <button
      aria-pressed={isSelected}
      className={`w-full p-3 rounded-lg transition-all text-left ${
        isSelected
          ? "bg-orange-500 text-white shadow-md"
          : "bg-purple-600 hover:bg-purple-700 hover:shadow-md text-white"
      }`}
      onClick={() => onSelect({ name: room.roomName, id: String(room.id) })}
    >
      {room.roomName}
    </button>
    <div className="mt-1 ml-2 text-xs text-purple-200 min-h-[3rem]">
      {loadingPets && <div>Loading pets...</div>}
      {errorPets && <div className="text-red-400">{errorPets}</div>}
      {!loadingPets && !errorPets && petsInRoom.length === 0 && (
        <div className="italic text-purple-400">No pets scheduled</div>
      )}
      {!loadingPets && !errorPets && petsInRoom.length > 0 && (
        <ul className="list-disc list-inside space-y-0.5">
          {petsInRoom.map((pet) => (
            <li key={pet.petUuid} className="relative group">
              <span
                className="font-semibold cursor-help underline decoration-dotted"
              >
                {pet.name}
              </span>

              {/* Custom tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded-md bg-gray-900 text-white text-xs p-2
                           opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                           transition-opacity whitespace-pre-line z-50 shadow-lg"
              >
                {`Check-in: ${pet.checkInDate || "?"}\nCheck-out: ${pet.checkOutDate || "?"}`}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
