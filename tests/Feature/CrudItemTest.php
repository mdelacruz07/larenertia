<?php

namespace Tests\Feature;

use App\Models\CrudItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CrudItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_crud_page_lists_items(): void
    {
        CrudItem::create([
            'name' => 'Sample record',
            'description' => 'Shown in the data table.',
            'status' => 'Active',
        ]);

        $this->get('/crud')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Crud')
                ->has('items', 1)
                ->where('items.0.name', 'Sample record')
            );
    }

    public function test_items_can_be_created(): void
    {
        $this->post('/crud', [
            'name' => 'New record',
            'description' => 'Created from the modal.',
            'status' => 'Pending',
        ])->assertRedirect(route('crud.index'));

        $this->assertDatabaseHas('crud_items', [
            'name' => 'New record',
            'description' => 'Created from the modal.',
            'status' => 'Pending',
        ]);
    }

    public function test_items_can_be_updated(): void
    {
        $item = CrudItem::create([
            'name' => 'Old name',
            'description' => 'Old description',
            'status' => 'Pending',
        ]);

        $this->put("/crud/{$item->id}", [
            'name' => 'Updated name',
            'description' => 'Updated description',
            'status' => 'Archived',
        ])->assertRedirect(route('crud.index'));

        $this->assertDatabaseHas('crud_items', [
            'id' => $item->id,
            'name' => 'Updated name',
            'description' => 'Updated description',
            'status' => 'Archived',
        ]);
    }

    public function test_items_can_be_soft_deleted(): void
    {
        $item = CrudItem::create([
            'name' => 'Delete me',
            'description' => null,
            'status' => 'Active',
        ]);

        $this->delete("/crud/{$item->id}")
            ->assertRedirect(route('crud.index'));

        $this->assertSoftDeleted('crud_items', [
            'id' => $item->id,
        ]);
    }
}
