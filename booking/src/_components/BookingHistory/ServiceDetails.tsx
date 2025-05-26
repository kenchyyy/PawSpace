// components/ServiceDetails.tsx
import React from 'react';
import { Pet } from './types/bookingRecordType';

interface ServiceDetailsProps {
    cancellationReason: string | undefined;
    pets: Pet[] | undefined;
    specialRequests: string | undefined;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ cancellationReason, pets, specialRequests }) => {
    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';

    return (
        <div className="flex flex-col">
            <h4 className={`${accent} text-lg font-semibold mb-2`}>Service Details</h4>
            <div className='p-3 rounded-md bg-purple-800 flex-grow'>
                {cancellationReason && (
                    <p className={`${textSecondary} text-sm`}>Cancellation Reason: <span className={textPrimary}>{cancellationReason}</span></p>
                )}
                
                {pets && pets.map((pet) => (
                    <React.Fragment key={`service-${pet.pet_uuid}`}>
                        {pet.groom_service?.service_variant && (
                            <p className={`${textSecondary} text-sm`}>Grooming: <span className={textPrimary}>{pet.groom_service.service_variant}</span></p>
                        )}
                        {pet.boarding_pet && (
                            <>
                                <p className={`${textSecondary} text-sm`}>Boarding: <span className={textPrimary}>
                                    {pet.boarding_pet.boarding_type === 'overnight'
                                        ? 'Overnight'
                                        : pet.boarding_pet.boarding_type === 'day'
                                        ? 'Day'
                                        : pet.boarding_pet.boarding_type || 'N/A'}
                                </span></p>
                                <p className={`${textSecondary} text-sm`}>Room: <span className={textPrimary}>{pet.boarding_pet.room_size || 'N/A'}</span></p>
                            </>
                        )}
                    </React.Fragment>
                ))}
                <p className={`${textSecondary} text-sm`}>Special Requests: <span className={textPrimary}>{specialRequests || 'No special requests'}</span></p>
            </div>
        </div>
    );
};

export default ServiceDetails;