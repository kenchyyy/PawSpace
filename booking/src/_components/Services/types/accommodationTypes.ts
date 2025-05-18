import { Detail } from "./serviceTypes";

export type CatAccommodationCardProps = {
    details: {
        title: string;
        inclusions: string[];
        prices: Detail[] | { allSizes: number };
        note?: string;
    } | null;
};

export type DogAccommodationCardProps = {
    details: {
        title: string;
        inclusions: string[];
        prices: Detail[] | { allSizes: number };
        note?: string;
    } | null;
};

export type DayboardingInfoProps = {
    title: string;
};