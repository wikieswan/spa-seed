/**
 * Created by wan-mac on 15/9/9.
 */
$(function(){
    var stateMap = {
        home :  'views/home.html',
        about : 'views/about.html',
        contact : 'views/contact.html'
    };
    window.onhashchange = function(){
        var hash = location.hash;
        stateChange(hash)
    };
    /**
     * hash 规则
     * 1 url = http://www.a.com/
     *   默认首页
     * 2 url = http://www.a.com/#
     *   默认首页
     * 3 url = http://www.a.com/#router
     *   加载 router 页面
     * 4 url = http://www.a.com/#router?name=nick&age=18
     *   加载 router 页面，并且传递参数?name=nick&age=18
     */
    function stateChange(hash){
        var url = hashUrl(hash);
        var templateUrlStr = templateUrl(url);
        loadTemplate(templateUrlStr);
    }

    /**
     * 获取url的hash值
     * @param hash
     * @returns {*}
     */
    function hashUrl(hash){
        var url ;
        if(hash===''){//1 2
            url = '';
        }
        else if(hash.indexOf('?')===-1){// 3
            url = hash.replace(/#/,'');
        }
        else{// 4
            var index = hash.indexOf('?');
            url = hash.substring(1,index);
        }
        return url;
    }

    /**
     * 获取hash对应的路由地址
     * @param url
     * @returns {*}
     */
    function templateUrl(url){
        var templateUrlStr = stateMap[url]===undefined?stateMap['home']:stateMap[url];
        return templateUrlStr;
    }
    function loadTemplate(url){
        $('#gl_main').load(url,function(){
            console.log(1)
            $(window).scrollTop(0);
        })
    }

});