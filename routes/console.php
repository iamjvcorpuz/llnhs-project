<?php

use App\Jobs\OfflineSyncJob;
use App\Models\AdvisoryGroupSync;
use App\Models\AdvisorySync;
use App\Models\AttendanceSync;
use App\Models\ClassroomsSASync;
use App\Models\ClassroomSync;
use App\Models\ClassSubjectTeachingSync;
use App\Models\ClassTSSync;
use App\Models\ContactsSync;
use App\Models\EducationBackgroundSync;
use App\Models\Employee;
use App\Models\EmployeeSync;
use App\Models\HolidaysSync;
use App\Models\MessengerFBSync;
use App\Models\NotificationsSync;
use App\Models\Parents;
use App\Models\ParentsSync;
use App\Models\SchoolRegistrySync;
use App\Models\SchoolSectionSync;
use App\Models\SchoolYearGradesSync;
use App\Models\SpecializeProgramSync;
use App\Models\SpecificProgramsSync;
use App\Models\Student;
use App\Models\StudentFinalGradesSync;
use App\Models\StudentGuardianSync;
use App\Models\StudentMovementSync;
use App\Models\StudentSync;
use App\Models\SubjectsSync;
use App\Models\TraningsSync;
use App\Models\UserAccounts;
use App\Models\UserAccountsSync;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;


// Schedule::call(function () {
//     $IsKiosk = env('KIOSK', false); 
//     if($IsKiosk == true) { 
//         OfflineSyncJob::dispatchIfNotExists(AttendanceSync::class); 
//     } else {
//         echo ",KIOSK MODE OFF";
//     }
// })->everyTenSeconds()->appendOutputTo(storage_path('logs/cron.log'));

