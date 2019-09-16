```js
const Sql = require('sql');

const sql = new Sql({
    server: '',
    database: '',
    user: '',
    password: '',
    connectTimeout: 60000,
    requestTimeout: 60000,
    pool: {
        max: 5,
        min: 1,
        idleTimeoutMillis: 3000
    }
});
```

```js
const return = await sql.execute('procedureName', {
    input: any,
    $output: sql.type()
});

/*
return =
    {
        content: [],
        returnValue: Number|String,
        outputs: { output: any }
    }
*/
```

```js
const return = await sql.executeOne('procedureName', {
    input: any
});

/*
return =
    {
        content: {},
        returnValue: Number|String
    }
*/
```

```js
const return = await sql.query('Select * From TABELA Where id = $id', {
    id: 'String|Number|Date|Boolean'
});
```

```js
await sql.openTransaction();

const result = await sql.execute('procedureName', {
    input: any,
    $output: sql.type()
});

if(!result.returnValue)
    await sql.rollback();

await sql.commit();
```