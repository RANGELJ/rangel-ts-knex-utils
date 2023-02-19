/* eslint-disable no-use-before-define */
import type { Knex } from 'knex'

type NotNullProps<Original extends Record<string, unknown>> = {
    [K in keyof Original as null extends Original[K] ? never : K]: Original[K];
}

type NullProps<Original extends Record<string, unknown>> = {
    [K in keyof Original as null extends Original[K] ? K : never]: Original[K];
}

type NullsAreOptional<Original extends Record<string, unknown>> = NotNullProps<Original>
    & Partial<NullProps<Original>>

export const NULL_DB_VALUE = Symbol('NULL_DB_VALUE')

type OnlyStringKeys<T> = Exclude<T, symbol | number>

type CollectFunction<
    Table extends Record<string, unknown>,
    SelectedColumnName extends string
> = (limit?: number) => Promise<Pick<Table, SelectedColumnName>[]>;

type CollectFirstFunction<
    Table extends Record<string, unknown>,
    SelectedColumnName extends string
> = () => Promise<Pick<Table, SelectedColumnName> | undefined>;

type GroupByFunction<
    Table extends Record<string, unknown>,
    SelectedColumn extends string
> = (column: keyof Table) => CollectionFunctions<Table, SelectedColumn>

type OrderByDirection = 'desc' | 'asc'

type OrderByFunction<
    Table extends Record<string, unknown>,
    SelectedColumn extends string
> = (column: keyof Table, direction: OrderByDirection) => CollectionFunctions<Table, SelectedColumn>

type ReturnlessWhereFunction<
    Table extends Record<string, unknown>,
    ReturType
> = <WhereColumn extends OnlyStringKeys<keyof Table>>(
    column: WhereColumn,
    value: Table[WhereColumn],
) => ReturType

type WhereColumnWithoutValue<
    Table extends Record<string, unknown>,
    ReturType
> = <WhereColumn extends OnlyStringKeys<keyof Table>>(
    column: WhereColumn,
) => ReturType

type WhereColumnIn<
    Table extends Record<string, unknown>,
    ReturType
> = <WhereColumn extends OnlyStringKeys<keyof Table>>(
    column: WhereColumn,
    values: Table[WhereColumn][],
) => ReturType

type WhereFunction<
    Table extends Record<string, unknown>,
    SelectedColumn extends string
> = ReturnlessWhereFunction<Table, CollectionFunctions<Table, SelectedColumn>>

export type ComparationOperator = '<' | '<>' | '>=' | '>' | 'like' | '='

type OrWhereFunction<
    Table extends Record<string, unknown>,
    ReturType
> = <WhereColumn extends OnlyStringKeys<keyof Table>>(
    column: WhereColumn,
    operator: ComparationOperator,
    value: Table[WhereColumn],
) => ReturType

type WhereFunctionWithOperator<
    Table extends Record<string, unknown>,
    ReturType
> = <WhereColumn extends OnlyStringKeys<keyof Table>>(
    column: WhereColumn,
    operator: ComparationOperator,
    value: Table[WhereColumn],
) => ReturType

export type CollectionFunctions<
    Table extends Record<string, unknown>,
    SelectedColumn extends string
> = {
    where: WhereFunction<Table, SelectedColumn>;
    whereOp: WhereFunctionWithOperator<Table, CollectionFunctions<Table, SelectedColumn>>;
    whereNull: WhereColumnWithoutValue<Table, CollectionFunctions<Table, SelectedColumn>>;
    whereNotNull: WhereColumnWithoutValue<Table, CollectionFunctions<Table, SelectedColumn>>;
    whereIn: WhereColumnIn<Table, CollectionFunctions<Table, SelectedColumn>>;
    whereNotIn: WhereColumnIn<Table, CollectionFunctions<Table, SelectedColumn>>;
    whereNested: (
        callback: (nested: CollectionFunctions<Table, SelectedColumn>) => void,
    ) => CollectionFunctions<Table, SelectedColumn>;
    orWhere: OrWhereFunction<Table, CollectionFunctions<Table, SelectedColumn>>;
    collect: CollectFunction<Table, SelectedColumn>;
    collectFirst: CollectFirstFunction<Table, SelectedColumn>;
    groupBy: GroupByFunction<Table, SelectedColumn>;
    orderBy: OrderByFunction<Table, SelectedColumn>;
}

type SelectFunction<
    Table extends Record<string, unknown>,
> = <SelectedColumns extends OnlyStringKeys<keyof Table>[]>(
    ...selectedColumns: SelectedColumns
) => CollectionFunctions<Table, SelectedColumns[number]>

type TableWithoutInmutableId<Table extends Record<string, unknown>> = Table extends { id: number } ? Omit<Table, 'id'> : Table

