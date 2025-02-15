<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::get('/student',[StudentController::class,'index']);
Route::post('/student',[StudentController::class,'store']);
 
Route::get('/teacher',[TeacherController::class,'index']);
Route::post('/teacher',[TeacherController::class,'store']);


Route::post('/attendance/account/find',[AttendanceController::class,'findAccount']);
Route::post('/attendance/time/entry',[AttendanceController::class,'insertTimelogs']);
Route::post('/attendance/time/today',[AttendanceController::class,'geTodayTimelogs']);