var express = require("express");
var exe = require("../db");
var router = express.Router();

router.get("/",async function(req,res){

  var id = req.params.id

    var slider = await exe(`SELECT * FROM slider_images`);

    var home_page_section = await exe(`SELECT * FROM home_page_section `);

    var home_page_section_4 = await exe(`SELECT * FROM home_page_section_4 `);

    var home_page_services = await exe(`SELECT * FROM home_page_services `);

    var experience_doctor_team = await exe(`SELECT * FROM experience_doctor_team`);

    var navbar = await exe(`SELECT * FROM navbar`);
    

    
    var obj = {
                "slider":slider,
                "home_page_section":home_page_section[0],
                "home_page_section_4":home_page_section_4[0],
                "home_page_services":home_page_services,
                "experience_doctor_team":experience_doctor_team,
                "navbar":navbar
              };
    
   

    res.render("user/home.ejs",obj);

});

router.get("/navbar",function(req,res){
  
  var navbar = exe(`SELECT * FROM appointments`);
  var appointments = exe(`SELECT * FROM appointments`);


  var obj = {"navbar":navbar,"appointments":appointments};

  res.render("user/navbar.ejs",obj);

});

// router.post("/apporpment", function(req, res) {
//   console.log(req.body); 
//   res.send(req.body);
// });


router.get("/user/about_page",async function(req, res) {
  

  var data = await exe(`SELECT * FROM about_background_imag`);
  var about_page_intro = await exe(`SELECT * FROM about_page `);
  var navbar = await exe(`SELECT * FROM navbar`);
  var services_background_images = await exe(`SELECT * FROM services_background_images`);

  var obj = {"info":data,
              "about_page_intro":about_page_intro,
              "navbar":navbar
            
            };

  res.render("user/about_page.ejs",obj);
});

router.get("/services",async function(req,res){

  var navbar = await exe(`SELECT * FROM navbar`);
  
  var services_background_images = await exe(`SELECT * FROM services_background_images`);

  var services_card = await exe(`SELECT * FROM services_card`)

 
  var obj = {"navbar":navbar, 
            "services_background_images":services_background_images,
            "services_card":services_card

            };
  
  res.render("user/services.ejs",obj);
})

router.get("/gallary",async function(req,res){

  var navbar = await exe(`SELECT * FROM navbar`);
  var gallary_background_page = await exe(`SELECT * FROM gallary_background_page`);

  
  var obj = {
              "navbar":navbar,
              "gallary_background_page":gallary_background_page
            };

  res.render("user/gallary.ejs",obj);
});

router.get("/contact",async function(req,res){
  
  var navbar = await exe(`SELECT * FROM navbar`);

  var contact = await exe(`SELECT * FROM contact`);


  

  var obj = {
              "navbar":navbar,
              "contact":contact[0],
              "appointments":navbar
            };

  res.render("user/contact.ejs",obj)
});

router.post("/appointment",async function(req,res){

  var sql = `INSERT INTO appointments(appointment_date ,  patient_name , patient_mobile , patient_age , patient_address )VALUES
                        (? , ? , ? , ? , ?)`;

  var data = await exe(sql,[req.body.appointment_date  , req.body.patient_name , req.body.patient_mobile , req.body.patient_age , req.body.patient_address]);
  
  res.send("<script>location.href = document.referrer</script>");

});

router.post("/contact_us",async function(req,res){
  

  var b = req.body;

  var sql =  `INSERT INTO contact_us(user_name , mobile_number , user_email , user_address)VALUES
                                    (? , ? , ? , ?)`;

  
 var data = await exe(sql,[b.user_name , b.mobile_number , b.user_email , b.user_address]);                                   
  
  // res.send(data);
  res.send("<script>location.href = document.referrer</script>");

});

module.exports = router;