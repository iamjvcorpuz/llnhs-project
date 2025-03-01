<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    use HasFactory;
    
    public $table = "parents";

    protected $fillable = [
        'qr_code', 
        'first_name',
        'last_name',
        'middle_name',
        'extension_name', 
        'sex',
        'status',
        'picture_base64',
        'email',
    ];
}
