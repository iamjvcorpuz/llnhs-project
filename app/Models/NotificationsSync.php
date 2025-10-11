<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class NotificationsSync extends Model implements SyncableModelInterface
{
    use Syncable; 
    use HasFactory;
    
    public $table = "notifications";

    protected $fillable = [
        'uuid',
        'type', 
        'to',
        'message',
        'status',
        'date',
        'time'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'type', 
            'to',
            'message',
            'status',
            'date',
            'time'
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
