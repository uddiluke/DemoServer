/*
* lunar V0.0.1 
* Copyright (c) 2010 yueng
* Date: 2010-09-2
* Email:89431376@qq.com
*/

//错误代码
//1001:自定义日期有误或日期输入不完整
//1002:自定义年份无效，必须在1900-2049年之间

var Lunar = function(d) {
    //农历转换
    var Calc = function(currentDate, cy, cm, cd) {
        var year = function() { return cy; };                                           //年
        var month = function() { var m = cm + 1; return FL(m); };                    //月
        var day = function() { return FL(cd); };                                        //日
        var hour = function() { var h = currentDate.getHours(); return FL(h); };      //时
        var minute = function() { var m = currentDate.getMinutes(); return FL(m); };     //分
        var second = function() { var s = currentDate.getSeconds(); return FL(s); };    //秒
        var FL = function(v) { return v < 10 ? "0" + v : v; };                         //固定日期长度


        //农历信息1900-2049,农历大月为30天，小月为29天
        /*说明:0x0d558对应的二进制为（0000 110101010101 1000）农历的分布为：
        P0：表示当年闰月是大月还是小月
        P1：按位表示当年每月的大小情况
        P2：表示当年闰的是哪个月份
        */
        var lunarInfo = new Array(
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);

        var animalInfo = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");     //生肖
        var ganInfo = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");                    //十天干
        var zhiInfo = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");        //十二地支

        //年号
        var cyclical = function() {
            var cl = new CalcLunar();
            var num = cl.year - 1900 + 36;
            return (ganInfo[num % 10] + zhiInfo[num % 12])
        };

        //年
        var cYear = function() {
            var years = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
            var y = new CalcLunar().year;
            var cyear = "";
            var i = 1000, s = 10;
            do {
                cyear = years[y % s] + cyear;
                y = parseInt(y / s);
                i /= s;
            } while (i >= 1);

            return cyear;
        };

        //生肖
        var cAnimal = function() {
            var cl = new CalcLunar();
            return animalInfo[(cl.year - 4) % 12];
        };

        //星期
        var cWeek = function() {
            var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            return weeks[currentDate.getDay()];
        };

        //月份
        var cMonth = function() {
            var cl = new CalcLunar();
            var m = cl.month;
            var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
            var s;
            if (m > 10) { s = '十' + nStr1[m - 10] } else { s = nStr1[m] };
            return cl.isLeap ? '闰' + s : s;
        };

        //日
        var cDay = function() {
            var cl = new CalcLunar();
            var d = cl.day;
            var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
            var nStr2 = new Array('初', '十', '廿', '卅', '');
            var s;
            switch (d) {
                case 10: s = '初十'; break;
                case 20: s = '二十'; break;
                case 30: s = '三十'; break;
                default: s = nStr2[Math.floor(d / 10)]; s += nStr1[d % 10];
            }
            return s;
        };

        //农历年的总天数
        var cYearDays = function(y) {
            var i, sum = 348
            for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
            return (sum + cLeapDays(y))
        };

        //闰月的天数
        var cLeapDays = function(y) {
            if (cLeapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
            else return (0)
        };

        //闰月 , 没闰传回 0
        var cLeapMonth = function(y) {
            return (lunarInfo[y - 1900] & 0xf)
        };

        //传回农历月份的总天数
        var cMonthDays = function(y, i) {
            return ((lunarInfo[y - 1900] & (0x10000 >> i)) ? 30 : 29)
        };

        //算出农历, 传入日期物件, 传回农历日期物件
        //     该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
        var CalcLunar = function() {
            var i, leap = 0, temp = 0;
            var baseDate = new Date(1900, 0, 31);
            var objDate = new Date(cy, cm, cd);
            var offset = (objDate - baseDate) / 86400000;

            this.dayCyl = offset + 40; //甲子日
            this.monCyl = 14; //甲子月

            for (i = 1900; i < 2050 && offset > 0; i++) {
                temp = cYearDays(i)
                offset -= temp
                this.monCyl += 12
            };

            if (offset < 0) {
                offset += temp;
                i--;
                this.monCyl -= 12
            };

            this.year = i; //农历年
            this.yearCyl = i - 1864; //1864年是甲子年

            leap = cLeapMonth(i); //闰哪个月
            this.isLeap = false; //是否为闰月

            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月
                if (leap > 0 && i == (leap + 1) && this.isLeap == false)
                { --i; this.isLeap = true; temp = cLeapDays(this.year); }
                else
                { temp = cMonthDays(this.year, i); }

                //解除闰月
                if (this.isLeap == true && i == (leap + 1)) { this.isLeap = false; };

                offset -= temp;
                if (this.isLeap == false) { this.monCyl++ };
            }

            if (offset == 0 && leap > 0 && i == leap + 1)
                if (this.isLeap)
            { this.isLeap = false; }
            else
            { this.isLeap = true; --i; --this.monCyl; }

            if (offset < 0) { offset += temp; --i; --this.monCyl; }

            this.month = i; //农历月
            this.day = offset + 1; //农历日
        }

        //格式化字符串
        var format = function(string) {
            var args = arguments;
            var pattern = new RegExp("{([1-" + arguments.length + "])}", "g");
            return String(string).replace(pattern, function(match, index) {
                return args[index];
            });
        };
        
        this.getMonthDayNumber=function(){
             var cl = new CalcLunar();
             return {month:cl.month,day:cl.day};
        };
        
        //获取指定格式的日期,
        //中文展示(农历)：  YYY：年，MMM：月，DDD：日，WWW：星期，NNN：年号
        //数字展示(公历)：  YY：年，MM：月，DD：日，
        //时间：            HH：时，NN：分，SS：秒
        //生肖：            AAA：生肖
        this.ToString = function(format) {
            var res = "";
            if (format) {
                res = String(format);

                /***************生肖***************/
                res = res.replace(/AAA/g, cAnimal);        //生肖

                /***************农历***************/
                res = res.replace(/NNN/g, cyclical);        //年号
                res = res.replace(/YYY/g, cYear);           //年
                res = res.replace(/MMM/g, cMonth);          //月
                res = res.replace(/DDD/g, cDay);            //日
                res = res.replace(/WWW/g, cWeek);            //星期

                /***************公历***************/
                res = res.replace(/YY/g, year);             //年
                res = res.replace(/MM/g, month);            //月
                res = res.replace(/DD/g, day);              //日

                /***************时间***************/
                res = res.replace(/HH/g, hour);             //时
                res = res.replace(/NN/g, minute);           //分
                res = res.replace(/SS/g, second);           //秒
            } else {
                res = currentDate.toLocaleString();         //根据系统格式输出日期
            }

            return res;
        }

        //短日期字符串表示形式输出，如1998-03-01
        this.ToShortDateString = function() {
            return format("{1}-{2}-{3}", year(), month(), day());
        }

        //短时间按农历以中文字符串表示形式输出，如一九九八年三月初一
        this.ToCShortDateString = function() {
            return format("{1}年{2}月{3}", cYear(), cMonth(), cDay());
        }

        //短时间字符串表示形式输出，如10:30
        this.ToShortTimeString = function() {
            return format("{1}:{2}", hour(), minute());
        }

        //长时间字符串表示形式输出，如1998年03月01日
        this.ToLongDateString = function() {
            return format("{1}年{2}月{3}日", year(), month(), day());
        }

        //长时间按农历以中文字符串表示形式输出，如戊寅一九九八年三月初一
        this.ToCLongDateString = function() {
            return format("{1}{2}年{3}月{4}", cyclical(), cYear(), cMonth(), cDay());
        }

        //长时间字符串表示形式输出，如10:30:50
        this.ToShortTimeString = function() {
            return format("{1}:{2}:{3}", hour(), minute(), second());
        }
    };

    //检测日期合法
    //设置当前日期
    var runCode = 0;

    var initData = d instanceof Date ? d : typeof (d) == "string" ? new Date(d.replace(/-/, "/")) : new Date();
    if (isNaN(initData)) runCode = 1001; //自定义日期有误
    //年
    var dy = initData.getFullYear();
    if (!runCode && (isNaN(dy) || dy < 1900 || dy > 2049)) runCode = 1002; //检测年

    //月
    var dm = initData.getMonth();

    //日
    var dd = initData.getDate();

    return runCode ? { Code: runCode, Change: null} : { Code: runCode, Change: new Calc(initData, dy, dm, dd) }; //返回运算对象
};


