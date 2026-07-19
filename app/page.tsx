export default function Home() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <header className="border-b border-default p-6">
        <h1 className="font-space-grotesk text-h1 font-bold">ApexUI</h1>
        <p className="text-secondary text-body mt-2">
          Design Vault — Interactive Component Library
        </p>
      </header>
      <main className="p-6">
        <div className="rounded-sm border border-default bg-card p-8 text-center">
          <p className="text-secondary text-body">Gallery loading...</p>
        </div>
      </main>
    </div>
  );
}
