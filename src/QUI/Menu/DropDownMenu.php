<?php

/**
 * This file contains \QUI\Menu\DropDownMenu
 */

namespace QUI\Menu;

use QUI;

/**
 * Class DropDownMenu
 * Creates an Drop Down Menu
 *
 * @package QUI\Menu
 * @author  www.pcsg.de (Henning Leutz)
 */
class DropDownMenu extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = array())
    {
        parent::__construct($attributes);

        $this->setAttribute('class', 'qui-menu-dropdown');
        $this->setAttribute('qui-class', 'package/quiqqer/menu/bin/DropDownMenu');

        $this->addCSSFile(dirname(__FILE__).'/DropDownMenu.css');
    }

    /**
     * Create the Body
     *
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'this'     => $this,
            'Site'     => $this->_getSite(),
            'Project'  => $this->_getProject(),
            'FileMenu' => dirname(__FILE__).'/DropDownMenu.Children.html'
        ));

        return $Engine->fetch(dirname(__FILE__).'/DropDownMenu.html');
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