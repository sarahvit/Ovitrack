"use client";

import { useEffect, useState } from "react";
import { buildImageUrl } from "@/lib/utils/image";

type Props = {
    path?: string | null;
    alt: string;
    className?: string;
    fallbackText?: string;
};

export default function NgrokBlobImage({
    path,
    alt,
    className,
    fallbackText = "Imagem indisponível",
}: Props) {
    const [blobSrc, setBlobSrc] = useState("");
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let objectUrl: string | null = null;

        async function loadImage() {
            if (!path) {
                setFailed(true);
                setBlobSrc("");
                return;
            }

            try {
                setFailed(false);

                const url = buildImageUrl(path);
                const token =
                    typeof window !== "undefined"
                        ? localStorage.getItem("token")
                        : null;

                const response = await fetch(url, {
                    headers: {
                        "ngrok-skip-browser-warning": "1",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ${response.status} ao carregar imagem`);
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setBlobSrc(objectUrl);
            } catch {
                setFailed(true);
                setBlobSrc("");
            }
        }

        loadImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [path]);

    if (!path || failed || !blobSrc) {
        return (
            <div className="w-full h-[320px] rounded-xl border bg-white flex items-center justify-center text-black">
                {fallbackText}
            </div>
        );
    }

    return <img src={blobSrc} alt={alt} className={className} />;
}