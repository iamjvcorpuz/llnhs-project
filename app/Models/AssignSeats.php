<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignSeats extends Model
{
    use HasFactory;
    
    public $table = "classrooms_seats";

    protected $fillable = [
        'uuid',
        'class_teaching_id',
        'class_id',
        'subject_id',
        'number_rows',
        'number_columns',
        'total_students',
        'description'
    ];

}
