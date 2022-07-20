<?php

namespace QUI\Menu\Rest;

use QUI;
use QUI\REST\ProviderInterface;
use Psr\Http\Message\ServerRequestInterface as RequestInterface;
use Psr\Http\Message\ResponseInterface as ResponseInterface;
use Psr\Http\Message\MessageInterface;
use QUI\REST\Server;
use QUI\CoreRest\Handler;
use Slim\Routing\RouteCollectorProxy;
use QUI\Utils\Security\Orthos;
use QUI\Menu\Independent\Handler as MenuHandler;
use QUI\Menu\Independent\Factory as MenuFactory;

/**
 * Class Provider
 *
 * REST API endpoints for QUIQQER Menus.
 */
class Provider implements ProviderInterface
{
    /**
     * Provider constructor.
     */
    public function __construct()
    {
        if (!\defined('SYSTEM_INTERN')) {
            \define('SYSTEM_INTERN', 1); // Session user = System User
        }
    }

    /**
     * Registered some REST Api Calls
     *
     * @param Server $Server
     */
    public function register(Server $Server)
    {
        $Slim = $Server->getSlim();

        // Register paths
        $Slim->group('/menus', function (RouteCollectorProxy $RouteCollector) {
            // CRUD
            $RouteCollector->post('/create', [$this, 'create']);
            $RouteCollector->get('/get', [$this, 'get']);
            $RouteCollector->patch('/update', [$this, 'update']);
            $RouteCollector->delete('/delete', [$this, 'delete']);
        });
    }

    /**
     * CREATE a new QUIQQER Menu
     *
     * @param RequestInterface $Request
     * @param ResponseInterface $Response
     * @return MessageInterface
     */
    public function create(RequestInterface $Request, ResponseInterface $Response): MessageInterface
    {
        $params = $Request->getParsedBody();
        $menu   = [];

        $requiredFields = [
            'title',
        ];

        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                return Handler::getGenericErrorResponse('Field "'.$field.'" is missing.');
            }

