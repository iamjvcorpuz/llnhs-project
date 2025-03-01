<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subjects extends Model
{
    use HasFactory;
    
    public $table = "school_subjects";

    protected $fillable = [
        'subject_name',
        'decription'
    ];
}
