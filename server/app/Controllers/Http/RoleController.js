'use strict';
const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');
const User = use('App/Models/User');

class RoleController {
  async createRole({request,response,auth}){
    await auth.getUser();
    const { Roles, Description } = request.all();
    const roleAdmin = new Role();
    roleAdmin.name = Roles;
    roleAdmin.slug = Roles.toLowerCase();
    roleAdmin.description = Description;
    await roleAdmin.save()
  }
  async getAllRoles({request,response,auth}){
    await auth.getUser();
    const roles = await Role.all();
    if (roles){
      return roles.toJSON();
    }
  }
  async getRoles({request,response,auth}){
    const { name } = request.all();
    await auth.getUser();
    const role = await Role.findBy('name', name);
    if (role){
      return role.toJSON();
    }
  }
  async deleteRole({request,response,auth}){
    const { name } = request.all();
    await auth.getUser();
    const role = await Role.findBy('name', name);
    if (role){
      await role.delete();
    }
  }
  async getUserRoles({request,response,auth}){
    const { name } = request.all();
    const user = await User.findBy('username', name);
    return  await user.getRoles();
    // if (roles){
    // console.log(roles);
    // return roles;
    // }
  }
  // async getCurrentUserRoles({request,response,auth}){
  //   const user = auth.getUser();
  //   return  await user.getRoles();
  // }
  async setRole({request,response,auth}){
    const { username, role } = request.all();
    const user = await User.findBy('username', username);

    const req_role = await Role.findBy('name', role);
    await user.roles().attach([req_role.id])
  }
  async detachRole({request,response,auth}){
    const { username, role } = request.all();
    try{
      const user = await User.findBy('username', username);
      const req_role = await Role.findBy('slug', role);
      await user.roles().detach([req_role.id])
    }catch (e) {
      console.log(e);
    }
  }
  async createRolePermission({request,response,auth}){
    const { action, slug, description, role } = request.all();
    const createUsersPermission = new Permission();
    // console.log(action, slug);
    const req_permission = await Permission.findBy('slug', slug);
    const req_role = await Role.findBy('name', role);

    if ( req_permission ) {
      await req_role.permissions().attach([
        req_permission.id
      ])
    } else {
      // const slug = action.toLowerCase();
      createUsersPermission.slug = slug;
      createUsersPermission.name = action;
      createUsersPermission.description = description;
      await createUsersPermission.save()
      const req_permission = await Permission.findBy('slug', slug);
      await req_role.permissions().attach([
        req_permission.id
      ])
    }
  }
  async getRolePermissions({request,response,auth}){
    const { name } = request.all();

    const role = await Role.findBy('name', name);
    const rolePermissions = await role.permissions().fetch();
    // console.log(name, rolePermissions);
    return rolePermissions;
  }
  async getUserPermissions({request,response,auth}){
    const user = await auth.getUser();
    // const userPermissions = await user.permissions().fetch();
    const userPermissions = await user.getPermissions();
    // console.log(userPermissions);
    return userPermissions;
  }
}

module.exports = RoleController
