"use client";

import { Slide } from "@/components/slide/index";
import { Footer } from "@/components/footer/index";
import { Mapas } from "@/components/mapas/index";
import { useEffect, useState } from "react";
import { Card } from "@/components/epidemiologico/index";
import {
  getTimeFilters,
  getIndicadoresAno,
  getIndicadoresMensais,
  getIndicadoresSemanais,
  IndicadoresEpi,
  getAvailableYears,
} from "@/lib/api/endpoints/indicators";

import {
  calculateAllWeekMetrics,
  calculateWeeklyMetrics,
  epiWeekNumberToString,
} from "@/lib/utils/entomologicalMetrics";

import { IndicadoresEntomologicos } from "@/components/entomologico";
import { GraficoOVos } from "@/components/graficoOvos";
import { GraficoCasos } from "@/components/graficoCasos";
import { listResults } from "@/lib/api/endpoints/results";
import { getWeeklyCasesByYear } from "@/lib/api/endpoints/indicators";
export default function Page() {
  const [year, setYear] = useState<number | null>(null);
  const [periodType, setPeriodType] = useState<"year" | "month" | "week">("year");
  const [periodValue, setPeriodValue] = useState<number | null>(null);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [maxMonth, setMaxMonth] = useState(52);
  const [maxWeek, setMaxWeek] = useState(52);
  const [indicadores, setIndicadores] = useState<IndicadoresEpi | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  type GraficoData = {
    semana: string;
    ovos: number;
  };

  type GraficoEpi = {
    semana: string
    casos: number
  }

  const [graficoData, setGraficoData] = useState<GraficoData[]>([]);
const years =
  minYear !== null && maxYear !== null
    ? Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
    : [];

const [extraYears, setExtraYears] = useState<number[]>([]);

useEffect(() => {
  if (!year) return;

  setExtraYears((prev) => {
    if (prev.includes(year)) return prev;
    return [...prev, year].sort((a, b) => a - b);
  });
}, [year]);

const yearsForSelect = Array.from(new Set([...years, ...extraYears])).sort(
  (a, b) => a - b
);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [metrics, setMetrics] = useState<any>({});
  const [graficoEpi, setGraficoEpi] = useState<GraficoEpi[]>([]);
  function getMaxWeekFromResults(results: any[], selectedYear: number) {
    const weekNumbers = results
      .filter(
        (item) =>
          Number(String(item.inspection?.epidemiological_week ?? "").slice(0, 4)) ===
          selectedYear
      )
      .map((item) =>
        Number(String(item.inspection?.epidemiological_week ?? "").slice(4))
      )
      .filter((value) => !Number.isNaN(value) && value > 0);

    return weekNumbers.length > 0 ? Math.max(...weekNumbers) : 52;
  }

  useEffect(() => {
    async function loadResults() {
      try {
        const response = await listResults({
          page: 1,
          size: 1000,
          sort: "-capture_date",
        });

        setResults(response.items ?? []);
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
        setResults([]);
      }
    }

    loadResults();
  }, []);

  useEffect(() => {
    try {
      const yearsSet = new Set(
        results
          .map((item) =>
            Number(String(item.inspection?.epidemiological_week ?? "").slice(0, 4))
          )
          .filter((value) => !Number.isNaN(value) && value > 0)
      );

      const yearsArray = Array.from(yearsSet).sort((a, b) => a - b);
      setAvailableYears(yearsArray);

      if (yearsArray.length > 0) {
        setSelectedYear((prev) => {
          if (prev && yearsArray.includes(prev)) return prev;
          return yearsArray[yearsArray.length - 1];
        });
      }
    } catch (error) {
      console.error("Erro ao carregar anos:", error);
    }
  }, [results]);

  useEffect(() => {
    if (!selectedYear) return;

    try {
      const weeksSet = new Set(
        results
          .filter(
            (item) =>
              Number(String(item.inspection?.epidemiological_week ?? "").slice(0, 4)) ===
              selectedYear
          )
          .map((item) => epiWeekNumberToString(item.inspection.epidemiological_week))
      );

      const weeksArray = Array.from(weeksSet).sort();
      setAvailableWeeks(weeksArray);

      if (weeksArray.length > 0) {
        setSelectedWeek((prev) => {
          if (prev && weeksArray.includes(prev)) return prev;
          return weeksArray[weeksArray.length - 1];
        });
      } else {
        setSelectedWeek("");
      }
    } catch (error) {
      console.error("Erro ao carregar semanas:", error);
    }
  }, [selectedYear, results]);

  useEffect(() => {
    async function loadMetrics() {
      if (!selectedWeek || results.length === 0) {
        setMetrics({});
        return;
      }

      try {
        const data = await calculateWeeklyMetrics(results, selectedWeek);
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao calcular métricas:", error);
        setMetrics({});
      }
    }

    loadMetrics();
  }, [selectedWeek, results]);

  useEffect(() => {
    async function fetchData() {
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
        } else if (periodType === "week" && periodValue !== null) {
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

    fetchData();
  }, [year, periodType, periodValue]);

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
    async function loadGrafico() {
      if (!selectedYear || results.length === 0) {
        setGraficoData([]);
        return;
      }

      try {
        const maxWeekFromResults = getMaxWeekFromResults(results, selectedYear);
        const data = await calculateAllWeekMetrics(
          results,
          selectedYear,
          maxWeekFromResults
        );

        setGraficoData(data);
      } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
        setGraficoData([]);
      }
    }

    loadGrafico();
  }, [selectedYear, results]);
