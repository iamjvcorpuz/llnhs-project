<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTS extends Model
{
    //school_class
    use HasFactory;
    
    public $table = "school_class";

    protected $fillable = [
        'qr_code',
        'level',
        'grade',
        'track',
        'strands',
        'classroom',
        'room_number',
        'section_name',
        'school_year'
    ];
}
