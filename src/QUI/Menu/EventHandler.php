<?php

namespace QUI\Menu;

use QUI;
use QUI\Interfaces\Projects\Site;
use Smarty;
use SmartyException;

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
    public static function menuCacheName(): string
    {
        return 'quiqqer/package/menu';
    }

    /**
     * @param Site $Site
     */
    public static function onSiteSave(Site $Site): void
    {
        QUI\Cache\Manager::clear(self::menuCacheName());
    }

    /**
     * Clear system cache on project save
     *
     * @return void
     */
    public static function onProjectConfigSave(): void
    {
        QUI\Cache\Manager::clear(self::menuCacheName());
    }

    /**
     * Event : on smarty init
     * add new brickarea function
     *
     * @param Smarty $Smarty
     * @throws SmartyException
     */
    public static function onSmartyInit(Smarty $Smarty): void
    {
        if (
            !isset($Smarty->registered_plugins['function'])
            || !isset($Smarty->registered_plugins['function']['menu'])
        ) {
            $Smarty->registerPlugin("function", "menu", "\\QUI\\Menu\\Independent\\Smarty::menu");
        }
    }

    /**
     * QUIQQER Event: onAdminLoadFooter
     *
     * @return void
     */
    public static function onAdminLoadFooter(): void
    {
        $jsFile = URL_OPT_DIR . 'quiqqer/menu/bin/onAdminLoadFooter.js';
        echo '<script src="' . $jsFile . '" async></script>';
    }

    /**
     * @param $menuId
     * @return void
     */
    public static function onQuiqqerMenuIndependentClear($menuId): void
    {
        QUI\Cache\Manager::clear(self::menuCacheName());
    }
}
