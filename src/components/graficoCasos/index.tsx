"use client";

import {
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";

type Props = {
    data: {
        semana: string;
        casos: number;
    }[];
    selectedYear: number | null;
    setSelectedYear: (year: number) => void;
    availableYears: number[];
};

export function GraficoCasos({
    data,
    selectedYear,
    setSelectedYear,
    availableYears,
}: Props) {
    return (
        <div>
            <div className="flex flex-row justify-between mb-14">
                <div className="flex items-center">
                    <h3 className="text-3xl text-blue-900 font-bold">
                        Casos confirmados no ano
                    </h3>
                </div>

                <div className="flex items-center">
                    <select
                        className="text-black bg-gray-100 w-40 h-10 p-2 rounded border border-gray-300"
                        value={selectedYear ?? ""}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {availableYears.map((y) => (
                            <option key={y} value={y}>
                                Ano {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-full h-[300px]">
                {data.length === 0 ? (
                    <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
                        Sem dados
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semana" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`${value ?? 0} casos`, "Confirmados"]}
                                cursor={{ stroke: "#ccc" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="casos"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}