
import { GraficoDistribuicao } from "../distribuicao"
type Props = {
    selectedYear: number | null
    setSelectedYear: (year: number) => void
    availableYears: number[]

    selectedWeek: string
    setSelectedWeek: (week: string) => void
    availableWeeks: string[]

    metrics: any
    loading: boolean
}
export function IndicadoresEntomologicos({
    selectedYear,
    setSelectedYear,
    availableYears,
    selectedWeek,
    setSelectedWeek,
    availableWeeks,
    metrics,
    loading
}: Props) {

    return (
        <div className=" text-black">

            <div >
                <div className="flex flex-row justify-between">
                <h3 className=" text-3xl text-blue-900 font-semibold">Distribuição de infestação</h3>
                <div>
                <select
                    className="text-black bg-gray-100 w-40 h-10 p-2 rounded border border-gray-300"
                    value={selectedYear ?? ""}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {availableYears.map((y) => (
                        <option key={y} value={y}>
                            Ano {y}
                        </option>
                    ))}
                </select>
                <select
                    className="text-black bg-gray-100 w-40 h-10 p-2 rounded border border-gray-300"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}>
                    {availableWeeks.map((w) => (
                        <option key={w} value={w}>
                            Semana {w}
                        </option>
                    ))}
                </select>
                </div>
                </div>
                <GraficoDistribuicao distribution={metrics?.distribution ?? []} selectedWeek={selectedWeek} />
                
            </div>
            <div className="flex items-top justify-between gap-10  mb-16">
                <div className="  rounded-xl pb-5 pt-5 px-15 border border-blue-800  flex flex-col items-center text-center  ">
                    <p>Ovitrampas ativas: {metrics?.activeOvitraps ?? 0}</p>
                </div>
                <div className="rounded-xl pb-5 pt-5 px-15 border border-blue-800  flex flex-col items-center text-center ">
                    <p>Ovitrampas com coleta: {metrics?.trapsWithCollection ?? 0}</p>
                </div>
                <div className="rounded-xl pb-5 pt-5 px-15 border border-blue-800  flex flex-col items-center text-center ">
                    <p>Total de ovos: {metrics?.totalEggs ?? 0}</p>
                </div>
                <div className="rounded-xl pb-5 pt-5 px-15 border border-blue-800  flex flex-col items-center text-center ">
                    <p>Média de ovos: {(metrics?.mediaEggs ?? 0).toFixed(2)}</p>
                </div>
            </div>

            {loading && <p className="mt-2 text-gray-500">Atualizando métricas...</p>}
        </div>
    )
}