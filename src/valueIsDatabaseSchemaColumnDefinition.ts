import buildValueIsConstant from 'ts-validators/buildValueIsConstant'
import buildValueIsOneOf from 'ts-validators/buildValueIsOneOf'
import buildValueIsShape from 'ts-validators/buildValueIsShape'
import valueIsString from 'ts-validators/valueIsString'
import type { Validator } from 'ts-validators/types'
import type { ColumnDefinition } from './types'

const valueIsDatabaseSchemaColumnDefinition: Validator<ColumnDefinition> = buildValueIsShape<ColumnDefinition>('ColumnDefinition', {
    Field: valueIsString,
    Null: buildValueIsOneOf([
        buildValueIsConstant('NO'),
        buildValueIsConstant('YES'),
    ]),
    Type: valueIsString,
})

export default valueIsDatabaseSchemaColumnDefinition
