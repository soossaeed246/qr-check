// وقت فتح التحقق
const openTime = new Date("2026-08-16T15:00:00+03:00");

// وقت إغلاق التحقق
const closeTime = new Date("2026-08-17T04:00:00+03:00");


// التحكم في ظهور الصفحات
function checkTime(){

    const now = new Date();

    const countdownBox = document.getElementById("countdownBox");
    const checkBox = document.getElementById("checkBox");
    const closedBox = document.getElementById("closedBox");
    const countdown = document.getElementById("countdown");


    if(now < openTime){

        countdownBox.style.display="block";
        checkBox.style.display="none";
        closedBox.style.display="none";


        let diff = openTime - now;


        let days = Math.floor(diff/(1000*60*60*24));

        let hours = Math.floor(
            (diff%(1000*60*60*24))/(1000*60*60)
        );

        let minutes = Math.floor(
            (diff%(1000*60*60))/(1000*60)
        );

        let seconds = Math.floor(
            (diff%(1000*60))/1000
        );


        countdown.innerHTML =
        days+" يوم | "+
        hours+" ساعة | "+
        minutes+" دقيقة | "+
        seconds+" ثانية";


    }


    else if(now >= openTime && now <= closeTime){

        countdownBox.style.display="none";
        checkBox.style.display="block";
        closedBox.style.display="none";

    }


    else{

        countdownBox.style.display="none";
        checkBox.style.display="none";
        closedBox.style.display="block";

    }

}


setInterval(checkTime,1000);

checkTime();




// نظام QR والتحقق

let scanner;


document.getElementById("scanBtn").onclick = function(){


    if(scanner) return;


    scanner = new Html5Qrcode("reader");


    scanner.start(

        {facingMode:"environment"},

        {
            fps:10,
            qrbox:250
        },


        (decodedText)=>{


            let code = decodedText;


            if(decodedText.includes("code=")){

                code =
                decodedText.split("code=")[1]
                .split("&")[0];

            }


            document.getElementById("code").value=code;


            scanner.stop();


            checkCode(code);


        }


    );


};




document.getElementById("checkBtn").onclick=function(){


    let code =
    document.getElementById("code").value.trim();


    if(code===""){

        document.getElementById("result").innerHTML =
        "اكتب رقم الدعوة أولاً";

        return;

    }


    checkCode(code);


};





function checkCode(code){


document.getElementById("result").innerHTML =
"جاري التحقق...";



fetch(
SCRIPT_URL+
"?code="+
encodeURIComponent(code)
)


.then(res=>res.json())


.then(data=>{


if(data.status==="ok"){


fetch(
SCRIPT_URL+
"?action=checkIn&code="+
encodeURIComponent(code)
);



document.getElementById("result").innerHTML =
"<div class='success'>✅ تم الدخول</div><br>"
"الاسم: "+data.name;



}


else if(data.status==="used"){


document.getElementById("result").innerHTML =
"<div class='warning'>⚠️ تم الدخول مسبقًا</div><br>"
"الاسم: "+data.name+
"<br>وقت الدخول: "+
new Date(data.time).toLocaleString("ar-SA");


}


else{


document.getElementById("result").innerHTML =
"<div class='error'>❌ الدعوة غير موجودة</div>"


}


});


}
