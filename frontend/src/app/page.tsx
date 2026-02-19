
export default function HomePage() {
    return (   
        <div className="flex h-screen">
            <div className="flex flex-1 flex-col">
                <main className="flex-1 overflow-y-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Home page</h1>
                    <p className="text-gray-600">Use the sidebar to navigate through different sections of the dashboard.</p>
                </main>
            </div>
        </div>
    );
}