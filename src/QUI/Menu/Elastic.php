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
 * @author  www.pcsg.de (Henning Leutz)
 */
class Elastic extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign([
            'FileMenu' => dirname(__FILE__) . '/Menu.Children.html',
            'this' => $this,
            'Site' => $this->getSite(),
            'Project' => $this->getProject(),
            'jsControl' => 'package/quiqqer/menu/bin/ElasticMenu'
        ]);

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
