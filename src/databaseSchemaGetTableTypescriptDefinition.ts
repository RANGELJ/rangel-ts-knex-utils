import type { Knex } from 'knex'
import databaseSchemaColumnDefinitionGetTypescriptDefinition from './databaseSchemaColumnDefinitionGetTypescriptDefinition'
import databaseSchemaGetTableColumns from './databaseSchemaGetTableColumns'
import databaseSchemaGetTableTypeName from './databaseSchemaGetTableTypeName'

type Args = {
    knex: Knex;
    tableName: string;
}

const databaseSchemaGetTableTypescriptDefinition = async ({
    knex,
    tableName,
}: Args) => {
    const getSpacesByIndentation = (indentation: number) => new Array<string>(indentation * 4).fill(' ').join('')

    const indentation = 0

    const tableTypeName = databaseSchemaGetTableTypeName(tableName)

    const columns = await databaseSchemaGetTableColumns({
        knex,
        tableName,
    })

    return `${getSpacesByIndentation(indentation)}type ${tableTypeName} = {
${columns.map((column) => `${getSpacesByIndentation(indentation + 1)}${databaseSchemaColumnDefinitionGetTypescriptDefinition(column)};`).join('\n')}
}`
}

export default databaseSchemaGetTableTypescriptDefinition
