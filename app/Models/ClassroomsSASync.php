<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class ClassroomsSASync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;

    public $table = "classrooms_seats_assign";

    protected $fillable = [
        'classrooms_seats_id',
        'class_id',
        'student_id',
        'seat_number',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'classrooms_seats_id',
            'class_id',
            'student_id',
            'seat_number',
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
