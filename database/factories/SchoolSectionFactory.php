<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolSection>
 */
class SchoolSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [ 
            'teacher_id' => null,
            'section_name' => fake()->colorName(),
            'room_no' => fake()->buildingNumber(), 
            'building_no' => fake()->buildingNumber(),
            'description' => "",
            'status' => "active"
        ];
    }
}
