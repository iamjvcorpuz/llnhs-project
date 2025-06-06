<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    use HasFactory;
    
    public $table = "events";

    protected $fillable = [
        'qrcode', 
        'type',
        'event_name',
        'facilitator',
        'location',
        'date',
        'time_start',
        'time_end',
        'description'
    ];}
