<?php

/**
 * This file contains QUI\Menu\MegaMenu
 */

namespace QUI\Menu;

use Exception;
use QUI;

use function array_filter;
use function array_merge;
use function array_unique;
use function is_object;
use function md5;
use function serialize;

/**
 * Class MegaMenu
 *
 * @package QUI\Menu
 */
class MegaMenu extends AbstractMenu
{
    /**
     * @var SlideOut|SlideOutAdvanced|null
     */
    protected SlideOutAdvanced|null|SlideOut $Mobile = null;

    /**
     * @var array
     */
    protected array $subMenus = [];

    /**
     * @param array $attributes
     * @throws QUI\Exception
     * @throws Exception
     */
    public function __construct(array $attributes = [])
    {
        $this->setAttributes([
            'showStart' => false,
            'Start' => false,
            'startText' => '', // optional: displayed text
            'data-qui' => 'package/quiqqer/menu/bin/MegaMenu',
            'display' => 'Standard',
            'enableMobile' => true,
            'menuId' => false,
            'showFirstLevelIcons' => false, // current it works only for independent menu
            'showMenuDelay' => false,
            'collapseSubmenu' => false,
            'showLevel' => 1,
            'showHomeLink' => false,
            'showShortDesc' => false,
            'breakPoint' => 767
        ]);

        if ($this->getProject()->getConfig('menu.settings.type')) {
            $this->setAttribute('display', $this->getProject()->getConfig('menu.settings.type'));
        }

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-menu-megaMenu');
        $this->addCSSFile(dirname(__FILE__) . '/MegaMenu.css');

        if (!$this->getAttribute('enableMobile')) {
            return;
        }

        $slideOutParam = [
            'showHomeLink' => true
        ];

        if ($this->getAttribute('menuId')) {
            $slideOutParam['menuId'] = $this->getAttribute('menuId');
        }

        $this->Mobile = $this->getMobileMenu($slideOutParam);

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
     * @throws Exception
     */
    public function getBody(): string
    {
        $cache = EventHandler::menuCacheName() . '/megaMenu/';

        $attributes = $this->getAttributes();
        $attributes = array_filter($attributes, function ($entry) {
            return is_object($entry) === false;
        });

        $cache .= md5(
            $this->getSite()->getCachePath() .
            serialize($attributes)
        );

        $childControl = $this->getMenuControl($this->getAttribute('display'));

        $showMenuDelay = 0;

        if (intval($this->getProject()->getConfig('menu.settings.showMenuDelay')) >= 0) {
            $showMenuDelay = intval($this->getProject()->getConfig('menu.settings.showMenuDelay'));
        }

        if (
            $this->getAttribute('showMenuDelay') !== '' &&
            $this->getAttribute('showMenuDelay') !== false &&
            intval($this->getAttribute('showMenuDelay')) >= 0
        ) {
            $showMenuDelay = intval($this->getAttribute('showMenuDelay'));
        }

        try {
            $cacheResult = QUI\Cache\Manager::get($cache);

            // load css files from the controls
            $cssFiles = [];

            foreach ($cacheResult['subMenus'] as $childControl) {
                $Instance = new $childControl();
                $cssFiles = array_merge($cssFiles, $Instance->getCSSFiles());
            }

            foreach ($cssFiles as $cssFile) {
                QUI\Control\Manager::addCSSFile($cssFile);
            }

            return $cacheResult['html'];
        } catch (QUI\Exception $Exception) {
        }

        $Engine = QUI::getTemplateManager()->getEngine();

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

        $this->setAttribute('data-qui-options-enablemobile', $this->getAttribute('enableMobile') ? 1 : 0);
        $this->setAttribute('data-qui-options-showmenuafter', $showMenuDelay);

        $breakPoint = intval($this->getProject()->getConfig('mobileMenu.settings.breakPoint'));

        if (!$breakPoint) {
            $breakPoint = intval($this->getAttribute('breakPoint'));
        }

        if ($breakPoint < 1) {
            $breakPoint = 767;
        }

        if ($this->getAttribute('menuId')) {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

            $children = $IndependentMenu->getChildren();

            $Engine->assign([
                'this' => $this,
                'Mobile' => $this->Mobile,
                'children' => $children,
                'prepend' => $this->prepend,
                'append' => $this->append,
                'childControl' => $childControl,
                'showMenu' => true,
                'breakPoint' => $breakPoint
            ]);

            $result = [];
            $result['html'] = $Engine->fetch(dirname(__FILE__) . '/MegaMenu.Independent.html');
        } else {
            $Engine->assign([
                'this' => $this,
                'Site' => $this->getSite(),
                'Project' => $this->getProject(),
                'Mobile' => $this->Mobile,
                'Start' => $this->getStart(),
                'children' => $this->getStart()->getNavigation(),
                'Rewrite' => QUI::getRewrite(),
                'jsControl' => 'package/quiqqer/menu/bin/MegaMenu',
                'prepend' => $this->prepend,
                'append' => $this->append,
                'childControl' => $childControl,
                'showMenu' => true,
                'breakPoint' => $breakPoint
            ]);

            if ($this->getProject()->getConfig('menu.settings.type') == 'noMenu') {
                $Engine->assign('showMenu', false);
            }

            $result = [];
            $result['html'] = $Engine->fetch(dirname(__FILE__) . '/MegaMenu.html');
        }

        $result['subMenus'] = array_unique($this->subMenus);

        QUI\Cache\Manager::set($cache, $result);

        return $result['html'];
    }

    /**
     * @return QUI\Interfaces\Projects\Site
     * @throws QUI\Exception
     * @throws Exception
     */
    public function getStart(): QUI\Interfaces\Projects\Site
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
     * @return false|string
     */
    public function getMenuControl($control): bool|string
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
     * @param $subMenu
     */
    public function addSubMenu($subMenu): void
    {
        $this->subMenus[] = $subMenu;
    }

    /**
     * Return the current site
     *
     * @return QUI\Interfaces\Projects\Site
     * @throws QUI\Exception
     */
    protected function getSite(): QUI\Interfaces\Projects\Site
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }

