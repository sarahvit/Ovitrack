import { listResults } from "../api/endpoints/results";
import { listOvitrampas } from "../api/endpoints/ovitrap.client";
import { Ovitrap } from "@/lib/api/endpoints/ovitrap.client";

let cachedOvitraps: Ovitrap[] | null = null;

function weekStringToNumber(week: string): number {
    return Number(week.replace("-", ""));
}

async function getOvitraps() {
    if (!cachedOvitraps) {
        cachedOvitraps = await listOvitrampas({ page: 1, size: 1000 });
    }
    return cachedOvitraps ?? [];
}

export async function calculateWeeklyMetrics(week: string) {
    const ovitraps = await getOvitraps();

    const resultsResponse = await listResults({
        page: 1,
        size: 1000,
        epidemiological_week: weekStringToNumber(week),
    });

    const results = resultsResponse.items ?? [];

    const activeOvitraps = ovitraps.filter((o) => o.is_active).length;

    const trapsWithCollection = new Set(
        results.map((item) => item.inspection.ovitrap_id)
    ).size;

    const totalEggs = results.reduce(
        (sum, item) => sum + Number(item.processing?.egg_count ?? 0),
        0
    );

    const mediaEggs = activeOvitraps > 0 ? totalEggs / activeOvitraps : 0;

    const positives = results.filter(
        (item) => Number(item.processing?.egg_count ?? 0) > 0
    ).length;

    const percentPositive =
        activeOvitraps > 0 ? (positives / activeOvitraps) * 100 : 0;

    const distribution = {
        zero: 0,
        range1_20: 0,
        range21_50: 0,
        range51_100: 0,
        over100: 0,
    };

    results.forEach((item) => {
        const eggs = Number(item.processing?.egg_count ?? 0);

        if (eggs === 0) distribution.zero++;
        else if (eggs <= 20) distribution.range1_20++;
        else if (eggs <= 50) distribution.range21_50++;
        else if (eggs <= 100) distribution.range51_100++;
        else distribution.over100++;
    });

    const heatmap = results.map((item) => ({
        inspection_id: item.inspection.id,
        ovitrap_id: item.inspection.ovitrap_id,
        egg_count: Number(item.processing?.egg_count ?? 0),
        confidence: Number(item.processing?.confidence ?? 0),
        location: item.location,
    }));

    return {
        activeOvitraps,
        trapsWithCollection,
        totalEggs,
        mediaEggs,
        percentPositive,
        distribution,
        heatmap,
    };
}

export async function calculateAllWeekMetrics(year: number, maxWeek: number) {
    const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

    const results = await Promise.all(
        weeks.map(async (week) => {
            const weekFormatted = `${year}-${String(week).padStart(2, "0")}`;
            const res = await calculateWeeklyMetrics(weekFormatted);

            return {
                semana: `Semana ${week}`,
                ovos: res.totalEggs,
            };
        })
    );

    const totalEggs = results.reduce((sum, item) => sum + item.ovos, 0);

    return results.map((item) => ({
        semana: item.semana,
        ovos:
            totalEggs > 0 ? Number(((item.ovos / totalEggs) * 100).toFixed(2)) : 0,
    }));
}