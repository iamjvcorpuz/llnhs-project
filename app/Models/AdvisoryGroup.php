<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvisoryGroup extends Model
{
    use HasFactory;
    
    public $table = "advisory_group";

    protected $fillable = [
        'advisory_id',
        'student_id', 
        'description',
        'status'
    ];}
