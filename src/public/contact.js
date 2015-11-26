var $w = $( window ) ,
  $contact = $( '#contact' ).on( 'mouseenter' , '.clear' , function () {
    $( this ).find( 'b' ).stop( true ).animate( {
      width : 200 ,
      //            height : 162 ,
      opacity : 1
    } , 200 );
  } ).on( 'mouseleave' , '.clear' , function () {
    $( this ).find( 'b' ).stop().animate( {
      width : 0 ,
      opacity : 0
    } , 200 );
  } ).on( 'click' , '.back' , function ( e ) {
    e.preventDefault();
    $w.scrollTop() && $( 'body,html' ).animate( {
      scrollTop : 0
    } , 500 );
  } );

$contact._pos = function () {
  //        var l = ($w.width() - 1000) / 2 - $contact.width();
  //        if ( l < 0 ) {
  //            l = 0;
  //        }
  $contact.css( {
    top : ($w.height() - $contact.height()) / 2 //,
    //            left : l
  } );
};

$contact._pos();

$w.resize( $contact._pos );

