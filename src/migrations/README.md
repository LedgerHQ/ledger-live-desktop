## Migrations system

this folder contains all the migration scripts.

Migrations works with a nonce, number we increment.
An app instance saves the nonce after running the migrations.
To know what migrations need to be performed, we simply need to run all migrations that have an index higher that this nonce and then save it.

The migration are run before the app starts and the idea is you need to perform everything on the db and maybe on the libcore with the commands.

### Add a migration

To add a migration, simply add one more item in the migrations array of index.js

If a migration throw an exception, it's considered to be a critical error and app will crash forever. so make sure you only throw if necessary (user can always Hard Reset at the end)
