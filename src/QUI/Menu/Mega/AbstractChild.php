<?php

namespace QUI\Menu\Mega;

use QUI;
use QUI\Exception;
use QUI\Interfaces\Projects\Site;

/**
 * Class AbstractMenu
 * Starting point for menu controls
 *
 * @package QUI\Menu
 */
abstract class AbstractChild extends QUI\Control
{
    /**
     * @var null|array
     */
    protected ?array $children = null;

    /**
     * Return the current site
     *
     * @return Site
     * @throws Exception
     */
    protected function getSite(): QUI\Interfaces\Projects\Site
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }

    /**
     * @return array|null
     * @throws Exception
     */
    public function getChildren(): ?array
    {
        if (is_null($this->children)) {
            $this->children = $this->getSite()->getNavigation();
        }

        return $this->children;
    }

    /**
     * Returns the number of children
     *
     * @return int
     * @throws Exception
     */
    public function count()
    {
        return count($this->getChildren());
    }
}
