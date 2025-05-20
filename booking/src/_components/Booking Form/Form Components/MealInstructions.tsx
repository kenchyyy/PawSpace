import React from 'react';
import { BoardingPet } from '../types';
import { FiCoffee, FiSun, FiMoon } from 'react-icons/fi';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

interface MealInstructionsProps {
    pet: BoardingPet;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors?: Record<string, string>;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

const MealInstructions: React.FC<MealInstructionsProps> = ({ pet, onChange, errors = {} }) => {
    const getError = (fieldName: string) => errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300';

    const handleTimeChange = (time: string | null, meal: MealType) => {
        const event = {
            target: {
                name: `meal_instructions.${meal}.time`,
                value: time || '',
                type: 'text' // Add type to match HTMLInputElement
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Create a proper event object for nested structure
        const event = {
            target: {
                ...e.target,
                name,
                value
            }
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        
        onChange(event);
    };

    const getMealIcon = (meal: MealType) => {
        switch(meal) {
            case 'breakfast': return <FiCoffee className="mr-1" />;
            case 'lunch': return <FiSun className="mr-1" />;
            case 'dinner': return <FiMoon className="mr-1" />;
            default: return <FiCoffee className="mr-1" />;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="font-medium text-gray-800 text-lg">Meal Instructions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(pet.meal_instructions) as MealType[]).map(meal => (
                    <div key={meal} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize flex items-center">
                            {getMealIcon(meal)} {meal}
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Time</label>
                                <TimePicker
                                    onChange={(time) => handleTimeChange(time, meal)}
                                    value={pet.meal_instructions[meal].time || ''}
                                    className={`w-full rounded ${getError(`meal_instructions.${meal}.time`)}`}
                                    clearIcon={null}
                                    disableClock={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Food</label>
                                <input
                                    name={`meal_instructions.${meal}.food`}
                                    value={pet.meal_instructions[meal].food || ''}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded ${getError(`meal_instructions.${meal}.food`)}`}
                                    placeholder="What to feed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                                <textarea
                                    name={`meal_instructions.${meal}.notes`}
                                    value={pet.meal_instructions[meal].notes || ''}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded ${getError(`meal_instructions.${meal}.notes`)}`}
                                    placeholder="Special instructions"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealInstructions;