<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class SubjectsSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "school_subjects";

    protected $fillable = [
        'subject_name',
        'description'
    ];

    public function getSyncableFields(): array
    {
        return [
            'subject_name',
            'description'
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
