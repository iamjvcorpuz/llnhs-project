<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    
    public $table = "employee";

    protected $fillable = [
        'uuid',
        'employee_type',
        'qr_code', 
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'email',
        'picture_base64',
        'civil_status',
        'religion',
        'ethic_group',
        'status',
        'emergency_contact_number',
        'emergency_contact_name',
        'emergency_contact_relation'
    ];
}
