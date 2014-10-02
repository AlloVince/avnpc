<?php

namespace Avnpc\Controllers;

use Eva\EvaBlog\Models\Post;
use Eva\EvaEngine\Exception;

class IndexController extends ControllerBase
{
    public function indexAction()
    {
    }

    public function proxyAction()
    {
        $domain = $this->getDI()->getConfig()->domain;
        return $this->response->setContent(
<<<"HTML"
<!DOCTYPE HTML>
<script src="//cdn.rawgit.com/jpillora/xdomain/gh-pages/dist/0.6/xdomain.min.js" master="http://$domain/"></script>     
HTML
        );
    }
}
