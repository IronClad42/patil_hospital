var express = require("express");
var exe = require("./../db");
const e = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
var router = express.Router();


// var b = req.body
// b.data_name = b.data_name.replaceAll("'", "\\'");
// b.data_name = b.data_name.replace(/'/g, "\\'");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assest/img/photos/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    }
});

const upload = multer({ storage: storage });



function verify_login(req, res, next) {
    if (req.session && req.session.admin_account_id) {
        next();
    } else {
        res.redirect("/admin/login/")
    }

    // if (req.session.admin_account_id) {
    //     next();
    // } else {
    //     res.redirect("/admin/login/")
    // }

}

router.get("/login", function (req, res) {
    res.render("admin/login.ejs");
});


router.post("/procced_login", async function (req, res) {
    // var b = req.body;

 

    var sql = `SELECT * FROM admin_account 
    WHERE  
     admin_email = ? 
    AND admin_password = ?`;

var data = await exe(sql, [

req.body.admin_email, 
req.body.admin_password
]);

console.log("Query Result:", data);


    if (data.length > 0) {
        req.session.admin_account_id = data[0].admin_account_id;
        res.redirect("/admin/");
    } else {
        res.send("Login Failed");
    }
});




router.get("/index",verify_login ,async function(req,res){
    res.render("admin/index.ejs");
});
router.get("/",verify_login ,  async function (req, res) {


    // var id = req.params.id;
    // style="text-overflow: ellipsis;"  => deatils zar zast zar aasel tr .... ase yeil

    var appointments = await exe(`SELECT * FROM appointments`);

    var sql = `SELECT * FROM navbar`;
    var data = await exe(sql);
    var obj = { "info":data[0],"appointments":appointments};
    // res.send(obj);
    res.render("admin/navbar.ejs", obj);
}); 


router.get("/appointment_delete/:id",async function(req,res){
    
    var id = req.params.id;

    var sql = `DELETE FROM appointments WHERE appointments_id = ${id}`;

    var data = await exe(sql);

    res.redirect("/admin");
})

router.post("/navbar",async function(req,res){
    var id = req.params.id
      

            if(req.files && req.files.image_logo)
            {
                var image_logo = new Date().getTime()+req.files.image_logo.name;
                req.files.image_logo.mv("public/assest/img/photos/"+image_logo);
            }
            else
            {
                var image_logo=req.body.image_logo;
            }

            if(req.files && req.files.facebook_icon_url)
            {
                var facebook_icon_url = new Date().getTime()+req.files.facebook_icon_url.name;
                req.files.facebook_icon_url.mv("public/assest/img/photos/"+facebook_icon_url);
            }
           else
           {
                var facebook_icon_url=req.body.facebook_icon_url1;
           }
           if(req.files && req.files.instagram_icon_url)
            {
                var instagram_icon_url = new Date().getTime()+req.files.instagram_icon_url.name;
                req.files.instagram_icon_url.mv("public/assest/img/photos/"+instagram_icon_url);
            }
           else
           {
                 var instagram_icon_url=req.body.instagram_icon_url1;
           }
           if(req.files && req.files.twitter_icon_url)
           {
                var twitter_icon_url = new Date().getTime()+req.files.twitter_icon_url.name;
                req.files.twitter_icon_url.mv("public/assest/img/photos/"+twitter_icon_url);
           }
           else
           {
                 var twitter_icon_url=req.body.twitter_icon_url1;
           }
           if(req.files && req.files.youtube_icon_url)
           {
                var youtube_icon_url = new Date().getTime()+req.files.youtube_icon_url.name;
                req.files.youtube_icon_url.mv("public/assest/img/photos/"+youtube_icon_url);
           }
           else
           {
             var youtube_icon_url=req.body.youtube_icon_url1;
           }


        var sql = `UPDATE navbar SET image_name = ?, approment_day = ? , image_logo = ? , facebook_icon_url = ? , instagram_icon_url = ? , twitter_icon_url = ? , youtube_icon_url = ? 
                                             WHERE navbar_id = 5`;


    var data = await exe(sql,[req.body.image_name , req.body.approment_day , image_logo , req.body.facebook_icon_url , req.body.instagram_icon_url , req.body.twitter_icon_url , req.body.youtube_icon_url ,  id]);

    // res.send(data);

    res.redirect("/admin")

    
});




