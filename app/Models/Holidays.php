<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holidays extends Model
{
    //school_class
    use HasFactory;
    
    public $table = "holidays";

    protected $fillable = [
        'type',
        'event_name',
        'date',
        'time_start',
        'time_end',
        'description'
    ];
}
