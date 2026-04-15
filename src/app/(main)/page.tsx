"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/footer/index";
import { Slide } from "@/components/slide/index";
import { Mapas } from "@/components/mapas/index";
import { Card } from "@/components/epidemiologico/index";
import { IndicadoresEntomologicos } from "@/components/entomologico";
import { GraficoOVos } from "@/components/graficoOvos";
import { GraficoCasos } from "@/components/graficoCasos";
import {
  getAvailableYears,
  getIndicadoresAno,
  getIndicadoresMensais,
  getIndicadoresSemanais,
  getTimeFilters,
  getWeeklyCasesByYear,
  IndicadoresEpi,
} from "@/lib/api/endpoints/indicators";
import {
  getPublicDashboard,
  getPublicResultFilters,
} from "@/lib/api/endpoints/results";
import {
  PublicResultDistributionItem,
  PublicResultWeekOption,
} from "@/types/result";

type GraficoData = {
  semana: string;
  ovos: number;
};

type GraficoEpi = {
  semana: string;
  casos: number;
};

type DistributionState = {
  zero: number;
  range1_20: number;
  range21_50: number;
  range51_100: number;
  over100: number;
};

type MetricsState = {
  activeOvitraps: number;
  trapsWithCollection: number;
  totalEggs: number;
  mediaEggs: number;
  distribution: DistributionState;
};

const EMPTY_DISTRIBUTION: DistributionState = {
  zero: 0,
  range1_20: 0,
  range21_50: 0,
  range51_100: 0,
  over100: 0,
};

const EMPTY_METRICS: MetricsState = {
  activeOvitraps: 0,
  trapsWithCollection: 0,
  totalEggs: 0,
  mediaEggs: 0,
  distribution: EMPTY_DISTRIBUTION,
};

function epidemiologicalWeekToString(value: number) {
  const raw = String(value);
  const year = raw.slice(0, 4);
  const week = raw.slice(4).padStart(2, "0");
  return `${year}-${week}`;
}

function distributionArrayToObject(
  distribution: PublicResultDistributionItem[]
): DistributionState {
  const next: DistributionState = { ...EMPTY_DISTRIBUTION };

  for (const item of distribution) {
    if (item.label === "0 ovos") next.zero = item.count;
    if (item.label === "1–20") next.range1_20 = item.count;
    if (item.label === "21–50") next.range21_50 = item.count;
    if (item.label === "51–100") next.range51_100 = item.count;
    if (item.label === "100+") next.over100 = item.count;
  }

  return next;
}

