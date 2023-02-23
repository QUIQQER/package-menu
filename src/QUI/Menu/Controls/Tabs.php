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
            'class'               => 'quiqqer-tabs',
            'qui-class'           => 'package/quiqqer/menu/bin/Controls/NavTabs',
            'activeEntry'         => 1, // number
            'entries'             => [],
            'template'            => 'simple',

            // tabs nav
            'navImgHeight'        => 20, // number
            'navStyle'            => 'imgLeft', // imgLeft, imgTop, onlyImg
            'navCenter'           => false,

            // tabs content
            'contentImgMaxWidth'  => 600, // number
            'contentImgMaxHeight' => 300, // number
            'contentTextWidth'    => 600, // number


        ]);

        parent::__construct($attributes);

        $this->addCSSFile(dirname(__FILE__).'/Tabs.css');
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine         = QUI::getTemplateManager()->getEngine();
        $entries        = $this->getAttribute('entries');
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

//        foreach ($entries as $entry) {
//            array_push($enabledEntries, $entry);
//        }
//
//        foreach ($entries as $entry) {
//            array_push($enabledEntries, $entry);
//        }

        $active = 1;

        if ($this->getAttribute('activeEntry') && $this->getAttribute('activeEntry') > 0) {
            $active = $this->getAttribute('activeEntry');
        }

        /* template */
        $template = 'simple';

        /* nav */
        $showNavText    = true;
        $navTabStyleCss = 'navTabStyle__imgLeft';
        $navAlignment   = 'quiqqer-tabsAdvanced-nav-inner__left';

        switch ($this->getAttribute('navStyle')) {
            case 'imgTop':
                $navTabStyleCss = 'navTabStyle__imgTop';
                break;
            case 'onlyImg':
                $navTabStyleCss = 'navTabStyle__onlyImg';
                $showNavText    = false;
        }

        if ($this->getAttribute('navCenter')) {
            $navAlignment = 'quiqqer-tabsAdvanced-nav-inner__center';
        }

        $Engine->assign([
            'this'                => $this,
            'entries'             => $enabledEntries,
            'active'              => $active,
            'navImgHeight'        => $this->getAttribute('navImgHeight'),
            'navStyle'            => $this->getAttribute('navStyle'),
            'navTabStyleCss'      => $navTabStyleCss,
            'showNavText'         => $showNavText,
            'navAlignment'        => $navAlignment,
            'contentTextWidth'    => $this->getAttribute('contentTextWidth'),
            'contentImgMaxWidth'  => $this->getAttribute('contentImgMaxWidth'),
            'contentImgMaxHeight' => $this->getAttribute('contentImgMaxHeight')
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Tabs.html');
    }
}
