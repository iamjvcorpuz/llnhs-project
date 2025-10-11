<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class ClassTSSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "school_class";

    protected $fillable = [
        'uuid',
        'qr_code',
        'level',
        'grade',
        'track',
        'strands',
        'classroom',
        'room_number',
        'section_name',
        'school_year',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qr_code',
            'level',
            'grade',
            'track',
            'strands',
            'classroom',
            'room_number',
            'section_name',
            'school_year',
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
