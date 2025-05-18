import { Detail } from "./serviceTypes";

export type BasicGroomingCardProps = {
    details: {
        title: string;
        inclusions: string[];
        prices: Detail[] | { allSizes: number };
        note?: string;
    } | null;
};

export type DeluxeGroomingCardProps = {
    details: {
        title: string;
        inclusions: string[];
        prices: Detail[] | { allSizes: number };
        note?: string;
    } | null;
};

export type CatGroomingCardProps = {
    details: {
        title: string;
        inclusions: string[];
        prices: { allSizes: number } | Detail[];
        note?: string;
    } | null;
};