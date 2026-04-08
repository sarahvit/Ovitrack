'use client'

import { Slide } from "@/components/slide/index"
import { Footer } from "@/components/footer/index"
import { Mapas } from "@/components/mapas/index"
import { useEffect, useState } from "react";
import { Card } from "@/components/epidemiologico/index"
import {
  getTimeFilters,
  getIndicadoresAno,
  getIndicadoresMensais,
  getIndicadoresSemanais,
  IndicadoresEpi,
  getAvailableYears
} from "@/lib/api/endpoints/indicators"

import { calculateAllWeekMetrics, calculateWeeklyMetrics } from "@/lib/utils/entomologicalMetrics"


import { IndicadoresEntomologicos } from "@/components/entomologico";
import { GraficoOVos } from "@/components/graficoOvos";
import { getListImages } from "@/lib/api/endpoints/images";
import { GraficoCasos } from "@/components/graficoCasos";

export default function Page() {
  const [year, setYear] = useState<number | null>(null)
  const [periodType, setPeriodType] = useState<"year" | "month" | "week">("year")
  const [periodValue, setPeriodValue] = useState<number | null>(null)
  const [minYear, setMinYear] = useState<number | null>(null)
  const [maxYear, setMaxYear] = useState<number | null>(null)
  const [maxMonth, setMaxMonth] = useState(52)
  const [maxWeek, setMaxWeek] = useState(52)
  const [indicadores, setIndicadores] = useState<IndicadoresEpi | null>(null)
  const [loading, setLoading] = useState(false)
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1)
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)
  type GraficoData = {
    semana: string
    ovos: number
  }
  type GraficoEpi = {
    label: string
    confirmados: number
    notificados: number
  }

  const [graficoData, setGraficoData] = useState<GraficoData[]>([])
  const years =
    minYear !== null && maxYear !== null
      ? Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => minYear + i
      )
      : []
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [metrics, setMetrics] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [graficoEpi, setGraficoEpi] = useState<GraficoEpi[]>([])


 

  useEffect(() => {
    async function loadYears() {
      try {
        const yearsSet = new Set(
          images.map(img => Number(img.epidemiological_week.split("-")[0]))
        )
        const yearsArray = Array.from(yearsSet).sort((a, b) => a - b)
        setAvailableYears(yearsArray)
        if (yearsArray.length > 0) setSelectedYear(yearsArray[yearsArray.length - 1])
      } catch (error) {
        console.error("Erro ao carregar anos:", error)
      }
    }

    loadYears()
  }, [images])

  useEffect(() => {
    async function loadWeeks() {
      if (!selectedYear) return
      try {

        const weeksSet = new Set(
          images
            .filter(img => Number(img.epidemiological_week.split("-")[0]) === selectedYear)
            .map(img => img.epidemiological_week)
        )
        const weeksArray = Array.from(weeksSet).sort()
        setAvailableWeeks(weeksArray)
        if (weeksArray.length > 0) {
          setSelectedWeek(weeksArray[weeksArray.length - 1])
        } else {
          setSelectedWeek("")
        }
      } catch (error) {
        console.error("Erro ao carregar semanas:", error)
      }
    }

    loadWeeks()
  }, [selectedYear, images])

  useEffect(() => {
    async function loadMetrics() {
      if (!selectedWeek) return
      setLoading(true)
      try {
        const data = await calculateWeeklyMetrics(selectedWeek)
        setMetrics(data)
      } catch (error) {
        console.error("Erro ao calcular métricas:", error)
        setMetrics({})
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [selectedWeek])

  useEffect(() => {

    async function fetchData() {
      if (!year) return
      setLoading(true)

      try {

        const filters = await getTimeFilters(year)
        setMaxMonth(filters.max_month)
        setMaxWeek(filters.max_week)

        let data: IndicadoresEpi | null = null

        if (periodType === "year") {
          data = await getIndicadoresAno(year)
        } else if (periodType === "month" && periodValue != null) {
          data = await getIndicadoresMensais(year, periodValue)
        } else if (periodType === "week" && periodValue !== null) {
          data = await getIndicadoresSemanais(year, periodValue)
        }
        setIndicadores(data)

      } catch (error) {

        console.error("Erro ao buscar indicadores:", error)
        setIndicadores({ notified_cases: 0, confirmed_cases: 0, confirmation_rate: 0 });
      } finally {
        setLoading(false)
      }

    }
    fetchData()
  }, [year, periodType, periodValue])

  useEffect(() => {
    async function loadYears() {
      try {
        const res = await getAvailableYears()
        console.log("API YEARS:", res)

        if (!res || res.max_year == null) {
          console.error("Resposta inválida da API:", res)
          return
        }

        setMinYear(res.min_year)
        setMaxYear(res.max_year)
        setYear((prev) => {
          if (!prev) return res.max_year
          return Math.max(prev, res.max_year)
        })

      } catch (error) {
        console.error("Erro ao carregar anos:", error)
      }
    }

    loadYears()
  }, [])

  useEffect(() => {
    async function loadGrafico() {
      if (!selectedYear || images.length === 0) return

      const data = await calculateAllWeekMetrics(selectedYear, 52)
      setGraficoData(data)
      console.log("YEAR:", selectedYear)
      console.log("DATA:", data)
    }
    loadGrafico()

  }, [selectedYear, maxWeek, images])

  if (!metrics) return <p>Carregando...</p>
  return (
    <main className="relative min-h-dvh bg-white">
      <Slide />
      <section className="mx-auto flex  flex-col">
        <div className="flex items-center gap-10 mt-20 mb-20 px-20">

          <h2 className="text-5xl text-blue-900 font-bold mr-30">
            Indicadores-Chave (KPIs)
          </h2>
          <select className="text-black text-sm bg-gray-100 w-40 h-10 p-2 rounded border border-gray-300"
            onChange={(e) => {
              const type = e.target.value as "year" | "month" | "week"
              setPeriodType(type)
              if (type === "month") setPeriodValue(1)
              if (type === "week") setPeriodValue(1)
              if (type === "year") setPeriodValue(null)
            }} >
            <option value="year">Ano completo</option>
            <option value="month">Por mês</option>
            <option value="week">Por semana</option>
          </select>
          <select value={year ?? ""} className="text-black text-sm  bg-gray-100 w-70 h-10 p-2 rounded  border border-gray-300"
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {periodType !== "year" && (
            <select className="text-black bg-gray-100 w-50 text-sm h-10 p-2 rounded border border-gray-300"
              onChange={(e) =>
                setPeriodValue(Number(e.target.value))
              }>
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
        </div>

        <Card indicadores={indicadores}
          loading={loading}
          periodType={periodType}
        />
      </section>
      <section className="mx-auto flex min-h-dvh justify-center">
        <Mapas />
      </section>
      <section className="mx-auto flex flex-col w-full">
        <div className=" mb-20 px-20">
          <IndicadoresEntomologicos selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            availableWeeks={availableWeeks}
            metrics={metrics}
            loading={loading} />
          <div className="flex flex-col">
            <h2 className="flex item text-5xl text-blue-900 font-bold mt-10 mb-20">Evolução temporal</h2>
            <GraficoOVos
              data={graficoData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
            />

            <h3 className="text-3xl text-blue-900 font-bold mb-10">
              Casos confirmados por ano
            </h3>

            <div className="w-full h-[350px]">
              <GraficoCasos data={graficoEpi} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
