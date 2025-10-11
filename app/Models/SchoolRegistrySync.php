<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class SchoolRegistrySync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "school_registry";

    protected $fillable = [
        'region',
        'division', 
        'district',
        'school_id',
        'school_name',
        'school_address',
        'school_year',
        'head_name',
        'head_position',
        'updated_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'region',
            'division', 
            'district',
            'school_id',
            'school_name',
            'school_address',
            'school_year',
            'head_name',
            'head_position',
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
