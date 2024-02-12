import Image from "next/image";
import ClientHome from "./client";
export default function Home() {
  return (
    <div>
      <h1 className="text-6xl text-center text-green-200">Cyberpunk Sequence Solver</h1>
      <ClientHome />
    </div>
  );
}
