const knex = require('knex') ({
    client: 'mysql2',
    // debug: true,
    connection: {
        host: '104.161.49.14',
        port: 28138,
        user: 'levtest',
        password: 'Levcloud2025@@',
        database: 'Lev_test_db'
    }
})

module.exports = knex
