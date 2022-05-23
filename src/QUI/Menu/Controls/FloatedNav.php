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
            'menuId'         => false,
            'posX'           => 'right', // right, left
            'size'           => 'medium', // small, medium, large
            'design'         => 'iconBar', // iconBar, flat
            'showLangSwitch' => false
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
        $Engine          = QUI::getTemplateManager()->getEngine();
        $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));
        $LangSwitch      = null;

        if (!$IndependentMenu) {
            return '';
        }

        switch ($this->getAttribute('design')) {
            case 'small':
            case 'medium':
            case 'large':
                $size = 'quiqqer-floatedNav__size-'.$this->getAttribute('size');
                break;

            default:
                $size = 'quiqqer-floatedNav__size-medium';
        }

        switch ($this->getAttribute('design')) {
            case 'iconBar':
            case 'flat':
                $design = 'quiqqer-floatedNav__'.$this->getAttribute('design');
                break;

            default:
                $design = 'quiqqer-floatedNav__iconsBar';
        }

        switch ($this->getAttribute('posX')) {
            case 'left':
            case 'right':
                $posX = 'quiqqer-floatedNav__posX-'.$this->getAttribute('posX');
                break;

            default:
                $posX = 'quiqqer-floatedNav__posX-right';
                break;
        }

        if ($this->getAttribute('showLangSwitch')) {
            try {
                $LangSwitch = new QUI\Bricks\Controls\LanguageSwitches\Flags([
                    'showFlags' => 0
                ]);
            } catch (QUI\Exception $Exception) {
                QUI\System\Log::writeException($Exception);
            }
        }

        $children = $IndependentMenu->getChildren();

        $Engine->assign([
            'this'       => $this,
            'children'   => $children,
            'size'       => $size,
            'posX'       => $posX,
            'design'     => $design,
            'LangSwitch' => $LangSwitch
        ]);

        return $Engine->fetch(dirname(__FILE__).'/FloatedNav.html');
    }
}
