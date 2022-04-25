<?php

namespace QUI\Menu\Independent\Items;

use QUI;

use function is_array;

/**
 * menu item to an anchor
 */
class Anchor extends AbstractMenuItem
{
    //region frontend item methods

    /**
     * @return string
     */
    public function getUrl(): string
    {
        $data = $this->getCustomData();

        if (is_array($data) && isset($data['url'])) {
            return $data['url'];
        }

        return '';
    }

    /**
     * @param QUI\Locale|null $Locale
     * @return string
     */
    public function getName(QUI\Locale $Locale = null): string
    {
        $data = $this->getCustomData();

        if (is_array($data) && isset($data['name'])) {
            return $data['name'];
        }

        return '';
    }

    //endregion

    //region type stuff

    /**
     * @return string
     */
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.anchor.title');
    }

    /**
     * @return string
     */
    public static function itemIcon(): string
    {
        return 'fa fa-anchor';
    }

    /**
     * @return string
     */
    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Anchor';
    }

    //endregion
}