useEffect(() => {
  async function loadGraficoCasos() {
    if (!year) {
      setGraficoEpi([]);
      return;
    }

    try {
      console.log("ANO DO GRAFICO:", year);

      const serie = await getWeeklyCasesByYear(year);
      console.log("SERIE BRUTA NORMALIZADA:", serie);

      const formatted = serie.map((item) => ({
        semana: `Semana ${item.week}`,
        casos: item.confirmed_cases,
      }));

      console.log("SERIE FORMATADA:", formatted);

      setGraficoEpi(formatted);
    } catch (error) {
      console.error("Erro ao carregar gráfico de casos confirmados:", error);
      setGraficoEpi([]);
    }
  }

  loadGraficoCasos();
}, [year]);

  if (!metrics) return <p>Carregando...</p>;

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
                value={year ?? ""}
                className="text-black text-sm bg-gray-100 w-28 h-10 p-2 rounded border border-gray-300 mr-8"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearsForSelect.map((y) => (
                  <option key={y} value={y}>
                   Ano {y}
                  </option>
                ))}
              </select>
              <select
                className="text-black text-sm bg-gray-100 w-60 h-10 p-2 rounded border border-gray-300"
                onChange={(e) => {
                  const type = e.target.value as "year" | "month" | "week";
                  setPeriodType(type);
                  if (type === "month") setPeriodValue(1);
                  if (type === "week") setPeriodValue(1);
                  if (type === "year") setPeriodValue(null);
                }}
              >
                <option value="year">Ano completo</option>
                <option value="month">Por mês</option>
                <option value="week">Por semana</option>
              </select>
            </div>
          </div>

        <Card indicadores={indicadores} loading={loading} periodType={periodType} />
      </section>

      <section className="mx-auto flex min-h-dvh justify-center">
        <Mapas />
      </section>

      <section className="mx-auto flex flex-col w-full">
        <div className="mb-20 px-20">
          <IndicadoresEntomologicos
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            availableWeeks={availableWeeks}
            metrics={metrics}
            loading={loading}
          />

          <div className="flex flex-col">
            <h2 className="flex item text-5xl text-blue-900 font-bold mt-10 mb-20">
              Evolução temporal
            </h2>

            <GraficoOVos
              data={graficoData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
            />

            <div className="w-full h-[350px]">
              <GraficoCasos
                data={graficoEpi}
                selectedYear={year}
                setSelectedYear={setYear}
                availableYears={yearsForSelect}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}