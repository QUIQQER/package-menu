<?php

namespace QUI\Menu\Independent\Items;

use QUI;
use QUI\Locale;

use function is_array;
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
     * @param Locale|null $Locale
     * @return string
     */
    public function getName(Locale $Locale = null): string
    {
        if ($Locale === null) {
            $Locale = QUI::getLocale();
        }

        $data    = $this->getCustomData();
        $current = $Locale->getCurrent();

        if (is_array($data) && isset($data['name'])) {
            if (is_string($data['name'])) {
                $name = json_decode($data['name'], true);
            } else {
                $name = $data['name'];
            }

            if (isset($name[$current])) {
                return $name[$current];
            }
        }

        return $this->getTitle($Locale);
    }

    /**
     * alias for name
     * - can be use for the `a title=""` attribute
     *
     * @param Locale|null $Locale
     * @return string
     */
    public function getTitleAttribute(Locale $Locale = null): string
    {
        return $this->getName($Locale);
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
     * @return string
     */
    public function getRel(): string
    {
        $data = $this->getCustomData();

        if (is_array($data) && isset($data['rel'])) {
            return $data['rel'];
        }

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

    /**
     * @param Locale|null $Locale
     * @return string
     */
    public function getHTML(QUI\Locale $Locale = null): string
    {
        if ($Locale === null) {
            $Locale = QUI::getLocale();
        }

        $url      = $this->getUrl();
        $title    = $this->getTitle($Locale);
        $name     = $this->getName($Locale);
        $relValue = $this->getRel();

        $rel = '';

        if (!empty($relValue)) {
            switch ($relValue) {
                case 'alternate':
                case 'author':
                case 'bookmark':
                case 'external':
                case 'help':
                case 'license':
                case 'next':
                case 'nofollow':
                case 'noopener':
                case 'noreferrer':
                case 'prev':
                case 'search':
                case 'tag':
                    $rel = 'rel="' . $relValue . '"';
                    break;
            }
        }

        return "<a href=\"$url\" title=\"$title\" $rel>$name</a>";
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
