var mongoose=require("mongoose");
var  extend = require('mongoose-schema-extend');

var Schema=mongoose.Schema;

mongoose.connect("mongodb://uddiluke:gomyway@linus.mongohq.com:10056/weather");

var RegUserSchema=new Schema({
   nickName:String,
   email:String,
   faceImageUrl:String,
   sharedInfo:String,
   role:String,
   company:String,
   password:String
});

var SoftwareInfoSchema=new Schema({
    version:String,
    lastUpdateTime:Date,
    dbVersion:Number,
    downloadUrl:String,
    versionInfo:String
});


var DeviceUserSchema=new Schema({
    partnerID:String,
    deviceType:String,
    platform:String,
    deviceModel:String,
    commProvider:String,
    sdkVersion:String,
    IMEI:String,
    MAC:String,
    sdkApiLevel:Number,
    regUser:[{type:Schema.ObjectId,ref:"RegUserModel"}],
    //installedSoft:[SoftwareInfoSchema]
    installedSoft:[{type: Schema.ObjectId, ref: 'SoftwareInfoModel'}]
});

var CitySpecialThingSchema=new Schema({
    name:String
});

CitySpecialThingSchema.static("getSpecialThing",function(day,callback){
    
});

var CitySchema=new Schema({
    timeZone:String,
    cityID:Number,
    name:String
});


var DaySchema=new Schema({
    date:Date,
    isHoliday:Boolean,
    holidayName:String,
    daysLeftToNextHoliday:Number,
    chineseDate:String,
    dayOfWeek:Number,
});

var ForecastSchema=new Schema({
    highTemp:Number,
    lowTemp:Number,
    condition:String,
    conditionID:Number,
    wind:String,
    windLevel:String,
    windDesc:String,
    baseDay:[{type:Schema.ObjectId,ref:"DayModel"}],
    city:[{type:Schema.ObjectId,ref:"CityModel"}]
});

var ForecastByHoursSchema=ForecastSchema.extend({
    fromTime:Number,
    toTime:Number
});

var LivingAdviceSchema=new Schema({
    type:String,
    name:String,
    level:String,
    desc:String,
    advice:String
});

var ForecastByDaySchema=ForecastSchema.extend({
    sunset:String,
    sunrise:String,
    toCondition:String,
    toConditionID:Number,
    tips:String,
    toWindLevel:String,
    toWindDesc:String,
    day:[{type:Schema.ObjectId,ref:"DayModel"}],
    livingAdvices:[LivingAdviceSchema]
});

var CurrentCastSchema=ForecastSchema.extend({
    temp:Number,
    humility:Number,
    updateTime:Date,
    relatedForecast:[{type:Schema.ObjectId,ref:"ForecastByDayModel"}],
    weatherWarning:[{type:Schema.ObjectId,ref:"WeatherWarningModel"}],
    airQuality:[{type:Schema.ObjectId,ref:"AirQualityModel"}]
});

var WeatherWarningSchema=new Schema({
    id:Number,
    desc:String,
    publishTime:Date,
    endTime:Date,
    info:String,
    iconUrl:String
});

var AirQualitySchema=new Schema({
    publishTime:Date,
    quality:Number,
    pm2:String,
    pm10:String    
});

var PictureSchema=new Schema({
    id:Number,
    publishTime:Date,
    location:String,
    width:Number,
    height:Number,
    compressedImageUrl:String,
    orginalImageUrl:String,
    shortLocation:String,
    praiseCount:Number,
    cityName:String,
    desc:String,
    sharedInfo:String,
    city: [{type:Schema.ObjectId,ref:"CityModel"}],
    regUser:[{type:Schema.ObjectId,ref:"RegUserModel"}]
});

var PictureCommentSchema=new Schema({
    content:String,
    publishTime:String,
    voteCount:Number,
    ipAddress:String,
    picture:[{type:Schema.ObjectId,ref:"PictureModel"}],
    regUser:[RegUserSchema]
});

var RegUserModel= mongoose.model("WuserModel",RegUserSchema);
var SoftwareInfoModel=mongoose.model("SoftwareInfoModel",SoftwareInfoSchema);
var DeviceUserModel=mongoose.model("DeviceUserModel",DeviceUserSchema);
var CityModel=mongoose.model("CityModel",CitySchema);
var DayModel=mongoose.model("DayModel",DaySchema);
var ForecastByHoursModel=mongoose.model("ForecastByHoursModel",ForecastByHoursSchema);
var ForecastByDayModel=mongoose.model("ForecastByDayModel",ForecastByDaySchema);
var CurrentCastModel=mongoose.model("CurrentCastModel",CurrentCastSchema);
var LivingAdviceModel=mongoose.model("LivingAdviceModel",LivingAdviceSchema);
var WeatherWarningModel=mongoose.model("WeatherWarningModel",WeatherWarningSchema);
var AirQualityModel=mongoose.model("AirQualityModel",AirQualitySchema);
var PictureCommentModel=mongoose.model("PictureCommentModel",PictureCommentSchema);
var PictureModel=mongoose.model("PictureModel",PictureSchema);


