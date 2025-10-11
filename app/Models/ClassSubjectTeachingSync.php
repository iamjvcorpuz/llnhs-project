<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;


class ClassSubjectTeachingSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "class_teaching";

    protected $fillable = [
        'uuid',
        'qr_code',
        'subject_id',
        'teacher_id',
        'class_id',
        'subject_name',
        'time_start',
        'time_end',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'description',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qr_code',
            'subject_id',
            'teacher_id',
            'class_id',
            'subject_name',
            'time_start',
            'time_end',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
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
