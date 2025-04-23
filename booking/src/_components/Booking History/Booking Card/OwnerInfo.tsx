import React from 'react';
import { OwnerDetails } from '../../Booking Form/types';

interface OwnerInfoProps {
  ownerDetails: OwnerDetails;
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({ ownerDetails }) => {
  return (
    <div className="md:col-span-2 border-t pt-4 mt-2">
      <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-gray-900">{ownerDetails.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Contact</p>
          <p className="text-gray-900">{ownerDetails.contactNumber}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-gray-900">{ownerDetails.address}</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;