module.exports={
   SoftwareInfoModel:SoftwareInfoModel,
   DeviceUserModel:DeviceUserModel,
   RegUserModel:RegUserModel,
   createDatabase :function (){
     DeviceUserModel.find(function(err,devices){
        if(err){
             console.log("cannnot find");
             createUserData();
            
        }else{
            console.log(devices);
        }
    });
    
   },
   


createSoftwareVersion:function(version,dbVersion,downloadUrl,versionInfo,callback){
    var softwareInfo=new SoftwareInfoModel({
        version:version,
        lastUpdateTime:Date.now(),
        dbVersion:dbVersion,
        downloadUrl:downloadUrl,
        versionInfo:versionInfo
    });
    softwareInfo.save(function(err,softwareInfo){
        callback(err,softwareInfo);
    });
},


findSoftwareVersion:function(version,callback){
    SoftwareInfoModel.find({version:version},function(err,softwares){
        callback(err,softwares);
    });
},

updateSoftwareVersion:function(softwareInfo,callback){
    softwareInfo.save(function(err,softwareInfo){
        callback(err,softwareInfo);
    });
},

removeSoftwareVersion:function(version,callback){
    SoftwareInfoModel.remove({version:version},function(err){
        callback(err);      
    });
},

registerDeviceUser:function(parnterID,platform,deviceType,deviceModel,sdkVersion,sdkApiLevel,IMEI,MAC,softVersion,callback){
   var deviceUser=new DeviceUserModel({
        platform:platform,
        deviceType:deviceType,
        deviceModel:deviceModel,
        sdkVersion:sdkVersion,
        sdkApiLevel:sdkApiLevel,
        IMEI:IMEI,
        MAC:MAC,
        parnterID:parnterID
    });
    
    SoftwareInfoModel.find({version:softVersion},function(err,softwares){
        if(!err && softwares){
            deviceUser.installedSoft= softwares;
            deviceUser.save(function(err2,vuser){
                callback(err2,vuser);
            });
        }else{
            callback(err);
        }
    });
},

registerRegUser:function(duserid,nickName,email,password,callback){
    DeviceUserModel.find({'_id':duserid},function(err,users){
         if(!err && users && users.length==1){
           var regUser=new RegUserModel({
               nickName:nickName,
               email:email,
               password:password,
               role:'Common'
           });
           regUser.save(function(err2,regUser){
                users[0].regUser=regUser;
                users[0].save(function(err3){
                    callback(err3,regUser);
                });
               //callback(err2);
           });
          
           
         }else{
              callback(err);
         }
    });
},

//callback(err,regUsers) 
findRegUserByNickname:function(nickName,callback){
    RegUserModel.find({nickName:nickName},function(err,regUsers){
         if(err){
             console.log(err);
         }else{
             callback(err,regUsers);
         }
    });
},

//callback(err,regUsers) 
findRegUserByEmail:function(email,callback){
    RegUserModel.find({email:email},function(err,regUsers){
         if(err){
             console.log(err);
         }else{
             callback(err,regUsers);
         }
    });
    
},
createCity:function(name,timeZone,callback){
      CityModel.findOne().sort('cityID',-1).run(function(err,city){
          var cityID;
          if(!err && city!==null){
               cityID=city.cityID+1;
           
          }else{
              cityID=8000;   
          };
           var newCity=new CityModel({
                cityID:cityID,
                name:name,
                timeZone:timeZone,
           });
           newCity.save(function(err,newCity){
                callback(err,newCity);
           });
      });
     
},
createDay:function(){
      
}


};

function createUserData(){
    var wuser2=new RegUserModel({
        userID:'1',
        nickName:'cy',
        email:'cy@14.com',
        parnterID:"122"
    });
    
    
    var softwareInfo=new SoftwareInfoModel({
       version:"10110",
       lastUpdateTime:Date.now(),
       dbVersion:200  
    })  ;  
    
    var userDevice=new DeviceUserModel({
         type:"phone",
         osName:"Android",
        model:"Desire",
       commProvider:"CHINA UNICOM",
       hasWIFI:true,
    sdkVersion:"2.3.7",
    IMEI:"wwewewsdsdss",
    MAC:"12-123-123-123",
    sdkApiLevel:10,
    regUser:[wuser2],
    installedSoft:[softwareInfo]
    });
    
    //wuser.save();
    //softwareInfo.save();
    userDevice.save(function(err){
        console.log(err);
    });
            
}