router.get("/home",verify_login ,  async function(req,res){
    
    var data = await exe(`SELECT * FROM navbar_info WHERE navbar_info_id = 8`);

    var obj = {"info":data};
    
    res.render("admin/home.ejs",obj);
});


router.post("/home_page_icon_deatils", async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files.phone_image)
        {
            var phone_image = new Date().getTime()+req.files.phone_image.name;
            req.files.phone_image.mv("public/assest/img/photos/"+phone_image);

            var sql = `UPDATE navbar_info SET phone_image = ? WHERE navbar_info_id = 8`;
            await exe(sql,[phone_image]);
        }

        if(req.files.location_image)
        {
            var location_image = new Date().getTime()+req.files.location_image.name;
            req.files.location_image.mv("public/assest/img/photos/"+location_image);
            
            var sql = `UPDATE navbar_info SET location_image = ? WHERE navbar_info_id = 8`;
            await exe(sql,[location_image]);
        }

        if(req.files.email_image)
        {
            var email_image = new Date().getTime()+req.files.email_image.name;
            req.files.email_image.mv("public/assest/img/photos/"+email_image);

            var sql = `UPDATE navbar_info SET email_image = ? WHERE navbar_info_id = 8`;
            await exe(sql,[email_image]);
        }
    }
   

    var sql = `UPDATE navbar_info SET phone_number = ? , hospital_address = ? , email = ? WHERE navbar_info_id = 8`;
    
    var data = await exe(sql,[b.phone_number , b.hospital_address , b.email]);

    // res.send(data);
    res.redirect("/admin/home")
});






router.get("/slider_images_insert",verify_login ,  async function(req,res){

    var sql = `SELECT * FROM slider_images`;

    var data = await exe(sql);

    var obj = {"slider_images":data}
    
    res.render("admin/slider_images_insert.ejs",obj);
});


router.post("/slider_images_insert",async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files.slider_image_1)
        {
            var slider_image_1 = new Date().getTime()+req.files.slider_image_1.name;
            req.files.slider_image_1.mv("public/assest/img/photos/"+slider_image_1);
        }
    }
    
    var sql = `INSERT INTO slider_images(slider_name_1 , slider_image_1) 
                                VALUES (? , ?)`;
    
    var data = await exe(sql,[b.slider_name_1 , slider_image_1]);

    // res.send(data);
    res.redirect("/admin/slider_images_insert");
});



router.post("/slider_images_edit/:id",async function(req,res){

    var b = req.body;

    var id = req.params.id;

    if(req.files && req.files.slider_image_1)
    {
        var slider_image_1 = new Date().getTime()+req.files.slider_image_1.name;
        req.files.slider_image_1.mv("public/assest/img/photos/"+slider_image_1);

        var sql = `UPDATE slider_images SET slider_image_1 = ? WHERE slider_id = ?`;
        var data = await exe(sql,[slider_image_1, id]);
    }

    var sql = `UPDATE slider_images SET slider_name_1 = ? WHERE slider_id = ?`;

    var data = await exe(sql,[b.slider_name_1 , id])
    
    
    // res.send(data);
    res.redirect("/admin/slider_images_insert")
})


router.get("/slider_images_edit/:id",verify_login ,  async function(req,res){

    var id = req.params.id;

    var sql = `SELECT * FROM slider_images WHERE slider_id = ?`;

    var data = await exe(sql,[id])

    var obj = {"slider_images":data[0]}

    res.render("admin/slider_images_edit.ejs",obj);
});



router.get("/slider_images_delete/:id",async function(req,res){
    
    var id = req.params.id;

    var sql = `DELETE FROM slider_images WHERE slider_id = ${id}`;

    var data = await exe(sql);

    res.redirect("/admin/slider_images_insert");
})


