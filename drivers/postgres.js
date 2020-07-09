var opOdata=require("odata-v4-pg")
module.exports = class postgresdb
{
  constructor(config)
  {
    var connectiondata={
      user:"",
    };
    this.connection=new Client({
        user: 'dbuser',
        host: 'database.server.com',
        database: 'mydb',
        password: 'secretpassword',
        port: 3211,
      });
  }
  createFilter(obj,parameters)
  {
     var str="";
     for(var a in obj)
     {
       str+="("
      if(a=="$and")
      {
        var andstr="";
        for(var b of obj[a])
        {
          andstr+='('+createFilter(b,parameters)+') and ';
        }
        str+=andstr.substr(0,andstr.length-5);
      }
      else if(a=="$or")
      {
        var andstr="";
        for(var b of obj[a])
        {
          andstr+='('+createFilter(b,parameters)+') and ';
        }
        str+=andstr.substr(0,andstr.length-4);
      }
      else
      {
        var strdata = a +" "
        if(obj[a]['$eq'])
        {
          parameters.push(obj[a]['$eq'])
          strdata += '=$'+(parameters.length)
        }
        else if(obj[a]['$ne'])
        {
          parameters.push(obj[a]['$ne'])
          strdata += '!=$'+(parameters.length)
        }
        else if(obj[a]['$gt'])
        {
          parameters.push(obj[a]['$gt'])
          strdata += '>$'+(parameters.length)
        }
        else if(obj[a]['$gte'])
        {
          parameters.push(obj[a]['$gte'])
          strdata += '>=$'+(parameters.length)
        }
        else if(obj[a]['$lt'])
        {
          parameters.push(obj[a]['$lt'])
          strdata += '<$'+(parameters.length)
        }
        else if(obj[a]['$lte'])
        {
          parameters.push(obj[a]['$lte'])
          strdata += '<=$'+(parameters.length)
        }
        else
        {
          parameters.push(obj[a])
          strdata += '<=$'+(parameters.length)

        }
        str+=strdata;
      }
      str+=")and "
     }
     if(str)
      str=str.substr(0,str.length-5);
    return str;  
    //  var length= Object.keys(obj).length
    //  if(length>)
  }
  joinOrder(box,odata)
  {
    var order="";
    if(box.order)
    {
      for(var a of box.order)
      {
        if(a.length==1 || a.length==2)
        {
          order+=a[0];
          if(a.length==2)
            order+=" "+a[1]
          order+=","  
        }
      }
      if(order)
        order=order.substr(0,order.length-1)
    }
    if(odata.$orderby)
    {
      var query = opOdata.createQuery("$orderby="+odata.$orderby);
      if(query.orderby)
        order+=(order?',':'')+query.orderby
    }
    return order;
  }
  joinFilter(box,odata)
  {
    var parametersArray=[];
    var filter = "";
    var boxCondition = ""; 
    if(odata.$filter)
    {
      try{
        var filter = opOdata.createQuery("$filter="+odata.$filter);
        parametersArray=filter.parameters;
        filter=filter.where;
      }catch(exp){}
    }
    if(box.where)
    {
      boxCondition = this.createFilter(box.where,parametersArray)
      if(boxCondition)
      {
        if(filter)
          filter = "("+filter+") and ("+boxCondition+")"
        else
          filter = boxCondition
      }
    }
    return {filter,parameters:parametersArray};
  }
  joinSelect(box,odata)
  {
    var select=[]
    var selectGroup=[]
    if(box.select)
    { 
        for(var x of box.select)
        {
            if(typeof(x)=='string')
            {
                select.push(x)
            }
            else
            {
                if(x.type=='function')
                {
                    selectGroup.push(x)
                }
            }
        } 
    } 
    if(odata.$select)
    {
      var tempselect=[]
      var query = opOdata.createQuery("$select="+odata.$select);
      for(var a of query.select) 
        a=a.substr(1,a.length-2)
      if(select.length)
      {
        for(var a of query.select)
        {
          if(select.indexOf(a)>-1)
            tempselect.push(a)
        }
      }
      else
      {
        tempselect=query.select;
      }
      select=tempselect;
    }
    return {select,selectGroup};
  }
  CreateSyntax(name,box,odata)
  {
    var selectData=this.joinSelect(box,odata);
    var order = this.joinOrder(box,odata);
    var filter= this.joinFilter(box,odata);
  }
  Search(name,box,odata,func)
  {

  }
  Update(name,keys,data,func)
  {

  }
  Insert(name,keys,data,func)
  {

  }
  Save(name,keys,data,func)
  {

  }
  Delete(name,keys,data,func)
  {

  }
}