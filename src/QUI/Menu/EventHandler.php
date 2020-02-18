<?php

namespace QUI\Menu;

use QUI;
use QUI\Interfaces\Projects\Site;

/**
 * Class EventHandler
 *
 * @package QUI\Menu
 */
class EventHandler
{
    /**
     * @return string
     */
    public static function menuCacheName()
    {
        return 'quiqqer/package/menu';
    }

    /**
     * @param Site $Site
     */
    public static function onSiteSave(Site $Site)
    {
        QUI\Cache\Manager::clear(self::menuCacheName());
    }
}
