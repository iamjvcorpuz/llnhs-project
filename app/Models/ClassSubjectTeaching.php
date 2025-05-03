<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSubjectTeaching extends Model
{
    use HasFactory;
    
    public $table = "class_teaching";

    protected $fillable = [
        'qr_code',
        'subject_id',
        'teacher_id',
        'class_id',
        'subject_name',
        'time_start',
        'time_end',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'description'
    ];
}
