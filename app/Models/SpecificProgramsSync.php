<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class SpecificProgramsSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "specific_programs";

    protected $fillable = [
        'name',
        'acronyms',
        'definition',
        'description',
        'updated_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'name',
            'acronyms',
            'definition',
            'description',
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