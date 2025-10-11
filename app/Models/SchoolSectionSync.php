<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class SchoolSectionSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "school_sections";

    protected $fillable = [
        'uuid',
        'qrcode',
        'teacher_id',
        'section_name',
        'room_no',
        'subject_id',
        'building_no',
        'decription',
        'status',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qrcode',
            'teacher_id',
            'section_name',
            'room_no',
            'subject_id',
            'building_no',
            'decription',
            'status',
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
