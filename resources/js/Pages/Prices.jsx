import { Head } from '@inertiajs/react';
import Header from '../Components/Header';

export default function Prices() {
    return (
        <>
            <Head title="Prices" />
            
            <div className="min-h-screen bg-zinc-950 text-white">
                <Header />
                <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col justify-center px-6 py-16">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                        Prices
                    </p>
                    <h1 className="text-4xl font-bold">
                        Welcome to the Prices page.
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-zinc-300">
                        This page is rendered by Laravel through Inertia and displayed
                        as a React component.
                    </p>
                </main>
            </div>
        </>
    );
}