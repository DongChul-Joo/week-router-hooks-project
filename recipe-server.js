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
    var skip=(page-1)*rowSize;
    /*
        1page => skip=0
        2page => 12개 버림->13번부터
    */

    var url="mongodb://211.238.142.181.27017"; // 몽고디비 주소
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
