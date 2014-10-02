#!/usr/bin/env php
<?php
// +----------------------------------------------------------------------
// | [phalcon]
// +----------------------------------------------------------------------
// | Author: Mr.5 <mr5.simple@gmail.com>
// +----------------------------------------------------------------------
// + Datetime: 14-7-16 14:18
// +----------------------------------------------------------------------
// + console.php 控制台入口文件
// +----------------------------------------------------------------------

set_time_limit(0);
$_start_time = microtime(true);
require __DIR__ . '/init_autoloader.php';

// 去除参数中的脚本名称
array_shift($argv);
// 取出 appName ，命令行的第一个参数
$appName = array_shift($argv);
/*
|--------------------------------------------------------------------------
| 初始化 engine
|--------------------------------------------------------------------------
|
| 第一个参数为 APP 的根目录
| 第二个参数为 APP 的名称，用于定位配置文件，配置文件放置在 /config/ 目录，
| 配置文件命名规则为 modules.{appName}.php
| 第三个参数为 APP 的运行模式，支持 web 和 cli，默认是 web , 命令行模式下使用 cli
|
|
*/
$engine = new \Eva\EvaEngine\Engine(__DIR__ . '/', $appName ? $appName : 'evaengine', 'cli');
$engine
    ->loadModules(include __DIR__ . '/config/modules.' . $engine->getAppName() . '.php')
    ->bootstrap();
/** @var  $output Eva\EvaEngine\CLI\Output\ConsoleOutput */
$output = $engine->getDI()->getOutput();


try {
    /** @var  $dispatcher Phalcon\CLI\Dispatcher */
    $dispatcher = $engine->getDI()->getDispatcher();


    $engine->getApplication()->handle(
        array(
            'module' => $dispatcher->getModuleName(),
            'task' => $dispatcher->getTaskName(),
            'action' => $dispatcher->getActionName(),
            'params' => $dispatcher->getParams()
        )
    );

} catch (\Phalcon\Exception $e) {
    $output->writeln('<error>  [ERROR]：' . $e->getMessage() . '  </error>');
    $output->writeln('');
    $output->writeln('<comment>' . $e->getTraceAsString() . '</comment>');
    exit(255);
}


// 输出内存使用情况，
$output->writelnInfo(
    sprintf(
        "\n" . 'Memory usage: %sMB (peak: %sMB), time cost: %ss',
        memory_get_usage(true) / 1024 / 1024,
        memory_get_peak_usage(true) / 1024 / 1024,
        microtime(true) - $_start_time
    )
);