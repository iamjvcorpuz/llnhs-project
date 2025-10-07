<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class UserAccounts extends Authenticatable  implements SyncableModelInterface
{
    use HasFactory, Notifiable, Syncable;
    
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

    protected function casts(): array
    {
        return [
            'update_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getSyncableFields(): array
    {
        return ['uuid', 'user_id', 'user_role_id', 'user_type', 'fullname', 'username', 'password', 'plainpassword', 'updated_at'];
    }

    public function getExcludedFields(): array
    {
        return [];
    }

    public function getSyncPriority(): int
    {
        return 1;  // Higher = sync first
    }
}
