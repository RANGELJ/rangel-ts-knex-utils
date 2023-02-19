import stringFirstCharacterToUpperCase from 'rangel-ts-utils/stringFirstCharacterToUpperCase'

const databaseSchemaGetTableTypeName = (tableName: string) => tableName
    .split('_')
    .map(stringFirstCharacterToUpperCase)
    .join('')
    .concat('Table')

export default databaseSchemaGetTableTypeName
