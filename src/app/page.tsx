import Image from "next/image";
import slide1 from "./slide1.png"
export default function Home() {
  return (
    <div>
      <section
        className="h-[400px] bg-[#172B72] bg-[url('/slide1.png')] bg-no-repeat bg-cover
          bg-right">
        <div className="flex justify-end">

        </div>
      </section>
      <section>
        <div className="flex min-h-screen items-cente justify-center font-sans">
          <h1 className="text-[#172B72] font-bold flex text-3xl">Indicadores-Chave (KPIs)</h1>

        </div>
      </section>
    </div>
  );
}
