<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalGrade extends Model
{
    use HasFactory;
    
    public $table = "student_final_grades";

    protected $fillable = [
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
        'status'
    ];
}
