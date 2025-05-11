<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessengerFB extends Model
{
    use HasFactory;
    
    public $table = "messenger";

    protected $fillable = [
        'fullname',
        'email',
        'fb_id'
    ];
}
