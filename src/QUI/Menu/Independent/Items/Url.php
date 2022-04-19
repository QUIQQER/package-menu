<?php

namespace QUI\Menu\Independent\Items;

use QUI;

class Url extends AbstractMenuItem
{
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.url.title');
    }

    /**
     * @return string
     */
    static function itemIcon(): string
    {
        return 'fa fa-globe';
    }

    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Url';
    }
}