function getChineseFestival(SY,SM,SD) {
    var sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758)
    var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至")
    var lFtv = new Array("0101*春节", "0115 元宵节", "0505 端午节", "0707 七夕情人节", "0715 中元节", "0815 中秋节", "0909 重阳节", "1208 腊八节", "1224 小年", "0100*除夕")
    var sFtv = new Array("0101*元旦", "0214 情人节", "0308 妇女节", "0309 偶今天又长一岁拉", "0312 植树节", "0315 消费者权益日", "0401 愚人节", "0418 MM的生日", "0501 劳动节", "0504 青年节", "0512 护士节", "0601 儿童节", "0701 建党节 香港回归纪念", "0801 建军节", "0808 父亲节", "0909 毛席逝世纪念", "0910 教师节", "0928 孔子诞辰", "1001*国庆节",
"1006 老人节", "1024 联合国日", "1112 孙中山诞辰", "1220 澳门回归纪念", "1225 圣诞节", "1226 毛席诞辰")

    var sDObj = new Date(SY, SM, SD);
    var lDObj = Lunar(sDObj).Change;
    var lDPOS = new Array(3)
    var festival = '', solarTerms = '', solarFestival = '', lunarFestival = '', tmp1, tmp2;
    //农历节日 
    var i;
    var monthDay=lDObj.getMonthDayNumber();
    for (i in lFtv)
        if (lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
        tmp1 = Number(RegExp.$1) - monthDay.month;
        tmp2 = Number(RegExp.$2) - monthDay.day;
        console.log(RegExp.$1+":"+RegExp.$2+":"+monthDay);
        if (tmp1 == 0 && tmp2 == 0) lunarFestival = RegExp.$4;
    }
    //国历节日
    for (i in sFtv)
        if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
        tmp1 = Number(RegExp.$1) - (SM + 1);
        tmp2 = Number(RegExp.$2) - SD;
        if (tmp1 == 0 && tmp2 == 0) solarFestival = RegExp.$4;
    }
    //节气
    tmp1 = new Date((31556925974.7 * (SY - 1900) + sTermInfo[SM * 2 + 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
    tmp2 = tmp1.getUTCDate()
    if (tmp2 == SD) solarTerms = solarTerm[SM * 2 + 1]
    tmp1 = new Date((31556925974.7 * (SY - 1900) + sTermInfo[SM * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
    tmp2 = tmp1.getUTCDate()
    if (tmp2 == SD) solarTerms = solarTerm[SM * 2]

//    if (solarTerms == '' && solarFestival == '' && lunarFestival == '')
//        festival = '';
//    else
//        festival = '<TABLE WIDTH=100% BORDER=0 CELLPADDING=2 CELLSPACING=0 BGCOLOR="#CCFFCC"><TR><TD align=center><marquee direction=left scrolldelay=120 behavior=alternate>' +
//    '<FONT COLOR="#FF33FF" STYLE="font-size:9pt;"><b>' + solarTerms + ' ' + solarFestival + ' ' + lunarFestival + '</b></FONT></marquee></TD>' +
//    '</TR></TABLE>';
//
//    var cl = '<font color="green" STYLE="font-size:9pt;">';
//    return (cl + festival + '</font>');
     return {day:lDObj.ToString('AAA NNN MMM DDD'), solarTerms:solarTerms, solarFestival:solarFestival,lunarFestival:lunarFestival};
}

module.exports={
    getChineseDayInfo:function(year,month,day){
       if(year && month && day)
        return getChineseFestival(year,month,day);  
          //return Lunar(year+"-"+month+"-"+day).Change.ToString('AAA NNN YYY MMM DDD');
       else{
           var cur=new Date();
           
           return getChineseFestival(cur.getFullYear(),cur.getMonth(),cur.getDate());  
           //return Lunar().Change.ToString('AAA NNN YYY MMM DDD');
       }
//        var result={};
//        result['day']=getChineseDay();
//        var festival=getChineseFestival();
//        for(var prop in festival){
//            result[prop]=festival[prop];
//        }
//        return result;
    }
}


