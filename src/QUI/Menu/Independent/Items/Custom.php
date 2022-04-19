<?php

namespace QUI\Menu\Independent\Items;

use QUI;

class Custom extends AbstractMenuItem
{
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.custom.title');
    }

    /**
     * @return string
     */
    static function itemIcon(): string
    {
        return 'fa fa-keyboard-o';
    }

    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Custom';
    }
}
