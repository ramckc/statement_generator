const generateUpdateStatement = require('./StatementGenerator');
const FS = require('fs');

const Data = JSON.parse(FS.readFileSync('data.json'));
let MutationQuery;
let ResultStatement;


MutationQuery = JSON.stringify({ "posts": [{"_id": 2, "value": "too"}] });
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({"posts": [{"value": "four"}] });
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({ "posts": [{"_id": 2, "_delete": true}] });
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({
    "posts": [
        {"_id": 2, "value": "too"},
        {"value": "four"},
        {"_id": 4, "_delete": true}
    ]
});
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({"posts": [{"_id": 3, "mentions": [{"text": "banana"}]}]});
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({ "posts": [{"_id": 3, "mentions": [ {"_id": 5, "text": "pear"}]}] });
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = '{ "posts": [{"_id": 3, "mentions": [ {"_id": 5, "text": "pear"}]}] }';
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({"posts": [{"_id": 3, "mentions": [{"text": "banana"}]}]});
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));

MutationQuery = JSON.stringify({ "posts": [{"_id": 3, "mentions": [{"_id": 6, "_delete": true}]}]});
ResultStatement = generateUpdateStatement(Data, MutationQuery);
console.log(JSON.stringify(ResultStatement));
