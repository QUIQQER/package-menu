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
    public static function onSiteSave(Site $Site)
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
    public static function onSmartyInit(Smarty $Smarty)
    {
        if (!isset($Smarty->registered_plugins['function'])
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
    public static function onAdminLoadFooter()
    {
        $jsFile = URL_OPT_DIR . 'quiqqer/menu/bin/onAdminLoadFooter.js';
        echo '<script src="' . $jsFile . '" async></script>';
    }
}
