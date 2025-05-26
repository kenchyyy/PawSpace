// components/OwnerDetails.tsx
import React from 'react';
import { OwnerDetails as OwnerDetailsType } from './types/bookingRecordType';

interface OwnerDetailsProps {
    ownerDetails: OwnerDetailsType | undefined;
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ ownerDetails }) => {
    if (!ownerDetails) return null;

    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';

    return (
        <div className="flex flex-col">
            <h4 className={`${accent} text-lg font-semibold mb-2`}>Owner Details</h4>
            <div className="p-3 rounded-md bg-purple-800 flex-grow">
                <p className={`${textSecondary} text-sm`}>Name: <span className={textPrimary}>{ownerDetails.name}</span></p>
                <p className={`${textSecondary} text-sm`}>Address: <span className={textPrimary}>{ownerDetails.address}</span></p>
                <p className={`${textSecondary} text-sm`}>Contact: <span className={textPrimary}>{ownerDetails.contact_number}</span></p>
                <p className={`${textSecondary} text-sm`}>Email: <span className={textPrimary}>{ownerDetails.email}</span></p>
            </div>
        </div>
    );
};

export default OwnerDetails;