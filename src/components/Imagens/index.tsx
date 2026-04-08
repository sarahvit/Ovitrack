"use client"
import { useState } from "react"
import { Imagem, postImagesUpload } from "@/lib/api/endpoints/images"

export default function UploadGaleria() {
    const [imagens, setImagens] = useState<Imagem[]>([])
    const [loading, setLoading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const formData = new FormData()
        Array.from(e.target.files).forEach(file => formData.append("files", file))

        setLoading(true)
        try {
            const imgs = await postImagesUpload(formData)
            setImagens(imgs)
        } catch (err) {
            console.error("Erro ao enviar imagens:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <input type="file" multiple onChange={handleUpload} />
            {loading && <p>Enviando imagens...</p>}
            <div className="grid grid-cols-3 gap-4 mt-4">
                {imagens.map(img => (
                    <div key={img.id}>
                        <img src={img.file_path} alt={`Imagem ${img.id}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}