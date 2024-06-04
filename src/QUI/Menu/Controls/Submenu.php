<?php

/**
 * This file contains \QUI\Menu\Controls\Submenu
 */

namespace QUI\Menu\Controls;

use QUI;
use QUI\Exception;
use QUI\Menu\Independent;
use QUI\Projects\Site\Utils;

/**
 * Class Subumenu
 *
 *  It creates a submenu navigation
 *
 *  This control is supposed to work with QUI Independent Menu, but you can use it with QUI Site.
 *  You have to pass a menu ID or a parent page.
 *
 * @package QUI\Menu
 * @author www.pcsg.de (Michael Danielczok)
 */
class Submenu extends QUI\Control
{
    private string $templateFile;
    private string $templateCssFile;

    /**
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        // defaults values
        $this->setAttributes([
            'class' => 'quiqqer-submenu',
            'startId' => false, // id or site link
            'menuId' => false, // id of an independent menu
            'template' => 'list.buttonStyle', // 'list.buttonStyle', 'list.simple'
            'useIcons' => false,
            'linkColor' => 'inherit',
            'linkColorHover' => 'inherit',
            'itemsAlignment' => 'flex-start' // 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
        ]);

        parent::__construct($attributes);

        $this->setAttribute('cacheable', false);
    }

    /**
     * (non-PHPdoc)
     *
     * @throws Exception
     * @see \QUI\Control::create()
     */
    public function getBody(): string
    {
        $isIndependentMenu = false;

        if ($this->getAttribute('menuId')) {
            // independent menu
            $children = $this->getChildrenForIndependentMenu();
            $isIndependentMenu = true;
        } elseif ($this->getAttribute('startId')) {
            // qui site
            $children = $this->getChildrenForQUISite();
            $this->templateFile = dirname(__FILE__) . '/Submenu.List.html';
        } else {
            return '';
        }

        $Engine = QUI::getTemplateManager()->getEngine();

        if ($this->getAttribute('linkColor')) {
            $this->setCustomVariable(
                'linkColor',
                $this->getAttribute('linkColor')
            );
        }

        if ($this->getAttribute('linkColorHover')) {
            $this->setCustomVariable(
                'linkColor--hover',
                'var(--qui-primary, ' . $this->getAttribute('linkColorHover') . ')'
            );
        }

        switch ($this->getAttribute('template')) {
            case 'list.simple':
                $templateName = '/Submenu.List.html';

                if ($isIndependentMenu) {
                    $templateName = '/Submenu.List.Independent.html';
                }

                $this->templateFile = dirname(__FILE__) . $templateName;
                $this->templateCssFile = dirname(__FILE__) . '/Submenu.List.css';
                $this->addCSSClass('quiqqer-submenu--list-simple');

                break;

            default:
            case 'list.buttonStyle':
                $templateName = '/Submenu.List.html';

                if ($isIndependentMenu) {
                    $templateName = '/Submenu.List.Independent.html';
                }

                $this->templateFile = dirname(__FILE__) . $templateName;
                $this->templateCssFile = dirname(__FILE__) . '/Submenu.List.css';
                $this->addCSSClass('quiqqer-submenu--list-buttonStyle');

                break;
        }

        switch ($this->getAttribute('itemsAlignment')) {
            case 'flex-start':
            case 'center':
            case 'flex-end':
            case 'space-between':
            case 'space-around':
                $itemsAlignment = $this->getAttribute('itemsAlignment');
                break;

            default:
                $itemsAlignment = 'flex-start';
                break;
        }

        $this->setCustomVariable('itemsAlignment', $itemsAlignment);

        $Engine->assign([
            'this' => $this,
            'children' => $children
        ]);

        $this->addCSSFile(dirname(__FILE__) . '/Submenu.css');
        $this->addCSSFile($this->templateCssFile);

        return $Engine->fetch($this->templateFile);
    }

    /**
     * Get sites for independent menu
     *
     * @return array
     * @throws QUI\Exception
     */
    public function getChildrenForIndependentMenu(): array
    {
        $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

        return $IndependentMenu->getChildren();
    }

    /**
     * Get sites for QUI site
     *
     * @return array|int
     * @throws Exception
     */
    public function getChildrenForQUISite(): array|int
    {
        $Project = $this->getProject();

        // start
        try {
            $startId = $this->getAttribute('startId');

            if (Utils::isSiteLink($startId)) {
                $Site = Utils::getSiteByLink($startId);
            } else {
                $Site = $Project->get((int)$startId);
            }
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addWarning($Exception->getMessage());

            return [];
        }

        return $this->getChildren($Site);
    }

    /**
     * @param QUI\Projects\Site $Site
     * @return array|int
     * @throws QUI\Exception
     */
    public function getChildren(QUI\Projects\Site $Site): array|int
    {
        if (!$this->getAttribute('showAllChildren')) {
            return $Site->getNavigation();
        }

        return $Site->getChildren();
    }

    /**
     * Set custom css variable to the control as inline style
     * --_quiqqer-menu-submenu-$name: var(--qui-submenu-$name, $value);
     *
     * Example:
     *     --_qui-submenu-linkColor: var(--quiqqer-menu-submenu-linkColor, inherit);
     *
     * @param string $name
     * @param string $value
     *
     * @return void
     */
    private function setCustomVariable(string $name, string $value): void
    {
        if (!$name || !$value) {
            return;
        }

        $this->setStyle(
            '--_quiqqer-menu-submenu__' . $name,
            'var(--quiqqer-menu-submenu__' . $name . ', ' . $value . ')'
        );
    }
}
