<?php

namespace QUI\Menu\Independent\Items;

use QUI;
use QUI\Locale;

use function is_string;
use function json_decode;

/**
 * Base class for menu items
 */
abstract class AbstractMenuItem
{
    protected array $attributes = [];
    protected array $children = [];

    /**
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    //region frontend methods

    /**
     * @param ?Locale $Locale
     * @return string
     */
    public function getTitle(Locale $Locale = null): string
    {
        if ($Locale === null) {
            $Locale = QUI::getLocale();
        }

        $current = $Locale->getCurrent();
        $title   = $this->attributes['title'];

        if (is_string($title)) {
            $title = json_decode($title, true);
        }

        if (isset($title[$current])) {
            return $title[$current];
        }

        return '';
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return '';
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return '';
    }

    /**
     * @return string
     */
    public function getIcon(): string
    {
        if (isset($this->attributes['icon'])) {
            return $this->attributes['icon'];
        }

        return '';
    }

    /**
     * @return string
     */
    public function getIdentifier(): string
    {
        return '';
    }

    /**
     * @return mixed
     */
    public function getCustomData()
    {
        if (isset($this->attributes['data'])) {
            return $this->attributes['data'];
        }

        return null;
    }

    //endregion

    //region type stuff

    abstract public static function itemTitle();

    /**
     * @return string
     */
    public static function itemIcon(): string
    {
        return 'fa fa-file-o';
    }

    /**
     * @return string
     */
    public static function itemJsControl(): string
    {
        return '';
    }

    //endregion

    //region children

    /**
     * Return the children of this item
     *
     * @return AbstractMenuItem[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    /**
     * Add a child item
     *
     * @param AbstractMenuItem $Item
     */
    public function appendChild(AbstractMenuItem $Item)
    {
        $this->children[] = $Item;
    }

    //endregion
}
