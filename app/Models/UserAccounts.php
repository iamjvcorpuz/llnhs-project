<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserAccounts extends Authenticatable
{
    use HasFactory, Notifiable;
    
    public $table = "user_accounts";

    protected $fillable = [
        'uuid',
        'user_id', 
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

    protected function casts(): array
    {
        return [
            'update_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
