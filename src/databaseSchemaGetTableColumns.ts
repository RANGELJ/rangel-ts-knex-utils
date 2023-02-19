import type { Knex } from 'knex'
import valueIsArray from 'ts-validators/cjs/valueIsArray'
import valueIsDatabaseSchemaColumnDefinition from './valueIsDatabaseSchemaColumnDefinition'
import { ColumnDefinition } from './types'

type Args = {
    knex: Knex;
    tableName: string;
}

const databaseSchemaGetTableColumns = async ({
    knex,
    tableName,
}: Args) => {
    const rawTableDescribe = await knex.raw(`DESC ${tableName}`)

    if (!valueIsArray(rawTableDescribe)) {
        throw new Error('Expecting rawTableDescribe to be an array')
    }

    const [rawColumns] = rawTableDescribe

    if (!valueIsArray(rawColumns)) {
        throw new Error('Expecting raw columns to be an array')
    }

    const columnDefinitions: ColumnDefinition[] = []

    rawColumns.forEach((column) => {
        if (!valueIsDatabaseSchemaColumnDefinition(column)) {
            throw new Error(`Invalid column definition: ${JSON.stringify(column)}`)
        }
        columnDefinitions.push(column)
    })

    return columnDefinitions
}

export default databaseSchemaGetTableColumns
