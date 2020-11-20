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
  Route.resource('opportunity','MainController').apiOnly().middleware('auth');
  Route.get('get-single-opp','MainController.getSingleOpp').middleware('auth');
  Route.get('opts-by-customer-name','MainController.getOptsByCustomerName').middleware('auth');
  Route.get('opts-by-sales-rep','MainController.getOptsBySalesRep').middleware('auth');
  Route.resource('salesrep','MainController').apiOnly().middleware('auth');
  Route.resource('products','MainController').apiOnly().middleware('auth');
  Route.resource('product','MainController').apiOnly().middleware('auth');
  Route.resource('note','NoteController').apiOnly().middleware('auth');
  Route.resource('activities','ActivityController').apiOnly().middleware('auth');
  Route.put('activities','ActivityController.update').middleware('auth');
  Route.resource('customers','CustomerController').apiOnly().middleware('auth');
  Route.put('note','NoteController.update').middleware('auth');
  Route.resource('products','MainController').apiOnly().middleware('auth');
  Route.resource('campaign','MainController').apiOnly().middleware('auth');
  Route.resource('industry','MainController').apiOnly().middleware('auth');
  Route.resource('country_region_territory','MainController').apiOnly().middleware('auth');
  Route.resource('states','MainController').apiOnly().middleware('auth');
  Route.resource('industry','MainController').apiOnly().middleware('auth');
  // Route.resource('states','MainController').apiOnly();
  Route.resource('sales_funnel','MainController').apiOnly().middleware('auth');
  Route.resource('users','MainController').apiOnly().middleware('auth');
  Route.put('opportunity','MainController.update').middleware('auth');
  Route.put('product','MainController.update').middleware('auth');
  Route.put('salesrep','MainController.update').middleware('auth');
  Route.put('products','MainController.update').middleware('auth');
  Route.put('campaign','MainController.update').middleware('auth');
  Route.put('industry','MainController.update').middleware('auth');
  Route.put('states','MainController.update').middleware('auth');
  Route.put('sales_funnel','MainController.update').middleware('auth');
  Route.resource('revenue_account','MainController').apiOnly().middleware('auth');
  Route.post('auth/login','AuthController.login');
  Route.get('user/:name','AuthController.fetchUsers').middleware('auth');
  Route.get('get-current-user','AuthController.getCurrentUser').middleware('auth');
  Route.get('add-user/:user','AuthController.addUser').middleware('auth');
  Route.get('country-region-territories','CountryRegionTerritoryController.index').middleware('auth');
  Route.put('country-region-territories/:id','CountryRegionTerritoryController.update').middleware('auth');
  Route.delete('country-region-territories/:id','CountryRegionTerritoryController.delete').middleware('auth');
  Route.post('country-region-territories','CountryRegionTerritoryController.create').middleware('auth');
  Route.post("set-role", "RoleController.setRole").middleware("auth");
  Route.get("all-roles", "RoleController.getAllRoles").middleware("auth");
  Route.post("user-roles", "RoleController.getUserRoles").middleware("auth");
  Route.post("detach-role", "RoleController.detachRole").middleware("auth");
  Route.post("role-delete", "RoleController.deleteRole").middleware("auth");
  Route.post("create-role", "RoleController.createRole").middleware("auth");
  Route.post("create-role-permission", "RoleController.createRolePermission").middleware("auth");
  Route.post("role-permissions", "RoleController.getRolePermissions").middleware("auth");
  Route.get('/wscalc1', 'SoapController');
  // Route.resource('main','MainController');
}).prefix('api');

