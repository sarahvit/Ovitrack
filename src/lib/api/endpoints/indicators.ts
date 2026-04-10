"use client"
import { indicadoresClient } from "@/lib/api/clientIndicators"

type WeeklyIndicator = {
    week: number
    notified_cases: number
    confirmed_cases: number
    confirmation_rate: number
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

function unwrapItems<T>(data: T | { items?: T; error?: unknown }): T {
    if (data && typeof data === "object" && "items" in data) {
        return (data as { items?: T }).items as T
    }
    return data as T
}

export async function getAvailableYears(): Promise<{ min_year: number; max_year: number }> {
    const { data } = await indicadoresClient.get("/epi-indicators/available-years")
    const items = unwrapItems<{ min_year: number; max_year: number }>(data)

    return {
        min_year: items?.min_year ?? new Date().getFullYear(),
        max_year: items?.max_year ?? new Date().getFullYear(),
    }
}

export async function getTimeFilters(year: number): Promise<TimeFiltersResponse> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/available-periods`)
    const items = unwrapItems<{ max_month?: number; max_week?: number }>(data)

    return {
        min_year: 2014,
        max_year: year,
        max_month: items?.max_month ?? 12,
        max_week: items?.max_week ?? 52,
    }
}

export async function getIndicadoresAno(year: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}`)
    const items = unwrapItems<{
        yearly_notified_cases?: number
        yearly_confirmed_cases?: number
        yearly_confirmation_rate?: number
    }>(data)

    return {
        notified_cases: items?.yearly_notified_cases ?? 0,
        confirmed_cases: items?.yearly_confirmed_cases ?? 0,
        confirmation_rate: items?.yearly_confirmation_rate ?? 0,
    }
}

export async function getIndicadoresMensais(year: number, month: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/monthly/${month}`)
    const items = unwrapItems<{
        monthly_notified_cases?: number
        monthly_confirmed_cases?: number
        monthly_confirmation_rate?: number
    }>(data)

    return {
        notified_cases: items?.monthly_notified_cases ?? 0,
        confirmed_cases: items?.monthly_confirmed_cases ?? 0,
        confirmation_rate: items?.monthly_confirmation_rate ?? 0,
    }
}

export async function getIndicadoresSemanais(year: number, week: number): Promise<IndicadoresEpi> {
    const { data } = await indicadoresClient.get(`/epi-indicators/${year}/weekly/${week}`)
    const items = unwrapItems<{
        weekly_notified_cases?: number
        weekly_confirmed_cases?: number
        weekly_confirmation_rate?: number
    }>(data)

    return {
        notified_cases: items?.weekly_notified_cases ?? 0,
        confirmed_cases: items?.weekly_confirmed_cases ?? 0,
        confirmation_rate: items?.weekly_confirmation_rate ?? 0,
    }
}

export async function getAllWeekly(year: number, maxWeek: number): Promise<WeeklyIndicator[]> {
    const requests = Array.from({ length: maxWeek }, (_, i) =>
        indicadoresClient
            .get(`/epi-indicators/${year}/weekly/${i + 1}`)
            .then(({ data }) => {
                const items = unwrapItems<{
                    weekly_notified_cases?: number
                    weekly_confirmed_cases?: number
                    weekly_confirmation_rate?: number
                }>(data)

                return {
                    week: i + 1,
                    notified_cases: items?.weekly_notified_cases ?? 0,
                    confirmed_cases: items?.weekly_confirmed_cases ?? 0,
                    confirmation_rate: items?.weekly_confirmation_rate ?? 0,
                }
            })
            .catch(() => null)
    )

    const results = await Promise.all(requests)
    return results.filter(Boolean) as WeeklyIndicator[]
}