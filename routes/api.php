<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\SMSController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController; 
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

Route::get('/advisory',[AdvisoryController::class,'getRequiredAllData']);
Route::post('/advisory',[AdvisoryController::class,'store']);
Route::delete('/advisory',[AdvisoryController::class,'remove']);

Route::post('/attendance/account/find',[AttendanceController::class,'findAccount']);
Route::post('/attendance/time/today/all/timelogs',[AttendanceController::class,'getTodaysTimelogs']);
Route::post('/attendance/time/new/entry',[AttendanceController::class,'insertTimelogs']);
Route::post('/attendance/time/logs',[AttendanceController::class,'getTimelogs']);

Route::post('/sms/send/test',[SMSController::class,'testSendSMS']);
Route::post('/sms/send',[SMSController::class,'SendSMS']);
Route::post('/sms/send/attendance',[SMSController::class,'SendSMSAttendance']);
Route::post('/sms/remove/all/outbox',[SMSController::class,'DeleteAllOutboxMSG']);