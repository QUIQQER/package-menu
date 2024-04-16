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
    protected string $append = '';

    /**
     * @var string
     */
    protected string $prepend = '';

    /**
     * append html to the menu
     * adds a html after the menu
     *
     * @param string $html
     */
    public function appendHTML(string $html): void
    {
        $this->append = $html;
    }

    /**
     * prepend html to the menu
     * adds a html before the menu
     *
     * @param string $html
     */
    public function prependHTML(string $html): void
    {
        $this->prepend = $html;
    }
}