router.get("/home_page_section_3",verify_login , async function(req,res){

    var sql = `SELECT * FROM home_page_section WHERE  home_page_section = 1`;

    var data = await exe(sql);

    var obj = {"info":data};

    res.render("admin/home_page_section_3.ejs",obj)
})



router.post("/home_page_section",async function(req,res){

    
    

    if(req.files && req.files.icon_image_1)
    {
        var icon_image_1 = new Date().getTime()+req.files.icon_image_1.name;
        req.files.icon_image_1.mv("public/assest/img/photos/"+icon_image_1);

        var sql =`UPDATE home_page_section SET icon_image_1 = '${icon_image_1}' WHERE home_page_section = 1`;
         await exe(sql);
    }
    if(req.files && req.files.icon_image_2)
    {
        var icon_image_2 = new Date().getTime()+req.files.icon_image_2.name;
        req.files.icon_image_2.mv("public/assest/img/photos/"+icon_image_2);

        var sql =`UPDATE home_page_section SET icon_image_2 = '${icon_image_2}' WHERE home_page_section = 1`;
         await exe(sql);
    }
    if(req.files && req.files.icon_image_3)
    {
        var icon_image_3 = new Date().getTime()+req.files.icon_image_3.name;
        req.files.icon_image_3.mv("public/assest/img/photos/"+icon_image_3);

        var sql =`UPDATE home_page_section SET icon_image_3 = '${icon_image_3}' WHERE home_page_section = 1`;
         await exe(sql);
    }
   
    
    var b = req.body;

    var sql = `UPDATE home_page_section SET 
    
                icon_name_1 = ?,
                icon_name_2 = ?,
                icon_name_3 =?

                WHERE home_page_section = 1 `;
    
    var data = await exe(sql,[b.icon_name_1 , b.icon_name_2 , b.icon_name_3]);

    // res.send(data);

    res.redirect("/admin/home_page_section_3")
});


router.get("/home_page_section_4",verify_login ,  async function(req,res){

    var sql = `SELECT * FROM home_page_section_4 WHERE home_page_section_4_id = 1`;

    var data = await exe(sql);


    var obj = {"info":data};
    
    res.render("admin/home_page_section_4.ejs",obj);
    

});

router.post("/home_page_section_4",async function(req,res){

    var b = req.body;

    if(req.files && req.files.image)
    {

        var image = new Date().getTime()+req.files.image.name;
        req.files.image.mv("public/assest/img/photos/"+image);

        var sql = `UPDATE home_page_section_4 SET image = '${image}' WHERE home_page_section_4_id = 1`;
        await exe(sql);

    }

    var sql = `UPDATE home_page_section_4 SET

            big_heading = ?,
            title = ?,
            subtitle = ?
            
            WHERE home_page_section_4_id = 1`;
    
    
            var data = await exe(sql,[b.big_heading , b.title , b.subtitle])
    
    // res.send(data);
    res.redirect("/admin/home_page_section_4")
});


router.post("/home_page_our_services",async function(req,res){
    
 
    var b = req.body;

    if(req.files)
    {
        if(req.files.image)
        {
            var image = new Date().getTime()+req.files.image.name;
            req.files.image.mv("public/assest/img/photos/"+image);
            console.log(image)
        }
    }

    var sql = `INSERT INTO home_page_services(services_title , subtitle_details , image)VALUES
                                            (? , ? , ?)`;

    var data = await exe(sql,[b.services_title , b.subtitle_details , image]);


    // res.send(data);

res.redirect("/admin/home_page_our_services");

    
});

router.get("/home_page_our_services",verify_login ,  async function(req,res){


var data = await exe(`SELECT * FROM home_page_services`);

var obj = {"info":data};


    res.render("admin/home_page_our_services.ejs",obj);

})

router.get("/home_page_our_services_edit/:id",verify_login , async function(req,res){

    var id = req.params.id;

    var data = await exe(`SELECT * FROM home_page_services WHERE home_page_services_id = ${id}`);

    var obj = {"info":data[0]}

    res.render("admin/home_page_our_services_edit.ejs",obj)
})



