<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class AttendanceSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "attendance";

    protected $fillable = [
        'uuid', 
        'terminal',
        'terminal_id',
        'mode',
        'type',
        'qr_code',
        'student_id',
        'teacher_id',
        'time',
        'date',
        'status'
    ];
    public function getSyncableFields(): array
    {
        return [
            'uuid', 
            'terminal',
            'terminal_id',
            'mode',
            'type',
            'qr_code',
            'student_id',
            'teacher_id',
            'time',
            'date',
            'status'
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
