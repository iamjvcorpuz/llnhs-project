<?php

namespace App\Http\Controllers;

use App\Models\UserAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserAccountsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $useraccounts = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,id,user_id,user_type,fullname,username,password,plainpassword,(SELECT name FROM roles WHERE roles.id = user_accounts.user_role_id) AS "user_role" FROM user_accounts;');
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $useraccounts
        ],200);
    }

    public static function getAll()
    {
        $useraccounts = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,id,user_id,user_type,fullname,username,password,plainpassword,(SELECT name FROM roles WHERE roles.id = user_accounts.user_role_id) AS "user_role" FROM user_accounts;');
        return  $useraccounts;
    }

    public static function getAllStudents()
    {
        $useraccounts = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,id,user_id,user_type,fullname,username,password,plainpassword,(SELECT name FROM roles WHERE roles.id = user_accounts.user_role_id) AS "user_role" FROM user_accounts;');
        return  $useraccounts;
    }

    public static function getAllUsers()
    {
        // return  [
        //     'student' => DB::select('SELECT * FROM student'),
        //     'teacher' => DB::select('SELECT * FROM employee '),// WHERE employee_type = "Teacher"
        //     'guardians' => DB::select('SELECT * FROM parents')
        // ];
        return  [
            'student' => StudentController::getAllActive__(),
            'teacher' => EmployeeController::getAll_(),
            'guardians' => DB::select('SELECT * FROM parents')
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'username' => 'required|string',
            'password' => 'required|string',
            'id' => 'required',
            'fullname' => 'required|string',
            'user_type' => 'required|string',
            'user_role_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user_role_id = 3;
        $user_type = "";

        $roles = DB::table('roles')->where('name','LIKE' ,'%'.$request->user_type.'%')->get(); 
        
        if($roles->count() > 0) {
            $user_role_id = $roles[0]->id;
            $user_type = $roles[0]->name;
        }

        if($user_type == "" || $user_type == null) {
            $user_type = $request->user_type;
        }

        $users_ids = DB::table('user_accounts')->where('user_id', $request->id)->where('user_type', $user_type)->get();

        if($users_ids->count()==0){
            $user_accounts = UserAccounts::factory()->state([
                'user_id' => $request->id,
                'user_type' => $user_type,
                'user_role_id' => $user_role_id,
                'fullname' => $request->fullname,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'plainpassword' => $request->password,
                'verified' => null
            ])->create();
            DB::table('user_accounts')->where('id', $user_accounts->id)->update(['uuid' => $user_accounts->id]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $user_accounts
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA FOUND",
                'data' => []
            ], 200);
        }
        //     $rand_pass = Str::random(10);
        //     UserAccounts::factory()->state([
        //         'user_id' => $val->id,
        //         'user_type' => 'Teacher',
        //         'user_role_id' => 2,
        //         'fullname' => $val->first_name . " " . $val->last_name,
        //         'username' => Str::random(10),
        //         'password' => Hash::make($rand_pass),
        //         'plainpassword' => $rand_pass,
        //         'verified' => null
        //     ])->create();
        // $teacher->each(function($val) {
        //     Contacts::factory()->state([
        //         'type' => 'teacher',
        //         'teacher_id' => $val->id,
        //         'phone_number' => "09758955082",
        //         'status' => 'active'
        //     ])->create();
        //     $rand_pass = Str::random(10);
        //     UserAccounts::factory()->state([
        //         'user_id' => $val->id,
        //         'user_type' => 'Teacher',
        //         'user_role_id' => 2,
        //         'fullname' => $val->first_name . " " . $val->last_name,
        //         'username' => Str::random(10),
        //         'password' => Hash::make($rand_pass),
        //         'plainpassword' => $rand_pass,
        //         'verified' => null
        //     ])->create();
        // });
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAccounts $userAccounts)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserAccounts $userAccounts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'update_username' => 'required|string',
            'update_password' => 'required|string',
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $teacher = DB::table('user_accounts')->where('id', $request->id)->get(); 

        if($teacher->count()==1) {            
            $user_accounts = DB::table('user_accounts')->where('id', $request->id)->update(['username' => $request->update_username,'password' => Hash::make($request->update_password)]); 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $user_accounts
            ], 201);

        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT EXIST",
                'data' => []
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAccounts $userAccounts)
    {
        //
    }
    public function remove(Request $request) {
        $Student = DB::table('user_accounts')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('user_accounts')->where('id', $request->id)->delete();            
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
