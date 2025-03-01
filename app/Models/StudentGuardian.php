<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGuardian extends Model
{
    use HasFactory;
    
    public $table = "student_guardians";

    protected $fillable = [
        'parents_id', 
        'student_id',
        'added_by'
    ];
}
