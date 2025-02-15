<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    
    public $table = "teacher";

    protected $fillable = [
        'qr_code', 
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'status',
        'email',
        'picture_base64'
    ];
}
