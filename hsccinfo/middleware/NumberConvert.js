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
, // Comma to separate functions

ConvertDecToHex:function(decimal){
  if (process.env.CONSOLE_DEBUG=="true"){
    console.log("Original value=",decimal)
  } // End if console.debug
  
  var runningdec=decimal;
  var hexString="";
  while (runningdec>0){
    var newDigit=runningdec % 16;
    switch(newDigit){
      case 15:
        newDigit='f'
        break
      case 14:
        newDigit='e'
        break
      case 13:
        newDigit='d'
        break
      case 12:
        newDigit='c'
        break
      case 11:
        newDigit='b'
        break
      case 10:
        newDigit='a'
        break
      default:
        newDigit=newDigit.toString()
        break
    } //End switch statement
    hexString=newDigit+hexString
    runningdec=Math.floor(runningdec/16)
  } // End while loop
  return hexString
} // End ConvertDecToHex function




} //End module.exports