router.post("/home_page_our_services_edit/:id",async function(req,res){


    var b = req.body;
    
    var id = req.params.id;
    
        if(req.files && req.files.image)
        {
            var image = new Date().getTime()+req.files.image.name;
            req.files.image.mv("public/assest/img/photos/"+image);
            
            var sql = `UPDATE home_page_services SET image = ? WHERE home_page_services_id = ?`;
            await exe(sql,[image , id ]); 
        }


    var sql = `UPDATE home_page_services SET services_title = ? , subtitle_details = ? WHERE home_page_services_id = ?`;

    var data = await exe(sql,[b.services_title , b.subtitle_details , id]);

    // res.send(data);
    res.redirect("/admin/home_page_our_services")
});



router.get("/home_page_our_services_delete/:id",async function(req,res){

    var id = req.params.id;
    
    var data = await exe(`DELETE FROM home_page_services WHERE home_page_services_id = ${id}`);

    
    res.redirect("/admin/home_page_our_services");
})







router.get("/home_page_doctor_tems",verify_login ,  async function(req,res){

    var data = await exe(`SELECT * FROM experience_doctor_team`);

    var obj = {"info":data};
    
    res.render("admin/home_page_doctor_tems.ejs",obj);
});

router.post("/experience_doctor_team",async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files.doctor_image)
        {
            var doctor_image = new Date().getTime()+req.files.doctor_image.name;
            req.files.doctor_image.mv("public/assest/img/photos/"+doctor_image);
        }
    }

    var sql = `INSERT INTO experience_doctor_team(big_heding , doctor_image , docter_title , doctor_details)VALUES
                                                (? , ? , ? , ?)`;
    
    var data = await exe(sql,[b.big_heding , doctor_image ,  b.docter_title , b.doctor_details])

    // res.send(data);
    res.redirect("/admin/home_page_doctor_tems")
});

router.get("/experience_doctor_team_edtit/:id",verify_login ,  async function(req,res){

    var id = req.params.id;

    var sql = `SELECT * FROM experience_doctor_team WHERE experience_doctor_team_id = ?`;


    var obj = {"info":data};

    res.render("admin/experience_doctor_team_edtit.ejs",obj)
})

router.post("/experience_doctor_team_edtit/:id",async function(req,res){
    
   

    var id = req.params.id;

    if(req.files && req.files.doctor_image)
    {
        var doctor_image = new Date().getTime()+req.files.doctor_image.name;
        req.files.doctor_image.mv("public/assest/img/photos/"+doctor_image);

        var sql = `UPDATE experience_doctor_team SET doctor_image = ? WHERE experience_doctor_team_id = ?`;
        await exe(sql,[doctor_image , id]);
    }

    var b = req.body;

    var sql = `UPDATE  experience_doctor_team SET
                
                big_heding = ?,
                docter_title = ?,
                doctor_details  = ?

                WHERE experience_doctor_team_id = ?`;

    var data = await exe(sql,[b.big_heding , b.docter_title , b.doctor_details  , id]);

    // res.send(data);
    res.redirect("/admin/home_page_doctor_tems");
});

router.get("/experience_doctor_team_delete/:id",verify_login ,  async function(req,res){
    
    var id = req.params.id;

    var sql = `DELETE FROM experience_doctor_team WHERE experience_doctor_team_id = '${id}'`;

    var data = await exe(sql);

    res.redirect("/admin/home_page_doctor_tems");
})

router.get("/home_page_blog",verify_login ,  async function (req, res) {
    var sql = `SELECT * FROM home_page_blog`;
    var data = await exe(sql);
    res.render("admin/home_page_blog.ejs", { info: data });
});

router.post("/home_page_blog", async function (req, res) {
 
    var b = req.body;

    // if(req.files)
    // {
    //     if(req.files.video)
    //     {
    //         var video = new Date().getTime()+req.files.video.name;
    //         req.files.video.mv("public/assest/img/photos/"+video);
    //     }
    // }

    var sql = `INSERT INTO home_page_blog(video)VALUES(?)`;


    var data = await exe(sql,[b.video]);

    

    res.redirect("/admin/home_page_blog");
})

