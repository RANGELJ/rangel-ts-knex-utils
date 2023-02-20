import type { Knex } from 'knex'
import databaseSchemaGetTableTypescriptDefinition from './databaseSchemaGetTableTypescriptDefinition'
import databaseSchemaListTables from './databaseSchemaListTables'
import databaseSchemaGetTableTypeName from './databaseSchemaGetTableTypeName'

type Args = {
    knex: Knex;
}

const knexGetTstypes = async ({
    knex,
}: Args) => {
    const tableNames = await databaseSchemaListTables(knex)

    const tableTypes = await Promise
        .all(tableNames.map((tableName) => databaseSchemaGetTableTypescriptDefinition({
            knex,
            tableName,
        })))

    let typesSource = `${tableTypes.map((type) => `export ${type}`).join('\n\n')}\n`

    const allTablesType = `export type AllTables = {
${tableNames.map((tableName) => `    ${tableName}: ${databaseSchemaGetTableTypeName(tableName)};`).join('\n')}
}`
    typesSource = `${typesSource}${allTablesType}\n`

    const tableNamestype = `export type AllTableNames =
${tableNames.map((tableName) => `    '${tableName}'`).join('|\n')};`

    typesSource = `${typesSource}${tableNamestype}\n`

    return typesSource
}

export default knexGetTstypes
