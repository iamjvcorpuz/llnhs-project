<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Connection Mode
    |--------------------------------------------------------------------------
    |
    | This option controls the default connection mode for the package.
    | When "auto", the package will automatically detect connectivity and
    | switch between offline and online modes. When "offline" or "online",
    | the package will force that specific mode.
    |
    | Supported: "auto", "offline", "online"
    |
    */
    'offline_connection' => 'offline',
    'online_connection' => 'online',
    'conflict_resolution' => 'last_write_wins',
    'sync_batch_size' => 100,
    'auto_sync_on_connect' => true,
    // Add data type mappings if using mixed DBs (e.g., MySQL ↔ PostgreSQL)
    'data_types' => [],
    
    'default_mode' => env('OFFLINE_SYNC_DEFAULT_MODE', 'auto'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here you may specify the database connections to use for offline and
    | online modes. These should correspond to connections defined in your
    | database.php configuration file. Supported drivers: mysql, pgsql, sqlsrv
    |
    | You can mix different database types for offline and online connections:
    | Examples:
    | - MySQL to MySQL: 'mysql_offline', 'mysql_online'
    | - PostgreSQL to PostgreSQL: 'pgsql_offline', 'pgsql_online'  
    | - SQL Server to SQL Server: 'sqlsrv_offline', 'sqlsrv_online'
    | - MySQL to SQL Server: 'mysql_offline', 'sqlsrv_online'
    | - SQL Server to MySQL: 'sqlsrv_offline', 'mysql_online'
    | - PostgreSQL to MySQL: 'pgsql_offline', 'mysql_online'
    |
    */
    'connections' => [
        'offline' => env('OFFLINE_SYNC_OFFLINE_CONNECTION', 'mysql_offline'),
        'online' => env('OFFLINE_SYNC_ONLINE_CONNECTION', 'mysql_online'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Connectivity Check
    |--------------------------------------------------------------------------
    |
    | Configuration for checking online connectivity. The package will
    | periodically check if the online database is reachable.
    |
    */
    'connectivity' => [
        'check_interval' => env('OFFLINE_SYNC_CHECK_INTERVAL', 30), // seconds
        'timeout' => env('OFFLINE_SYNC_TIMEOUT', 5), // seconds
        'retry_attempts' => env('OFFLINE_SYNC_RETRY_ATTEMPTS', 3),
        'test_query' => env('OFFLINE_SYNC_TEST_QUERY', 'SELECT 1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Synchronization Settings
    |--------------------------------------------------------------------------
    |
    | Configure how synchronization should behave between offline and online
    | databases.
    |
    */
    'sync' => [
        'auto_sync' => env('OFFLINE_SYNC_AUTO_SYNC', true),
        'sync_interval' => env('OFFLINE_SYNC_INTERVAL', 60), // seconds
        'batch_size' => env('OFFLINE_SYNC_BATCH_SIZE', 100),
        'max_retries' => env('OFFLINE_SYNC_MAX_RETRIES', 3),
        'retry_delay' => env('OFFLINE_SYNC_RETRY_DELAY', 30), // seconds
        
        // Conflict resolution strategy
        'conflict_resolution' => env('OFFLINE_SYNC_CONFLICT_RESOLUTION', 'latest_wins'),
        // Options: 'latest_wins', 'online_wins', 'offline_wins', 'manual'
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the queue system for handling sync operations.
    |
    */
    'queue' => [
        'enabled' => true,
        'connection' => env('OFFLINE_SYNC_QUEUE_CONNECTION', 'database'),
        'queue' => env('OFFLINE_SYNC_QUEUE_NAME', 'offline-sync'),
        'failed_table' => env('OFFLINE_SYNC_FAILED_TABLE', 'offline_sync_failed_jobs'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    | Configure logging for sync operations.
    |
    */
    'logging' => [
        'enabled' => env('OFFLINE_SYNC_LOGGING_ENABLED', true),
        'level' => env('OFFLINE_SYNC_LOGGING_LEVEL', 'info'),
        'channel' => env('OFFLINE_SYNC_LOGGING_CHANNEL', 'offline-sync'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Model Configuration
    |--------------------------------------------------------------------------
    |
    | Configure which models should be synchronized and their settings.
    |
    */
    'models' => [
        // Example configuration:
        // App\Models\User::class => [
        //     'sync_fields' => ['name', 'email', 'updated_at'],
        //     'exclude_fields' => ['password', 'remember_token'],
        //     'sync_deletes' => true,
        //     'priority' => 1, // Higher numbers sync first
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Validation
    |--------------------------------------------------------------------------
    |
    | Configure data validation and integrity checks.
    |
    */
    'validation' => [
        'verify_checksums' => env('OFFLINE_SYNC_VERIFY_CHECKSUMS', true),
        'validate_foreign_keys' => env('OFFLINE_SYNC_VALIDATE_FK', true),
        'skip_validation_errors' => env('OFFLINE_SYNC_SKIP_VALIDATION_ERRORS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    |
    | Security settings for data synchronization.
    |
    */
    'security' => [
        'encrypt_sync_data' => env('OFFLINE_SYNC_ENCRYPT_DATA', false),
        'encryption_key' => env('OFFLINE_SYNC_ENCRYPTION_KEY'),
        'verify_ssl' => env('OFFLINE_SYNC_VERIFY_SSL', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance
    |--------------------------------------------------------------------------
    |
    | Performance optimization settings.
    |
    */
    'performance' => [
        'use_transactions' => env('OFFLINE_SYNC_USE_TRANSACTIONS', true),
        'chunk_size' => env('OFFLINE_SYNC_CHUNK_SIZE', 1000),
        'memory_limit' => env('OFFLINE_SYNC_MEMORY_LIMIT', '256M'),
        'optimize_queries' => env('OFFLINE_SYNC_OPTIMIZE_QUERIES', true),
    ],
];