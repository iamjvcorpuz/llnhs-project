<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class EventsSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "events";

    protected $fillable = [
        'uuid',
        'qrcode', 
        'type',
        'event_name',
        'facilitator',
        'location',
        'date',
        'time_start',
        'time_end',
        'description',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qrcode', 
            'type',
            'event_name',
            'facilitator',
            'location',
            'date',
            'time_start',
            'time_end',
            'description',
            'update_at'
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
