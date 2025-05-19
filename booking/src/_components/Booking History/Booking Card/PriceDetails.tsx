import React from 'react';
import { ServiceType } from '../../Booking Form/types';

interface PriceDetailsProps {
  totalAmount: number;
  discountApplied: number;
  serviceType: ServiceType;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  totalAmount,
  discountApplied,
  serviceType
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">Price Details</h3>
      <div className="border-t border-gray-200 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Service Type</span>
          <span className="text-gray-900 capitalize">{serviceType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Base Amount</span>
          <span className="text-gray-900">₱{totalAmount}</span>
        </div>
        {discountApplied > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Discount Applied</span>
            <span className="text-green-600">-₱{discountApplied}</span>
          </div>
        )}
        <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
          <span>Total Amount</span>
          <span>₱{totalAmount - (discountApplied || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;