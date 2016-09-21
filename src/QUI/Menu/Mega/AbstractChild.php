<?php

namespace QUI\Menu\Mega;

use QUI;

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
    protected $children = null;

    /**
     * Return the current site
     *
     * @return mixed|QUI\Projects\Site
     */
    protected function getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }

    /**
     * @return array
     */
    public function getChildren()
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
     */
    public function count()
    {
        return count($this->getChildren());
    }
}
