<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    
    public $table = "student";

    protected $fillable = [
        'qr_code',
        'lrn',
        'psa_cert_no',
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'status',
        'picture_base64'
    ];
}
