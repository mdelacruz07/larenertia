import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Header from '../Components/Header';

const statuses = ['Active', 'Pending', 'Archived'];

function fieldClass(hasError) {
    return [
        'mt-2 w-full rounded-md border bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition',
        hasError
            ? 'border-red-400 focus:border-red-300'
            : 'border-zinc-700 focus:border-emerald-400',
    ].join(' ');
}

function Modal({ children, onClose, title }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-8 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                        aria-label="Close modal"
                    >
                        x
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ItemForm({ form, onSubmit, submitLabel, onCancel }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
            <div>
                <label className="text-sm font-medium text-zinc-200" htmlFor={`${submitLabel}-name`}>
                    Name
                </label>
                <input
                    id={`${submitLabel}-name`}
                    type="text"
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    className={fieldClass(form.errors.name)}
                />
                {form.errors.name && (
                    <p className="mt-1 text-sm text-red-300">{form.errors.name}</p>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-zinc-200" htmlFor={`${submitLabel}-description`}>
                    Description
                </label>
                <textarea
                    id={`${submitLabel}-description`}
                    value={form.data.description}
                    onChange={(event) => form.setData('description', event.target.value)}
                    rows="4"
                    className={fieldClass(form.errors.description)}
                />
                {form.errors.description && (
                    <p className="mt-1 text-sm text-red-300">{form.errors.description}</p>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-zinc-200" htmlFor={`${submitLabel}-status`}>
                    Status
                </label>
                <select
                    id={`${submitLabel}-status`}
                    value={form.data.status}
                    onChange={(event) => form.setData('status', event.target.value)}
                    className={fieldClass(form.errors.status)}
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                {form.errors.status && (
                    <p className="mt-1 text-sm text-red-300">{form.errors.status}</p>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {form.processing ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}

function statusClass(status) {
    const classes = {
        Active: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
        Pending: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
        Archived: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-200',
    };

    return classes[status] ?? classes.Archived;
}

export default function Crud({ items = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);

    const createForm = useForm({
        name: '',
        description: '',
        status: 'Active',
    });

    const updateForm = useForm({
        name: '',
        description: '',
        status: 'Active',
    });

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                (item.description ?? '').toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [items, search, statusFilter]);

    function openCreateModal() {
        createForm.reset();
        createForm.clearErrors();
        setCreateOpen(true);
    }

    function openUpdateModal(item) {
        setEditingItem(item);
        updateForm.clearErrors();
        updateForm.setData({
            name: item.name,
            description: item.description ?? '',
            status: item.status,
        });
    }

    function submitCreate(event) {
        event.preventDefault();

        createForm.post('/crud', {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitUpdate(event) {
        event.preventDefault();

        if (!editingItem) {
            return;
        }

        updateForm.put(`/crud/${editingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingItem(null),
        });
    }

    function confirmDelete() {
        if (!deletingItem) {
            return;
        }

        setDeleteProcessing(true);

        router.delete(`/crud/${deletingItem.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteProcessing(false),
            onSuccess: () => setDeletingItem(null),
        });
    }

    return (
        <>
            <Head title="Crud" />

            <div className="min-h-screen bg-zinc-950 text-white">
                <Header />

                <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                                Crud
                            </p>
                            <h1 className="mt-2 text-3xl font-bold text-white">
                                Records
                            </h1>
                        </div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                        >
                            New record
                        </button>
                    </div>

                    <section className="rounded-lg border border-zinc-800 bg-zinc-900/45">
                        <div className="grid gap-3 border-b border-zinc-800 p-4 md:grid-cols-[1fr_180px]">
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search records"
                                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                            />
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
                            >
                                <option value="All">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-zinc-950/70 text-xs uppercase tracking-wider text-zinc-400">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Name</th>
                                        <th className="px-4 py-3 font-semibold">Description</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Created</th>
                                        <th className="px-4 py-3 font-semibold">Updated</th>
                                        <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <tr key={item.id} className="transition hover:bg-zinc-800/45">
                                                <td className="px-4 py-4 font-medium text-white">
                                                    {item.name}
                                                </td>
                                                <td className="max-w-sm px-4 py-4 text-zinc-300">
                                                    <span className="line-clamp-2">
                                                        {item.description || 'No description'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-zinc-300">
                                                    {item.created_at}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-300">
                                                    {item.updated_at}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openUpdateModal(item)}
                                                            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingItem(item)}
                                                            className="rounded-md border border-red-400/40 px-3 py-1.5 text-sm font-medium text-red-200 transition hover:bg-red-500/10"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-12 text-center text-zinc-400">
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            {createOpen && (
                <Modal title="Create record" onClose={() => setCreateOpen(false)}>
                    <ItemForm
                        form={createForm}
                        onSubmit={submitCreate}
                        submitLabel="Create"
                        onCancel={() => setCreateOpen(false)}
                    />
                </Modal>
            )}

            {editingItem && (
                <Modal title="Update record" onClose={() => setEditingItem(null)}>
                    <ItemForm
                        form={updateForm}
                        onSubmit={submitUpdate}
                        submitLabel="Update"
                        onCancel={() => setEditingItem(null)}
                    />
                </Modal>
            )}

            {deletingItem && (
                <Modal title="Delete record" onClose={() => setDeletingItem(null)}>
                    <div className="space-y-5 px-5 py-5">
                        <p className="text-sm text-zinc-300">
                            Delete <span className="font-semibold text-white">{deletingItem.name}</span>?
                        </p>
                        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-5">
                            <button
                                type="button"
                                onClick={() => setDeletingItem(null)}
                                className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteProcessing}
                                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleteProcessing ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
