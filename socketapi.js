
const io = require( "socket.io" )();

// var { ToastContainer, toast } = require("react-toastify")
const socketapi = {
    io: io
};
const userModel = require("./routes/users")

const say = require('say')
var onlinename = []
var onlineuser = []

io.on( "connection", async function( socket ) {
var userid = socket.handshake.auth.token
   await userModel.findOneAndUpdate({_id:userid},{$set:{online:"1"}})


 socket.broadcast.emit("getonline",{user_id:userid})  
    socket.on("setname", function(data){

        socket.broadcast.emit('newuser',data)
        onlineuser.push(socket.id);
        onlinename.push(data)
        io.emit("online",onlinename)
    })
    socket.on("disconnect", async (data) => {
        socket.broadcast.emit('disuser',{data:onlinename.splice(onlineuser.indexOf(socket.id),1)})
        var userid = socket.handshake.auth.token
        await userModel.findOneAndUpdate({_id:userid},{$set:{online:"0"}})
     
        onlinename.splice(onlineuser.indexOf(socket.id),1);
        onlineuser.splice(onlineuser.indexOf(socket.id),1);
        io.emit("online",onlineuser)
 socket.broadcast.emit("getoffline",{user_id:userid})  

        // socket.emit("dis")
        // io.emit("usercon")

    });
    console.log( "A user connected" );
    // io.emit("usercon")
socket.on("msg",function(data){
    io.emit("msg",data)
})



});
// end of socket.io logic


module.exports = socketapi;