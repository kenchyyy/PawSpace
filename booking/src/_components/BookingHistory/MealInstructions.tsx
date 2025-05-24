// components/MealInstructions.tsx
import React from 'react';
import { Pet, MealInstructionType } from './types/bookingRecordType';
import { format } from 'date-fns';

interface MealInstructionsProps {
    pets: Pet[] | undefined;
}

const MealInstructions: React.FC<MealInstructionsProps> = ({ pets }) => {
    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';


    const petsWithMealInstructions = pets?.filter(
        pet => pet.boarding_pet && pet.boarding_pet.meal_instructions && pet.boarding_pet.meal_instructions.length > 0
    );

    if (!petsWithMealInstructions || petsWithMealInstructions.length === 0) return null;

    return (
        <div className="mt-4 flex flex-col">
            <h4 className={`${accent} text-lg font-semibold mb-2`}>Meal Instructions</h4>
            <div className="p-3 rounded-md bg-purple-800">
                {petsWithMealInstructions.map(pet => {

                    const mealInstructionsByPet: {
                        breakfast: MealInstructionType[],
                        lunch: MealInstructionType[],
                        dinner: MealInstructionType[],
                        other: MealInstructionType[]
                    } = {
                        breakfast: [],
                        lunch: [],
                        dinner: [],
                        other: []
                    };

                    pet.boarding_pet?.meal_instructions?.forEach(instruction => {
                        const mealType = instruction.meal_type?.toLowerCase();
                        if (mealType === 'breakfast') {
                            mealInstructionsByPet.breakfast.push(instruction);
                        } else if (mealType === 'lunch') {
                            mealInstructionsByPet.lunch.push(instruction);
                        } else if (mealType === 'dinner') {
                            mealInstructionsByPet.dinner.push(instruction);
                        } else {
                            mealInstructionsByPet.other.push(instruction);
                        }
                    });

                    return (
                        <div key={`meal-instructions-${pet.pet_uuid}`} className="mb-4 last:mb-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div className="flex flex-col">
                                    <h5 className={`${accent} text-md font-semibold mb-1`}>Breakfast</h5>
                                    {mealInstructionsByPet.breakfast.length > 0 ? (
                                        mealInstructionsByPet.breakfast.map((instruction, idx) => {
                                            let formattedMealTime = instruction.time || 'N/A';
                                            if (instruction.time) {
                                                try {
                                                    formattedMealTime = format(new Date(`2000-01-01T${instruction.time}`), 'h:mm a');
                                                } catch {
                                                    formattedMealTime = instruction.time;
                                                }
                                            }
                                            return (
                                                <div key={instruction.id || idx} className="ml-2 border-l-2 border-purple-700 pl-2 mb-1">
                                                    <p className={`${textSecondary} text-xs`}>Time: <span className={textPrimary}>{formattedMealTime}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Food: <span className={textPrimary}>{instruction.food || 'N/A'}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Notes: <span className={textPrimary}>{instruction.notes || 'None'}</span></p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className={`${textSecondary} text-xs italic`}>No breakfast instructions.</p>
                                    )}
                                </div>


                                <div className="flex flex-col">
                                    <h5 className={`${accent} text-md font-semibold mb-1`}>Lunch</h5>
                                    {mealInstructionsByPet.lunch.length > 0 ? (
                                        mealInstructionsByPet.lunch.map((instruction, idx) => {
                                            let formattedMealTime = instruction.time || 'N/A';
                                            if (instruction.time) {
                                                try {
                                                    formattedMealTime = format(new Date(`2000-01-01T${instruction.time}`), 'h:mm a');
                                                } catch {
                                                    formattedMealTime = instruction.time;
                                                }
                                            }
                                            return (
                                                <div key={instruction.id || idx} className="ml-2 border-l-2 border-purple-700 pl-2 mb-1">
                                                    <p className={`${textSecondary} text-xs`}>Time: <span className={textPrimary}>{formattedMealTime}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Food: <span className={textPrimary}>{instruction.food || 'N/A'}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Notes: <span className={textPrimary}>{instruction.notes || 'None'}</span></p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className={`${textSecondary} text-xs italic`}>No lunch instructions.</p>
                                    )}
                                </div>


                                <div className="flex flex-col">
                                    <h5 className={`${accent} text-md font-semibold mb-1`}>Dinner</h5>
                                    {mealInstructionsByPet.dinner.length > 0 ? (
                                        mealInstructionsByPet.dinner.map((instruction, idx) => {
                                            let formattedMealTime = instruction.time || 'N/A';
                                            if (instruction.time) {
                                                try {
                                                    formattedMealTime = format(new Date(`2000-01-01T${instruction.time}`), 'h:mm a');
                                                } catch {
                                                    formattedMealTime = instruction.time;
                                                }
                                            }
                                            return (
                                                <div key={instruction.id || idx} className="ml-2 border-l-2 border-purple-700 pl-2 mb-1">
                                                    <p className={`${textSecondary} text-xs`}>Time: <span className={textPrimary}>{formattedMealTime}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Food: <span className={textPrimary}>{instruction.food || 'N/A'}</span></p>
                                                    <p className={`${textSecondary} text-xs`}>Notes: <span className={textPrimary}>{instruction.notes || 'None'}</span></p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className={`${textSecondary} text-xs italic`}>No dinner instructions.</p>
                                    )}
                                </div>
                            </div>

                            {mealInstructionsByPet.other.length > 0 && (
                                <div className="mt-2">
                                    <h5 className={`${accent} text-md font-semibold mb-1`}>Other Meals</h5>
                                    {mealInstructionsByPet.other.map((instruction, idx) => {
                                        let formattedMealTime = instruction.time || 'N/A';
                                        if (instruction.time) {
                                            try {
                                                formattedMealTime = format(new Date(`2000-01-01T${instruction.time}`), 'h:mm a');
                                            } catch {
                                                formattedMealTime = instruction.time;
                                            }
                                        }
                                        return (
                                            <div key={instruction.id || idx} className="ml-2 border-l-2 border-purple-700 pl-2 mb-1">
                                                <p className={`${textSecondary} text-xs`}>Meal Type: <span className={textPrimary}>{instruction.meal_type || 'N/A'}</span></p>
                                                <p className={`${textSecondary} text-xs`}>Time: <span className={textPrimary}>{formattedMealTime}</span></p>
                                                <p className={`${textSecondary} text-xs`}>Food: <span className={textPrimary}>{instruction.food || 'N/A'}</span></p>
                                                <p className={`${textSecondary} text-xs`}>Notes: <span className={textPrimary}>{instruction.notes || 'None'}</span></p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MealInstructions;