<?php

/**
 * This file contains QUI\Menu\Controls\FloatedNav
 */

namespace QUI\Menu\Controls;

use QUI;
use QUI\Menu\Independent;

/**
 * Class WallpaperText
 *
 * @package quiqqer/menu
 */
class FloatedNav extends QUI\Control
{
    /**
     * constructor
     *
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // default options
        $this->setAttributes([
            'menuId' => false,
            'size'   => 'medium', // small, medium, large
            'design' => 'iconBar', // iconBar, flat
        ]);

        parent::__construct($attributes);

        $this->addCSSFile(
            dirname(__FILE__).'/FloatedNav.css'
        );
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $size   = 'quiqqer-floatedNav__size-medium';
        $design = 'quiqqer-floatedNav__iconsBar';
        $showLangSwitch = false;

        $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

        if (!$IndependentMenu) {
            return '';
        }

        if ($this->getAttribute('size')) {
            $size = 'quiqqer-floatedNav__size-'.$this->getAttribute('size');
        }

        if ($this->getAttribute('design')) {
            $design = 'quiqqer-floatedNav__'.$this->getAttribute('design');
        }


        $showLangSwitch = true;

        $LangSwitch = new QUI\Bricks\Controls\LanguageSwitches\Flags([
            'showFlags' => 0
        ]);

        $children = $IndependentMenu->getChildren();

        $Engine->assign([
            'this'     => $this,
            'children' => $children,
            'size'     => $size,
            'design'   => $design,
            'showLangSwitch' => $showLangSwitch,
            'LangSwitch' => $LangSwitch
        ]);

        return $Engine->fetch(dirname(__FILE__).'/FloatedNav.html');
    }
}
