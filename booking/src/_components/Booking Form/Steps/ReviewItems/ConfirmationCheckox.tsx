import React, { useState } from "react";
import PoliciesModal from "@/_components/Services/PoliciesModal";
import { policyContent } from "@/_components/Services/data/policyData";
import { ServiceType } from "../../types";

interface ConfirmationCheckboxProps {
  confirmedInfo: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  errors?: Record<string, string>;
  policyContent: typeof policyContent;
  serviceType: ServiceType;
}

const ConfirmationCheckbox: React.FC<ConfirmationCheckboxProps> = ({
  confirmedInfo,
  onConfirmChange,
  errors,
  policyContent,
  serviceType,
}) => {
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);

  const handleOpenPoliciesModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPoliciesModalOpen(true);
  };

  const handleClosePoliciesModal = () => {
    setIsPoliciesModalOpen(false);
  };

  const selectedPolicy = policyContent[serviceType];
  const policyTitle = `${selectedPolicy.title}`;
  const policyContentText = selectedPolicy.content;

  return (
    <div className="ml-0 md:ml-8 mb-6 mt-4">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={confirmedInfo}
          onChange={(e) => onConfirmChange(e.target.checked)}
          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0 mt-1"
        />
        <span className="text-sm text-gray-700 leading-tight">
          I confirm that all information provided is accurate. I have read and agree to the Pawspace's{" "}
          <button
            type="button"
            onClick={handleOpenPoliciesModal}
            className="text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {policyTitle}.
          </button>
        </span>
      </label>
      {errors?.confirmation && !confirmedInfo && (
        <p className="text-red-500 text-xs mt-1 ml-6">
          {errors.confirmation}
        </p>
      )}

      <PoliciesModal
        isOpen={isPoliciesModalOpen}
        onClose={handleClosePoliciesModal}
        title={policyTitle}
        content={policyContentText}
      />
    </div>
  );
};

export default ConfirmationCheckbox;