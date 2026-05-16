<?php

namespace App\Http\Controllers;

use App\Models\CrudItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrudItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Crud', [
            'items' => CrudItem::query()
                ->latest()
                ->get()
                ->map(fn (CrudItem $item): array => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'status' => $item->status,
                    'created_at' => $item->created_at?->format('M d, Y'),
                    'updated_at' => $item->updated_at?->diffForHumans(),
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        CrudItem::create($this->validatedData($request));

        return redirect()->route('crud.index');
    }

    public function update(Request $request, CrudItem $crudItem): RedirectResponse
    {
        $crudItem->update($this->validatedData($request));

        return redirect()->route('crud.index');
    }

    public function destroy(CrudItem $crudItem): RedirectResponse
    {
        $crudItem->delete();

        return redirect()->route('crud.index');
    }

    /**
     * @return array{name: string, description: ?string, status: string}
     */
    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'string', 'in:Active,Pending,Archived'],
        ]);
    }
}
