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
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        $this->setAttributes([
            'showHomeLink' => true,
            'menuId' => false, // if set independent menu template will be used
            'showFirstLevelIcons' => false, // current it works only for independent menu
            'collapseMobileSubmenu' => false,
            'showLevel' => 1
        ]);

        parent::__construct($attributes);
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $collapseMobileSubmenu = $this->getAttribute('collapseMobileSubmenu');
        $showLevel = $this->getAttribute('showLevel');

        $params = [
            'this' => $this,
            'Project' => $this->getProject(),
            'jsControl' => 'package/quiqqer/menu/bin/SlideOut',
            'showHomeLink' => $this->getAttribute('showHomeLink')
        ];

        if ($this->getAttribute('menuId')) {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

            $template = dirname(__FILE__) . '/Menu.Independent.html';
            $params['FileMenu'] = dirname(__FILE__) . '/Menu.Children.Independent.html';
            $params['IndependentMenu'] = $IndependentMenu;
            $params['Site'] = $this->getSite();
            $params['collapseMobileSubmenu'] = $collapseMobileSubmenu;
            $params['showLevel'] = $showLevel;
            $params['showFirstLevelIcons'] = $this->getAttribute('showFirstLevelIcons');
        } else {
            $template = dirname(__FILE__) . '/Menu.html';
            $params['collapseMobileSubmenu'] = $collapseMobileSubmenu;
            $params['showLevel'] = $showLevel;
            $params['FileMenu'] = dirname(__FILE__) . '/Menu.Children.html';
            $params['Site'] = $this->getSite();
        }

        $Engine->assign($params);

        return $Engine->fetch($template);
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
