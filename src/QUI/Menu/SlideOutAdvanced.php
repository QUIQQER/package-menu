<?php

/**
 * This file contains \QUI\Menu\SlideOutAdvanced
 */

namespace QUI\Menu;

use QUI;

/**
 * Class MenuAdvanced
 * Creates an slideout menu
 *
 * @package QUI\Menu
 */
class SlideOutAdvanced extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        $this->setAttributes([
            'menuId'              => false, // if set independent menu template will be used
            'showFirstLevelIcons' => false, // current it works only for independent menu
            'showHomeLink'        => true,
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

        $this->addCSSFile(
            \dirname(__FILE__).'/SlideOutAdvanced.css'
        );

        $params = [
            'this'          => $this,
            'Project'       => $this->getProject(),
            'jsControl'     => 'package/quiqqer/menu/bin/SlideoutAdvanced',
            'showShortDesc' => $this->getAttribute('showShortDesc'),
            'showHomeLink'  => $this->getAttribute('showHomeLink')
        ];

        if ($this->getAttribute('menuId')) {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

            $template                      = dirname(__FILE__).'/SlideOutAdvanced.Independent.html';
            $params['FileMenu']            = dirname(__FILE__).'/SlideOutAdvanced.Children.Independent.html';
            $params['IndependentMenu']     = $IndependentMenu;
            $params['Site']                = $this->getSite();
            $params['showFirstLevelIcons'] = $this->getAttribute('showFirstLevelIcons');
        } else {
            $template           = dirname(__FILE__).'/SlideOutAdvanced.html';
            $params['FileMenu'] = dirname(__FILE__).'/SlideOutAdvanced.Children.html';
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
