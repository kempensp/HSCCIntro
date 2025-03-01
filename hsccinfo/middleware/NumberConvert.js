module.exports={

// Create decimal to binary conversion function
ConvertDecToBin:function(decimal){
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log(decimal)
  } // End if console.debug

  var runningdec=decimal;
  var binString='';

  while (runningdec > 0){
    var newBit= runningdec % 2
    binString=newBit.toString()+binString;
    runningdec = Math.floor(runningdec/2);
  } // End while loop
  return binString;
} // End ConvertDecToBin function


} //End module.exports