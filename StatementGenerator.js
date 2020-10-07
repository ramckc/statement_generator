
function generateUpdateStatement(OriginalDocument, Mutation)
{
    const Result = {};
    const Query = JSON.parse(Mutation);
    const KeysToMutate = Object.keys(Query);

    KeysToMutate.map((Key) => {
        const Statements = Query[Key];

        Statements.map((Statement) => {
            const ProcessedStatement =
                ProcessSingleStatement(Key, Statement, OriginalDocument);
            let StatementType = ProcessedStatement.Type;
            
            if(ProcessedStatement.SubStatements.length > 0)
            {
                ProcessedStatement.SubStatements.map((SubStatement) => {
                    StatementType = SubStatement.Type;
                    
                    if(!Result[StatementType])
                    {
                        Result[StatementType] = [];
                    }
                    
                    const QueryKey =
                        `${ProcessedStatement.QueryKey}.${SubStatement.QueryKey}`;
                    Result[StatementType].push({
                        [QueryKey]: SubStatement.QueryValue
                    });                    
                });
            }
            else
            {
                if(!Result[StatementType])
                {
                    Result[StatementType] = [];
                }

                Result[StatementType].push({
                    [ProcessedStatement.QueryKey]: ProcessedStatement.QueryValue
                });
            }
        });
    });

    return(Result);
}

function ProcessSingleStatement(Key, Statement, OriginalDocument)
{
    const Result = [];
    let SubStatements = [];
    let { Type, Id } = GetStatementType(Statement);
    const Index = GetIndexById(OriginalDocument[Key], Id);
    const ObjectToMutate = OriginalDocument[Key][Index];
    let QueryKey = `${Key}`;
    let QueryValue;

    const StatementKeyValue = GetStatementKeyValue(Statement);
    const { StKey, StValue } = StatementKeyValue ? StatementKeyValue : {};
    
    if(Type === '$add')
    {
        QueryValue = [Statement];
    }
    else if(Type === '$remove' && Index !== -1)
    {
        QueryKey += `.${Index}`;
        QueryValue = true;
    }
    else if (Type === '$update' && Index !== -1)
    {
        QueryKey += `.${Index}`;
        QueryValue = StValue;


        if(Array.isArray(StValue))
        {
            SubStatements = StValue.map((SubStatement) => {
                const SubStatementResult =
                    ProcessSingleStatement(StKey, SubStatement, ObjectToMutate);

                return {
                    Type: SubStatementResult.Type,
                    QueryKey: SubStatementResult.QueryKey,
                    QueryValue: SubStatementResult.QueryValue,
                };
            });
        }
        else
        {
            QueryKey += `.${StKey}`;
        }
    }
    return({
        Type,
        QueryKey,
        QueryValue,
        SubStatements,
    });
}

function GetStatementKeyValue(Statement)
{
    const StatementKeys = Object.keys(Statement);
    for(let Index = 0; Index < StatementKeys.length; ++Index)
    {
        const StKey = StatementKeys[Index];
        if(!['_id', '_delete'].includes(StKey))
        {
            return ({
                StKey,
                StValue: Statement[StKey]
            });
        }
    }
}

function GetStatementType(Statement)
{
    const StatementKeys = Object.keys(Statement);
    const Result = {};
    Result['Type'] = '$add';
    if(StatementKeys.includes('_id'))
    {
        Result['Id'] = Statement._id;
        if(StatementKeys.includes('_delete'))
        {
            Result['Type'] = '$remove';
        }
        else
        {
            Result['Type'] = '$update';
        }
    }

    return(Result);
}

function GetIndexById(ObjectList, Id)
{
    return ObjectList.findIndex((Obj) => {
        return Obj._id === Id;
    });
}

module.exports = generateUpdateStatement;
