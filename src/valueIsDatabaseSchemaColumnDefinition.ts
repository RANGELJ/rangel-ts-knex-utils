import buildValueIsConstant from 'ts-validators/buildValueIsConstant'
import buildValueIsOneOf from 'ts-validators/buildValueIsOneOf'
import buildValueIsShape from 'ts-validators/buildValueIsShape'
import valueIsString from 'ts-validators/valueIsString'
import type { ColumnDefinition } from './types'

const valueIsDatabaseSchemaColumnDefinition = buildValueIsShape<ColumnDefinition>('ColumnDefinition', {
    Field: valueIsString,
    Null: buildValueIsOneOf([
        buildValueIsConstant('NO'),
        buildValueIsConstant('YES'),
    ]),
    Type: valueIsString,
})

export default valueIsDatabaseSchemaColumnDefinition