export default function Page() {
  const [year, setYear] = useState<number | null>(null);
  const [periodType, setPeriodType] = useState<"year" | "month" | "week">("year");
  const [periodValue, setPeriodValue] = useState<number | null>(null);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [maxMonth, setMaxMonth] = useState(12);
  const [maxWeek, setMaxWeek] = useState(52);
  const [indicadores, setIndicadores] = useState<IndicadoresEpi | null>(null);
  const [loading, setLoading] = useState(false);

  const [publicYears, setPublicYears] = useState<number[]>([]);
  const [publicWeeks, setPublicWeeks] = useState<PublicResultWeekOption[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [metrics, setMetrics] = useState<MetricsState>(EMPTY_METRICS);
  const [graficoData, setGraficoData] = useState<GraficoData[]>([]);
  const [graficoEpi, setGraficoEpi] = useState<GraficoEpi[]>([]);

  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  const years =
    minYear !== null && maxYear !== null
      ? Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
      : [];

  const yearsForSelect = Array.from(new Set([...years, ...publicYears])).sort(
    (a, b) => a - b
  );

  const availableWeeks = useMemo(() => {
    if (!selectedYear) return [];
    return publicWeeks
      .filter((item) => Math.floor(item.value / 100) === selectedYear)
      .map((item) => epidemiologicalWeekToString(item.value))
      .sort();
  }, [publicWeeks, selectedYear]);

  useEffect(() => {
    async function loadPublicFilters() {
      try {
        const response = await getPublicResultFilters();
        const nextYears = response.years ?? [];
        const nextWeeks = response.weeks ?? [];

        setPublicYears(nextYears);
        setPublicWeeks(nextWeeks);

        if (nextYears.length > 0) {
          setSelectedYear((prev) =>
            prev && nextYears.includes(prev) ? prev : nextYears[0]
          );
        }
      } catch (error) {
        console.error("Erro ao carregar filtros públicos:", error);
        setPublicYears([]);
        setPublicWeeks([]);
      }
    }

    loadPublicFilters();
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setSelectedWeek("");
      return;
    }

    const yearWeeks = publicWeeks
      .filter((item) => Math.floor(item.value / 100) === selectedYear)
      .map((item) => epidemiologicalWeekToString(item.value))
      .sort();

    if (yearWeeks.length === 0) {
      setSelectedWeek("");
      return;
    }

    setSelectedWeek((prev) => (prev && yearWeeks.includes(prev) ? prev : yearWeeks[yearWeeks.length - 1]));
  }, [publicWeeks, selectedYear]);

  useEffect(() => {
    async function loadPublicMetrics() {
      if (!selectedYear) {
        setMetrics(EMPTY_METRICS);
        return;
      }

      try {
        const epidemiologicalWeek = selectedWeek
          ? Number(selectedWeek.replace("-", ""))
          : undefined;

        const response = await getPublicDashboard({
          year: selectedYear,
          ...(epidemiologicalWeek ? { epidemiological_week: epidemiologicalWeek } : {}),
        });

        setMetrics({
          activeOvitraps: response.active_ovitraps,
          trapsWithCollection: response.ovitraps_with_collection,
          totalEggs: response.total_eggs,
          mediaEggs: response.average_eggs,
          distribution: distributionArrayToObject(response.distribution ?? []),
        });
      } catch (error) {
        console.error("Erro ao carregar métricas entomológicas:", error);
        setMetrics(EMPTY_METRICS);
      }
    }

    loadPublicMetrics();
  }, [selectedYear, selectedWeek]);

  useEffect(() => {
    async function loadEggChart() {
      if (!selectedYear) {
        setGraficoData([]);
        return;
      }

      const selectedYearWeeks = publicWeeks
        .filter((item) => Math.floor(item.value / 100) === selectedYear)
        .sort((a, b) => a.value - b.value);

      if (selectedYearWeeks.length === 0) {
        setGraficoData([]);
        return;
      }

      try {
        const series = await Promise.all(
          selectedYearWeeks.map(async (week) => {
            const dashboard = await getPublicDashboard({
              year: selectedYear,
              epidemiological_week: week.value,
            });

            const weekNumber = String(week.value).slice(4).padStart(2, "0");

            return {
              semana: `Semana ${Number(weekNumber)}`,
              ovos: dashboard.total_eggs ?? 0,
            };
          })
        );

        setGraficoData(series);
      } catch (error) {
        console.error("Erro ao carregar gráfico de ovos:", error);
        setGraficoData([]);
      }
    }

    loadEggChart();
  }, [publicWeeks, selectedYear]);

  useEffect(() => {
    async function loadYears() {
      try {
        const res = await getAvailableYears();

        setMinYear(res.min_year);
        setMaxYear(res.max_year);
        setYear((prev) => prev ?? res.max_year);
      } catch (error) {
        console.error("Erro ao carregar anos:", error);
      }
    }

    loadYears();
  }, []);

  useEffect(() => {
    async function fetchIndicators() {
      if (!year) return;

      setLoading(true);

      try {
        const filters = await getTimeFilters(year);
        setMaxMonth(filters.max_month);
        setMaxWeek(filters.max_week);

        let data: IndicadoresEpi | null = null;

        if (periodType === "year") {
          data = await getIndicadoresAno(year);
        } else if (periodType === "month" && periodValue != null) {
          data = await getIndicadoresMensais(year, periodValue);
        } else if (periodType === "week" && periodValue != null) {
          data = await getIndicadoresSemanais(year, periodValue);
        }

        setIndicadores(data);
      } catch (error) {
        console.error("Erro ao buscar indicadores:", error);
        setIndicadores({
          notified_cases: 0,
          confirmed_cases: 0,
          confirmation_rate: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();
  }, [year, periodType, periodValue]);

  useEffect(() => {
    async function loadGraficoCasos() {
      if (!year) {
        setGraficoEpi([]);
        return;
      }

      try {
        const serie = await getWeeklyCasesByYear(year);

        setGraficoEpi(
          serie.map((item) => ({
            semana: `Semana ${item.week}`,
            casos: item.confirmed_cases,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar gráfico de casos confirmados:", error);
        setGraficoEpi([]);
      }
    }

    loadGraficoCasos();
  }, [year]);

  return (
    <main className="relative min-h-dvh bg-white">
      <Slide />

      <section className="mx-auto flex flex-col">
        <div className="flex items-center mt-20 mb-20 justify-between ">
          <div className="flex flex-start pl-20">
            <h2 className="text-5xl text-blue-900 font-bold mr-50">
              Indicadores-Chave (KPIs)
            </h2>
          </div>
          <div className="mr-20 ">
            {periodType !== "year" && (
              <select
                className="text-black bg-gray-100 w-30 text-sm h-10 p-2 rounded border border-gray-300 mr-8"
                onChange={(e) => setPeriodValue(Number(e.target.value))}
                value={periodValue ?? ""}
              >
                {periodType === "month" &&
                  months.map((m) => (
                    <option key={m} value={m}>
                      Mês {m}
                    </option>
                  ))}

                {periodType === "week" &&
                  weeks.map((w) => (
                    <option key={w} value={w}>
                      Semana {w}
                    </option>
                  ))}
              </select>
            )}

            <select
              className="text-black bg-gray-100 w-30 text-sm h-10 p-2 rounded border border-gray-300 mr-8"
              onChange={(e) =>
                setPeriodType(e.target.value as "year" | "month" | "week")
              }
              value={periodType}
            >
              <option value="year">Ano</option>
              <option value="month">Mês</option>
              <option value="week">Semana</option>
            </select>

            <select
              className="text-black bg-gray-100 w-30 text-sm h-10 p-2 rounded border border-gray-300"
              onChange={(e) => setYear(Number(e.target.value))}
              value={year ?? ""}
            >
              {yearsForSelect.map((y) => (
                <option key={y} value={y}>
                  Ano {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card
          indicadores={indicadores}
          loading={loading}
          periodType={periodType}
        />

        <div className="mx-20 mt-20">
          <h2 className="text-5xl text-blue-900 font-bold mb-10">
            Indicadores entomológicos
          </h2>

          <IndicadoresEntomologicos
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={publicYears}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            availableWeeks={availableWeeks}
            metrics={metrics}
            loading={false}
          />
        </div>

        <div className="mx-20 mt-20">
          <GraficoOVos
            data={graficoData}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={publicYears}
          />
        </div>

        <div className="mx-20 mt-20">
          <GraficoCasos
            data={graficoEpi}
            selectedYear={year}
            setSelectedYear={setYear}
            availableYears={yearsForSelect}
          />
        </div>

        <div className="mx-20 mt-20">
          <Mapas />
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </section>
    </main>
  );
}