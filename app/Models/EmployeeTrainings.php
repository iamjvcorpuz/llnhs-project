<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeTrainings extends Model
{
    use HasFactory;
    
    public $table = "tranings";

    protected $fillable = [
        'employee_id',
        'title', 
        'experience',
        'total_render',
        'date_from',
        'date_to'
    ];
}
