var assert = require("assert");
var model =require("../model");
var chineseDay=require("../lunar");

describe('Model', function(){

 // Cleanup the test collection
  beforeEach(function(done) {
     model.DeviceUserModel.remove(function(err) {
       //assert..assert(!err,"remove user devices error")
       if(err)
          done(err);
       done();
    });
      model.SoftwareInfoModel.remove(function(err){
          assert.ok(err==null);
      });
      model.RegUserModel.remove(function(err){
          
      });
  });
  
  describe('create software info',function(){
      it("create software info",function(done){
           model.createSoftwareVersion(1110023203,200,'http://localhost/ss','This is a test',function(err,softid){
           //assert.assert(!err,"addsoft info error")
           assert.equal(err,undefined);
           assert.ok(softid!==null);
           done();
       }); 
      });
      
     it("find software info",function(done){
         
        model.createSoftwareVersion(1110023203,200,'http://localhost/ss','This is a test',function(){
            model.findSoftwareVersion(1110023203,function(err,softs){
             //assert.assert(!err,"addsoft info error")
              assert.ok(err==null);
             // assert.equal(err,undefined);
              assert.ok(softs!=null && softs.length==1);
              done();
            }); 
         
       }); 
         
        
      }); 
      
          
     it("remove software info",function(done){
         
        model.createSoftwareVersion(1110023203,200,'http://localhost/ss','This is a test',function(){
            model.removeSoftwareVersion(1110023203,function(err){
             //assert.assert(!err,"addsoft info error")
              assert.ok(err==null);
         
              done();
            }); 
         
       }); 
         
        
      });
      
      //register device name
      it("register device user",function(done){
         
        model.createSoftwareVersion('1110023203',200,'http://localhost/ss','This is a test',function(){
            model.registerDeviceUser(200,'Android',"Phone","HTC Desire","2.3.7","10","eesdsfs","122-232-2323",'1110023203',function(err,wuser){
             //assert.assert(!err,"addsoft info error")
              assert.ok(err===null);
              assert.ok(wuser!==null);
              assert.ok(wuser.installedSoft!=null);
              assert.ok(wuser.installedSoft.length==1);
              done();
            }); 
         
       }); 
         
        
      });
      
      //register sns user
       it("register sns user",function(done){
         
        model.createSoftwareVersion('1110023203',200,'http://localhost/ss','This is a test',function(){
            model.registerDeviceUser(200,'Android',"Phone","HTC Desire","2.3.7","10","eesdsfs","122-232-2323",'1110023203',function(err,wuser){
                 model.registerRegUser(wuser.id,'cy','cy@google.com','123456',function(err2,regUser){
                      assert.ok(err2==null);
                      assert.ok(regUser.id!=null);
                      
                      assert.ok(chineseDay.getChineseDayInfo()!=null);
                      var date=new Date();
                      console.log(date.getDate());
                      console.log(chineseDay.getChineseDayInfo(date.getFullYear(),date.getMonth(),10));
                      done();             
                    
                 });
                 
            }); 
         
       }); 
         
        
      });
      
  });
  
 
  
});