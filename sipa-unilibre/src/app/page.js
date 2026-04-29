import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800">Bienvenido a SIPA</h1>
      <p className="text-gray-500 mt-2">Sistema de Programación Académica</p>
    </MainLayout>
  );
}