<?php

namespace Avnpc\Controllers;

use Eva\EvaBlog\Models\Post;
use Eva\EvaBlog\Models\Tag;
use Eva\EvaEngine\Exception;

class PagesController extends ControllerBase
{
    public function indexAction()
    {
        return $this->response->redirect($this->url->get('/'));
    }

    public function pAction()
    {
        $id = $this->dispatcher->getParam('id');
        $post = Post::findFirstById($id);
        if (!$post || (!$preview && $post->status != 'published')) {
            throw new Exception\ResourceNotFoundException('Request post not found');
        }
        return $this->response->redirect($this->url->get('/pages/' . $post->slug));
    }

    public function getAction()
    {
        $slug = $this->dispatcher->getParam('slug');
        $preview = $this->request->getQuery('preview', 'int', 0);
        $post = array();
        if ($slug) {
            $post = Post::findFirstBySlug($slug);
        }
        //Show draft under preview
        if (!$post || (!$preview && $post->status != 'published')) {
            throw new Exception\ResourceNotFoundException('Request post not found');
        }
        $posts = null;
        $this->view->setVar('post', $post);
    }
}
