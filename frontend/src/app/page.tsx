import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function HomePage() {
  return (
    <>
    <Header />
    <div className="flex-1 flex flex-row">
        <Sidebar />
        <main className="flex items-center justify-items-center w-full">
          {/* Content area - Add your main content elements here */}
          <div className="mx-auto">
            <h1 className="text-2xl font-bold">Main Content</h1>
            <p>This is where you can place various components, forms, etc.</p>
          </div>
        </main>
    </div>
    </>
  );
}