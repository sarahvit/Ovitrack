import { getListImages } from "../api/endpoints/images";
import { getProcessResults, listProcessResults } from "../api/endpoints/process";
import { listOvitrampas } from "../api/endpoints/ovitrap.client";
import { Ovitrap } from "@/lib/api/endpoints/ovitrap.client"

let cachedOvitraps: Ovitrap[] | null = null

    async function getOvitraps() {
        if (!cachedOvitraps) {
            cachedOvitraps = await listOvitrampas()
        }
        return cachedOvitraps ?? []
    }

export async function calculateWeeklyMetrics(week: string) {
    const ovitraps = await getOvitraps()
    const imagesResponse = await getListImages(1, 200, { epidemiological_week: week })
    const images = imagesResponse.items

    const results = await Promise.all(
        images.map(img =>
            listProcessResults({ image_id: img.id, size: 200 })
        )
    )

    const processResults = results.flatMap(r => r.items ?? [])

    const activeOvitraps = ovitraps.filter(o => o.status === "active").length

    const trapsWithCollection = new Set(images.map(i => i.ovitrampa_id)).size

    const totalEggs = processResults.reduce(
        (sum, r) => sum + Number(r.egg_count || 0),
        0
    )

    const mediaEggs = activeOvitraps > 0 ? totalEggs / activeOvitraps : 0

    const imagesAtLeastOneEgg = processResults.filter(r => r.egg_count > 0).length

    const percentPositive = activeOvitraps > 0 ? (imagesAtLeastOneEgg / activeOvitraps) * 100 : 0

    const distribution = { zero: 0, range1_20: 0, range21_50: 0, range51_100: 0, over100: 0 }

    processResults.forEach(r => {
        const eggs = r.egg_count

        if (eggs == 0) distribution.zero++

        else if (eggs <= 20) distribution.range1_20++
        else if (eggs <= 50) distribution.range21_50++
        else if (eggs <= 100) distribution.range51_100++
        else distribution.over100++
    })

    const heatmap = images.map(img => {
        const trap = ovitraps.find(o => o.id === img.ovitrampa_id)
        const result = processResults.find(r => r.image_id === img.id)
    })

    return {
        activeOvitraps,
        trapsWithCollection,
        totalEggs,
        mediaEggs,
        percentPositive,
        distribution,
        heatmap
    }

}

export async function calculateAllWeekMetrics(year: number, maxWeek: number) {
    const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)

    const results = await Promise.all(
        weeks.map(async (week) => {
            const weekFormatted = `${year}-${String(week).padStart(2, "0")}`
            const res = await calculateWeeklyMetrics(weekFormatted)
            return {
                semana: `Semana ${week}`,
                ovos: res.totalEggs
            }
        })
    )

    const totalEggs = results.reduce((sum, item) => sum + item.ovos, 0)

    const percentData = results.map(item => ({
        semana: item.semana,
        ovos: totalEggs > 0
            ? Number(((item.ovos / totalEggs) * 100).toFixed(2))
            : 0
    }))

    return percentData
}
