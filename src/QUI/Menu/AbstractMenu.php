<?php

namespace QUI\Menu;

use QUI;

/**
 * Class AbstractMenu
 * Starting point for menu controls
 *
 * @package QUI\Menu
 */
abstract class AbstractMenu extends QUI\Control
{
    /**
     * @var string
     */
    protected $append = '';

    /**
     * @var string
     */
    protected $prepend = '';

    /**
     * append html to the menu
     * adds a html after the menu
     *
     * @param string $html
     */
    public function appendHTML($html)
    {
        $this->append = $html;
    }

    /**
     * prepend html to the menu
     * adds a html before the menu
     *
     * @param string $html
     */
    public function prependHTML($html)
    {
        $this->prepend = $html;
    }
}
