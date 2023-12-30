(function()
{
    module.exports = function(mods)
    {
        var middleware = mods.express.Router();
        middleware.use(function(req, res, next)
        {
            next();
        });

        var authenticate =
        {
            authenticate : function(req, res, next)
            {
                // console.log(req.body);
                var rules = {
                    "user_id" : 'required|numeric'
                };
                var validation = new mods.Validator(req.body, rules);
                if(validation.passes())
                {
                    var user_id = req.body.user_id;
                    var token = req.body.token;
                    var ip = req.connection.remoteAddress;
                    var query = "select * from quest_token where user_id = ? and ip_address = ? and token = ?";
                    var params = [user_id, ip, token];
                    mods.Query.executeQuery(query, params, function(rows, fields, query)
                    {
                        if(rows.length == 1)
                        {
                            return next();
                        }
                        else
                        {
                            res.send({'code' : 5, 'message' : 'session does not exist', data : {}});
                        }
                    });
                }
                else
                {
                    res.send({'code' : 5, 'message' : 'parameters missing - token', data : {}});
                }
            }
        };
        mods.app.use('/', middleware);
        return authenticate;
    };
})();