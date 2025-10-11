<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class TraningsSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "tranings";

    protected $fillable = [
        'employee_id', 
        'title',
        'experience',
        'total_render',
        'date_from',
        'date_to',
        'updated_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'employee_id', 
            'title',
            'experience',
            'total_render',
            'date_from',
            'date_to',
            'updated_at'
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
