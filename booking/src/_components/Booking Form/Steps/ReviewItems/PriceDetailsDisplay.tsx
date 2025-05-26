import React from "react";
import { ServiceType } from "../../types";
import { PriceDetails } from "./Functions/pricingCalculations";

interface PriceDetailsDisplayProps {
    priceDetails: PriceDetails;
    isBoarding: boolean;
    surchargeAmount?: number;
    surchargeNote?: string;
}

const PriceDetailsDisplay: React.FC<PriceDetailsDisplayProps> = ({
    priceDetails,
    isBoarding,
    surchargeAmount = 0,
    surchargeNote,
}) => {
    const discountAmount = priceDetails.basePrice * (priceDetails.discount / 100);
    const subtotalBeforeDiscount = priceDetails.basePrice + surchargeAmount;

    return (
        <div className="bg-gray-100 p-5 rounded-lg shadow-md border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-4 text-lg border-b pb-3">
                Booking Price Summary
            </h5>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-700 text-sm">
                        {isBoarding
                            ? priceDetails.boarding_type === "overnight"
                                ? `Overnight Boarding (${priceDetails.nights} night${
                                      priceDetails.nights !== 1 ? "s" : ""
                                  })`
                                : `Day Boarding (${priceDetails.hours} hour${
                                      priceDetails.hours !== 1 ? "s" : ""
                                  })`
                            : "Grooming Service Base Price"}
                    </p>
                    <p className="font-medium text-gray-900 text-base">
                        ₱{priceDetails.basePrice.toFixed(2)}
                    </p>
                </div>

                {isBoarding && surchargeAmount > 0 && (
                    <>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-gray-700 text-sm flex items-center">
                                Early/Late Check-in/out Surcharge
                                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                    +₱{surchargeAmount.toFixed(2)}
                                </span>
                            </p>
                            <p className="font-medium text-gray-900 text-base">
                                ₱{surchargeAmount.toFixed(2)}
                            </p>
                        </div>
                        {/* Subtotal only displayed if there's a surcharge */}
                        <div className="flex justify-between items-center border-t border-gray-200 mt-3 pt-3 mb-2">
                            <p className="text-gray-700 font-semibold text-base">Subtotal</p>
                            <p className="font-bold text-gray-900 text-lg">
                                ₱{subtotalBeforeDiscount.toFixed(2)}
                            </p>
                        </div>
                    </>
                )}

                {priceDetails.discount > 0 && (
                    <>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-gray-700 text-sm flex items-center">
                                Discount Applied
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    {priceDetails.discount}% OFF
                                </span>
                            </p>
                            <p className="font-medium text-green-600 text-base">
                                -₱{discountAmount.toFixed(2)}
                            </p>
                        </div>
                        <p className="text-xs text-gray-600 text-right mb-2 leading-tight">
                            (Reduced from base price)
                        </p>
                    </>
                )}

                <div className="border-t-2 border-purple-300 mt-4 pt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-purple-700">Amount to Pay</p>
                    <p className="text-2xl font-bold text-purple-700">
                        ₱{priceDetails.total.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceDetailsDisplay;