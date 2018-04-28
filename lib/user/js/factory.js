angular.module('schoolnode.factory',[]).
factory('LSfactory',function(){
    var user = '';
    var STD ={
        clear : function(){
            return localStorage.clear();
        },
        set : function(key, data){
            
            return localStorage.setItem(key,JSON.stringify(data))
        },
        delete : function(key){
            return localStorage.removeItem(key)
        },
        get : function(key){
            return JSON.parse(localStorage.getItem(key))
        }

    };
    return STD;
}).
factory('SSfactory',function(){
// the use of SSfactory is for data that should be deleted at the end of the session
    var STD ={
        clear : function(){
            return sessionStorage.clear();
        },
        set : function(key, data){
            
            return sessionStorage.setItem(key,JSON.stringify(data))
        },
        delete : function(key){
            return sessionStorage.removeItem(key)
        },
        get : function(key){
            return JSON.parse(sessionStorage.getItem(key))
        }

    };
    return STD;
}). 
factory('AUTHfactory',function(LSfactory, SSfactory){
    var AUTH;
    AUTH = {
        isLoggedIn : function(){
            var logged = true;
            if(this.getSessionUser() === null && this.getPermanentUser() === null){
                return logged = false;
            };
            return logged = true;
        },
        getPermanentUser : function(){
            return LSfactory.get('user');
        },
        setPermanentUser : function(data){
            return LSfactory.set('user',data);
        },
        getSessionUser : function(){
            return SSfactory.get('user');
        },
        setSessionUser : function(data){
            return SSfactory.set('user',data);
        }
    }
    return AUTH;
}).
factory('APIfactory',function($http){
    var API = {
        send : function(address, data){
            return $http.post(address, data);
            // returns a promise so chain a then method

        },
        get: function(address){
            return $http.get(address);
        },
        remove : function(address){
            return $http.delete(address);
            //data can be a single ID of the data tO delete
        },
        edit: function(adress, data){
            return $http.put(address, data);  
        }
    }
    return API;
}).
factory('STRfactory',function(){
    var STR = {
        formatNews: function(str){
            var result = str.split('#');
            return result;

        }
    }
    return STR;
}).
factory('NAVfactory',function(SSfactory){
    var NAV = {
        saveURL : function(){
            var url = window.location.href;
         return   SSfactory.set('url',url);

        },
        getURL : function(){
            return SSfactory.get('url');
        }
    }
    return NAV;
}).
factory('DTfactory', function(){
    var dt = {
        timeDiff : function(dateTime){
         var newsDate =   new date(dateTime);
         var now = new date();
        }
    }
})