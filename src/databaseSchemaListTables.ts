import unknownGetValueByPath from 'rangel-ts-utils/unknownGetValueByPath'
import type { Knex } from 'knex'
import valueIsArray from 'ts-validators/valueIsArray'
import valueIsString from 'ts-validators/valueIsString'

const databaseSchemaListTables = async (knex: Knex) => {
    const databaseName: unknown = knex.client.config.connection.database

    if (!valueIsString(databaseName) || databaseName.length < 1) {
        throw new Error(`Invalid database name: ${JSON.stringify(databaseName)}`)
    }

    const rawTablesData: unknown = await knex.raw(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${databaseName}'`)

    if (!valueIsArray(rawTablesData)) {
        throw new Error('Expecting an array from raw tables data')
    }

    const [rawTables] = rawTablesData

    if (!valueIsArray(rawTables)) {
        throw new Error('Expecting an array for raw tables')
    }

    return rawTables.map((rawTableData) => {
        const tableName = unknownGetValueByPath(rawTableData, ['TABLE_NAME'])
            ?? unknownGetValueByPath(rawTableData, ['table_name'])

        if (!valueIsString(tableName)) {
            throw new Error(`Unexpected table name: ${JSON.stringify(rawTableData)}`)
        }

        return tableName
    })
}

export default databaseSchemaListTables