router.get("/about_background_imag",verify_login ,  async function(req,res){

    var data = await exe(`SELECT * FROM about_background_imag`);

    var obj = {"info":data};

    res.render("admin/about_background_imag.ejs",obj);
});


router.post("/about_background_imags",async function(req,res){
   
   
    var b = req.body;

    var id = req.params.id;
    
    

    if(req.files && req.files.about_background_imags)
    {
        var about_background_imags = new Date().getTime()+req.files.about_background_imags.name;
        req.files.about_background_imags.mv("public/assest/img/photos/"+about_background_imags);

        var sql = `UPDATE about_background_imag SET about_background_imags = ? WHERE about_background_imag_id = 8`;
        await exe(sql,[about_background_imags]);
    }
    

    var sql = `UPDATE about_background_imag SET about_background_image_name = ?  WHERE about_background_imag_id = 8`;

    var data = await exe(sql,[b.about_background_image_name]);
    
    // res.send(data);
    res.redirect("/admin/about_background_imag");

});


router.get("/about_us_introduction",verify_login , async function(req,res){


    var data = await exe(`SELECT * FROM about_page `);

    var obj = {"info":data};
    
    res.render("admin/about_us_introduction.ejs",obj);
});

router.post("/about_us_introduction",async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files.about_image)
        {
            var about_image = new Date().getTime()+req.files.about_image.name;
            req.files.about_image.mv("public/assest/img/photos/"+about_image)
        }
    }

    var sql = `INSERT INTO about_page(about_big_title_name , about_background_image_name , about_image , about_us_card_title , about_us_card_details , about_details , about_service)VALUES
    (? , ? , ? , ? , ? , ? , ?)`;

    var data = await exe(sql,[b.about_big_title_name , b.about_background_image_name , about_image , b.about_us_card_title , b.about_us_card_details , b.about_details , b.about_service]);
    
    // res.send(data);
    res.redirect("/admin/about_us_introduction");
});

router.get("/about__intro_info_edit/:id",verify_login , async function(req,res){

    var id = req.params.id;

    var data = await exe(`SELECT * FROM about_page WHERE about_page_id = ${id}`);

    var obj = {"info":data[0]};
    
    res.render("admin/about__intro_info_edit.ejs",obj);
});

router.post("/about__intro_info_edit/:id",async function(req,res){

    var id = req.params.id;

    var b = req.body;

    if(req.files && req.files.about_image)
    {
        var about_image = new Date().getTime()+req.files.about_image.name;
        req.files.about_image.mv("public/assest/img/photos/"+about_image)

        var sql = `UPDATE about_page SET about_image = ? WHERE about_page_id = ?`;
        await exe(sql,[about_image , id]);
    }
    var sql = `UPDATE about_page SET 
       about_big_title_name = ? , about_background_image_name = ? ,  about_us_card_title = ? , about_us_card_details = ? , about_details = ? , about_service = ?
       WHERE about_page_id = ?`;

    var data = await exe(sql,[b.about_big_title_name , b.about_background_image_name  , b.about_us_card_title , b.about_us_card_details , b.about_details , b.about_service , id])
    
    
    // res.send(data);
    res.redirect("/admin/about_us_introduction");
});

router.get("/about__intro_info_delete/:id",verify_login , async function(req,res){

    var id = req.params.id;

    var sql = `DELETE FROM about_page WHERE about_page_id = ${id}`;
    
    var data = await exe(sql);
    
    res.redirect("/admin/about_us_introduction");
})


router.get("/services_background_imag", verify_login ,async function(req,res){

    var data = await exe(`SELECT * FROM services_background_images`);

    var obj = {"info":data};

    res.render("admin/services_background_imag.ejs",obj);
});

router.post("/services_background_imag",async function(req,res){

    var b = req.body;


    if(req.files)
    {
        if(req.files.services_image)
        {
            var services_image = new Date().getTime()+req.files.services_image.name;
            req.files.services_image.mv("public/assest/img/photos/"+services_image);
        }
    }

    var sql = `INSERT INTO services_background_images(serveces_image_name , services_image)VALUES
                                    (? , ?)`;


    var data = await exe(sql,[b.serveces_image_name , services_image]);

    // res.send(data);

    res.redirect("/admin/services_background_imag");

});


