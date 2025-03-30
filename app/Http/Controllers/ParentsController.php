<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use App\Models\Parents;
use App\Models\StudentGuardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class ParentsController extends Controller
{
    public function index() 
    {
        // $student = Parents::all();
        // $student = Parents::query([
        //     'total_student' => StudentGuardian::query()->count('parents_id')->where('')
        // ])->addSelect()->get();
        // $student = Parents::select('id')->whereHas('student_guardians',function($query) use ($id){
        //     $query->where('parents_id',$id);
        // })->get();
        // $student = DB::select(`SELECT id, qr_code, first_name, last_name, middle_name, extension_name, sex, status, picture_base64, email FROM parents ORDER BY ? ASC`,['id']);

        $student = DB::select('SELECT id, qr_code, first_name, last_name, middle_name, extension_name, sex, status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student FROM parents');

        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200);
    }
    public static function getAll() 
    {
        return Parents::all();
    }   
    public function show($id)
    {
        $student = Parents::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'current_address'=> 'required'
        ]);

        $contact_list = $request->contact_list;
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $Student = DB::table('parents')
                ->where('first_name', '=', $request->first_name)
                ->orWhere('last_name', '=', $request->last_name)
                ->get();

        if($Student->count()==0) {
            $customer = Parents::create($request->except(['contact_list']));
            if($contact_list != NULL) {
                foreach($contact_list as $key => $val) {
                    $temp = DB::table('contacts')->where('teacher_id',$customer->id)->where('phone_number',$val['phone_number'])->get(); 
                    if($temp->count() == 0) {
                        Contacts::create([
                            'type' => 'guardian',
                            'guardian_id' => $customer->id,
                            'phone_number' => $val['phone_number'],
                            'status' => 'active'
                        ]);
                    }
                }
            } 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $customer
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => []
            ], 200);
        }


    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string'
        ]);

        $contact_list = $request->contact_list;
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $Student = DB::table('parents')
                ->where('first_name', '=', $request->first_name)
                ->orWhere('last_name', '=', $request->last_name)
                ->get();

        if($Student->count()==1) {
            $customer = Parents::create($request->except(['contact_list']));
            if($contact_list != NULL) {
                foreach($contact_list as $key => $val) {
                    $temp = DB::table('contacts')->where('guardian_id',$val['guardian_id'])->where('phone_number',$val['phone_number'])->get(); 
                    if($temp->count() == 0) {
                        Contacts::create([
                            'type' => 'guardian',
                            'guardian_id' => $val['guardian_id'],
                            'phone_number' => $val['phone_number'],
                            'status' => 'active'
                        ]);
                    }
                }
            } 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $customer
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT FOUND",
                'data' => []
            ], 200);
        }


    }
    public function remove(Request $request) {
        $Student = DB::table('parents')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('parents')->where('id', $request->id)->update(['status'=>'remove']);            
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $updateStudent
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT FOUND",
                'data' => []
            ], 200);
        }
    }
}