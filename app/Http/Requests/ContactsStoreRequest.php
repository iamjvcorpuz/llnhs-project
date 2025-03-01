<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactsStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string|max:255',
            'student_id' => 'required|string|max:255',
            'teacher_id' => 'required|string|max:255',
            'guardian_id' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'telephone_number' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'status' => 'required|string|max:255'
        ];
    }
}