    /**
     * Get mobile menu (slideout or slideoutAdvanced) depend on project setting
     *
     * @param $slideOutParam
     * @return SlideOutAdvanced|SlideOut
     * @throws QUI\Exception
     * @throws Exception
     */
    protected function getMobileMenu($slideOutParam): SlideOut|SlideOutAdvanced
    {
        if ($this->getProject()->getConfig('mobileMenu.settings.type') == 'slideoutAdvanced') {
            $Menu = new QUI\Menu\SlideOutAdvanced($slideOutParam);

            $showHomeLink = $this->getAttribute('showHomeLink');
            if ($this->getProject()->getConfig('mobileMenu.slideoutAdvanced.settings.homeLink') !== '') {
                $showHomeLink = $this->getProject()->getConfig('mobileMenu.slideoutAdvanced.settings.homeLink');
            }

            $showShortDesc = $this->getAttribute('showShortDesc');
            if ($this->getProject()->getConfig('mobileMenu.slideoutAdvanced.settings.shortDesc') !== '') {
                $showShortDesc = $this->getProject()->getConfig('mobileMenu.slideoutAdvanced.settings.shortDesc');
            }

            $Menu->setAttribute('showHomeLink', $showHomeLink);
            $Menu->setAttribute('showShortDesc', $showShortDesc);

            return $Menu;
        }

        $Menu = new QUI\Menu\SlideOut($slideOutParam);

        $collapseMobileSubmenu = $this->getAttribute('collapseSubmenu');

        if ($this->getProject()->getConfig('mobileMenu.standard.settings.collapseSubmenu') !== '') {
            $collapseMobileSubmenu = $this->getProject()->getConfig('mobileMenu.standard.settings.collapseSubmenu');
        }

        $showLevel = $this->getAttribute('showLevel');
        if (intval($this->getProject()->getConfig('mobileMenu.standard.settings.showLevel')) > 0) {
            $showLevel = intval($this->getProject()->getConfig('mobileMenu.standard.settings.showLevel'));
        }

        $Menu->setAttribute('collapseMobileSubmenu', $collapseMobileSubmenu);
        $Menu->setAttribute('showLevel', $showLevel);

        return $Menu;
    }
}
