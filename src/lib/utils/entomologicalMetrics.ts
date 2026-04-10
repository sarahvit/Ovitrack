import { listOvitrampas } from "../api/endpoints/ovitrap.client";
import { Ovitrap } from "@/lib/api/endpoints/ovitrap.client";

type ResultItem = {
  inspection: {
    id: number;
    ovitrap_id: number;
    epidemiological_week: number;
  };
  location?: any;
  processing?: {
    egg_count?: number | null;
    confidence?: number | null;
  } | null;
};

let cachedOvitraps: Ovitrap[] | null = null;

async function getOvitraps() {
  if (!cachedOvitraps) {
    cachedOvitraps = await listOvitrampas({ page: 1, size: 1000 });
  }
  return cachedOvitraps ?? [];
}

export function epiWeekNumberToString(value: number) {
  const raw = String(value);
  const year = raw.slice(0, 4);
  const week = raw.slice(4).padStart(2, "0");
  return `${year}-${week}`;
}

export async function calculateWeeklyMetrics(
  results: ResultItem[],
  week: string
) {
  const ovitraps = await getOvitraps();

  const weekResults = results.filter(
    (item) =>
      epiWeekNumberToString(item.inspection.epidemiological_week) === week
  );

  const activeOvitraps = ovitraps.filter((o) => o.is_active).length;

  const trapsWithCollection = new Set(
    weekResults.map((item) => item.inspection.ovitrap_id)
  ).size;

  const totalEggs = weekResults.reduce(
    (sum, item) => sum + Number(item.processing?.egg_count ?? 0),
    0
  );

  const mediaEggs = activeOvitraps > 0 ? totalEggs / activeOvitraps : 0;

 

  const distribution = {
    zero: 0,
    range1_20: 0,
    range21_50: 0,
    range51_100: 0,
    over100: 0,
  };

  weekResults.forEach((item) => {
    const eggs = Number(item.processing?.egg_count ?? 0);

    if (eggs === 0) distribution.zero++;
    else if (eggs <= 20) distribution.range1_20++;
    else if (eggs <= 50) distribution.range21_50++;
    else if (eggs <= 100) distribution.range51_100++;
    else distribution.over100++;
  });

  const heatmap = weekResults.map((item) => ({
    inspection_id: item.inspection.id,
    ovitrap_id: item.inspection.ovitrap_id,
    egg_count: Number(item.processing?.egg_count ?? 0),
    confidence: Number(item.processing?.confidence ?? 0),
    location: item.location ?? null,
  }));

  return {
    activeOvitraps,
    trapsWithCollection,
    totalEggs,
    mediaEggs,
    distribution,
    heatmap,
  };
}

export async function calculateAllWeekMetrics(
  results: ResultItem[],
  year: number,
  maxWeek: number
) {
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  const yearlyResults = results.filter(
    (item) =>
      Number(String(item.inspection.epidemiological_week).slice(0, 4)) === year
  );

  const data = weeks.map((week) => {
    const weekFormatted = `${year}-${String(week).padStart(2, "0")}`;

    const weekResults = yearlyResults.filter(
      (item) =>
        epiWeekNumberToString(item.inspection.epidemiological_week) ===
        weekFormatted
    );

    const ovos = weekResults.reduce(
      (sum, item) => sum + Number(item.processing?.egg_count ?? 0),
      0
    );

    return {
      semana: `Semana ${week}`,
      ovos,
    };
  });

  const totalEggs = data.reduce((sum, item) => sum + item.ovos, 0);

  return data.map((item) => ({
    semana: item.semana,
    ovos:
      item.ovos,
  }));
}