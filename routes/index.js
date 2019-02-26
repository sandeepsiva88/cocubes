var express = require('express');
var router = express.Router();
var monk = require('monk');
var multer = require('multer');
var xlstojson = require('xls-to-json-lc');
var xlsxtojson = require('xlsx-to-json-lc');
var formidable = require('formidable');
var db = monk('localhost:27017/ACET');
var collection1 = db.get('cocubes');
//excel
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            //var datetimestamp = Date.now();
            cb(null, file.originalname)
        }
});
var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
}).single('file');
//placements upload
    /** API path that will upload the files */
  router.post('/uploadxls', function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            //console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: "out.json", //since we don't need output.json
                    lowerCaseHeaders:false
                }, function(err,result){
                    if(err) {
                        return res.send('error in importing data');
                    } 
                    //console.log(result);
                    saveData(result);
                    res.redirect("/admin");
            });
            } catch (e){
                res.send("Corupted excel file");
            } 
       });
});

function saveData(data) {
 //console.log(data);
for(var i=0;i<data.length;i++){
collection1.insert({"RollNumber":data[i].RollNumber,"Name":data[i].Name,"College":data[i].College,"Branch":data[i].Branch,"CoCubesId":parseInt(data[i].CoCubesId),"Batch":data[i].Batch,"Score":parseInt(data[i].Score),"English":parseInt(data[i].English),"Quantitative":parseInt(data[i].Quantitative),"Analytical":parseInt(data[i].Analytical),"Domain":parseInt(data[i].Domain),"WrittenEnglish":parseInt(data[i].WrittenEnglish),"Coding":parseInt(data[i].Coding)},{multi:true},  function(err, data ) {
//console.log(data);
    if(err)
    console.log(err);
});
}
}
//student panel
router.get('/student', function(req, res) {
  res.render('index');
});
router.get('/', function(req, res) {
  res.render('view');
});
router.get('/admin', function(req, res) {
  res.render('admin');
});
router.get('/college', function(req, res) {
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$Score"}}}],function(err,docs){
  //console.log(docs);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$English"}}}],function(err,eng){
  //console.log(eng);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$Quantitative"}}}],function(err,qua){
  //console.log(qua);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$Analytical"}}}],function(err,ana){
  //console.log(ana);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$Domain"}}}],function(err,dom){
  //console.log(dom);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$WrittenEnglish"}}}],function(err,wri){
  //console.log(wri);
  collection1.aggregate([{$group: {_id: "$College", count : {$sum : 1}, total: {$sum: "$Coding"}}}],function(err,cod){
  //console.log(cod);
  //Colleges
  var aec = Math.round((docs[0].total)/(docs[0].count));
  var acet = Math.round((docs[1].total)/(docs[1].count));
  var acoe = Math.round((docs[2].total)/(docs[2].count));
  //English
  var aeceng = Math.round((eng[0].total)/(eng[0].count));
  // console.log(aeceng);
  var aceteng = Math.round((eng[1].total)/(eng[1].count));
  // console.log(aceteng);
  var acoeeng = Math.round((eng[2].total)/(eng[2].count));
  //Quantitative
  var aecqua = Math.round((qua[0].total)/(qua[0].count));
  // console.log(aecqua);
  var acetqua = Math.round((qua[1].total)/(qua[1].count));
  // console.log(acetqua);
  var acoequa = Math.round((qua[2].total)/(qua[2].count));
  // console.log(acoequa);
  //Analytical
  var aecana = Math.round((ana[0].total)/(ana[0].count));
  // console.log(aecana);
  var acetana = Math.round((ana[1].total)/(ana[1].count));
  // console.log(acetana);
  var acoeana = Math.round((ana[2].total)/(ana[2].count));
  // console.log(acoeana);
  //Domain
  var aecdom = Math.round((dom[0].total)/(dom[0].count));
  // console.log(aecdom);
  var acetdom = Math.round((dom[1].total)/(dom[1].count));
  // console.log(acetdom);
  var acoedom = Math.round((dom[2].total)/(dom[2].count));
  // console.log(acoedom);
  //WrittenEnglish
  var aecwri = Math.round((wri[0].total)/(wri[0].count));
  // console.log(aecwri);
  var acetwri = Math.round((wri[1].total)/(wri[1].count));
  // console.log(acetwri);
  var acoewri = Math.round((wri[2].total)/(wri[2].count));
  // console.log(acoewri);
  //Coding
  var aeccod = Math.round((cod[0].total)/(cod[0].count));
  // console.log(aeccod);
  var acetcod = Math.round((cod[1].total)/(cod[1].count));
  // console.log(acetcod);
  var acoecod = Math.round((cod[2].total)/(cod[2].count));
  // console.log(acoecod);

  res.locals.aec=aec;
  res.locals.acet=acet;
  res.locals.acoe=acoe;
  //English
  res.locals.aeceng=aeceng;
  res.locals.aceteng=aceteng;
  res.locals.acoeeng=acoeeng;
  //Quantitative
  res.locals.aecqua=aecqua;
  res.locals.acetqua=acetqua;
  res.locals.acoequa=acoequa;
  //Analytical
  res.locals.aecana=aecana;
  res.locals.acetana=acetana;
  res.locals.acoeana=acoeana;
  //Domain
  res.locals.aecdom=aecdom;
  res.locals.acetdom=acetdom;
  res.locals.acoedom=acoedom;
  //WrittenEnglish
  res.locals.aecwri=aecwri;
  res.locals.acetwri=acetwri;
  res.locals.acoewri=acoewri;
  //Coding
  res.locals.aeccod=aeccod;
  res.locals.acetcod=acetcod;
  res.locals.acoecod=acoecod;

  res.render('college');
});
});
});
});
});
});
});
});
router.get('/branch', function(req, res) {
  //AEC
  //CSE
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$Score"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,acse){
  console.log(acse);
  var aeccse = Math.round((acse[3].total)/(acse[3].count));
  //IT
  var aecit = Math.round((acse[6].total)/(acse[6].count));
  //ECE
  var aecece = Math.round((acse[4].total)/(acse[4].count));
  //EEE
  var aeceee = Math.round((acse[5].total)/(acse[5].count));
  //CIVIL
  var aeccivil = Math.round((acse[2].total)/(acse[2].count));
  //MECH
  var aecmech = Math.round((acse[7].total)/(acse[7].count));
  //PT
  var aecpt = Math.round((acse[9].total)/(acse[9].count));

  //ACET
  //CSE
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$Score"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,ecse){
  var acetcse = Math.round((ecse[1].total)/(ecse[1].count));
  //IT
  var acetit = Math.round((ecse[4].total)/(ecse[4].count));
  //ECE
  var acetece = Math.round((ecse[2].total)/(ecse[2].count));
  //EEE
  var aceteee = Math.round((ecse[3].total)/(ecse[3].count));
  //CIVIL
  var acetcivil = Math.round((ecse[0].total)/(ecse[0].count));
  //MECH
  var acetmech = Math.round((ecse[5].total)/(ecse[5].count));
  //PT
  //var acetpt = Math.round((ept[0].total)/(ept[0].count));

  //ACOE
  //CSE
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$Score"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,tcse){
  var acoecse = Math.round((tcse[7].total)/(tcse[7].count));
  //ECE
  var acoeece = Math.round((tcse[8].total)/(tcse[8].count));
  //EEE
  var acoeeee = Math.round((tcse[9].total)/(tcse[9].count));
  //CIVIL
  var acoecivil = Math.round((tcse[6].total)/(tcse[6].count));
  //MECH
  var acoemech = Math.round((tcse[10].total)/(tcse[10].count));
  //PT
  var acoept = Math.round((tcse[11].total)/(tcse[11].count));
  
  
  //ENGLISH
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$English"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,ae){
  //console.log(ae);
  //AEC
  //CSE
  var aeccseeng = Math.round((ae[12].total)/(ae[12].count));
  //ECE
  var aececeeng = Math.round((ae[8].total)/(ae[8].count));
  //EEE
  var aeceeeeng = Math.round((ae[9].total)/(ae[9].count));
  //CIVIL
  var aeccivileng = Math.round((ae[6].total)/(ae[6].count));
  //MECH
  var aecmecheng = Math.round((ae[10].total)/(ae[10].count));
  //PT
  var aecpteng = Math.round((ae[11].total)/(ae[11].count));
  //AGRI
  var aecagrieng = Math.round((ae[11].total)/(ae[11].count));
  //MIN
  var aecmineng = Math.round((ae[11].total)/(ae[11].count));

  //ACET
  //CSE
  var acetcseeng = Math.round((ae[1].total)/(ae[1].count));
  //IT
  var acetiteng = Math.round((ae[4].total)/(ae[4].count));
  //ECE
  var aceteceeng = Math.round((ae[2].total)/(ae[2].count));
  //EEE
  var aceteeeeng = Math.round((ae[3].total)/(ae[3].count));
  //CIVIL
  var acetcivileng = Math.round((ae[0].total)/(ae[0].count));
  //MECH
  var acetmecheng = Math.round((ae[5].total)/(ae[5].count));

  //ACOE
  //CSE
  var acoecseeng = Math.round((ae[7].total)/(ae[7].count));
  //ECE
  var acoeeceeng = Math.round((ae[8].total)/(ae[8].count));
  //EEE
  var acoeeeeeng = Math.round((ae[9].total)/(ae[9].count));
  //CIVIL
  var acoecivileng = Math.round((ae[6].total)/(ae[6].count));
  //MECH
  var acoemecheng = Math.round((ae[10].total)/(ae[10].count));
  //PT
  var acoepteng = Math.round((ae[11].total)/(ae[11].count));

  //QUANTITATIVE  
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$Quantitative"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,aq){
  //console.log(aq);
  //AEC
  //CSE
  var aeccsequant= Math.round((aq[7].total)/(aq[7].count));
  //ECE
  var aececequant = Math.round((aq[8].total)/(aq[8].count));
  //EEE
  var aeceeequant = Math.round((aq[9].total)/(aq[9].count));
  //CIVIL
  var aeccivilquant = Math.round((aq[6].total)/(aq[6].count));
  //MECH
  var aecmechquant = Math.round((aq[10].total)/(aq[10].count));
  //PT
  var aecptquant = Math.round((aq[11].total)/(aq[11].count));

  //ACET
  //CSE
  var acetcsequant = Math.round((aq[1].total)/(aq[1].count));
  //IT
  var acetitquant = Math.round((aq[4].total)/(aq[4].count));
  //ECE
  var acetecequant = Math.round((aq[2].total)/(aq[2].count));
  //EEE
  var aceteeequant = Math.round((aq[3].total)/(aq[3].count));
  //CIVIL
  var acetcivilquant = Math.round((aq[0].total)/(aq[0].count));
  //MECH
  var acetmechquant = Math.round((aq[5].total)/(aq[5].count));

  //ACOE
  //CSE
  var acoecsequant = Math.round((aq[7].total)/(aq[7].count));
  //ECE
  var acoeecequant = Math.round((aq[8].total)/(aq[8].count));
  //EEE
  var acoeeeequant = Math.round((aq[9].total)/(aq[9].count));
  //CIVIL
  var acoecivilquant = Math.round((aq[6].total)/(aq[6].count));
  //MECH
  var acoemechquant = Math.round((aq[10].total)/(aq[10].count));
  //PT
  var acoeptquant = Math.round((aq[11].total)/(aq[11].count));

  //ANALYTICAL
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$Analytical"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,aa){
  //console.log(aa);
  //AEC
  //CSE
  var aeccseanaly = Math.round((aa[7].total)/(aa[7].count));
  //ECE
  var aececeanaly = Math.round((aa[8].total)/(aa[8].count));
  //EEE
  var aeceeeanaly = Math.round((aa[9].total)/(aa[9].count));
  //CIVIL
  var aeccivilanaly = Math.round((aa[6].total)/(aa[6].count));
  //MECH
  var aecmechanaly = Math.round((aa[10].total)/(aa[10].count));
  //PT
  var aecptanaly = Math.round((aa[11].total)/(aa[11].count));

  //ACET
  //CSE
  var acetcseanaly = Math.round((aa[1].total)/(aa[1].count));
  //IT
  var acetitanaly = Math.round((aa[4].total)/(aa[4].count));
  //ECE
  var aceteceanaly = Math.round((aa[2].total)/(aa[2].count));
  //EEE
  var aceteeeanaly = Math.round((aa[3].total)/(aa[3].count));
  //CIVIL
  var acetcivilanaly = Math.round((aa[0].total)/(aa[0].count));
  //MECH
  var acetmechanaly = Math.round((aa[5].total)/(aa[5].count));

  //ACOE
  //CSE
  var acoecseanaly = Math.round((aa[7].total)/(aa[7].count));
  //ECE
  var acoeeceanaly = Math.round((aa[8].total)/(aa[8].count));
  //EEE
  var acoeeeeanaly = Math.round((aa[9].total)/(aa[9].count));
  //CIVIL
  var acoecivilanaly = Math.round((aa[6].total)/(aa[6].count));
  //MECH
  var acoemechanaly = Math.round((aa[10].total)/(aa[10].count));
  //PT
  var acoeptanaly = Math.round((aa[11].total)/(aa[11].count));

  //DOMAIN
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$English"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,ad){
  //console.log(ad);
  //AEC
  //CSE
  var aeccsedomain = Math.round((ad[12].total)/(ad[12].count));
  //ECE
  var aececedomain = Math.round((ad[8].total)/(ad[8].count));
  //EEE
  var aeceeedomain = Math.round((ad[9].total)/(ad[9].count));
  //CIVIL
  var aeccivildomain = Math.round((ad[6].total)/(ad[6].count));
  //MECH
  var aecmechdomain = Math.round((ad[10].total)/(ad[10].count));
  //PT
  var aecptdomain = Math.round((ad[11].total)/(ad[11].count));
  //AGRI
  var aecagridomain = Math.round((ad[11].total)/(ad[11].count));
  //MIN
  var aecmindomain = Math.round((ad[11].total)/(ad[11].count));

  //ACET
  //CSE
  var acetcsedomain = Math.round((ad[1].total)/(ad[1].count));
  //IT
  var acetitdomain = Math.round((ad[4].total)/(ad[4].count));
  //ECE
  var acetecedomain = Math.round((ad[2].total)/(ad[2].count));
  //EEE
  var aceteeedomain = Math.round((ad[3].total)/(ad[3].count));
  //CIVIL
  var acetcivildomain = Math.round((ad[0].total)/(ad[0].count));
  //MECH
  var acetmechdomain = Math.round((ad[5].total)/(ad[5].count));

  //ACOE
  //CSE
  var acoecsedomain = Math.round((ad[7].total)/(ad[7].count));
  //ECE
  var acoeecedomain = Math.round((ad[8].total)/(ad[8].count));
  //EEE
  var acoeeeedomain = Math.round((ad[9].total)/(ad[9].count));
  //CIVIL
  var acoecivildomain = Math.round((ad[6].total)/(ad[6].count));
  //MECH
  var acoemechdomain = Math.round((ae[10].total)/(ad[10].count));
  //PT
  var acoeptdomain = Math.round((ad[11].total)/(ad[11].count));

  //COMPUTER FUNDAMENTALS
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$English"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,acf){
  //console.log(acf);
  //AEC
  //CSE
  var aeccsecompf = Math.round((acf[12].total)/(acf[12].count));
  //ECE
  var aecececompf = Math.round((acf[8].total)/(acf[8].count));
  //EEE
  var aeceeecompf = Math.round((acf[9].total)/(acf[9].count));
  //CIVIL
  var aeccivilcompf = Math.round((acf[6].total)/(acf[6].count));
  //MECH
  var aecmechcompf = Math.round((acf[10].total)/(acf[10].count));
  //PT
  var aecptcompf = Math.round((acf[11].total)/(acf[11].count));
  //AGRI
  var aecagricompf = Math.round((acf[11].total)/(acf[11].count));
  //MIN
  var aecmincompf = Math.round((acf[11].total)/(acf[11].count));

  //ACET
  //CSE
  var acetcsecompf = Math.round((acf[1].total)/(acf[1].count));
  //IT
  var acetitcompf = Math.round((acf[4].total)/(acf[4].count));
  //ECE
  var acetececompf = Math.round((acf[2].total)/(acf[2].count));
  //EEE
  var aceteeecompf = Math.round((acf[3].total)/(acf[3].count));
  //CIVIL
  var acetcivilcompf = Math.round((acf[0].total)/(acf[0].count));
  //MECH
  var acetmechcompf = Math.round((acf[5].total)/(acf[5].count));

  //ACOE
  //CSE
  var acoecsecompf = Math.round((acf[7].total)/(acf[7].count));
  //ECE
  var acoeececompf = Math.round((acf[8].total)/(acf[8].count));
  //EEE
  var acoeeeecompf = Math.round((acf[9].total)/(acf[9].count));
  //CIVIL
  var acoecivilcompf = Math.round((acf[6].total)/(acf[6].count));
  //MECH
  var acoemechcompf = Math.round((acf[10].total)/(acf[10].count));
  //PT
  var acoeptcompf = Math.round((acf[11].total)/(acf[11].count));

  //CODING
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$English"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,ac){
  //console.log(ac);
  //AEC
  //CSE
  var aeccsecod = Math.round((ac[12].total)/(ac[12].count));
  //ECE
  var aecececod = Math.round((ac[8].total)/(ac[8].count));
  //EEE
  var aeceeecod = Math.round((ac[9].total)/(ac[9].count));
  //CIVIL
  var aeccivilcod = Math.round((ac[6].total)/(ac[6].count));
  //MECH
  var aecmechcod = Math.round((ac[10].total)/(ac[10].count));
  //PT
  var aecptcod = Math.round((ac[11].total)/(ac[11].count));
  //AGRI
  var aecagricod = Math.round((ac[11].total)/(ac[11].count));
  //MIN
  var aecmincod = Math.round((ac[11].total)/(ac[11].count));

  //ACET
  //CSE
  var acetcsecod = Math.round((ac[1].total)/(ac[1].count));
  //IT
  var acetitcod = Math.round((ac[4].total)/(ac[4].count));
  //ECE
  var acetececod = Math.round((ac[2].total)/(ac[2].count));
  //EEE
  var aceteeecod = Math.round((ac[3].total)/(ac[3].count));
  //CIVIL
  var acetcivilcod = Math.round((ac[0].total)/(ac[0].count));
  //MECH
  var acetmechcod = Math.round((ac[5].total)/(ac[5].count));

  //ACOE
  //CSE
  var acoecsecod = Math.round((ac[7].total)/(ac[7].count));
  //ECE
  var acoeececod = Math.round((ac[8].total)/(ac[8].count));
  //EEE
  var acoeeeecod = Math.round((ac[9].total)/(ac[9].count));
  //CIVIL
  var acoecivilcod = Math.round((ac[6].total)/(ac[6].count));
  //MECH
  var acoemechcod = Math.round((ac[10].total)/(ac[10].count));
  //PT
  var acoeptcod = Math.round((ac[11].total)/(ac[11].count));

  //WRITTEN ENGLISH
  collection1.aggregate([{$group: {_id: {"Branch":"$Branch","College":"$College"}, count : {$sum : 1}, total: {$sum: "$English"}}},{$sort:{"_id.College":1,"_id.Branch":1}}],function(err,aw){
  //console.log(aw);
  //AEC
  //CSE
  var aeccsewet = Math.round((aw[12].total)/(aw[12].count));
  //ECE
  var aececewet = Math.round((aw[8].total)/(aw[8].count));
  //EEE
  var aeceeewet = Math.round((aw[9].total)/(aw[9].count));
  //CIVIL
  var aeccivilwet = Math.round((aw[6].total)/(aw[6].count));
  //MECH
  var aecmechwet = Math.round((aw[10].total)/(aw[10].count));
  //PT
  var aecptwet = Math.round((aw[11].total)/(aw[11].count));
  //AGRI
  var aecagriwet = Math.round((aw[11].total)/(aw[11].count));
  //MIN
  var aecminwet = Math.round((aw[11].total)/(aw[11].count));

  //ACET
  //CSE
  var acetcsewet = Math.round((aw[1].total)/(aw[1].count));
  //IT
  var acetitwet = Math.round((aw[4].total)/(aw[4].count));
  //ECE
  var acetecewet = Math.round((aw[2].total)/(aw[2].count));
  //EEE
  var aceteeewet = Math.round((aw[3].total)/(aw[3].count));
  //CIVIL
  var acetcivilwet = Math.round((aw[0].total)/(aw[0].count));
  //MECH
  var acetmechwet = Math.round((aw[5].total)/(aw[5].count));

  //ACOE
  //CSE
  var acoecsewet = Math.round((aw[7].total)/(aw[7].count));
  //ECE
  var acoeecewet = Math.round((aw[8].total)/(aw[8].count));
  //EEE
  var acoeeeewet = Math.round((aw[9].total)/(aw[9].count));
  //CIVIL
  var acoecivilwet = Math.round((aw[6].total)/(aw[6].count));
  //MECH
  var acoemechwet = Math.round((aw[10].total)/(aw[10].count));
  //PT
  var acoeptwet = Math.round((aw[11].total)/(aw[11].count));



  res.locals.aeccse = aeccse;
  res.locals.aecece = aecece;
  res.locals.aeceee = aeceee;
  res.locals.aeccivil = aeccivil;
  res.locals.aecmech = aecmech;
  res.locals.aecpt = aecpt;
  res.locals.aecit = aecit;
  res.locals.acetcse = acetcse;
  res.locals.acetit = acetit;
  //res.locals.acetpt = acetpt;
  res.locals.acetece = acetece;
  res.locals.aceteee = aceteee;
  res.locals.acetcivil = acetcivil;
  res.locals.acetmech = acetmech;
  res.locals.acoecse = acoecse;
  res.locals.acoeece = acoeece;
  res.locals.acoeeee = acoeeee;
  res.locals.acoecivil = acoecivil;
  res.locals.acoemech = acoemech;
  res.locals.acoept = acoept;
  res.locals.aeccseeng = aeccseeng;
  res.locals.aececeeng = aececeeng;
  res.locals.aeceeeeng = aeceeeeng;
  res.locals.aeccivileng = aeccivileng;
  res.locals.aecmecheng = aecmecheng;
  res.locals.aecpteng = aecpteng;
  res.locals.aecagrieng = aecagrieng;
  res.locals.aecmineng = aecmineng;
  res.locals.acetcseeng = acetcseeng;
  res.locals.acetiteng = acetiteng;
  res.locals.aceteceeng = aceteceeng;
  res.locals.aceteeeeng = aceteeeeng;
  res.locals.acetcivileng = acetcivileng;
  res.locals.acetmecheng = acetmecheng;
  res.locals.acoecseeng = acoecseeng;
  res.locals.acoeeceeng = acoeeceeng;
  res.locals.acoeeeeeng = acoeeeeeng;
  res.locals.acoecivileng = acoecivileng;
  res.locals.acoemecheng = acoemecheng;
  res.locals.acoepteng = acoepteng;
  res.locals.aeccsequant = aeccsequant;
  res.locals.aececequant = aececequant;
  res.locals.aeceeequant = aeceeequant;
  res.locals.aeccivilquant = aeccivilquant;
  res.locals.aecmechquant = aecmechquant;
  res.locals.aecptquant = aecptquant;
  res.locals.acetcsequant = acetcsequant;
  res.locals.acetitquant = acetitquant;
  res.locals.acetecequant = acetecequant;
  res.locals.aceteeequant = aceteeequant;
  res.locals.acetcivilquant = acetcivilquant;
  res.locals.acetmechquant = acetmechquant;
  res.locals.acoecsequant = acoecsequant;
  res.locals.acoeecequant = acoeecequant;
  res.locals.acoeeeequant = acoeeeequant;
  res.locals.acoecivilquant = acoecivilquant;
  res.locals.acoemechquant = acoemechquant;
  res.locals.acoeptquant = acoeptquant; 
  res.locals.aeccseanaly = aeccseanaly;
  res.locals.aececeanaly = aececeanaly;
  res.locals.aeceeeanaly = aeceeeanaly;
  res.locals.aeccivilanaly = aeccivilanaly;
  res.locals.aecmechanaly = aecmechanaly;
  res.locals.aecptanaly = aecptanaly;
  res.locals.acetcseanaly = acetcseanaly;
  res.locals.acetitanaly = acetitanaly;
  res.locals.aceteceanaly = aceteceanaly;
  res.locals.aceteeeanaly = aceteeeanaly;
  res.locals.acetcivilanaly = acetcivilanaly;
  res.locals.acetmechanaly = acetmechanaly;
  res.locals.acoecseanaly = acoecseanaly;
  res.locals.acoeeceanaly = acoeeceanaly;
  res.locals.acoeeeeanaly = acoeeeeanaly;
  res.locals.acoecivilanaly = acoecivilanaly;
  res.locals.acoemechanaly = acoemechanaly;
  res.locals.acoeptanaly = acoeptanaly;
  res.locals.aeccsedomain = aeccsedomain;
  res.locals.aececedomain = aececedomain;
  res.locals.aeceeedomain = aeceeedomain;
  res.locals.aeccivildomain = aeccivildomain;
  res.locals.aecmechdomain = aecmechdomain;
  res.locals.aecptdomain = aecptdomain;
  res.locals.acetcsedomain = acetcsedomain;
  res.locals.acetitdomain = acetitdomain;
  res.locals.acetecedomain = acetecedomain;
  res.locals.aceteeedomain = aceteeedomain;
  res.locals.acetcivildomain = acetcivildomain;
  res.locals.acetmechdomain = acetmechdomain;
  res.locals.acoecsedomain = acoecsedomain;
  res.locals.acoeecedomain = acoeecedomain;
  res.locals.acoeeeedomain = acoeeeedomain;
  res.locals.acoecivildomain = acoecivildomain;
  res.locals.acoemechdomain = acoemechdomain;
  res.locals.acoeptdomain = acoeptdomain;
  res.locals.aeccsecompf = aeccsecompf;
  res.locals.aecececompf = aecececompf;
  res.locals.aeceeecompf = aeceeecompf;
  res.locals.aeccivilcompf = aeccivilcompf;
  res.locals.aecmechcompf = aecmechcompf;
  res.locals.aecptcompf = aecptcompf;
  res.locals.aecagricompf = aecagricompf;
  res.locals.aecmincompf = aecmincompf;
  res.locals.acetcsecompf = acetcsecompf;
  res.locals.acetitcompf = acetitcompf;
  res.locals.acetececompf = acetececompf;
  res.locals.aceteeecompf = aceteeecompf;
  res.locals.acetcivilcompf = acetcivilcompf;
  res.locals.acetmechcompf = acetmechcompf;
  res.locals.acoecsecompf = acoecsecompf;
  res.locals.acoeececompf = acoeececompf;
  res.locals.acoeeeecompf = acoeeeecompf;
  res.locals.acoecivilcompf = acoecivilcompf;
  res.locals.acoemechcompf = acoemechcompf;
  res.locals.acoeptcompf = acoeptcompf;
  res.locals.aeccsecod = aeccsecod;
  res.locals.aecececod = aecececod;
  res.locals.aeceeecod = aeceeecod;
  res.locals.aeccivilcod = aeccivilcod;
  res.locals.aecmechcod = aecmechcod;
  res.locals.aecptcod = aecptcod;
  res.locals.acetcsecod = acetcsecod;
  res.locals.acetitcod = acetitcod;
  res.locals.acetececod = acetececod;
  res.locals.aceteeecod = aceteeecod;
  res.locals.acetcivilcod = acetcivilcod;
  res.locals.acetmechcod = acetmechcod;
  res.locals.acoecsecod = acoecsecod;
  res.locals.acoeececod = acoeececod;
  res.locals.acoeeeeeng = acoeeeecod;
  res.locals.acoecivilcod = acoecivilcod;
  res.locals.acoemechcod = acoemechcod;
  res.locals.acoeptcod = acoeptcod;
  res.locals.aeccsewet = aeccsewet;
  res.locals.aececewet = aececewet;
  res.locals.aeceeewet = aeceeewet;
  res.locals.aeccivilwet = aeccivilwet;
  res.locals.aecmechwet = aecmechwet;
  res.locals.aecptwet = aecptwet;
  res.locals.acetcsewet = acetcsewet;
  res.locals.acetitwet = acetitwet;
  res.locals.acetecewet = acetecewet;
  res.locals.aceteeewet = aceteeewet;
  res.locals.acetcivilwet = acetcivilwet;
  res.locals.acetmechwet = acetmecheng;
  res.locals.acoecsewet = acoecsewet;
  res.locals.acoeecewet = acoeecewet;
  res.locals.acoeeeewet = acoeeeewet;
  res.locals.acoecivilwet = acoecivilwet;
  res.locals.acoemechwet = acoemechwet;
  res.locals.acoeptwet = acoeptwet;
  res.render('branch');
  });
  });
  });
  });
  });
  });
  });
  });
  });
  });
});
router.get('/year', function(req, res) {
  res.render('year');
});
router.get('/login', function(req, res) {
  res.render('login');
});
router.post('/getdetails', function(req,res){
  var rollno = req.body.num;
  collection1.find({"RollNo":rollno}, function(err,docs){
    //console.log(docs);
    res.send(docs);
  })
});
router.post('/getgraph', function(req,res){
  var rollno = req.body.num;
  //console.log(rollno+'getgraph');
  collection1.find({"RollNumber":rollno}, function(err,docs1){
    // var score = docs1[0].Score;
    // var aptitude = docs1[0].Aptitude;
    // var english = docs1[0].English;
    // var quantitative = docs1[0].Quantitative;
    // var analytical = docs1[0].Analytical;
    // var domain = docs1[0].Domain;
    // var computer = docs1[0].ComputerFundamentals;
    // var coding = docs1[0].Coding;
    // var written = docs1[0].WrittenEnglish;
    // res.locals.score=score;
    // res.locals.aptitude=aptitude;
    // res.locals.english=english;
    // res.locals.quantitative=quantitative;
    // res.locals.analytical=analytical;
    // res.locals.domain=domain;
    // res.locals.computer=computer;
    // res.locals.coding=coding;
    // res.locals.written=written;
    res.send(docs1);
});
});
//admin panel

module.exports = router;

