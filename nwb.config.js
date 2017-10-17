var path = require('path')

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
	compat: {
    enzyme: true
 	},
	webpack: {
    rules: {
      less: {
        data: '@import "_variables"',
        includePaths: [path.resolve('src/styles')]
      }
    }
  }
}
