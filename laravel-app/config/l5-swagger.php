<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Travel Agency API',
                'description' => 'API for managing travel agency products and services',
                'version' => '1.0.0',
                'termsOfService' => 'http://example.com/terms',
                'contact' => [
                    'name' => 'API Support',
                    'email' => 'support@travelagency.com',
                    'url' => 'http://travelagency.com/support',
                ],
                'license' => [
                    'name' => 'Apache 2.0',
                    'url' => 'http://www.apache.org/licenses/LICENSE-2.0.html',
                ],
            ],
            'routes' => [
                'api' => 'api/documentation',
                'docs' => 'api/docs',
                'oauth2_callback' => 'api/oauth2-callback',
                'middleware' => [
                    'api' => [],
                    'asset' => [],
                    'docs' => [],
                    'oauth2_callback' => [],
                ],
                'group_versions' => false,
            ],
            'paths' => [
                'docs' => storage_path('api-docs'),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'annotations' => [
                    base_path('app/Http/Controllers/API'),
                    base_path('app/Models'),
                ],
                'base' => env('L5_SWAGGER_BASE_PATH', null),
                'excludes' => [],
                'swagger_ui_assets_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),
            ],
            'securityDefinitions' => [
                'securitySchemes' => [
                    'bearerAuth' => [
                        'type' => 'http',
                        'scheme' => 'bearer',
                        'bearerFormat' => 'JWT',
                    ],
                ],
            ],
            'security' => [
                ['bearerAuth' => []],
            ],
            'swagger' => [
                'host' => parse_url(env('APP_URL', 'http://localhost:8000'), PHP_URL_HOST),
                'basePath' => '/api',
                'schemes' => [
                    'http',
                    'https',
                ],
                'consumes' => [
                    'application/json',
                ],
                'produces' => [
                    'application/json',
                ],
            ],
            'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', true),
            'generate_yaml_copy' => env('L5_SWAGGER_GENERATE_YAML_COPY', false),
            'proxy' => env('L5_SWAGGER_PROXY', false),
            'additional_config_url' => null,
            'operations_sort' => 'method',
            'validator_url' => null,
            'ui' => [
                'display' => [
                    'doc_expansion' => 'list',
                    'filter' => true,
                ],
                'authorization' => [
                    'persist_authorization' => false,
                ],
                'oauth2' => [
                    'usePkceWithAuthorizationCodeGrant' => false,
                ],
            ],
        ],
    ],
    'defaults' => [
        'routes' => [
            'docs' => 'docs',
            'oauth2_callback' => 'api/oauth2-callback',
            'middleware' => [
                'web',
                \L5Swagger\Http\Middleware\Config::class,
            ],
            'group_options' => [],
        ],
        'paths' => [
            'docs' => storage_path('api-docs'),
            'docs_json' => 'api-docs.json',
            'docs_yaml' => 'api-docs.yaml',
            'annotations' => [
                base_path('app/Http/Controllers/API'),
                base_path('app/Models'),
            ],
            'views' => base_path('resources/views/vendor/l5-swagger'),
            'base' => env('L5_SWAGGER_BASE_PATH', null),
            'swagger_ui_assets_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),
            'cache' => storage_path('api-docs'),
            'excludes' => [],
        ],
        'scanOptions' => [
            'analyser' => null,
            'analysis' => null,
            'processors' => [],
            'pattern' => null,
            'logger' => null,
            'exclude' => [],
        ],
        'proxy' => false,
        'additional_config_url' => null,
        'constants' => [
            'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost:8000'),
        ],
    ],
];
