export type Detail = {
    size?: string;
    price: number;
    weightRange?: string;
};
  
export type ServiceDetails = {
    title: string;
    type: "grooming" | "overnight";
    inclusions: string[];
    prices: { size?: string; price: number; weightRange?: string }[] | { allSizes: number };
    note?: string;
};
  
export type Props = {
    isOpen: boolean;
    onClose: () => void;
    details: ServiceDetails | null;
    onClick: (category: 'boarding' | 'grooming') => void;
};

export type GroomingServicesSectionProps = {
    setSelectedService: (serviceKey: string) => void;
};

export type OvernightServicesSectionProps = {
    setSelectedService: (serviceKey: string) => void;
};

export type SpecialOffersProps = {
    offers: string[];
}

type Service = {
    label: string;
    icon: string;
    bgColor: string;
    glow?: boolean;
    onClick?: () => void;
};

export type ServiceSectionProps = {
    title: string;
    services: Service[];
    columns?: number;
};

export type ServiceCardProps = {
    label: string;
    icon: string;
    bgColor: string;
    onClick?: () => void;
};

export type PriceTableProps = {
    prices: Detail[] | {allSizes: number};
    type: "grooming" | "overnight";
}

export type InclusionProps = {
    inclusions: string[];
}
