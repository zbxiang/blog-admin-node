const env = process.env.NODE_ENV
let debug = Boolean

if (env === 'dev') { debug = true }
if (env === 'production') { debug = false }

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug,
  PWD_SALT: 'admin_zbxiangblog_node',
  PRIVATE_KEY: 'admin_zbxiangblog_node_abel_youbaobao_xyz',
  JWT_EXPIRED: 60 * 60
}
  