type TableWithNullableValues<Table extends Record<string, unknown>> = {
    [K in keyof Table]: null extends Table[K] ? (Table[K] | typeof NULL_DB_VALUE) : Table[K];
}

type InsertFunction<
    Table extends Record<string, unknown>,
> = (values: NullsAreOptional<TableWithoutInmutableId<Table>>) => Promise<number>;

type InsertMultipleFunction<
    Table extends Record<string, unknown>,
> = (values: NullsAreOptional<TableWithoutInmutableId<Table>>[]) => Promise<void>;

export type WhereFromUpdate<
    Table extends Record<string, unknown>,
> = {
    where: ReturnlessWhereFunction<Table, WhereFromUpdate<Table>>;
    whereOp: WhereFunctionWithOperator<Table, WhereFromUpdate<Table>>;
    whereIn: WhereColumnIn<Table, WhereFromUpdate<Table>>;
    whereNotIn: WhereColumnIn<Table, WhereFromUpdate<Table>>;
    whereNull: WhereColumnWithoutValue<Table, WhereFromUpdate<Table>>;
    whereNotNull: WhereColumnWithoutValue<Table, WhereFromUpdate<Table>>;
    whereNested: (
        callback: (nested: WhereFromUpdate<Table>) => void,
    ) => WhereFromUpdate<Table>;
    orWhere: OrWhereFunction<Table, WhereFromUpdate<Table>>;
    orWhereNull: WhereColumnWithoutValue<Table, WhereFromUpdate<Table>>;
    withData: (
        values: Partial<TableWithNullableValues<TableWithoutInmutableId<Table>>>,
    ) => Promise<void>;
}

type InsertWithMergeFunction<
    Table extends Record<string, unknown>,
> = (values: NullsAreOptional<Table>) => Promise<void>;

type TypedKnexBase<
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
> = {
    table: TableQueryFunction<AllTables, AllTableNames>;
    transaction: <T>(callback: (knex: TransactionTypedKnex<AllTables, AllTableNames>) => Promise<T>) => Promise<T>;
    getOriginal: () => Knex;
}

type TransactionTypedKnexOnCompletedListener = () => Promise<unknown>

export type TransactionTypedKnex<
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
> = TypedKnexBase<AllTables, AllTableNames> & {
    inTransaction: true;
    onTransactionCompleted: (listener: TransactionTypedKnexOnCompletedListener) => void;
    getOnCompletedListeners: () => TransactionTypedKnexOnCompletedListener[];
}

type NonTransactionKnex<
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
> = TypedKnexBase<AllTables, AllTableNames> & {
    inTransaction: false
}

export type TypedKnex<
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
> = TransactionTypedKnex<AllTables, AllTableNames> | NonTransactionKnex<AllTables, AllTableNames>

type TableQueryFunction<
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
> = <TableName extends AllTableNames>(tableName: TableName) => {
    select: SelectFunction<AllTables[TableName]>;
    insert: InsertFunction<AllTables[TableName]>;
    insertMultiple: InsertMultipleFunction<AllTables[TableName]>;
    insertOrMerge: InsertWithMergeFunction<AllTables[TableName]>;
    updateWhere: WhereFromUpdate<AllTables[TableName]>['where'];
    updateWhereOp: WhereFromUpdate<AllTables[TableName]>['whereOp'];
    updateWhereNull: WhereFromUpdate<AllTables[TableName]>['whereNull'];
    updateWhereNotNull: WhereFromUpdate<AllTables[TableName]>['whereNotNull'];
    updateWhereNested: WhereFromUpdate<AllTables[TableName]>['whereNested'];
}

