<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

use App\Lib\Alarm;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        HttpException::class,
        ModelNotFoundException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        # 404错误不收集了，太多了
        if (strpos(get_class($e), 'NotFoundHttpException') === false) {
            $alarm = new Alarm($e);
            $alarm->log();
        }

        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        $idc = \App\Conf::getIdc();

        # 如果是生产环境，则返回json 500
        if ($idc != 'corp') {
            $result = ['result' => false, 'error' => \Constant::ERROR_SERVER];

            return response()->json($result);
        }

        return parent::render($request, $e);
    }
}
