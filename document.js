// 修改这个选择下载哪些文档，如果是空数组就下载所有的文档，示例中下载的是2-7个文档
var root=[1,2,3,4,5,6]
// 下载所有文档
// var root=[]

// 文档空间
var space = "express"
// 文档分类
var category = "manual"

var rootUrl = "https://ts.qiniu.io/action/article/tree?" + "category=" + category + "&" + "space=" + space;

function httpGet(theUrl)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function walk(rootDoc) 
{
    let id = rootDoc.locales["zh-CN"].id
    let contents = httpGet("https://ts.qiniu.io/action/articles/1/versions/" + id)
    let result = "\n# " + contents.title + "\n\n" + contents["content_md"] 
    if (rootDoc.children.length <= 0) {
        return result
    }
    for (let i = 0 ; i < rootDoc.children.length ; i++) {
        result += (walk(rootDoc.children[i]) + `\n\n---\n\n`)
    }
    return result 
}

function getAllResult(roots) {
    let rootArticle = httpGet(rootUrl)
    let result = ""
    for (let i = 0; i < rootArticle.length; i++) {
        if (roots.length > 0 && !roots.find(item => item === i)) {
            continue
        }
        let startArticle = rootArticle[i]
        result += walk(startArticle) 
    }
    return result
}

copy(getAllResult(root))
  

