<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Xslain\OfflineSync\Traits\Syncable;
use Xslain\OfflineSync\Contracts\SyncableModelInterface;

class StudentSync extends Model implements SyncableModelInterface
{
    use Syncable;
    use HasFactory;
    
    public $table = "student";

    protected $fillable = [
        'uuid',
        'qr_code',
        'lrn',
        'psa_cert_no',
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'status',
        'picture_base64',
        'is_ip',
        'ip_specify',
        'is_4ps_benficiary',
        '4ps_id',
        'is_disability',
        'type_disability',
        'type2_disability',
        'type_others_disability', 
        'cd_hno',
        'cd_sn',
        'cd_barangay',
        'cd_mc',
        'cd_province',
        'cd_country',
        'cd_zip', 
        'is_pa_same_cd',
        'pa_hno',
        'pa_sn',
        'pa_barangay',
        'pa_mc',
        'pa_province',
        'pa_country',
        'pa_zip',
        'lglc',
        'lsyc',
        'lsa',
        'lsa_school_id',
        'flsh_semester',
        'flsh_track',
        'flsh_strand',
        'ldm_applied',
        'mfirst_name',
        'mmiddle_name',
        'mmaiden_name',
        'mlast_name',
        'mextension_name',
        'ffirst_name',
        'fmiddle_name ',
        'flast_name',
        'fextension_name'
    ];

    public function getSyncableFields(): array
    {
        return [
            'uuid',
            'qr_code',
            'lrn',
            'psa_cert_no',
            'first_name',
            'last_name',
            'middle_name',
            'extension_name', 
            'bdate',
            'sex',
            'status',
            'is_ip',
            'ip_specify',
            'is_4ps_benficiary',
            '4ps_id',
            'is_disability',
            'type_disability',
            'type2_disability',
            'type_others_disability', 
            'cd_hno',
            'cd_sn',
            'cd_barangay',
            'cd_mc',
            'cd_province',
            'cd_country',
            'cd_zip', 
            'is_pa_same_cd',
            'pa_hno',
            'pa_sn',
            'pa_barangay',
            'pa_mc',
            'pa_province',
            'pa_country',
            'pa_zip',
            'lglc',
            'lsyc',
            'lsa',
            'lsa_school_id',
            'flsh_semester',
            'flsh_track',
            'flsh_strand',
            'ldm_applied',
            'mfirst_name',
            'mmiddle_name',
            'mmaiden_name',
            'mlast_name',
            'mextension_name',
            'ffirst_name',
            'fmiddle_name ',
            'flast_name',
            'fextension_name'
        ];
    }

    public function getExcludedFields(): array
    {
        return ['picture_base64'];
    }

    public function getSyncPriority(): int
    {
        return 1;  // Higher = sync first
    }
}
