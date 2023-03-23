<?php

/**
 * This file contains \QUI\Menu\MenuAdvanced
 */

namespace QUI\Menu;

use QUI;

/**
 * Class MenuAdvanced
 * Creates an slideout menu
 *
 * @package QUI\Menu
 */
class MenuAdvanced extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        $this->setAttributes([
            'showHomeLink'        => true,
            'menuId'              => false, // if set independent menu template will be used
            'showFirstLevelIcons' => false, // current it works only for independent menu
            'showHomeIcon'        => true,
            'showShortDesc'       => true,
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

        $showHomeIcon  = $this->getAttribute('showHomeIcon');
        $showShortDesc = $this->getAttribute('showShortDesc');

        $backBtnText = QUI::getLocale()->get(
            'quiqqer/menu',
            'mobileMenu.advanced.backBtn.text'
        );

        $this->addCSSFile(
            \dirname(__FILE__) . '/MenuAdvanced.css'
        );

        $params = [
            'this'           => $this,
            'Project'        => $this->getProject(),
            'jsControl'      => 'package/quiqqer/menu/bin/MenuAdvanced',
            'showHomeLink'   => $this->getAttribute('showHomeIcon'),
            'showShortDesc' => $this->getAttribute('showShortDesc'),
            'backBtn'        => $backBtnText
        ];

        if ($this->getAttribute('menuId')) {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

            $template                      = dirname(__FILE__) . '/MenuAdvanced.Independent.html';
            $params['FileMenu']            = dirname(__FILE__) . '/MenuAdvanced.Children.Independent.html';
            $params['IndependentMenu']     = $IndependentMenu;
            $params['Site']                = $this->getSite();
            $params['showFirstLevelIcons'] = $this->getAttribute('showFirstLevelIcons');
        } else {
            $template           = dirname(__FILE__) . '/MenuAdvanced.html';
            $params['FileMenu'] = dirname(__FILE__) . '/MenuAdvanced.Children.html';
            $params['Site']     = $this->getSite();
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
