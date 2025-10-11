<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class StudentMovementSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "student_movement";

    protected $fillable = [
        'uuid',
        'id', 
        'student_id',
        'student_lrn',
        'sy',
        'grade_level',
        'repeat_grade_level',
        'track',
        'track_id',
        'strand',
        'strand_id',
        'semester_1st',
        'semester_2nd',
        'movement_status',
        'transferee',
        'transfer_grade_level',
        'transfer_sy_completed',
        'transfer_school_attended',
        'transfer_school_id',
        'balik_aral',
        'balik_aral_date',
        'with_lrn',
        'status'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'id', 
            'student_id',
            'student_lrn',
            'sy',
            'grade_level',
            'repeat_grade_level',
            'track',
            'track_id',
            'strand',
            'strand_id',
            'semester_1st',
            'semester_2nd',
            'movement_status',
            'transferee',
            'transfer_grade_level',
            'transfer_sy_completed',
            'transfer_school_attended',
            'transfer_school_id',
            'balik_aral',
            'balik_aral_date',
            'with_lrn',
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
