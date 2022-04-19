<?php

namespace QUI\Menu\Independent\Items;

use QUI;

class Anchor extends AbstractMenuItem
{
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.anchor.title');
    }

    /**
     * @return string
     */
    static function itemIcon(): string
    {
        return 'fa fa-anchor';
    }

    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Anchor';
    }
}