            $menu[$field] = Orthos::clear($params[$field]);
        }

        $optionalFields = [
            'id',
            'workingTitle',
            'data'
        ];

        foreach ($optionalFields as $field) {
            if (empty($params[$field])) {
                continue;
            }

            if (\is_array($params[$field])) {
                $value = Orthos::clearArray($params[$field]);
            } else {
                $value = Orthos::clear($params[$field]);
            }

            $menu[$field] = $value;
        }

        try {
            /*
             * If the menu has to have a specific ID, we have to make sure that the ID is not taken.
             */
            $menuId = false;

            if (!empty($menu['id'])) {
                $menuId = (int)$menu['id'];

                try {
                    $menu = MenuHandler::getMenu($menuId);
                } catch (\Exception $Exception) {
                    QUI\System\Log::writeDebugException($Exception);
                    $menu = false;
                }

                if ($menu) {
                    throw new QUI\Exception(
                        'Menu with specific id #'.$menuId.' cannot be created, since a menu with this id already'
                        .' exists.'
                    );
                }
            }

            $Menu      = MenuFactory::createMenu();
            $newMenuId = $Menu->getId();

            if ($menuId) {
                QUI::getDataBase()->update(
                    MenuHandler::table(),
                    [
                        'id' => $menuId,
                    ],
                    [
                        'id' => $newMenuId
                    ]
                );

                $newMenuId = $menuId;
                $Menu      = MenuHandler::getMenu($newMenuId);
            }

            $Menu->setTitle($menu['title']);

            if (!empty($menu['workingTitle'])) {
                $Menu->setWorkingTitle($menu['workingTitle']);
            }

            if (!empty($menu['data'])) {
                $Menu->setData($menu['data']);
            }

            $Menu->save(QUI::getUsers()->getSystemUser());
        } catch (\Exception $Exception) {
            return Handler::getGenericExceptionResponse($Exception);
        }

        return Handler::getGenericSuccessResponse(
            'Menu created.',
            [
                'id' => $newMenuId
            ]
        );
    }

    /**
     * GET data of a QUIQQER Menu
     *
     * @param RequestInterface $Request
     * @param ResponseInterface $Response
     * @return MessageInterface
     */
    public function get(RequestInterface $Request, ResponseInterface $Response): MessageInterface
    {
        $params = $Request->getParsedBody();
        $menu   = [];

        $requiredFields = [
            'id'
        ];

        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                return Handler::getGenericErrorResponse('Field "'.$field.'" is missing.');
            }

            $menu[$field] = Orthos::clear($params[$field]);
        }

        try {
            $Menu = MenuHandler::getMenu($menu['id']);
        } catch (\Exception $Exception) {
            return Handler::getGenericExceptionResponse($Exception);
        }

        return Handler::getGenericSuccessResponse(
            null,
            $Menu->toArray()
        );
    }

    /**
     * UPDATE data of a QUIQQER Menu
     *
     * @param RequestInterface $Request
     * @param ResponseInterface $Response
     * @return MessageInterface
     */
    public function update(RequestInterface $Request, ResponseInterface $Response): MessageInterface
    {
        $params = $Request->getParsedBody();
        $menu   = [];

        $requiredFields = [
            'id'
        ];

        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                return Handler::getGenericErrorResponse('Field "'.$field.'" is missing.');
            }

            $menu[$field] = Orthos::clear($params[$field]);
        }

        $optionalFields = [
            'title',
            'workingTitle',
            'data'
        ];

        foreach ($optionalFields as $field) {
            if (empty($params[$field])) {
                continue;
            }

            if (\is_array($params[$field])) {
                $value = Orthos::clearArray($params[$field]);
            } else {
                $value = Orthos::clear($params[$field]);
            }

            $menu[$field] = $value;
        }

        try {
            $Menu = MenuHandler::getMenu((int)$menu['id']);

            if (!empty($menu['title'])) {
                $Menu->setTitle($menu['title']);
            }

            if (!empty($menu['workingTitle'])) {
                $Menu->setWorkingTitle($menu['workingTitle']);
            }

            if (!empty($menu['data'])) {
                $Menu->setData($menu['data']);
            }

            $Menu->save(QUI::getUsers()->getSystemUser());
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return Handler::getGenericExceptionResponse($Exception);
        }

        return Handler::getGenericSuccessResponse(
            'Menu #'.$menu['id'].' successfully updated.',
            $Menu->toArray()
        );
    }

    /**
     * DELETE a QUIQQER Site
     *
     * @param RequestInterface $Request
     * @param ResponseInterface $Response
     * @return MessageInterface
     */
    public function delete(RequestInterface $Request, ResponseInterface $Response): MessageInterface
    {
        $params = $Request->getParsedBody();
        $menu   = [];

        $requiredFields = [
            'id'
        ];

        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                return Handler::getGenericErrorResponse('Field "'.$field.'" is missing.');
            }

            $menu[$field] = Orthos::clear($params[$field]);
        }

        try {
            MenuFactory::deleteMenu((int)$menu['id']);
        } catch (\Exception $Exception) {
            return Handler::getGenericExceptionResponse($Exception);
        }

        return Handler::getGenericSuccessResponse(
            'Menu #'.$menu['id'].' successfully deleted.'
        );
    }

    /**
     * Get file containting OpenApi definition for this API.
     *
     * @return string|false - Absolute file path or false if no definition exists
     */
    public function getOpenApiDefinitionFile()
    {
        return false;
    }

    /**
     * Get unique internal API name.
     *
     * This is required for requesting specific data about an API (i.e. OpenApi definition).
     *
     * @return string - Only letters; no other characters!
     */
    public function getName(): string
    {
        return 'QuiqqerMenus';
    }

    /**
     * Get title of this API.
     *
     * @param QUI\Locale|null $Locale (optional)
     * @return string
     */
    public function getTitle(QUI\Locale $Locale = null): string
    {
        if (empty($Locale)) {
            $Locale = QUI::getLocale();
        }

        return $Locale->get('quiqqer/menu', 'provider.Rest.title');
    }
}
