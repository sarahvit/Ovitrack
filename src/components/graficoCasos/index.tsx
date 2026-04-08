"use client"

import {
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer
} from "recharts"

type Props = {
    data: {
        label: string
        confirmados: number
        notificados: number
    }[]
}

export function GraficoCasos({ data }: Props) {
    if (!data || data.length === 0) {
        return <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
            Sem dados
        </div>
    }

    return (
        <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="label" />
                    <YAxis />

                    <Tooltip
                        formatter={(value, name) => [
                            `${value}`,
                            name === "confirmados" ? "Confirmados" : "Notificados"
                        ]}
                    />

                    <Line
                        type="monotone"
                        dataKey="confirmados"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="notificados"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}