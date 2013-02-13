// reference the http module so we can create a webserver
var application_root=__dirname,
    application_data=application_root+"/travel_data",
    application_static="http://demo-project.chen_luke.c9.io/travel",
    express = require("express"),
    path = require("path"),
    fileSystem =require('fs'),
    util=require('util'),
    ejs=require('ejs');
    //mongoose= require("mongoose"),
    //mymodel=require("./model");

var server=express();    

//mymodel.createDatabase();
//mongoose.connect("mongodb://uddiluke:gomyway@linus.mongohq.com:10056/weather");



//Config
server.configure(function(){
   server.use(express.bodyParser());
   server.use(express.methodOverride());
 
   server.use(express.static(path.join(application_root,"public")));
   server.use(server.router);
   server.use(express.errorHandler({dumpException:true,showStack:true }));
     

});

function fixture(name) {
  return fileSystem.readFileSync(path.join(application_data, name), 'utf8').replace(/\r/g, '');
}

server.get('/getLifePhotosFlow',function(req,res){
   
    console.log(req.url); 
    res.status(200).write(ejs.render(fixture('photosflow.xml')));   
    res.end();
});

server.get('/version',function(req,res){
    //return version;
    console.log('version start');
    var filePath =path.join(application_data,'cg.zip');
    var stat = fileSystem.statSync(filePath);
    
    res.status(200).write(ejs.render(fixture('version.xml'),{lastUpdateTime:1339664441,fileSize:stat.size})); 
    //res.write('<xml><cgupdate><status>OK</status><lastupdate>1339664441</lastupdate><filesize>'+stat.size+'</filesize></cgupdate></xml>');
    //res.send('{"curtime":{"status":"OK","time":1354872328}');
    res.end();
    console.log('version_end');
});

server.get('/galleryconfig',function(req,res){
    //return version;
    console.log('updategallery start');
    var versionid=req.cgid; //.query['cgid'];
    var localUpdateTime=req.query['t'];
    var filePath =path.join(application_data,'gallery.xml');
    
    res.writeHead(200);
    //res.send('{"curtime":{"status":"OK","time":1354872328}');
    var readStream=fileSystem.createReadStream(filePath);
    util.pump(readStream,res);
    //res.end();
    console.log('updategallery_end');
});

server.get('/updategallery',function(req,res){
    //return version;
    console.log('downloadgallery data start');
    var versionid=req.query['cgid'];
    var localUpdateTime=req.query['t'];
    var filePath =path.join(application_data,'gallerydata.zip');
    res.writeHead(200);
    //res.send('{"curtime":{"status":"OK","time":1354872328}');
    if(fileSystem.exists(filePath)){
       var readStream=fileSystem.createReadStream(filePath);
       util.pump(readStream.res);
       
    }else{
       res.end();
    }
    console.log('downloadgallery data end');
});


server.get('/download',function(req,res){
    //return version;
    console.log('download start');
    var filePath =path.join(application_data,'cg.zip');
    var stat = fileSystem.statSync(filePath);

    res.writeHead(206,
        {'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size});
    var readStream=fileSystem.createReadStream(filePath);
    util.pump(readStream,res);
    console.log('download end');
});

server.get('/download_mirror',function(req,res){
    console.log('redirect start');
    var host=req.headers['host'];
    console.log(host);
    res.redirect('http://'+host+'/download');
    console.log('redirect ok');    
}
);

server.get('/getnewsconfig',function(req,res){
    //return version;
    console.log('getnews start');
    var versionid=req.cgid; //.query['cgid'];
    var localUpdateTime=req.query['t'];
    var newsRoot=application_static+"/news";
    //var NewsModel={id:String,title:String,category:Number,publishDate:String,imgUrl:String,thumbnailUrl:String,contentUrl:String,summery:String,source:String};
    var newsInfo=[];
    newsInfo[0]={
        id:'1001',
        title:'Welcome to Mt.Huashan',
        category:21,
        publishDate: '2012-12-12 12:12',
        imgUrl:newsRoot+"/1001/news_1001_pic.jpg",
        thumbnailUrl:newsRoot+"/1001/news_1001_pic_small.jpg",
        contentUrl:newsRoot+"/1001/news_1001.zip",
        summery:"welcome to MT.Huashan",
        source:"http://teamconcert.net/"
    };
    
    res.status(200).write(ejs.render(fixture('newsconfig.xml'),{lastUpdateTime:1351501038,newsList:newsInfo})); 
    //res.end();
    console.log('getnews end');
});


server.listen(process.env.PORT, process.env.IP);





