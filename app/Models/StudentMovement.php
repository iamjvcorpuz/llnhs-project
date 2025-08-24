<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMovement extends Model
{
    use HasFactory;
    
    public $table = "student_movement";

    protected $fillable = [
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
