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
            'class'           => 'quiqqer-floatedNav',
            'nodeName'        => 'nav',
            'menuId'          => false,
            'posX'            => 'right', // right, left
            'size'            => 'medium', // small, medium, large
            'design'          => 'iconBar', // iconBar, flat
            'animationType'   => false, // false, showOneByOne (show entire control), showSingle (show each entry one by one)
            'animationEasing' => 'easeOutExpo', // see easing names on https://easings.net/
            'showLangSwitch'  => false
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
        $Engine     = QUI::getTemplateManager()->getEngine();
        $LangSwitch = null;

        try {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return '';
        }

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
            case 'flat':
                $design = 'quiqqer-floatedNav__design-'.$this->getAttribute('design');
                break;

            case 'iconBar':
            default:
                $design = 'quiqqer-floatedNav__design-iconsBar';
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
                    'showFlags' => 0,
                    'class'     => 'quiqqer-floatedNav-entry'
                ]);
            } catch (QUI\Exception $Exception) {
                QUI\System\Log::writeException($Exception);
            }
        }

        $animation = '';
        if ($this->getAttribute('animationType')) {
            switch ($this->getAttribute('animationType')) {
                case 'showAll':
                case 'showOneByOne':
                    $this->setJavaScriptControlOption('position', 'right');
                    $this->setJavaScriptControlOption('animationtype', $this->getAttribute('animationType'));
                    $this->setJavaScriptControlOption('animationeasing', $this->getAnimationEasingName());
                    $this->setJavaScriptControl('package/quiqqer/menu/bin/Controls/FloatedNav');
                    $animation = 'quiqqer-floatedNav__animation-'.$this->getAttribute('animationType');
                    break;
            }
        }

        $this->addCSSClass($size);
        $this->addCSSClass($design);
        $this->addCSSClass($posX);
        $this->addCSSClass($animation);

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

    /**
     * Get correct easing name for animation
     * https://easings.net/
     *
     * @return false|mixed|string
     */
    public function getAnimationEasingName()
    {
        switch ($this->getAttribute('animationEasing')) {
            case 'easeInQuad':
            case 'easeInCubic':
            case 'easeInQuart':
            case 'easeInQuint':
            case 'easeInSine':
            case 'easeInExpo':
            case 'easeInCirc':
            case 'easeInBack':
            case 'easeOutQuad':
            case 'easeOutCubic':
            case 'easeOutQuart':
            case 'easeOutQuint':
            case 'easeOutSine':
            case 'easeOutExpo':
            case 'easeOutCirc':
            case 'easeOutBack':
            case 'easeInBounce':
            case 'easeInOutQuad':
            case 'easeInOutCubic':
            case 'easeInOutQuart':
            case 'easeInOutQuint':
            case 'easeInOutSine':
            case 'easeInOutExpo':
            case 'easeInOutCirc':
            case 'easeInOutBack':
            case 'easeInOutBounce':
            case 'easeOutBounce':
            case 'easeOutInQuad':
            case 'easeOutInCubic':
            case 'easeOutInQuart':
            case 'easeOutInQuint':
            case 'easeOutInSine':
            case 'easeOutInExpo':
            case 'easeOutInCirc':
            case 'easeOutInBack':
            case 'easeOutInBounce':
                return $this->getAttribute('animationEasing');

            default:
                return 'easeOutExpo';
        }
    }
}
