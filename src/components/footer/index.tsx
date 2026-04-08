import Image from "next/image"
import lica from "@/components/footer/lica.png"
import unimontes from "@/components/footer/unimontes.png"
import prefeitura from "@/components/footer/prefeitura.png"
import mail from "@/components/footer/Mail.png"
import phone from "@/components/footer/Phone.png"
import insta from "@/components/footer/Instagram.png"
import Link from "next/link"
export function Footer() {

    return (
        <div>
            <footer className="bg-[#172B72] w-full h-80 p-16 pl-25 pb-20">

                <div className="flex flex-row justify-stretch gap-70">
                    <div className="flex flex-col justify-start">
                        <div className="flex flex-row gap-20">
                            <Image className="w-55 h-8" src={lica} alt="Logo do laboratótio de inteligência computacional aplicada - LICA" />
                            <Image className="w-55 h-9" src={unimontes} alt="Logo da universidade estadual de montes claros - Unimontes" />
                            <Image className="w-55 h-9" src={prefeitura} alt="Logo da prefeitura de montes claros" />
                        </div>
                        <div className="mt-20 ml-20 w-180 flex flex-col justify-center gap-2 text-md">
                            <div className="flex flex-col justify-center">
                                <p className="mb-2 ml-10">Ovitrack - Projeto da dengue com informações epidemiológicas e ambientais </p>

                                <div className="flex justify-center mb-2">
                                    <p>@2025 Desenvolvido por ... </p>
                                </div>
                                <div>
                                    <p>Apoio: Universidade Estadual de Montes Claros (UNIMONTES), Laboratório de Inteligência
                                    </p>
                                    <p className="ml-4">
                                        Computacional Aplicada (LICA), Prefeitura de Montes Claros Secretaria de Saúde (SMS)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mr-40 flex flex-col gap-10">
                        <h2 className="text-2xl font-semibold">Contato:</h2>
                        <div className="text-lg flex flex-col gap-8">
                                <div className="flex flex-row">
                                    <Image src={mail} className="w-6 mr-5" alt="Ícone de e-mail"/>
                                    <p>lica@unimontes.br</p>
                                </div>
                                <div className="flex flex-row">
                                    <Image src={phone} className="w-6 mr-5" alt="Ícone de telefone"/>
                                    <p>(38) 3229-8450</p>
                                    
                                </div>
                                <div className="flex flex-row">
                                    <Image src={insta} className="w-6 mr-5" alt="Ícone da rede social instgram"/>
                                    <Link href={"https://www.instagram.com/lica.unimontes/"}>lica.unimontes</Link>
                                </div>
                        </div>
                    </div>
                </div>


            </footer>
        </div>
    )
}