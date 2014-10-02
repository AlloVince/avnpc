<?php

namespace Avnpc\Controllers;

use Eva\EvaBlog\Models\Post;
use Eva\EvaBlog\Models\PostSearcher;
use Eva\EvaBlog\Models\Tag;
use Eva\EvaEngine\Exception;
use Eva\Wiki\Utils\WikiUtil;

class NodeController extends ControllerBase
{
    public function indexAction()
    {
        return $this->response->redirect('/news');
    }

    public function nodeAction()
    {
        $id = $this->dispatcher->getParam('id');
        $preview = $this->request->getQuery('preview', 'int', 0);
        if (is_numeric($id)) {
            $post = PostSearcher::findFirst($id);
        } else {
            $post = PostSearcher::findFirstBySlug($id);
        }
        //Show draft under preview
        if (!$post || (!$preview && $post->status != 'published')) {
            throw new Exception\ResourceNotFoundException('Request post not found');
        }
        if ($this->getDI()->getModuleManager()->hasModule('Wiki')) {
            //$post->text->content = WikiUtil::highlight($post->text->content);
        }

        $posts = null;

//        if ($post->connections->count() < 1 && $post->tags->count() > 0) {
//            $tag = new Tag();
//            $post->connections = $tag->getRelatedPosts($post->id, 3);
//        }
        $this->view->setVar('relatedPosts', $post->getRelatedPosts($post->id));
//        $this->view->setVar('relatedPosts', array());
        $appKeys4share = array();
        $oauthConfigs = $this->getDI()->getConfig()->oauth->toArray();

        // 支持以下自定义：
        //  "tsina":"sinaweibo",
        //  "tqq":"tencentweibo",
        //  "t163":"netease",
        //  "tsouhu":"sohuweibo",
        //  "tpeople":"renminwang"
        if (isset($oauthConfigs['oauth2']['weibo'])) {
            $appKeys4share['tsina'] = '4ildYm';
        }
        if (isset($oauthConfigs['oauth2']['tencent'])) {
            $appKeys4share['tqq'] = $oauthConfigs['oauth2']['tencent']['consumer_key'];
        }
        if (isset($oauthConfigs['oauth1']['sohu'])) {
            $appKeys4share['tsouhu'] = $oauthConfigs['oauth1']['sohu']['consumer_key'];
        }

        $this->view->setVar('appKeys4share', $appKeys4share);
        $this->view->setVar('post', $post);
    }
}
