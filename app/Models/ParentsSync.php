<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class ParentsSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "parents";

    protected $fillable = [
        'uuid', 
        'qr_code', 
        'first_name',
        'last_name',
        'middle_name',
        'maiden_name',
        'extension_name', 
        'sex',
        'status',
        'picture_base64',
        'email',
        'bdate',
        'current_address'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid', 
            'qr_code', 
            'first_name',
            'last_name',
            'middle_name',
            'maiden_name',
            'extension_name', 
            'sex',
            'status',
            'picture_base64',
            'email',
            'bdate',
            'current_address'
        ];
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
