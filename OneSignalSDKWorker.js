importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js");

firebase.initializeApp({
  apiKey:            "AIzaSyDCoTi2mUUsrbAfeEUgA-I45ZuUzRiZ9v8",
  authDomain:        "cosmeticsmw-bd93d.firebaseapp.com",
  projectId:         "cosmeticsmw-bd93d",
  storageBucket:     "cosmeticsmw-bd93d.firebasestorage.app",
  messagingSenderId: "654394172526",
  appId:             "1:654394172526:web:e40f0488b91ae31a1a727f"
});

var db = firebase.firestore();

// Check push_queue every 10 seconds
setInterval(async function(){
  try{
    var snap = await db.collection('push_queue')
                       .where('sent','==',false)
                       .get();
    snap.forEach(async function(docSnap){
      var data = docSnap.data();
      // Send via OneSignal REST API
      var resp = await fetch('https://onesignal.com/api/v1/notifications',{
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Key njn27yluwezpmrxxmnxmq622v'
        },
        body: JSON.stringify(data.payload)
      });
      if(resp.ok){
        await db.collection('push_queue').doc(docSnap.id).update({ sent: true });
      }
    });
  }catch(e){ console.log('SW push error:', e); }
}, 10000);
