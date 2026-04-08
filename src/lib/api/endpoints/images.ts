import { Imagem, ImagemList } from "@/types/Image"
import { apiClient } from "@/lib/api/client"


export async function postImagesUpload(ovitrampaId: number, file: File, captureDate: string): Promise<Imagem> {
    const formData = new FormData()

    formData.append("ovitrampa_id", ovitrampaId.toString());
    formData.append("file", file);
    formData.append("capture_date", captureDate);


    const { data } = await apiClient.post<Imagem>("/images/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });

    console.log("API retornou:", data)

    return data;
}

export async function getListImages(page = 1, size = 20, filters?: Record<string,any>): Promise<ImagemList> {
    const {data} = await apiClient.get<ImagemList>("/images/", {params: {page, size, ...filters},})

    return data;
}

export async function getImageId(id: number){
    const { data } = await apiClient.get<Imagem>(`/images/${id}`)

    return data;
}

export async function deleteImage(id: number){
    const { data } = await apiClient.delete<{message: string}>(`/images/${id}`);

    return data;
}
