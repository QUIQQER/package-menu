<?php

/**
 * This file contains QUI\Menu\MegaMenu
 */

namespace QUI\Menu;

use QUI;

/**
 * Class MegaMenu
 *
 * @package QUI\Menu
 */
class MegaMenu extends AbstractMenu
{
    /**
     * @var SlideOut
     */
    protected $Mobile = null;

    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        $this->setAttributes([
            'showStart'    => false,
            'Start'        => false,
            'data-qui'     => 'package/quiqqer/menu/bin/MegaMenu',
            'display'      => 'Standard',
            'enableMobile' => true
        ]);

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-menu-megaMenu');
        $this->addCSSFile(dirname(__FILE__).'/MegaMenu.css');

        if (!$this->getAttribute('enableMobile')) {
            return;
        }

        $this->Mobile = new QUI\Menu\SlideOut();

        // defaults
        $this->Mobile->setAttribute('Project', $this->getProject());
        $this->Mobile->setAttribute('Site', $this->getSite());

        $this->Mobile->setAttribute('data-menu-right', 10);
        $this->Mobile->setAttribute('data-menu-top', 15);
        $this->Mobile->setAttribute('data-show-button-on-desktop', 0);
        $this->Mobile->setAttribute('data-qui-options-menu-width', 400);
        $this->Mobile->setAttribute('data-qui-options-menu-button', 0);
        $this->Mobile->setAttribute('data-qui-options-touch', 0);
        $this->Mobile->setAttribute('data-qui-options-buttonids', 'mobileMenu');
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $cache = EventHandler::menuCacheName().'/megaMenu/';

        $cache .= \md5(
            $this->getSite()->getCachePath().
            \serialize($this->getAttributes())
        );

        $childControl = $this->getMenuControl($this->getAttribute('display'));

        try {
            return QUI\Cache\Manager::get($cache);
        } catch (QUI\Exception $Exception) {
        }

        $Engine       = QUI::getTemplateManager()->getEngine();

        if ($this->Mobile) {
            $this->Mobile->setAttribute('Project', $this->getProject());
            $this->Mobile->setAttribute('Site', $this->getSite());

            $this->Mobile->setAttribute('data-menu-right', 10);
            $this->Mobile->setAttribute('data-menu-top', 15);
            $this->Mobile->setAttribute('data-show-button-on-desktop', 0);
            $this->Mobile->setAttribute('data-qui-options-menu-width', 400);
            $this->Mobile->setAttribute('data-qui-options-menu-button', 0);
            $this->Mobile->setAttribute('data-qui-options-touch', 0);
            $this->Mobile->setAttribute('data-qui-options-buttonids', 'mobileMenu');
        }

        $this->setAttribute('data-qui-options-enablemobile', $this->getAttribute('enableMobile'));

        $Engine->assign([
            'this'         => $this,
            'Site'         => $this->getSite(),
            'Project'      => $this->getProject(),
            'Mobile'       => $this->Mobile,
            'Start'        => $this->getStart(),
            'children'     => $this->getStart()->getNavigation(),
            'Rewrite'      => QUI::getRewrite(),
            'jsControl'    => 'package/quiqqer/menu/bin/MegaMenu',
            'prepend'      => $this->prepend,
            'append'       => $this->append,
            'childControl' => $childControl,
            'showMenu'     => true
        ]);

        if ($this->getProject()->getConfig('menu.settings.type') == 'noMenu') {
            $Engine->assign('showMenu', false);
        }

        $result = $Engine->fetch(dirname(__FILE__).'/MegaMenu.html');

        QUI\Cache\Manager::set($cache, $result);

        return $result;
    }

    /**
     * @return QUI\Projects\Site
     */
    public function getStart()
    {
        if ($this->getAttribute('Start')) {
            return $this->getAttribute('Start');
        }

        return $this->getProject()->firstChild();
    }

    /**
     * Return the menu control class name for a menu control shortcut
     *
     * @param $control
     * @return mixed
     */
    public function getMenuControl($control)
    {
        switch ($control) {
            case 'Image':
            case QUI\Menu\Mega\Image::class:
                return QUI\Menu\Mega\Image::class;

            case 'Icons':
            case QUI\Menu\Mega\Icons::class:
                return QUI\Menu\Mega\Icons::class;

            case 'IconsDescription':
            case QUI\Menu\Mega\IconsDescription::class:
                return QUI\Menu\Mega\IconsDescription::class;

            case 'Standard':
            case QUI\Menu\Mega\Standard::class:
                return QUI\Menu\Mega\Standard::class;

            case 'Simple':
            case QUI\Menu\Mega\Simple::class:
                return QUI\Menu\Mega\Simple::class;

            case 'noMenu':
                return false;
        }

        if ($this->getAttribute('display')) {
            switch ($this->getAttribute('display')) {
                case 'Image':
                case QUI\Menu\Mega\Image::class:
                    return QUI\Menu\Mega\Image::class;

                case 'Icons':
                case QUI\Menu\Mega\Icons::class:
                    return QUI\Menu\Mega\Icons::class;

                case 'IconsDescription':
                case QUI\Menu\Mega\IconsDescription::class:
                    return QUI\Menu\Mega\IconsDescription::class;

                case 'Standard':
                case QUI\Menu\Mega\Standard::class:
                    return QUI\Menu\Mega\Standard::class;

                case 'Simple':
                case QUI\Menu\Mega\Simple::class:
                    return QUI\Menu\Mega\Simple::class;

                case 'noMenu':
                    return false;
            }
        }

        return QUI\Menu\Mega\Standard::class;
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
