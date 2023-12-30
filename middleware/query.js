(function()
{
    module.exports = function(connection, Promise)
    {
        var query = {
            executeQuery : function(query, params, callback)
            {
                var sqlQuery = connection.query(query, params, function(error, results, fields)
                {
                    if(error)
                    {
                        try
                        {
                            query.rollbackTransaction();
                        }
                        catch(e)
                        {

                        }

                        throw error + " Full Query : " + sqlQuery.sql;
                    }
                    callback(results, fields, sqlQuery.sql);
                });
            },
            executeQueryWithPromise : function(query, params)
            {
                //for(var i = 0; i < params.length; i++)
                //{
                //    if(typeof params[i] != "object")
                //    {
                //        params[i] = connection.escape(params[i]);
                //    }
                //}
                return new Promise(function(fulfill, reject)
                {
                    var sqlQuery = connection.query(query, params, function(error, results, fields)
                    {
                        if(error)
                        {
                            try
                            {
                                query.rollbackTransaction();
                            }
                            catch(e)
                            {

                            }
                            // console.log(error + " Full Query : " + sqlQuery.sql);
                            reject(error + " Full Query : " + sqlQuery.sql);
                        }
                        fulfill({
                            results : results, fields : fields, query : sqlQuery.sql
                        });
                    });
                });
            },
            create : function(query, params, callback)
            {
                var sqlQuery = connection.query(query, params, function(err, result, fields)
                {
                    callback(result, fields, sqlQuery.sql)
                });
            },
            beginTransaction : function()
            {
                connection.beginTransaction(function(err)
                {
                    if(err)
                    {
                        throw err;
                    }
                    // console.log("begin transaction");
                });
            },
            commitTransaction : function()
            {
                connection.commit(function(err)
                {
                    if(err)
                    {
                        throw err;
                    }
                    // console.log("transaction committed");
                });
            },
            rollbackTransaction : function()
            {
                connection.rollback(function()
                {
                    // console.log("transaction rollback");
                });
            }
        };
        return query;
    }
})();