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
  Route.resource('salesrep','MainController').apiOnly();
  Route.resource('product','MainController').apiOnly();
  Route.resource('country_region_territory','MainController').apiOnly();
  Route.resource('states','MainController').apiOnly();
  Route.resource('industry','MainController').apiOnly();
  Route.put('opportunity','MainController.update');
  Route.resource('revenue_account','MainController').apiOnly();
  Route.post('auth/login','AuthController.login');
  Route.get('user/:name','AuthController.fetchUsers');
  Route.get('get-current-user','AuthController.getCurrentUser');
  Route.get('add-user/:user','AuthController.addUser');
  // Route.resource('main','MainController');
}).prefix('api');

