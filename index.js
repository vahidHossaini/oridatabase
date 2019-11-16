var uuid=require("uuid");
var dbs ={};
class globalDb
{
    constructor(disc)
    {
        this.disc=disc
        this.type={
            string:{
                mysql:'nvarchar',
                mssql:'nvarchar'
            },
            bool:{
                mysql:'bit',
                mssql:'bit'
            },
            small:{
                mysql:'int',
                mssql:'int'
            },
            number:{
                mysql:'bigint',
                mssql:'bigint'
            },
            Json:{
                mysql:'bigint',
                mssql:'bigint'
            },
            object:{
                complex:true,

            },
            array:{
                complex:true
            }
        }
        
    }
    Config(context,structure,func)
    {
        return this.disc.run('database','Config',{name:context,structure:structure},func)
    }
    Search(context,table,query,odata,func)
    {
        if(!odata)
            odata={}
        return this.disc.run('database','Search',{name:context,table:table,query:query,odata:odata},func)
    }
    SearchOne(context,table,query,odata,func)
    {
        if(!odata)
            odata={}
        return this.disc.run('database','SearchOne',{name:context,table:table,query:query,odata:odata},func)
    }
    Save(context,table,key,data,func)
    {
        return this.disc.run('database','Save',{name:context,table:table,key:key,data:data},func)
    }
    Delete(context,table,key,data,func)
    {
        return this.disc.run('database','Delete',{name:context,table:table,key:key,data:data},func)
    }
    Update(context,table,key,data,func)
    {
        return this.disc.run('database','Update',{name:context,table:table,key:key,data:data},func)
    } 
    Replicate(context,table,func)
    {
        return this.disc.run('database','Replicate',{name:context,table:table},func)
        
    }
}
module.exports = class defaultIndex
{
	constructor(config,dist)
	{
		this.config=config.statics
		this.context=this.config.context 
		global.db=new globalDb(dist)
		 
        for(var a of this.config.connection)
        {
            dbs[a.name]=new (require('./drivers/'+a.type))(a,dist)
        }
	}
	Search(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Search(a.table,a.query,a.odata,func)
    }
    SearchOne(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Search(a.table,a.query,a.odata,(ee,dd)=>{

            if(ee)
            {
                console.log(ee)
                return func({m:"error"})
            }
            if(dd.value.length)
            {
                return func(null,dd.value[0])
            }
            else{ 
                return func(null,null)
            }
        })
    }
    Save(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Save(a.table,a.key,a.data,func)
    }
    Update(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Update(a.table,a.key,a.data,func)
    }
    Delete(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Delete(a.table,a.key,a.data,func)
    }
    Replicate(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Replicate(a.table,func)
    }
    Transaction(msg,func,self)
    {
        var a =msg    
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Transaction(a.tdata,func)
    }
    Config(msg,func,self)
    {
        var a =msg   
        if(!a.name || !dbs[a.name])
            return func({message:'connection not exist'})
        dbs[a.name].Config(a.structure,func)

    }
}