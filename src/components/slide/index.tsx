import { useState } from 'react';
import Image from 'next/image';

export function Slide() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Projeto da dengue",
            description: "Painel de apoio à tomada de decisão no combate à dengue, desenvolvido pelo Laboratório de Inteligência Computacional Aplicada (LICA) e pela Unimontes, em Montes Claros-MG, integrando os dados do Ovitrack com informações epidemiológicas e ambientais.",
            image: "/slides/slide10.png",
            backgroundColor: "from-blue-900 to-blue-700",

        },
        {
            title: "Ovitrack",
            description: "O Ovitrack, desenvolvido pelo LICA/Unimontes, já avança na automatização da contagem de ovos em ovitrampas usando inteligência artificial e geração de mapas de calor entomológicos.",
            image: "/slides/slide20.png",
            logo: "/slides/logo1.png"
        },
        {
            title: "Objetivo",
            description: "Foi desenvolvido um painel interativo que integra dados entomológicos, epidemiológicos e ambientais, fornecendo informações atualizadas para apoiar decisões rápidas e baseadas em evidências no enfrentamento da dengue.",
            image: "/slides/slide3.png"
        },
        {
            title: "Visão Fragmentada",
            description: "Dados fragmentados em sistemas impedem a visão consolidada para o planejamento sobre: A situação epidemiológica (casos confirmados, suspeitos e óbitos); A distribuição espacial do vetor (Aedes aegypti); Os indicadores entomológicos (ovitrampas, positividade, LIRAa); Fatores ambientais e climáticos que influenciam a proliferação do vetor.",
            image: "/slides/slide4.png"
        }


    ]
    const nextSlide = () => {
        setCurrentSlide((ant) => (ant + 1) % slides.length);
    };
    const prevSlide = () => {

        setCurrentSlide((ant) => (ant - 1 + slides.length) % slides.length)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full h-[354px] overflow-hidden bg-linear-to-r from-[#1a2b5e] to-[#2d4a8f]">
            {/* Slides */}
            <div className="relative w-full h-[354px] overflow-hidden bg-linear-to-r from-[#1a2b5e] to-[#2d4a8f]">
                <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="min-w-full h-full relative">
                            {/* Imagem de fundo */}
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover opacity-100"
                                priority={index === 0} // Carrega a primeira imagem com prioridade
                            />

                            {slide.logo && (
                                <div className="absolute right-20 z-20 mr-50 bottom-0">
                                    <Image
                                        src={slide.logo}
                                        alt="Logo"
                                        width={400}
                                        height={50}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            {/* Conteúdo do slide */}
                            <div className="relative z-10 flex items-center h-full px-6">
                                <div className="max-w-2xl text-white ml-35">
                                    <h1 className="text-5xl font-bold mb-6 ">{slide.title}</h1>
                                    <p className="text-lg leading-relaxed">{slide.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}