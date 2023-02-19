import { ColumnDefinition } from './types'

const databaseSchemaColumnDefinitionGetTypescriptDefinition = (column: ColumnDefinition) => {
    if (column.Type.startsWith('tinyint')) {
        if (column.Null === 'NO') {
            return `${column.Field}: boolean`
        }
        return `${column.Field}: boolean | null`
    }
    if (
        column.Type === 'int unsigned'
        || column.Type === 'int'
        || column.Type.startsWith('float(')
        || /^int\([0-9]+\)( unsigned)?$/.test(column.Type)
    ) {
        if (column.Null === 'NO') {
            return `${column.Field}: number`
        }
        return `${column.Field}: number | null`
    }
    if (column.Type.startsWith('varchar')) {
        if (column.Null === 'NO') {
            return `${column.Field}: string`
        }
        return `${column.Field}: string | null`
    }
    if (column.Type === 'json' || column.Type === 'timestamp') {
        if (column.Null === 'NO') {
            return `${column.Field}: unknown`
        }
        return `${column.Field}: unknown | null`
    }
    throw new Error(`Unsuported column type: ${column.Type} for column with name: ${column.Field}`)
}

export default databaseSchemaColumnDefinitionGetTypescriptDefinition
