<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class StudentGuardianSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "student_guardians";

    protected $fillable = [
        'parents_id', 
        'student_id',
        'relationship',
        'added_by'
    ];

    public function getSyncableFields(): array
    {
        return [
            'parents_id', 
            'student_id',
            'relationship',
            'added_by'
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
