export default class Auth {
  constructor(permissions, roles) {
    this.permissions = permissions;
    this.roles = roles;
  }
  roles() {
    return this.roles;
  }
  permissions() {
    return this.permissions;
  }
  can(action) {
    return this.permissions.includes(action);
  }
  isAdmin() {
    return this.roles.includes('admin');
  }
  isITSupport() {
    return this.roles.includes('it support');
  }
  isSPI() {
    return this.roles.includes('spi');
  }
  isMarketingSingle() {
    return this.roles.includes('marketing single capture');
  }
  isMarketingMulti() {
    return this.roles.includes('marketing multi-capture');
  }
  isMarketing() {
    return this.roles.includes('marketing user');
  }
}
