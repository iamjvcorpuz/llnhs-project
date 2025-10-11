<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class StudentFinalGradesSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "student_final_grades";

    protected $fillable = [
        'uuid',
        'grade_level',
        'sy',
        'student_id',
        'teacher_id',
        'class_id',
        'subject_id',
        'subject_name',
        'q1',
        'q2',
        'q3',
        'q4',
        'status',
        'updated_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'grade_level',
            'sy',
            'student_id',
            'teacher_id',
            'class_id',
            'subject_id',
            'subject_name',
            'q1',
            'q2',
            'q3',
            'q4',
            'status',
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