import { Head } from '@inertiajs/react';
import Header from '../Components/Header';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-zinc-950 text-white">
                <Header />

                <main className="grid min-h-[calc(100vh-73px)] place-items-center px-6">
                    <h1 className="text-center text-4xl font-bold">
                        Laravel 13 + React + Tailwind + Inertia2
                    </h1>
                </main>
            </div>
        </>
    );
}
