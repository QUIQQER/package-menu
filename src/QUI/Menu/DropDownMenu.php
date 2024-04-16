<?php

/**
 * This file contains \QUI\Menu\DropDownMenu
 */

namespace QUI\Menu;

use QUI;

use QUI\Exception;

use QUI\Interfaces\Projects\Site;

use function array_filter;
use function dirname;
use function is_object;
use function md5;
use function serialize;

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
    public function __construct(array $attributes = [])
    {
        $this->setAttribute('class', 'qui-menu-dropdown');
        $this->setAttribute('qui-class', 'package/quiqqer/menu/bin/DropDownMenu');
        $this->setAttribute('icons', false);

        parent::__construct($attributes);

        $this->addCSSFile(dirname(__FILE__) . '/DropDownMenu.css');
    }

    /**
     * Create the Body
     *
     * @return string
     * @throws QUI\Exception
     */
    public function getBody(): string
    {
        $cache = EventHandler::menuCacheName() . '/dropDownMenu/';

        $attributes = $this->getAttributes();
        $attributes = array_filter($attributes, function ($entry) {
            return is_object($entry) === false;
        });

        $cache .= md5(
            $this->getSite()->getCachePath() .
            serialize($attributes)
        );

        try {
            return QUI\Cache\Manager::get($cache);
        } catch (QUI\Exception) {
        }

        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign([
            'this' => $this,
            'Site' => $this->getSite(),
            'Project' => $this->getProject(),
            'FileMenu' => dirname(__FILE__) . '/DropDownMenu.Children.html'
        ]);

        $result = $Engine->fetch(dirname(__FILE__) . '/DropDownMenu.html');

        QUI\Cache\Manager::set($cache, $result);

        return $result;
    }

    /**
     * Return the current site
     *
     * @return Site
     * @throws Exception
     */
    protected function getSite(): QUI\Interfaces\Projects\Site
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }
}
