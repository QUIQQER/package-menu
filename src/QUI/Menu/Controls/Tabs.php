<?php

/**
 * This file contains QUI\Menu\Controls\Tabs
 */

namespace QUI\Menu\Controls;

use QUI;

/**
 * Class NavTabs
 *
 * @author  Michael Danielczok
 * @package QUI\Menu
 */
class Tabs extends QUI\Control
{
    /**
     * constructor
     *
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // default options
        $this->setAttributes([
            'class' => 'quiqqer-tabs',
            'qui-class' => 'package/quiqqer/menu/bin/Controls/NavTabs',
            'activeEntry' => 1,
            // number
            'entries' => [],
            'template' => 'simple',

            // tabs nav
            'navImgHeight' => 20,
            // number
            'navStyle' => 'imgLeft',
            // imgLeft, imgTop, onlyImg
            'navWrapText' => 'wrap',
            // wrap / noWrap; allow breaking text on space. 'noWrap' set "white-space: nowrap;" CSS property on nav text
            'navFillSpace' => false,
            // it feels the available space
            'navCenter' => false,
            'enableDragToScroll' => true,

            // tabs content
            'contentImgMinWidth' => 200,
            // number; do not use large values, recommended is between 100 and 600
            'contentImgMaxWidth' => 400,
            // number; do not use large values, recommended is between 200 and 600
            'contentTextWidth' => 600,
            // number
        ]);

        parent::__construct($attributes);

        $this->addCSSFile(dirname(__FILE__) . '/Tabs.css');
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $entries = $this->getAttribute('entries');
        $enabledEntries = [];

        if (is_string($entries)) {
            $entries = json_decode($entries, true);
        }

        foreach ($entries as $entry) {
            if (isset($entry['isDisabled']) && $entry['isDisabled'] === 1) {
                continue;
            }

            array_push($enabledEntries, $entry);
        }

        $active = 1;

        $this->setJavaScriptControlOption('enabledragtoscroll', $this->getAttribute('enableDragToScroll'));

        if ($this->getAttribute('activeEntry') && $this->getAttribute('activeEntry') > 0) {
            $active = $this->getAttribute('activeEntry');
        }

        /* template */
        $template = 'simple';

        /* nav */
        $showNavText = true;
        $navWrapText = 'navText__wrap';
        $navTabStyleCss = 'navTabStyle__imgLeft';
        $navAlignment = '';
        $navFillSpace = '';

        switch ($this->getAttribute('navStyle')) {
            case 'imgTop':
                $navTabStyleCss = 'navTabStyle__imgTop';
                break;
            case 'onlyImg':
                $navTabStyleCss = 'navTabStyle__onlyImg';
                $showNavText = false;
        }

        if (!$this->getAttribute('navFillSpace') && $this->getAttribute('navCenter')) {
            // centre nav tabs only if "navFillSpace" options is not enabled
            $navAlignment = 'navTab__center';
        }

        if ($this->getAttribute('navFillSpace')) {
            $navFillSpace = 'navFillSpace';
        }

        if ($this->getAttribute('navWrapText') === 'noWrap') {
            $navWrapText = 'navText__noWrap';
        }

        $Engine->assign([
            'this' => $this,
            'entries' => $enabledEntries,
            'active' => $active,
            'navImgHeight' => $this->getAttribute('navImgHeight'),
            'navStyle' => $this->getAttribute('navStyle'),
            'navWrapText' => $navWrapText,
            'navTabStyleCss' => $navTabStyleCss,
            'showNavText' => $showNavText,
            'navAlignment' => $navAlignment,
            'navFillSpace' => $navFillSpace,
            'contentTextWidth' => $this->getAttribute('contentTextWidth'),
            'contentImgMaxWidth' => $this->getAttribute('contentImgMaxWidth'),
            'contentImgMinWidth' => $this->getAttribute('contentImgMinWidth'),
        ]);

        return $Engine->fetch(dirname(__FILE__) . '/Tabs.html');
    }
}
