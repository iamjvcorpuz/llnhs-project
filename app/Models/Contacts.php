<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacts extends Model
{
    use HasFactory;
    
    public $table = "contacts";

    protected $fillable = [
        'type',
        'student_id',
        'teacher_id',
        'guardian_id',
        'phone_number',
        'telephone_number',
        'messenger_id',
        'messenger_name',
        'status'
    ];
}
