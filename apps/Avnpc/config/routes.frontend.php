<?php

return array(
    '/' => array(
        'module' => 'Avnpc',
        'controller' => 'index',
        'action' => 'index',
        '_dispatch_cache' => 'lifetime=180&methods=get'
    ),
    '/thinking/(\w+)' => array(
        'module' => 'Avnpc',
        'controller' => 'pages',
        'action' => 'index',
        'id' => 1,
        '_dispatch_cache' => 'lifetime=900&methods=get'
    ),
    '/p/(\d+)' => array(
        'module' => 'Avnpc',
        'controller' => 'pages',
        'id' => 1,
        'action' => 'p',
    ),
    '/pages/([\w-_]+)' => array(
        'module' => 'Avnpc',
        'controller' => 'pages',
        'slug' => 1,
        'action' => 'get',
        '_dispatch_cache' => 'lifetime=900&methods=get'
    ),
);
