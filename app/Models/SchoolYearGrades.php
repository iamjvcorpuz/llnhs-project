<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolYearGrades extends Model
{
    use HasFactory;
    
    public $table = "school_year_grades";

    protected $fillable = [
        'year_grade'
    ];}
