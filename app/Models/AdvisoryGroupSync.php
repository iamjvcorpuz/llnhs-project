<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class AdvisoryGroupSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "advisory_group";

    protected $fillable = [
        'advisory_id',
        'student_id', 
        'description',
        'status',
        'update_at'
    ];
    public function getSyncableFields(): array
    {
        return [
            'advisory_id',
            'student_id', 
            'description',
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
