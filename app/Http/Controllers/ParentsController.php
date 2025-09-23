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

        $student = DB::select('SELECT id,uuid, qr_code, first_name, last_name, middle_name, extension_name, sex, status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.uuid) AS total_student FROM parents WHERE status = \'active\' ');

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
    public static function getAllMyChildren($id) 
    {
        return  DB::select('SELECT 
        ROW_NUMBER() OVER () as no, 
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.uuid AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section,
        school_class.track AS track,
        school_class.strands AS strand,
        school_class.level AS grade_level
        FROM student_guardians
        LEFT JOIN student ON student.uuid = student_guardians.student_id
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid AND advisory_group.status = \'active\'
        LEFT JOIN advisory ON advisory.id = advisory_group.advisory_id
        LEFT JOIN school_class ON school_class.id = advisory.school_sections_id
        WHERE  student_guardians.parents_id = ?',[$id]);
    }
    public static function newId() {
        // $id = DB::select('SELECT LAST_INSERT_ID() INTO parents;');
        $d = $trans = Parents::orderBy('id', 'desc')->take(1)->first();
        $id_ = 1;
        if($d != null) {
            $id_ =  $d->id+1;
        }
        return $id_;
    }
    public static function getData($id)
    {
        $student = Parents::findOrFail($id);
        return $student;
    }
    public static function getContacts($id)
    { 
        return  DB::select('SELECT * FROM contacts WHERE guardian_id = ?',[$id]);
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
                'message' => 'Required Fields',
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
            DB::table('parents')->where('id', $customer->id)->update(['uuid' => $customer->id]);
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
            'id' => 'required',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'current_address' => 'required|string'
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
        $Student = DB::table('parents')->where('id', $request->id)->get();
        // $Student = DB::table('parents')
        //         ->where('first_name', '=', $request->first_name)
        //         ->orWhere('last_name', '=', $request->last_name)
        //         ->get();

        if($Student->count()==1) {

            // $customer = Parents::create($request->except(['contact_list']));


            $customer = DB::table('parents')->where('id', $request->id)->update($request->except(['id','contact_list']));

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
    public function updateMessenger(Request $request)
    {
        $validator = null;
        if($request->dmode == "update") {
            
            $validator = Validator::make($request->all(), [ 
                'id' => 'required',
                'messenger_name' => 'required|string',
                'messenger_id' => 'required|int',
                'messenger_email' => 'required|string',
                'contact_id' => 'required|int',
            ]);
             
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

        }



        // echo $request;
        $Student = DB::table('parents')->where('id', $request->id)->get(); 
        $contacts = DB::table('contacts')->where('id', $request->contact_id)->get(); 

        if($Student->count()==1&&$contacts->count()>0) {

            DB::table('contacts')->where('id', $request->contact_id)->update([
                'messenger_name' => $request->messenger_name,
                'messenger_id' => $request->messenger_id
            ]); 

            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
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