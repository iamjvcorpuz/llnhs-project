<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class AdvisorySync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "advisory";

    protected $fillable = [
        'qrcode',
        'teacher_id',
        'school_sections_id',
        'section_name',
        'year_level',
        'school_year',
        'subject_id',
        'decription',
        'status'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qrcode',
            'teacher_id',
            'school_sections_id',
            'section_name',
            'year_level',
            'school_year',
            'subject_id',
            'decription',
            'status'
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
