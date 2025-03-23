<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSection extends Model
{
    use HasFactory;
    
    public $table = "school_sections";

    protected $fillable = [
        'qrcode',
        'teacher_id',
        'section_name',
        'room_no',
        'subject_id',
        'building_no',
        'decription',
        'status'
    ];
}
