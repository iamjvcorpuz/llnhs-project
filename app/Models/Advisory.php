<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advisory extends Model
{
    use HasFactory;
    
    public $table = "advisory";

    protected $fillable = [
        'qrcode',
        'student_id',
        'section_name',
        'school_year',
        'subject_id',
        'year_level',
        'decription',
        'status'
    ];
}
