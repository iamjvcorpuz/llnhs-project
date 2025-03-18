<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccounts extends Model
{
    use HasFactory;
    
    public $table = "user_accounts";

    protected $fillable = [
        'user_type', 
        'fullname',
        'username',
        'password',
        'plainpassword'
    ];
    protected $hidden = [
        'password',
        'plainpassword',
    ];

    protected function casts(): array
    {
        return [
            'update_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
