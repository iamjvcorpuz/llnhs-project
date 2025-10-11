<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class ClassroomSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "classrooms";

    protected $fillable = [
        'room_number',
        'floor_number',
        'building_no',
        'description',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'room_number',
            'floor_number',
            'building_no',
            'description',
            'update_at'
        ];
    }

    public function getExcludedFields(): array
    {
        return [];
    }

    public function getSyncPriority(): int
    {
        return 1;  // Higher = sync first
    }
}
