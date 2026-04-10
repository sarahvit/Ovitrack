"use client";

import axios from "axios";
import { indicadoresClient } from "@/lib/api/clientIndicators";

type WeeklyIndicator = {
    week: number;
    notified_cases: number;
    confirmed_cases: number;
    confirmation_rate: number;
};

export type WeeklyCasesPoint = {
    week: number;
    confirmed_cases: number;
};

export type IndicadoresEpi = {
    notified_cases: number;
    confirmed_cases: number;
    confirmation_rate: number;
};

export type TimeFiltersResponse = {
    min_year: number;
    max_year: number;
    max_month: number;
    max_week: number;
};

type ApiResponse<T> = {
    items: T;
    error: string | null;
};

function unwrapResponse<T>(data: ApiResponse<T> | undefined | null): T {
    if (!data) {
        throw new Error("EMPTY_RESPONSE");
    }

    if (data.error) {
        throw new Error(data.error);
    }

    return data.items;
}

function logAxiosError(prefix: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.log(prefix);
    console.log("status:", error.response?.status);
    console.log("url:", error.config?.baseURL, error.config?.url);
    console.log(
      "data:",
      JSON.stringify(error.response?.data, null, 2)
    );
  } else {
    console.log(prefix, error);
  }
}

export async function getAvailableYears(): Promise<{ min_year: number; max_year: number }> {
    try {
        const { data } =
            await indicadoresClient.get<ApiResponse<{ min_year: number; max_year: number }>>(
                "/epi-indicators/available-years"
            );

        console.log("RAW AVAILABLE YEARS RESPONSE:", data);

        return unwrapResponse(data);
    } catch (error) {
        logAxiosError("Erro em getAvailableYears", error);
        throw error;
    }
}

export async function getTimeFilters(year: number): Promise<TimeFiltersResponse> {
    try {
        const { data } =
            await indicadoresClient.get<ApiResponse<{ max_month: number; max_week: number }>>(
                `/epi-indicators/${year}/available-periods`
            );

        console.log("RAW AVAILABLE PERIODS RESPONSE:", data);

        const items = unwrapResponse(data);

        return {
            min_year: 2014,
            max_year: year,
            max_month: items.max_month && items.max_month > 0 ? items.max_month : 12,
            max_week: items.max_week && items.max_week > 0 ? items.max_week : 52,
        };
    } catch (error) {
        logAxiosError("Erro em getTimeFilters", error);
        throw error;
    }
}

export async function getIndicadoresAno(year: number): Promise<IndicadoresEpi> {
    try {
        const { data } =
            await indicadoresClient.get<
                ApiResponse<{
                    yearly_notified_cases: number;
                    yearly_confirmed_cases: number;
                    yearly_confirmation_rate: number;
                }>
            >(`/epi-indicators/${year}`);

        console.log("RAW YEAR INDICATORS RESPONSE:", data);

        const items = unwrapResponse(data);

        return {
            notified_cases: items.yearly_notified_cases ?? 0,
            confirmed_cases: items.yearly_confirmed_cases ?? 0,
            confirmation_rate: items.yearly_confirmation_rate ?? 0,
        };
    } catch (error) {
        logAxiosError("Erro em getIndicadoresAno", error);
        throw error;
    }
}

export async function getIndicadoresMensais(year: number, month: number): Promise<IndicadoresEpi> {
    try {
        const { data } =
            await indicadoresClient.get<
                ApiResponse<{
                    monthly_notified_cases: number;
                    monthly_confirmed_cases: number;
                    monthly_confirmation_rate: number;
                }>
            >(`/epi-indicators/${year}/monthly/${month}`);

        console.log("RAW MONTH INDICATORS RESPONSE:", data);

        const items = unwrapResponse(data);

        return {
            notified_cases: items.monthly_notified_cases ?? 0,
            confirmed_cases: items.monthly_confirmed_cases ?? 0,
            confirmation_rate: items.monthly_confirmation_rate ?? 0,
        };
    } catch (error) {
        logAxiosError("Erro em getIndicadoresMensais", error);
        throw error;
    }
}

export async function getIndicadoresSemanais(year: number, week: number): Promise<IndicadoresEpi> {
    try {
        const { data } =
            await indicadoresClient.get<
                ApiResponse<{
                    weekly_notified_cases: number;
                    weekly_confirmed_cases: number;
                    weekly_confirmation_rate: number;
                }>
            >(`/epi-indicators/${year}/weekly/${week}`);

        console.log("RAW WEEK INDICATORS RESPONSE:", data);

        const items = unwrapResponse(data);

        return {
            notified_cases: items.weekly_notified_cases ?? 0,
            confirmed_cases: items.weekly_confirmed_cases ?? 0,
            confirmation_rate: items.weekly_confirmation_rate ?? 0,
        };
    } catch (error) {
        logAxiosError("Erro em getIndicadoresSemanais", error);
        throw error;
    }
}

export async function getAllWeekly(year: number, maxWeek: number): Promise<WeeklyIndicator[]> {
    const requests = Array.from({ length: maxWeek }, (_, i) =>
        indicadoresClient
            .get<
                ApiResponse<{
                    weekly_notified_cases: number;
                    weekly_confirmed_cases: number;
                    weekly_confirmation_rate: number;
                }>
            >(`/epi-indicators/${year}/weekly/${i + 1}`)
            .then(({ data }) => {
                const items = unwrapResponse(data);

                return {
                    week: i + 1,
                    notified_cases: items.weekly_notified_cases ?? 0,
                    confirmed_cases: items.weekly_confirmed_cases ?? 0,
                    confirmation_rate: items.weekly_confirmation_rate ?? 0,
                };
            })
            .catch((error) => {
                logAxiosError(`Erro em getAllWeekly semana ${i + 1}`, error);
                return null;
            })
    );

    const results = await Promise.all(requests);
    return results.filter(Boolean) as WeeklyIndicator[];
}

export async function getWeeklyCasesByYear(year: number): Promise<WeeklyCasesPoint[]> {
    try {
        const { data } =
            await indicadoresClient.get<
                ApiResponse<
                    | Array<{ week: number; confirmed_cases: number }>
                    | { status?: string; year?: number; data?: Record<string, number | null> }
                >
            >(`/epi-indicators/${year}/weekly-cases`);

        console.log("RAW WEEKLY CASES RESPONSE:", data);

        const items = unwrapResponse(data);

        if (Array.isArray(items)) {
            return items
                .map((item) => ({
                    week: Number(item.week ?? 0),
                    confirmed_cases: Number(item.confirmed_cases ?? 0),
                }))
                .filter((item) => item.week > 0)
                .sort((a, b) => a.week - b.week);
        }

        const weeklyData = items?.data;

        if (!weeklyData || typeof weeklyData !== "object") {
            return [];
        }

        return Object.entries(weeklyData)
            .map(([week, cases]) => ({
                week: Number(week),
                confirmed_cases: cases == null ? 0 : Number(cases),
            }))
            .filter((item) => item.week > 0)
            .sort((a, b) => a.week - b.week);
    } catch (error) {
        logAxiosError("Erro em getWeeklyCasesByYear", error);
        throw error;
    }
}