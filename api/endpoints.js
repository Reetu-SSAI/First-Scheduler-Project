// All API paths in one place. The server address comes from API_BASE_URL in the .env file.
module.exports = {
  login: '/lmd/usrsrv/users/v1/user/scheduler_login',
  selectStation: '/lmd/usrsrv/users/v1/switch_company/', // + station id (the station menu at the top right)
  // Settings -> Admins: the list of admins (owner, admins and drivers promoted to admin)
  admins: '/lmd/schsrv/scheduler_user/v1/all_user_permissions',
};
