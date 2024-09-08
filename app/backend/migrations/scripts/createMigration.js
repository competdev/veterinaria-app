const execSync = require('child_process').execSync;

const MigrationName = (params) => {
    if(params.length <= 2){
        return 'custom_migration'
    }

    let migrationNameAux = '';

    params.splice(2).forEach(param => {
        if(migrationNameAux.length){
            migrationNameAux += '_';
        }
        migrationNameAux += param;
    })

    return migrationNameAux.toLocaleLowerCase();
}

execSync(`npm run typeorm migration:generate -- -n ${MigrationName(process.argv)}`, { stdio:[0, 1, 2] });