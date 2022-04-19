<?php

namespace QUI\Menu\Independent\Items;

use QUI;

class Site extends AbstractMenuItem
{
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.site.title');
    }

    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Site';
    }
}
