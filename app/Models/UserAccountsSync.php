<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class UserAccountsSync extends Model implements SyncableModelInterface
{
    use Syncable;
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
    //php artisan offline-sync:sync --model="App\Models\UserAccountsSync"
    // Override for custom sync fields (trait provides defaults)
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
