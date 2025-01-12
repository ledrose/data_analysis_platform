import { build } from "@hapi/joi";
import { InternalServerErrorException } from "@nestjs/common/exceptions/internal-server-error.exception";
import { Knex } from "knex";
import { ChartFilter } from "src/charts/entities/filter.entity";
import { ChartSort } from "src/charts/entities/sort.entity";
import { AggregateType, DatasetField } from "src/datasets/entities/dataset-field.entity";
import { DatasetJoin } from "src/datasets/entities/dataset-join.entity";

export class QueryBuilderCustom {
    
    private knex: Knex<any, any[]>;
    private operations: ((knexBuilder: Knex.QueryBuilder) => Knex.QueryBuilder)[] = [];
    constructor(knex: Knex) {
        this.knex = knex;
    }

    static new(knex: Knex) {
        return new QueryBuilderCustom(knex);
    }

    build() {
        return {builder: 
            this.operations.reduce((prev,operation) => operation(prev),this.knex.queryBuilder())
        } 
    }

    addTestField(fieldString: string) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            knexBuilder.select(this.knex.raw(fieldString + " as result"));
            return knexBuilder
        });
        return this;
    }

    addDatasetFields(fields: DatasetField[],ignoreAggregates: boolean = false) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            fields.forEach((field) => {
                if (field.isSimple) {
                    const fieldString = `${field.sourceFields[0].sourceTable.name}.${field.sourceFields[0].name} as ${field.name}`;  
                    if (ignoreAggregates) {
                        knexBuilder = knexBuilder.select(fieldString);
                    } else {
                        knexBuilder = this.addAggregateFunction(knexBuilder,field.aggregateType)(fieldString);
                    }
                } else {
                    let fieldString = `${field.formula} as ${field.name}`;
                    for (let i=0; i<field.sourceFields.length;i++) {
                        fieldString = fieldString.replaceAll("${"+i+"}",`"${field.sourceFields[i].sourceTable.name}"."${field.sourceFields[i].name}"`);
                    }
                    knexBuilder = knexBuilder.select(this.knex.raw(fieldString));
                    // knexBuilder = this.addAggregateFunction(knexBuilder,field.aggregateType)(fieldString);
                }
            })
            return knexBuilder
        });
        return this;
    }
    fromRequiredTables(requiredTables: string[], joins: DatasetJoin[]) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            
            knexBuilder = knexBuilder.from(requiredTables[0]);
            console.log(requiredTables)
            //Здесь мы пытаемся сделать идиотское дерево из joinов и добавляем только те у которых одной вершины нету в списке
            //Если два поиска закончились неудачно или мы подключили все таблицы, то выходим из цикла.
            const joinedTables = [requiredTables[0]];
            let tempVariable = 0;
            let el: DatasetJoin;
            // while (   joinedTables.length<requiredTables.length) {
            while (requiredTables.some((table) => !joinedTables.includes(table))) {
                tempVariable = joinedTables.length
                el = joins.find((join) => joinedTables.includes(join.leftSourceField.sourceTable.name)
                    && !joinedTables.includes(join.rightSourceField.sourceTable.name));
                if (el!=undefined) {
                    joinedTables.push(el.rightSourceField.sourceTable.name);
                    this.addJoinFunction(knexBuilder)[el.type.toString()](
                        el.rightSourceField.sourceTable.name,
                        `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`,
                        `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`
                    )
                }
                el = joins.find((join) => !joinedTables.includes(join.leftSourceField.sourceTable.name)
                    && joinedTables.includes(join.rightSourceField.sourceTable.name));
                if (el!=undefined) {
                    joinedTables.push(el.leftSourceField.sourceTable.name);
                    this.addJoinFunction(knexBuilder)[el.type.toString()](
                        el.leftSourceField.sourceTable.name,
                        `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`,
                        `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`
                    )
                }
                //Если ничего небыло сделано за циклы, значит таблицы не связаны
                if (tempVariable==joinedTables.length) {
                    throw new InternalServerErrorException("Query build failed: Joins resolution failed")
                }
            }
            return knexBuilder;
        });
        return this;
    }

    offset(offset: number) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            if (offset>0) {
                knexBuilder = knexBuilder.offset(offset,{skipBinding: true})   
            }
            return knexBuilder;
        });
        return this;
    }

    limit(limit: number) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            if (limit>0) {
                knexBuilder = knexBuilder.limit(limit,{skipBinding: true});    
            }
            return knexBuilder;
        });
        return this;
    }

    groupBy(groupBy: DatasetField[]) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            groupBy.forEach((field) => {
                knexBuilder = knexBuilder.groupBy(field.name);
            })
            return knexBuilder;
        });
        return this;
    }

    filter(filters: ChartFilter[]) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            knexBuilder.where((builder) => {
                filters.forEach(element => {
                    builder = this
                        .addWhereFunction(builder,element.operator,element.value1,element.value2)
                        (this.getFullFieldFormula(element.field));
                });
            })
            return knexBuilder;
        });
        return this;
    }

    sortBy(sortBy: ChartSort[]) {
        this.operations.push((knexBuilder: Knex.QueryBuilder) => {
            const sortConditions = sortBy.sort((a,b) => a.order-b.order)
                .map((element) => ({'column': element.field.name,'order':element.asc?'asc':'desc'}));
            knexBuilder = knexBuilder.orderBy(sortConditions);
            return knexBuilder;
        });
        return this;
    }

    private getFullFieldFormula(field: DatasetField) {
        if (field.isSimple) {
            return `${field.sourceFields[0].sourceTable.name}.${field.sourceFields[0].name}`;   
        } 
        let fieldString = `${field.formula} as ${field.name}`;
        for (let i=0; i<field.sourceFields.length;i++) {
            fieldString = fieldString.replaceAll("${"+i+"}",`"${field.sourceFields[i].sourceTable.name}"."${field.sourceFields[i].name}"`);
        }
        return this.knex.raw(fieldString);        
    }

    private addWhereFunction(knexBuilder: Knex.QueryBuilder, filterType: string, field1: string, field2: string) {
        return (a: any) => {
            switch (filterType) {
                case "contains":
                    return knexBuilder.where(a, 'like', `%${field1}%`);
                case "=":
                    return knexBuilder.where(a, field1);
                case "!=":
                    return knexBuilder.whereNot(a, field1);
                case ">":
                    return knexBuilder.where(a, '>', field1);
                case ">=":
                    return knexBuilder.where(a, '>=', field1);
                case "<":
                    return knexBuilder.where(a, '<', field1);
                case "<=":
                    return knexBuilder.where(a, '<=', field1);
                case "between":
                    return knexBuilder.whereBetween(a, [field1, field2]);
                case "like":
                    return knexBuilder.whereLike(a, `%${field1}%`);
            }
            return knexBuilder.where(a);
        }
    }

    private addAggregateFunction(knexBuilder: Knex.QueryBuilder,aggregateType: AggregateType) {
        return (a: string) => {
            switch (aggregateType) {
                case AggregateType.SUM:
                    return knexBuilder.sum(a);
                case AggregateType.COUNT:
                    return knexBuilder.count(a);
                case AggregateType.NONE:
                    return knexBuilder.select(a);
                case AggregateType.COUNTUNIQUE:
                    return knexBuilder.countDistinct(a);
            }
        }
    }
    private addJoinFunction(knexBuilder: Knex.QueryBuilder) {
        return {
            "inner": (a,b,c) => knexBuilder.innerJoin(a,b,c),
            "left": (a,b,c) => knexBuilder.leftJoin(a,b,c),
            "right": (a,b,c) => knexBuilder.rightJoin(a,b,c),
        }
    }

}