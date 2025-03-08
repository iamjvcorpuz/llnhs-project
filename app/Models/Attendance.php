<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    
    public $table = "attendance";

    protected $fillable = [
        'terminal',
        'terminal_id',
        'mode',
        'type',
        'qr_code',
        'student_id',
        'teacher_id',
        'time',
        'date',
        'status'
    ];
}
