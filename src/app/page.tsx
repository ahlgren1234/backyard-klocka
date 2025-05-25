import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Backyard Klocka
          </h1>
          <p className="text-xl mb-8">
            Din digitala assistent för backyard och frontyard löpartävlingar
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              Skapa och hantera dina löpartävlingar med enkelhet
            </p>
            <p className="text-lg">
              Perfekt för både backyard och frontyard-format
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
