<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qrcode = str_pad(fake()->randomNumber(9, true), 10, '0', STR_PAD_LEFT);
        return [
            'qr_code' => $qrcode, 
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name'  => fake()->lastName(),
            'extension_name' => "",
            'bdate' => now()->format('Y-m-d'),
            'sex' => fake()->randomElement(['Male','Female']),
            'status' => 'active',
            'email' => fake()->unique()->safeEmail(),
            'picture_base64' => ""
        ];
    }
}
