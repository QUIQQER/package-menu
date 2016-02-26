<?php

/**
 * This file contains \QUI\Menu\SlideOut
 */

namespace QUI\Menu;

use QUI;

/**
 * Class SlideOut
 * Creates an slideout menu
 *
 * @package QUI\Menu
 * @author  www.pcsg.de (Henning Leutz)
 */
class SlideOut extends QUI\Control
{
    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'FileMenu' => dirname(__FILE__) . '/Menu.Children.html',
            'this' => $this,
            'Site' => $this->getSite(),
            'Project' => $this->getProject(),
            'jsControl' => 'package/quiqqer/menu/bin/SlideOut'
        ));

        return $Engine->fetch(dirname(__FILE__) . '/Menu.html');
    }

    /**
     * Return the current site
     *
     * @return mixed|QUI\Projects\Site
     */
    protected function getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }
}
