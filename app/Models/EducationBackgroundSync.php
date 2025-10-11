<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class EducationBackgroundSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "education_background";

    protected $fillable = [
        'employee_id',
        'level',
        'name_of_school',
        'basic_edu_degree_course',
        'period_from',
        'period_to',
        'units',
        'yr_graduated',
        'ac_ah_recieve',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'employee_id',
            'level',
            'name_of_school',
            'basic_edu_degree_course',
            'period_from',
            'period_to',
            'units',
            'yr_graduated',
            'ac_ah_recieve',
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
