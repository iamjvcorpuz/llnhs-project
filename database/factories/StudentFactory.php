<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lrn = str_pad(fake()->randomNumber(9, true), 10, '0', STR_PAD_LEFT);

        return [ 
            'qr_code' => $lrn,
            'lrn'=> $lrn,
            'psa_cert_no' => "none",
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name'  => fake()->lastName(),
            'extension_name' => "",
            'bdate'  => now()->format('Y-m-d'),
            'sex' => fake()->randomElement(['Male','Female']),
            'status' => 'active',
            'picture_base64' => "",
            'is_ip' => false,
            'ip_specify' => "",
            'is_4ps_benficiary' => false,
            '4ps_id' => "",
            'is_disability' => false,
            'type_disability' => "",
            'type2_disability' => "",
            'type_others_disability' => "", 
            'cd_hno' => "1",
            'cd_sn' => "",
            'cd_barangay' => "Poblacion 1",
            'cd_mc' => "Davao City",
            'cd_province' => "Davao Del Sur",
            'cd_country' => "Philippines",
            'cd_zip' => fake()->randomNumber(), 
            'is_pa_same_cd' => "true",
            'pa_hno' => null,
            'pa_sn' => null,
            'pa_barangay' => null,
            'pa_mc' => null,
            'pa_province' => null,
            'pa_country' => null,
            'pa_zip' => null,
            'lglc' => null,
            'lsyc' => null,
            'lsa' => null,
            'lsa_school_id' => null,
            'flsh_semester' => null,
            'flsh_track' => null,
            'flsh_strand' => null,
            'ldm_applied' => null,
        ];
    }
}
