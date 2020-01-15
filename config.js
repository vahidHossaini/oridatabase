module.exports = class defaultConfig
{
    constructor(config)
    { 
         this.config=config;
    }
    getPackages()
    {
        var pkgs={}
       for(var a of this.config.connection)
       {
           if(a.type=="mongodb")
           {
               pkgs["odata-v4-parser"]="0.1.29";
               pkgs["mongodb"]="3.3.5";
               pkgs["assert"]="2.0.0"; 
           }
           if(a.type=="mongodb")
           {
               pkgs["mssql"]="6.0.1";
               pkgs["odata-v4-mysql"]="0.1.1";  
           }
       }
       var allPackages=[{name:"uuid"}];
       for(var x in pkgs)
       {
          var a= pkgs[x]
          allPackages.push({name:x,version:a})
       }
       return allPackages;
    }
    getMessage()
	{
		return{
			default001:"user not exist", 
		}
	}
    getVersionedPackages()
    { 
      return []
    }
    getDefaultConfig()
    {
      return { 
		 
      }
    }
}