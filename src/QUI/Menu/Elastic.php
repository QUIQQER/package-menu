<?php

/**
 * This file contains \QUI\Menu\Elastic
 */

namespace QUI\Menu;

use QUI;

/**
 * Class Elastic
 * Creates an elastic menu
 *
 * @package QUI\Menu
 * @author www.pcsg.de (Henning Leutz)
 */
class Elastic extends QUI\Control
{
    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'FileMenu' => dirname(__FILE__).'/Elastic.Menu.html',
            'this' => $this,
            'Site' => $this->_getSite(),
            'Project' => $this->_getProject()
        ));

        return $Engine->fetch(dirname(__FILE__).'/Elastic.html');
    }

    /**
     * Return the current site
     *
     * @return mixed|QUI\Projects\Site
     */
    protected function _getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }
}