router.get("/services_background_imag_edit/:id", verify_login , async function(req,res){

    var id = req.params.id

    var data = await exe(`SELECT * FROM services_background_images WHERE services_background_images_id = ${id}`);

    var obj = {"info":data[0]};

    res.render("admin/services_background_imag_edit.ejs",obj);
});

router.post("/services_background_imag_edit/:id",async function(req,res){

    var id  = req.params.id
    var b = req.body;

    if(req.files && req.files.services_image)
    {
        var services_image = new Date().getTime()+req.files.services_image.name;
        req.files.services_image.mv("public/assest/img/photos/"+services_image);

        var sql = `UPDATE services_background_images SET services_image = ? WHERE services_background_images_id = ${id}`;
          await exe(sql,[services_image ]);
    }

    var sql = `UPDATE services_background_images SET serveces_image_name = ? WHERE services_background_images_id = ?`;

    var data = await exe(sql,[b.serveces_image_name , id]);

    // res.send(data);
    res.redirect("/admin/services_background_imag")
});

router.get("/services_background_imag_delete/:id",verify_login , async function(req,res){
    
    var sql = `DELETE  FROM services_background_images WHERE services_background_images_id = ${req.params.id}`;

    var data = await exe(sql);

    res.redirect("/admin/services_background_imag")
})


router.get("/services_deatils", verify_login ,async function(req,res){

    var data = await exe(`SELECT * FROM services_card`);
    
    res.render("admin/services_deatils.ejs",{"info":data});
})

router.post("/serve_deatils",async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files)
        {
            var card_images_services = new Date().getTime()+req.files.card_images_services.name;
            req.files.card_images_services.mv("public/assest/img/photos/"+card_images_services);
        }
    }

    var sql = `INSERT INTO services_card(card_images_services , card_title_services , card_details_services)VALUES
                                        (? , ? , ?)`; 

    var data = await exe(sql,[card_images_services , b.card_title_services, b.card_details_services]);

    // res.send(data);
    res.redirect("/admin/services_deatils");
});


router.get("/serve_deatils_edit/:id",verify_login ,async function(req,res){

    var data = await exe(`SELECT * FROM services_card WHERE services_card_id = ?`,req.params.id)
    
    res.render("admin/serve_deatils_edit.ejs",{"info":data[0]});
});

router.post("/serve_deatils_edit/:id",verify_login , async function(req,res){

    var b = req.body;

    if(req.files && req.files.card_images_services)
    {
        var card_images_services = new Date().getTime()+req.files.card_images_services.name;
        req.files.card_images_services.mv("public/assest/img/photos/"+card_images_services);

        var data = await exe(`UPDATE services_card SET card_images_services = ? WHERE services_card_id = ?`,[card_images_services , req.params.id]);
    }

    var sql = `UPDATE services_card SET card_title_services = ? , card_details_services = ? WHERE services_card_id = ?`;

    var data = await exe(sql,[b.card_title_services , b.card_details_services , req.params.id]);

    res.redirect("/admin/services_deatils");
    
})

router.get("/services_card_delete/:id",verify_login , async function(req,res){
    
    var data = await exe(`DELETE FROM services_card WHERE services_card_id = ?`,[req.params.id]);

    res.redirect("/admin/services_deatils");
})


router.get("/gallary_background_page",verify_login , async function(req,res){

    var data = await exe(`SELECT * FROM gallary_background_page`);

    res.render("admin/gallary_background_page.ejs",{"info":data});
})


router.post("/gallary_background_page",async function(req,res){

    var b = req.body;

    if(req.files)
    {
        if(req.files.gallary_background_image)
        {
            var gallary_background_image = new Date().getTime()+req.files.gallary_background_image.name;
            req.files.gallary_background_image.mv("public/assest/img/photos/"+gallary_background_image);
        }
    }
    var sql = `INSERT INTO gallary_background_page(gallary_background_image_name , gallary_background_image)VALUES
                                            (? , ?)`;
    var data = await exe(sql,[b.gallary_background_image_name , gallary_background_image]);

    // res.send(data);
    res.redirect("/admin/gallary_background_page");
})

