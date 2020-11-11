'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.group(function () {
  Route.on('/').render('welcome');
  Route.resource('opportunity','MainController').apiOnly();
  Route.get('get-single-opp','MainController.getSingleOpp');
  Route.get('opts-by-customer-name','MainController.getOptsByCustomerName');
  Route.resource('salesrep','MainController').apiOnly();
  Route.resource('products','MainController').apiOnly();
  Route.resource('product','MainController').apiOnly();
  Route.resource('note','NoteController').apiOnly();
  Route.resource('activities','ActivityController').apiOnly();
  Route.put('activities','ActivityController.update');
  Route.resource('customers','CustomerController').apiOnly();
  Route.put('note','NoteController.update');
  Route.resource('products','MainController').apiOnly();
  Route.resource('campaign','MainController').apiOnly();
  Route.resource('industry','MainController').apiOnly();
  Route.resource('country_region_territory','MainController').apiOnly();
  Route.resource('states','MainController').apiOnly();
  Route.resource('industry','MainController').apiOnly();
  Route.resource('states','MainController').apiOnly();
  Route.resource('users','MainController').apiOnly();
  Route.put('opportunity','MainController.update');
  Route.put('product','MainController.update');
  Route.put('salesrep','MainController.update');
  Route.put('products','MainController.update');
  Route.put('campaign','MainController.update');
  Route.put('industry','MainController.update');
  Route.put('states','MainController.update');
  Route.resource('revenue_account','MainController').apiOnly();
  Route.post('auth/login','AuthController.login');
  Route.get('user/:name','AuthController.fetchUsers');
  Route.get('get-current-user','AuthController.getCurrentUser');
  Route.get('add-user/:user','AuthController.addUser');
  Route.get('country-region-territories','CountryRegionTerritoryController.index');
  Route.put('country-region-territories/:id','CountryRegionTerritoryController.update');
  Route.delete('country-region-territories/:id','CountryRegionTerritoryController.delete');
  Route.post('country-region-territories','CountryRegionTerritoryController.create');
  Route.post("set-role", "RoleController.setRole").middleware("auth");
  Route.get("all-roles", "RoleController.getAllRoles").middleware("auth");
  Route.post("user-roles", "RoleController.getUserRoles").middleware("auth");
  Route.post("detach-role", "RoleController.detachRole").middleware("auth");
  Route.post("role-delete", "RoleController.deleteRole").middleware("auth");
  Route.post("create-role", "RoleController.createRole").middleware("auth");
  Route.post("create-role-permission", "RoleController.createRolePermission").middleware("auth");
  Route.post("role-permissions", "RoleController.getRolePermissions").middleware("auth");
  // Route.resource('main','MainController');
}).prefix('api');

