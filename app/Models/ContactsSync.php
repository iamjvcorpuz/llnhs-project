<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class ContactsSync extends Model implements SyncableModelInterface
{
    use Syncable;
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
        'status',
        'update_at'
    ];

    public function getSyncableFields(): array
    {
        return [
            'type',
            'student_id',
            'teacher_id',
            'guardian_id',
            'phone_number',
            'telephone_number',
            'messenger_id',
            'messenger_name',
            'status',
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
