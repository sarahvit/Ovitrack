"use client"
import { indicadoresClient } from "@/lib/api/clientIndicators"

type WeeklyIndicator = {
    week: number;
    notified_cases: number;
    confirmed_cases: number;
    confirmation_rate: number;
}

export type IndicadoresEpi = {
    notified_cases: number
    confirmed_cases: number
    confirmation_rate: number
}
export type TimeFiltersResponse = {
    min_year: number
    max_year: number
    max_month: number
    max_week: number
}

export async function getAvailableYears(): Promise<{ min_year: number; max_year: number }> {
    const { data } = await indicadoresClient.get("/epi-indicators/available-years")
    return data;
}

export async function getTimeFilters(year: number): Promise<TimeFiltersResponse> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/available-periods`);
    return {
        min_year: 2014,
        max_year: year,
        max_month: data.max_month ?? 12,
        max_week: data.max_week ?? 52,
    };
}
export async function getIndicadoresAno(year: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}`)

    return {
        notified_cases: data.yearly_notified_cases ?? 0,
        confirmed_cases: data.yearly_confirmed_cases ?? 0,
        confirmation_rate: data.yearly_confirmation_rate ?? 0,
    };

}
export async function getIndicadoresMensais(year: number, month: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/monthly/${month}`)

    return {
        notified_cases: data.monthly_notified_cases ?? 0,
        confirmed_cases: data.monthly_confirmed_cases ?? 0,
        confirmation_rate: data.monthly_confirmation_rate ?? 0,
    };

}

export async function getIndicadoresSemanais(year: number, week: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/weekly/${week}`)

    return {
        notified_cases: data.weekly_notified_cases ?? 0,
        confirmed_cases: data.weekly_confirmed_cases ?? 0,
        confirmation_rate: data.weekly_confirmation_rate ?? 0,
    };

}

export async function getAllWeekly(year: number, maxWeek: number): Promise<WeeklyIndicator[]> {
    const requests = Array.from({ length: maxWeek }, (_, i) =>
        indicadoresClient
            .get(`/epi-indicators/${year}/weekly/${i + 1}`)
            .then(({ data }) => ({
                week: i + 1,
                notified_cases: data.weekly_notified_cases ?? 0,
                confirmed_cases: data.weekly_confirmed_cases ?? 0,
                confirmation_rate: data.weekly_confirmation_rate ?? 0,
            }))
            .catch(() => null) // semanas sem dados retornam null
    )

    const results = await Promise.all(requests)
    return results.filter(Boolean) as WeeklyIndicator[]
}