Schedule::call(function () {

    $IsKiosk = env('KIOSK', false);
    $busy = false;
    OfflineSyncJob::dispatchIfNotExists(AttendanceSync::class); 
    if($IsKiosk == true && $busy == false) {

        
        echo "\nExecuted in CONSOLE\n";
        echo "KIOSK MODE ON\n";    
        $UserAccounts = DB::select("SELECT id FROM user_accounts");
        echo "\nUSER ACCOUNTS ";
        echo "LOCAL TOTAL : " . count($UserAccounts) . " :";
        if(count($UserAccounts) == 0) {
            $busy = true;
            echo "\nCREATING USER ACCOUNTS ";
            OfflineSyncJob::dispatchIfNotExists(UserAccountsSync::class);
            // OfflineSyncJob::dispatch(UserAccounts::class, 'sync')->onQueue('offline-sync');
        }
        
        $Parents = DB::select("SELECT id FROM parents");
        echo "\nParents ";
        echo "LOCAL TOTAL : " . count($Parents) . " :";
        if(count($Parents) == 0) {
            echo "\nCREATING PARENTS ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(ParentsSync::class); 
        }

        $Employee = DB::select("SELECT id FROM employee");
        echo "\nEmployee ";
        echo "LOCAL TOTAL : " . count($Employee) . " :";
        if(count($Employee) == 0) {
            echo "\nCREATING EMPLOYEE ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(EmployeeSync::class); 
        }

        $Student = DB::select("SELECT id FROM student");
        echo "\nStudent ";
        echo "LOCAL TOTAL : " . count($Student) . " :";
        if(count($Student) == 0) {
            echo "\nCREATING STUDENT ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(StudentSync::class); 
        }

        $Advisory = DB::select("SELECT id FROM advisory");
        echo "\nAdvisory";
        echo "LOCAL TOTAL : " . count($Advisory) . " :";
        if(count($Advisory) == 0) {
            echo "\nCREATING STUDENT ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(AdvisorySync::class); 
        }

        $AdvisoryGroup = DB::select("SELECT id FROM advisory");
        echo "\nAdvisoryGroup ";
        echo "LOCAL TOTAL : " . count($AdvisoryGroup) . " :";
        if(count($AdvisoryGroup) == 0) {
            echo "\nCREATING AdvisoryGroup ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(AdvisoryGroupSync::class); 
        }

        $ClassSubjectTeaching = DB::select("SELECT id FROM class_teaching");
        echo "\nAdvisoryGroup ";
        echo "LOCAL TOTAL : " . count($ClassSubjectTeaching) . " :";
        if(count($ClassSubjectTeaching) == 0) {
            echo "\nCREATING ClassSubjectTeaching ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(ClassSubjectTeachingSync::class); 
        }

        $Classroom = DB::select("SELECT id FROM classrooms_seats");
        echo "\nclassrooms_seats ";
        echo "LOCAL TOTAL : " . count($Classroom) . " :";
        if(count($Classroom) == 0) {
            echo "\nCREATING Classroom ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(ClassroomSync::class); 
        }

        $ClassroomsSA = DB::select("SELECT id FROM classrooms_seats_assign");
        echo "\nclassrooms_seats_assign ";
        echo "LOCAL TOTAL : " . count($ClassroomsSA) . " :";
        if(count($ClassroomsSA) == 0) {
            echo "\nCREATING ClassroomsSA ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(ClassroomsSASync::class); 
        }
        
        $EducationBackground = DB::select("SELECT id FROM education_background");
        echo "\nEducationBackground";
        echo "LOCAL TOTAL : " . count($EducationBackground) . " :";
        if(count($EducationBackground) == 0) {
            echo "\nCREATING EducationBackground ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(EducationBackgroundSync::class); 
        }
        
        $Holidays = DB::select("SELECT id FROM holidays");
        echo "\nHolidays";
        echo "LOCAL TOTAL : " . count($Holidays) . " :";
        if(count($Holidays) == 0) {
            echo "\nCREATING Holidays ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(HolidaysSync::class); 
        }
        
        $MessengerFB = DB::select("SELECT id FROM messenger");
        echo "\nMessengerFB";
        echo "LOCAL TOTAL : " . count($MessengerFB) . " :";
        if(count($MessengerFB) == 0) {
            echo "\nCREATING MessengerFB ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(MessengerFBSync::class); 
        }
        
        $Notifications = DB::select("SELECT id FROM notifications");
        echo "\nNotifications";
        echo "LOCAL TOTAL : " . count($Notifications) . " :";
        if(count($Notifications) == 0) {
            echo "\nCREATING Notifications ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(NotificationsSync::class); 
        }
        
        $ClassTS = DB::select("SELECT id FROM school_class");
        echo "\nClassTS";
        echo "LOCAL TOTAL : " . count($ClassTS) . " :";
        if(count($ClassTS) == 0) {
            echo "\nCREATING ClassTS ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(ClassTSSync::class); 
        }
        
        $SchoolRegistry = DB::select("SELECT id FROM school_registry");
        echo "\nSchoolRegistry";
        echo "LOCAL TOTAL : " . count($SchoolRegistry) . " :";
        if(count($SchoolRegistry) == 0) {
            echo "\nCREATING nSchoolRegistry ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SchoolRegistrySync::class); 
        }
        
        $SchoolSection = DB::select("SELECT id FROM school_sections");
        echo "\nSchoolSection";
        echo "LOCAL TOTAL : " . count($SchoolSection) . " :";
        if(count($SchoolSection) == 0) {
            echo "\nCREATING SchoolSection ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SchoolSectionSync::class); 
        }
        
        $Subjects = DB::select("SELECT id FROM school_subjects");
        echo "\nSubjects";
        echo "LOCAL TOTAL : " . count($Subjects) . " :";
        if(count($Subjects) == 0) {
            echo "\nCREATING Subjects ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SubjectsSync::class); 
        }
        
        $SchoolYearGrades = DB::select("SELECT id FROM school_year_grades");
        echo "\nSchoolYearGrades";
        echo "LOCAL TOTAL : " . count($SchoolYearGrades) . " :";
        if(count($SchoolYearGrades) == 0) {
            echo "\nCREATING SchoolYearGrades ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SchoolYearGradesSync::class); 
        }
        
        $SpecializeProgram = DB::select("SELECT id FROM specialize_program");
        echo "\nSpecializeProgram";
        echo "LOCAL TOTAL : " . count($SpecializeProgram) . " :";
        if(count($SpecializeProgram) == 0) {
            echo "\nCREATING SpecializeProgram ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SpecializeProgramSync::class); 
        }
        
        $SpecificPrograms = DB::select("SELECT id FROM specific_programs");
        echo "\nSpecificPrograms";
        echo "LOCAL TOTAL : " . count($SpecificPrograms) . " :";
        if(count($SpecificPrograms) == 0) {
            echo "\nCREATING SpecificPrograms ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(SpecificProgramsSync::class); 
        }
        
        $StudentFinalGrades = DB::select("SELECT id FROM student_final_grades");
        echo "\nStudentFinalGrades";
        echo "LOCAL TOTAL : " . count($StudentFinalGrades) . " :";
        if(count($StudentFinalGrades) == 0) {
            echo "\nCREATING StudentFinalGrades ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(StudentFinalGradesSync::class); 
        }
        
        $StudentGuardian = DB::select("SELECT id FROM student_guardians");
        echo "\nStudentFinalGrades";
        echo "LOCAL TOTAL : " . count($StudentGuardian) . " :";
        if(count($StudentGuardian) == 0) {
            echo "\nCREATING StudentGuardian ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(StudentGuardianSync::class); 
        }
        
        $StudentMovement = DB::select("SELECT id FROM student_movement");
        echo "\nStudentMovement";
        echo "LOCAL TOTAL : " . count($StudentMovement) . " :";
        if(count($StudentMovement) == 0) {
            echo "\nCREATING StudentMovement ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(StudentMovementSync::class); 
        }
        
        $Tranings = DB::select("SELECT id FROM tranings");
        echo "\nTranings";
        echo "LOCAL TOTAL : " . count($Tranings) . " :";
        if(count($Tranings) == 0) {
            echo "\nCREATING Tranings ";
            $busy = true;
            OfflineSyncJob::dispatchIfNotExists(TraningsSync::class); 
        }
        
        
    } else if($busy == true) {
        echo "\nConsole is busy";
    } else {
        echo ",KIOSK MODE OFF";
    }
})->everyTenSeconds()->appendOutputTo(storage_path('logs/cron.log'));


// Schedule::command('queue:work --queue=offline-sync --stop-when-empty --tries=3 --memory=1gb --timeout=300')->everyTenSeconds()->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));
Schedule::command('queue:work --queue=offline-sync --stop-when-empty --tries=3 --timeout=30000 --memory=1056M')->everyTenSeconds()->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));