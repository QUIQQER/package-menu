<?php

namespace QUI\Menu\Independent\Items;

/**
 *
 */
abstract class AbstractMenuItem
{
    protected array $attributes = [];

    /**
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    abstract static function itemTitle();

    /**
     * @return string
     */
    static function itemIcon(): string
    {
        return 'fa fa-file-o';
    }

    static function itemJsControl(): string
    {
        return '';
    }

    // region frontend methods

    /**
     * @return string
     */
    public function getTitle(): string
    {
        if (isset($attributes['title'])) {
            return $attributes['title'];
        }

        return '';
    }

    public function getName()
    {
        if (isset($attributes['name'])) {
            return $attributes['name'];
        }

        return '';
    }

    public function getUrl()
    {
    }

    public function getIcon()
    {
    }

    public function getIdentifier()
    {
    }

    public function getCustomData()
    {
    }

    //endregion
}