const buildCollectionFunctions = <
        Table extends Record<string, unknown>,
        SelectedColumn extends string
    >(
        tableName: string,
        selectedColumns: SelectedColumn[],
        query: Knex.QueryBuilder,
    ): CollectionFunctions<Table, SelectedColumn> => ({
        where: (columnName, columnValue) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.where(columnName, columnValue as any)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereOp: (columnName, operator, value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.where(columnName as any, operator, value as any)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereNull: (columnName) => {
            query.whereNull(columnName)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereNotNull: (columnName) => {
            query.whereNotNull(columnName)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereIn: (columnName, values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.whereIn(columnName as any, values as any)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereNotIn: (columnName, values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.whereNotIn(columnName as any, values as any)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        whereNested: (callback) => {
            // eslint-disable-next-line prefer-arrow-callback
            query.where(function (nested) {
                callback(buildCollectionFunctions(tableName, selectedColumns, nested))
            })

            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        orWhere: (columnName, operator, value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.orWhere(columnName as any, operator, value as any)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        collect: async (limit) => {
            const actualData = await query.limit(limit ?? 1000)
            return actualData
        },
        collectFirst: async () => {
            const actualData = await query.first()
            return actualData
        },
        orderBy: (columnName, orderDirection) => {
            query.orderBy(columnName, orderDirection)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
        groupBy: (columnName) => {
            query.groupBy(columnName)
            return buildCollectionFunctions(tableName, selectedColumns, query)
        },
    })

const buildSelectFunction = <
        Table extends Record<string, unknown>,
    >(
        tableName: string,
        query: Knex.QueryBuilder,
    ): SelectFunction<Table> => (...selectedColumns) => {
        query.select(...selectedColumns)

        return buildCollectionFunctions(
            tableName,
            selectedColumns,
            query,
        )
    }

const knexGetTransactionTypedKnex = <
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
>(knex: Knex): TransactionTypedKnex<AllTables, AllTableNames> => {
    const normal = knexCreateTypedKnex<AllTables, AllTableNames>(knex)
    const listeners: TransactionTypedKnexOnCompletedListener[] = []

    return {
        ...normal,
        inTransaction: true,
        onTransactionCompleted: (listener) => {
            listeners.push(listener)
        },
        getOnCompletedListeners: () => listeners,
    }
}

const buildWhereFromUpdate = <Table extends Record<string, unknown>>(
    query: Knex.QueryBuilder,
    knex: Knex,
): WhereFromUpdate<Table> => ({
        where: (columnName, columnValue) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.where(columnName, columnValue as any)
            return buildWhereFromUpdate(query, knex)
        },
        whereOp: (columnName, operator, value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.where(columnName as any, operator, value as any)
            return buildWhereFromUpdate(query, knex)
        },
        whereIn: (columnName, values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.whereIn(columnName as any, values as any)
            return buildWhereFromUpdate(query, knex)
        },
        whereNull: (columnName) => {
            query.whereNull(columnName)
            return buildWhereFromUpdate(query, knex)
        },
        whereNotNull: (columnName) => {
            query.whereNotNull(columnName)
            return buildWhereFromUpdate(query, knex)
        },
        whereNested: (callback) => {
            // eslint-disable-next-line prefer-arrow-callback
            query.where(function (nested) {
                callback(buildWhereFromUpdate(nested, knex))
            })

            return buildWhereFromUpdate(query, knex)
        },
        orWhere: (columnName, operator, value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.orWhere(columnName as any, operator, value as any)
            return buildWhereFromUpdate(query, knex)
        },
        orWhereNull: (columnName) => {
            query.orWhereNull(columnName)
            return buildWhereFromUpdate(query, knex)
        },
        whereNotIn: (columnName, values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.whereNotIn(columnName as any, values as any)
            return buildWhereFromUpdate(query, knex)
        },
        withData: async (values) => {
            const formatedValues = Object
                .entries(values)
                .reduce((accum, [key, value]) => ({
                    ...accum,
                    [key]: value === NULL_DB_VALUE ? knex.raw('NULL') : value,
                }), {})
            await query.update(formatedValues)
        },
    })

const knexCreateTypedKnex = <
    AllTables extends Record<string, Record<string, unknown>>,
    AllTableNames extends OnlyStringKeys<keyof AllTables>
>(knex: Knex): TypedKnex<AllTables, AllTableNames> => ({
    table: (
        tableName,
    ) => {
        const knexWithTable = knex(tableName)

        return {
            select: buildSelectFunction(tableName, knexWithTable),
            insert: async (values) => {
                const [key] = await knexWithTable.insert(values)
                return key
            },
            insertMultiple: async (values) => {
                await knexWithTable.insert(values)
            },
            insertOrMerge: async (values) => {
                await knexWithTable
                    .insert(values)
                    .onConflict('id')
                    .merge()
            },
            updateWhere: buildWhereFromUpdate(knexWithTable, knex).where,
            updateWhereOp: buildWhereFromUpdate(knexWithTable, knex).whereOp,
            updateWhereNull: buildWhereFromUpdate(knexWithTable, knex).whereNull,
            updateWhereNotNull: buildWhereFromUpdate(knexWithTable, knex).whereNotNull,
            updateWhereNested: buildWhereFromUpdate(knexWithTable, knex).whereNested,
        }
    },
    transaction: async (callback) => {
        let typedTransaction: TransactionTypedKnex<AllTables, AllTableNames> | undefined

        const transactionResult = await knex
            .transaction((transaction) => {
                typedTransaction = knexGetTransactionTypedKnex(transaction)
                return callback(typedTransaction)
            })

        if (!typedTransaction) {
            throw new Error('Transaction not found')
        }

        await Promise.all(
            typedTransaction.getOnCompletedListeners()
                .map((listener) => listener()),
        )

        return transactionResult
    },
    getOriginal: () => knex,
    inTransaction: false,
})

export default knexCreateTypedKnex
