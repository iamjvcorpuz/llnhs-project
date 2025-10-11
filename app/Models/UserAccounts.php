<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserAccounts extends Authenticatable 
{
    use HasFactory;
    
    public $table = "user_accounts";

    protected $fillable = [
        'uuid',
        'user_id', 
        'user_role_id',
        'user_type', 
        'fullname',
        'username',
        'password',
        'plainpassword'
    ];
    protected $hidden = [
        'password',
        'plainpassword',
        'remember_token'
    ];
}
