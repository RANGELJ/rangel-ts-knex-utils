import buildValueIsConstant from 'ts-validators/cjs/buildValueIsConstant'
import buildValueIsOneOf from 'ts-validators/cjs/buildValueIsOneOf'
import buildValueIsShape from 'ts-validators/cjs/buildValueIsShape'
import valueIsString from 'ts-validators/cjs/valueIsString'
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