router.get("/gallary_background_page_edit/:id",verify_login ,async function(req,res){
    
    var data = await exe(`SELECT * FROM gallary_background_page WHERE gallary_background_page_id = ?`,req.params.id);

    res.render("admin/gallary_background_page_edit.ejs",{"info":data[0]});
})

router.get("/gallary_background_page_delete/:id",verify_login ,async function(req,res){
    
    var sql = `DELETE FROM gallary_background_page WHERE gallary_background_page_id = ${req.params.id}`;

    var data = await exe(sql);

    res.redirect("/admin/gallary_background_page")
})


router.get("/contact",verify_login ,async function(req,res){

    var data = await exe(`SELECT * FROM contact`);

    var contact_us =  await exe(`SELECT * FROM contact_us`);
    
    res.render("admin/contact.ejs",{"info":data[0],"contact_us":contact_us});
})


router.post("/contact",async function(req,res){

   
    var b = req.body;

    var id = req.params.id;

    if(req.files && req.files.contact_image)
    {
         var contact_image = new Date().getTime()+req.files.contact_image.name;
         req.files.contact_image.mv("public/assest/img/photos/"+contact_image);

         var sql = `UPDATE contact SET contact_image = ? WHERE contact_id = 15`;
         await exe(sql,[contact_image]);
        }

    var sql = `UPDATE contact SET 
    
                contact_address = ?,
                contact_email = ?,
                contact_phone = ?,
                map = ?
                WHERE contact_id = 15`;

    var data = await exe(sql,[b.contact_address , b.contact_email , b.contact_phone , b.map])
    
    // res.send(data);
    // res.send(data);  

    res.redirect("/admin/contact");
});


router.get("/edit_contact/:id",verify_login , async function(req,res){

    var data = await exe(`SELECT * FROM contact WHERE contact_id = ${req.params.id}`);

    var obj = {"info":data[0]};
    
    res.render("admin/edit_contact.ejs",obj);
});

router.post("/edit_contact/:id",async function(req,res){
    
   

    res.redirect("/admin/contact")
});

router.get("/delete_contact/:id",verify_login ,async function(req,res){
    
    var data = await exe(`DELETE FROM contact WHERE contact_id = ${req.params.id}`);

    res.redirect("/admin/contact")
})


router.get("/map",verify_login ,async function(req,res){

    var data = await exe(`SELECT * FROM map`);

    var obj = {"info":data};

    res.render("admin/map.ejs",obj)
})



router.get("/appointment_delete/:id",verify_login , async function(req,res){
    
    var id = req.params

    var sql = `DELETE FROM appointments WHERE appointments_id = ${id}`;

    var data = await exe(sql);

    res.redirect("/")


})


module.exports = router;


// CREATE TABLE map (
//     map_id INT AUTO_INCREMENT PRIMARY KEY,
//     map TEXT 
// );



// CREATE TABLE contact (
//     contact_id INT AUTO_INCREMENT PRIMARY KEY,
//     contact_image VARCHAR(255),
//     contact_address TEXT,
//     contact_email VARCHAR(100),
//     contact_phone VARCHAR(20)
// );

// CREATE TABLE gallary_background_page (
//     gallary_background_page_id INT PRIMARY  KEY AUTO_INCREMENT,
//     gallary_background_image_name VARCHAR(255),
//     gallary_background_image TEXT
// );


// CREATE TABLE services_card (
//     services_card_id INT AUTO_INCREMENT PRIMARY KEY,
//     card_images_services VARCHAR(255),
//     card_title_services VARCHAR(255),
//     card_details_services TEXT
// );

// CREATE TABLE home_page_blog (
//     home_page_blog_id INT AUTO_INCREMENT PRIMARY KEY,
//     blog_video VARCHAR(255)
// );