const express=require("express")
//라이브러리 로드

//서버구동
const app=express();

/*
       bind()   => IP,PORT 연결(개통)
       listen()  => 대기상태
       accept() => 클라이언트가 접속시에 처리
*/
app.listen(3355,()=>{
    console.log("Serve Start","http://localhost:3355")
})

app.all('/*', function(req, res, next) { // 포트 충돌방지
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// 몽고디비 연결
const Client = require("mongodb").MongoClient;
// 클라이언트와 통신
// 사용자의 URI
app.get('/recipe',(request,response)=>{
    //request => 사용자가 보내주 요청정보 : page,id,pwd
    //요청 처리
    //결과 전송

    var page=request.query.page;
    var rowSize=12;
    var skip=(page*rowSize)-rowSize;
    /*
        1page => skip=0
        2page => 12개 버림->13번부터
    */

    var url="mongodb://211.238.142.181:27017"; // 몽고디비 주소
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        db.collection('recipe').find({}).skip(skip).limit(rowSize)
            .toArray((err,docs)=>{
                // docs라는 오브젝트로 배열데이터를 묶음
                response.json(docs);
                console.log(docs)
                client.close();
            })
    })
})

app.get('/recipe_total',(request,response)=>{
    var url="mongodb://211.238.142.181:27017";
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        db.collection('recipe').find({}).count((err,count)=>{
          response.json({total:Math.ceil(count/12.0)})
          client.close();
          return count;
        })
    })
})

app.get('/recipe_detail',(request,response)=>{
    var url="mongodb://211.238.142.181:27017";
    var no=request.query.no;
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        db.collection('recipe_detail').find({no:Number(no)}).toArray((err,detail)=>{
            response.json(detail[0]);
            client.close();
        })
    })
})

app.get('/chef',(request,response)=>{
    //request => 사용자가 보내주 요청정보 : page,id,pwd
    //요청 처리
    //결과 전송

    var page=request.query.page;
    var rowSize=50;
    var skip=(page*rowSize)-rowSize;
    /*
        1page => skip=0
        2page => 12개 버림->13번부터
    */

    var url="mongodb://211.238.142.181:27017"; // 몽고디비 주소
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        db.collection('chef').find({}).skip(skip).limit(rowSize)
            .toArray((err,docs)=>{
                // docs라는 오브젝트로 배열데이터를 묶음
                response.json(docs);
                console.log(docs)
                client.close();
            })
    })
})

app.get('/chef_total',(request,response)=>{
    var url="mongodb://211.238.142.181:27017";
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        db.collection('chef').find({}).count((err,count)=>{
            response.json({total:Math.ceil(count/50.0)})
            client.close();
            return count;
        })
    })
})

const xml2js = require("xml2js")
const request = require("request")
//외부서버에서 데이터 읽어올때 사용
app.get('/recipe_news',(req,res)=>{
    var query=encodeURIComponent("야구");
    var url="http://newssearch.naver.com/search.naver?where=rss&query="+query;
    var parser = new xml2js.Parser({
        //xml을 json으로 변경하는 파서기
        explicitArray:false
    })
    request({url:url},(err,request,xml)=>{
        parser.parseString(xml,function(err,pJson){
            console.log(pJson.rss.channel.item)
        })
    })
})
