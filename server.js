// reference the http module so we can create a webserver
var application_root=__dirname,
    express = require("express"),
    path = require("path"),
    fileSystem =require('fs'),
    util=require('util'),
    easyxml=require("easyxml"),
    ejs=require('ejs'),
    //mongoose= require("mongoose"),
    mymodel=require("./model");

var server=express();    

//mymodel.createDatabase();
//mongoose.connect("mongodb://uddiluke:gomyway@linus.mongohq.com:10056/weather");



//Config
server.configure(function(){
   server.use(express.bodyParser());
   server.use(express.methodOverride());
   server.use(server.router);
   server.use(express.static(path.join(application_root,"public")));
   server.use(express.errorHandler({dumpException:true,showStack:true }));
   
   
   // map .renderFile to ".html" files
   //server.engine('xml', require('ejs').renderFile);

   // make ".html" the default
   //server.set('view engine', 'xml');

   // set views for error and 404 pages
    //server.set('views', __dirname + '/data');
    
   
    easyxml.configure({
      singularizeChildren: true,
      underscoreAttributes: true,
      rootElement: 'response',
      dateFormat: 'ISO',
      indent: 2,
       manifest: true
    });
    

});

function fixture(name) {
  return fileSystem.readFileSync(application_root+"/data/"+ name, 'utf8').replace(/\r/g, '');
}

server.get('/checkVerAd',function(req,res){
   
       console.log(req.url); 
    res.status(200).write(ejs.render(fixture('checkVerAd.xml')));     //fixture('checkVerAd.xml'));
    res.end();
});

server.get('/registerDevice',function(req,res){
   
    console.log(req.url); 
    res.status(200).write('0\r\n87800876\r\n');     //fixture('checkVerAd.xml'));
    res.end();
});

server.get('/uploadPVUVStats',function(req,res){
   
    console.log(req.url); 
    res.status(200).write('0\r\n');     //fixture('checkVerAd.xml'));
    res.end();
});

server.get('/getCityForecasts',function(req,res){
   
    console.log(req.url); 
     res.status(200).write(ejs.render(fixture('forecasts.xml')));   
    res.end();
});

server.get('/getNewestShare',function(req,res){
   
    console.log(req.url); 
     res.status(200).write(ejs.render(fixture('newshare.xml')));   
    res.end();
});

server.get('/getPersonalMsgCount',function(req,res){
   
    console.log(req.url); 
     res.status(200).write('0\r\n0,1359384016075');   
    res.end();
});

server.get('/getLifePhotosFlow',function(req,res){
   
    console.log(req.url); 
    res.status(200).write(ejs.render(fixture('photosflow.xml')));   
    res.end();
});





server.get('/version',function(req,res){
    //return version;
    console.log('version start');
    var filePath =path.join(application_root,'cg.zip');
    var stat = fileSystem.statSync(filePath);
    
    res.writeHead(200);
    res.write('<xml><cgupdate><status>OK</status><lastupdate>1339664441</lastupdate><filesize>'+stat.size+'</filesize></cgupdate></xml>');
    //res.send('{"curtime":{"status":"OK","time":1354872328}');
    res.end();
    console.log('version_end');
});

server.get('/galleryconfig',function(req,res){
    //return version;
    console.log('updategallery start');
    var versionid=req.cgid; //.query['cgid'];
    var localUpdateTime=req.query['t'];
    var filePath =path.join(application_root,'gallery.xml');
    
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
    var filePath =path.join(application_root,'gallerydata.zip');
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
    var filePath =path.join(application_root,'cg.zip');
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

server.listen(process.env.PORT, process.env.IP);





