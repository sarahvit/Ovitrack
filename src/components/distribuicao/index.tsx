
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts"

type Props = {
    
    distribution: {
        zero: number
        range1_20: number
        range21_50: number
        range51_100: number
        over100: number
    }
    selectedWeek: string
}

export function GraficoDistribuicao({ distribution, selectedWeek }: Props) {
    const data = [
        { faixa: "0 ovos", valor: distribution.zero },
        { faixa: "1–20", valor: distribution.range1_20 },
        { faixa: "21–50", valor: distribution.range21_50 },
        { faixa: "51–100", valor: distribution.range51_100 },
        { faixa: "100+", valor: distribution.over100 }
    ]
    return (
        <div className="mt-12">
        <div className="w-full h-[300]">
            <ResponsiveContainer>
                <BarChart data={data}  key={selectedWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faixa" />
                    <YAxis />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                    <Bar dataKey="valor" radius={[8, 8, 0, 0]}
                        >
                        {data.map((entry, index) => {
                            let color = "#001C3F" 

                            if (entry.faixa === "51–100") color = "#f59e0b"
                            if (entry.faixa === "100+") color = "#ef4444"

                            return <Cell key={index} fill={color} />
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    )
}

