<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::get('/student',[StudentController::class,'index']);
Route::post('/student',[StudentController::class,'store']); 
Route::post('/student/update',[StudentController::class,'update']);
Route::delete('/student',[StudentController::class,'remove']);
 
Route::get('/teacher',[TeacherController::class,'index']);
Route::post('/teacher',[TeacherController::class,'store']);
Route::post('/teacher/update',[TeacherController::class,'update']);
Route::delete('/teacher',[TeacherController::class,'remove']);

Route::get('/contacts',[ContactsController::class,'index']);
Route::post('/contacts',[ContactsController::class,'store']);

Route::get('/parents',[ParentsController::class,'index']);
Route::post('/parents',[ParentsController::class,'store']);

Route::post('/attendance/account/find',[AttendanceController::class,'findAccount']);
Route::post('/attendance/time/today/all/timelogs',[AttendanceController::class,'getTodaysTimelogs']);
Route::post('/attendance/time/new/entry',[AttendanceController::class,'insertTimelogs']);
Route::post('/attendance/time/logs',[AttendanceController::class,'getTimelogs']);