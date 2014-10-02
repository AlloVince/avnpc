<?php

namespace Avnpc\Controllers;

class ControllerBase extends \Eva\EvaEngine\Mvc\Controller\ControllerBase
{
    public function initialize()
    {
        /*
        $cacheKey = md5($this->request->getURI());
        $this->view->cache(array(
            'lifetime' => 60,
            'key' => $cacheKey,
        ));
        */
        $this->view->setModuleLayout('Avnpc', '/views/layouts/default');
        $this->view->setModuleViewsDir('Avnpc', '/views');
        $this->view->setModulePartialsDir('Avnpc', '/views');
    }

}
