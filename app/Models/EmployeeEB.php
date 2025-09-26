<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeEB extends Model
{
    use HasFactory;
    
    public $table = "education_background";

    protected $fillable = [
        'employee_id',
        'level', 
        'name_of_school',
        'basic_edu_degree_course',
        'period_from',
        'period_to',
        'units',
        'yr_graduated',
        'ac_ah_recieve'
    ];
}
