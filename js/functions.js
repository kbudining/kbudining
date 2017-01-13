function pad(number, length) {  // Padding function

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function loadHTML( filename ) { // Routing function

    if ( filename === '' || filename === null || typeof( filename ) === 'undefined' ) {

        $( '#navigation' ).load( './pages/navigation.html' );
        $( '#dashboard' ).load( './pages/dashboard.html' );
        $( '#extra' ).load( './pages/todayssales.html' );
        // $( '#floatable' ).load( './pages/float.html' );

    } else {
        $( '#extra' ).empty( );
        $( '#dynamic' ).fadeOut( 100 ).slideUp( 100 ).load( './pages/'+filename+'.html' ).fadeIn( 100 ).slideDown( 100 );
        setTimeout( function () {
            $( 'select' ).material_select( );
        }, 250 );
    }

}

function generateID() {
    let id = '';
    let length = 6;
    const characters = '1QAZXSW23EDCVFR45TGBNHY67UJMKLOI890PL';
    let index = Math.round( Math.random( ) * 100 );
    if ( index > characters.length ) {
        while ( index > characters.length ) {
            index -= 5;
        }
    }
}

function pushToFirebase( ref, id, data, onSuccess ) {   //  Save data to firebase
    let reference = firebase.database( ).ref( ref + '/' + id );
    reference.set( data, onSuccess );
}

function childAdded( ref, onSuccess ) {
    let reference = firebase.database( ).ref( ref );
    reference.on( 'child_added', onSuccess );
}

function childRemoved( ref, onSuccess ) {
    let reference = firebase.database( ).ref( ref );
    reference.on( 'child_removed', onSuccess );
}

function loadDataFromFirebase( ref, id, onSuccess ) {
    let target = ( id === '' ) ? ref : ref + '/' + id;
    let reference = firebase.database( ).ref( target );
    reference.once( 'value', onSuccess );
}

function filterDataFromFirebase( ref, order, value, onSuccess ) {
    let reference   =   firebase.database( ).ref( ref );
    reference.orderByChild( order ).equalTo( value ).once( 'value', onSuccess );
    // reference.off( 'value', () => console.log( 'Stopped listening' ));
}

function deleteFromFirebase( ref, id, onSuccess ) {
    let target      =   ref + '/' + id;
    let reference   =   firebase.database( ).ref( target );
    reference.remove( ).then( onSuccess );
}

function updateSpecificChildValue( ref, id, prop, new_value, onSuccess ) {
    let updates = {};
    updates[ ref+'/'+id+'/'+prop ] = new_value;

    let reference   =   firebase.database( ).ref( );
    reference.update( updates ).then( onSuccess );
}

function childChanged( ref, onSuccess ) {
    let reference   =   firebase.database( ).ref( ref );
    reference.on( 'child_changed', onSuccess );
}

function upCaseFirst( string ) {
    let low_case    = string.toLowerCase( );
    let firstchar   = low_case.substring( 0, 1 );
    let rest        = low_case.substr( 1 );
    return firstchar.toUpperCase( ).concat( rest ).trim( );
}

function upCaseEach( phrase ) {
    let words   =   phrase.split( ' ' );
    let new_phrase = ''
    words.map( word => {
        new_phrase += upCaseFirst( word );
        new_phrase += ' ';
    })
    return new_phrase.trim( );
}

function item( name, category, price, type, quantity, lastupdated ) {
    let item    =   {};
    item.name   =   upCaseEach( name );
    item.category   =   category;
    item.price  =   parseFloat( price.trim( ) ).toFixed( 2 );
    item.type   =   type;
    item.quantity   =   parseInt( quantity.trim( ) );
    item.addedBy    =   'admin',
    item.addedOn    =   get( 'date' );
    item.addedAt    =   get( 'time' );
    item.lastupdated = lastupdated.trim( );
    return item;
}

// SHADES OF COLORS
function colorShade() {
    let colors = [ 'purple', 'red', 'amber', 'light-blue', 'green' ];
    let shades = [
        'darken-4', 'darken-3', 'darken-2', 'darken-1', '', 'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5'
    ];

    let get_color = ( Math.ceil( Math.random( ) * 10 ) ) - 2;
    if ( get_color > 4 ) {
        get_color = get_color - 4;
    }
    if ( get_color < 0 ) {
        get_color = 1;
    }
    let get_shade = Math.ceil( Math.random( ) * 10 ) -1 ;
    return colors[ get_color ]+' '+shades[ get_shade ];

}
//

// POPULATE FUNCTIONS
function populateCategoryTable( snap ) {
    if ( snap.val( ) === null ) {
        $( '#category_row' ).empty( ).append( `<tr>
            <td colspan="5"><h6 class="center">No records found!</h6></td>
        </tr>` );
    } else {
        let new_rows = '';
        snap.forEach( child => {
            new_row = `<tr data-name="name" data-addedOn="`+ child.val( ).addedOn +`" data-addedBy="`+ child.val( ).addedBy +`" data-key="`+ child.key +`" data-ref="categories">
                <td class="edit" data-name="name">`+ child.val( ).name +`</td>
                <td class="edit" data-name="assigned_to">`+ child.val( ).assigned_to +`</td>
                <td>`+ child.val( ).addedOn +`</td>
                <td>`+ child.val( ).addedBy +`</td>
                <td class="center"><a class="del" href="" data-record-id="`+ child.key +`" data-ref="categories"><i class="material-icons red-text">delete</i></a></td>
            </tr>`;
            new_rows += new_row;
        });
        $( '#category_row' ).empty( ).append( new_rows );
    }
}

function populateDrinksTable( snap ) {
    if ( snap === null ) {
        $( '#drinks_table tbody' ).empty( ).append( `<tr>
            <td colspan="5"><h6 class="center">No records found!</h6></td>
        </tr>` );
    } else {
        let new_rows = '';
        snap.forEach( child => {
            let color = ( child.val( ).quantity < 5 ) ? 'red lighten-4' : '';
            new_row = `<tr class="`+ color +`" data-name="name" data-price="`+ child.val( ).price +`" data-quantity="`+ child.val( ).quantity +`" data-addedOn="`+ child.val( ).addedOn +`" data-addedBy="`+ child.val( ).addedBy +`" data-key="`+ child.key +`" data-ref="drinks">
                <td class="edit" data-name="name">`+ child.val( ).name +`</td>
                <td class="edit" data-name="price">`+ child.val( ).price +`</td>
                <td class="edit" data-name="quantity">`+ child.val( ).quantity +`</td>
                <td data-name="addedOn">`+ child.val( ).addedOn +`</td>
                <td data-name="addedBy">`+ child.val( ).addedBy +`</td>
                <td data-name="lastupdated">`+ child.val( ).lastupdated +`</td>
                <td><a href="" class="center del" data-record-id="`+ child.key +`" data-ref="drinks"><i class="red-text material-icons">delete</i></a></td>
            </tr>`;
            new_rows += new_row;
        });
        $( '#drinks_table tbody' ).empty( ).append( new_rows );
    }
}

// Get sales
function populateSalesTable( snap ) {

    if ( snap ) {
        let row =   `<tr id="`+snap.key+`" class="animated slideInDown">
            <td>`+snap.val( ).type+`</td>
            <td>`+snap.val( ).items+`</td>
            <td>`+snap.val( ).cost+`</td>
            <td>`+snap.val( ).paid+`</td>
            <td>`+snap.val( ).change+`</td>
            <td class="status">`+snap.val( ).status+`</td>
            <td>
                <a href="" class="col s4 btn-flat blue white-text center description" data-record-id="`+ snap.key +`" data-ref="sales">
                    <i class="material-icons">description</i>
                </a>
                <a href="" class="col s4 btn-flat amber white-text center change_status" data-record-id="`+ snap.key +`" data-ref="sales">
                    <i class="material-icons">style</i>
                </a>
                <a href="" class="col s4 btn-flat red white-text center del" data-record-id="`+ snap.key +`" data-chain=true data-ref="sales">
                    <i class="material-icons">delete</i>
                </a>
            </td>
        </tr>`;
        $( '#sales-table tbody' ).prepend( row );
    }   else {
        $( '#sales-table tbody' ).empty( ).html( `<tr>
            <td colspan="7"><h5 class="center">No records found!</h5></td>
        </tr>` );
    }
}

// Get Meals
function populateMealsTable( snap ) {
    if ( snap.val( ) === null ) {
        $( '#meals-table tbody' ).empty( ).html( `<tr>
            <td colspan="7"><h5 class="center">No records found!</h5></td>
        </tr>` );
    } else {
        let rows = '';
        snap.forEach( child => {
            rows += `<tr data-name="name" data-price="`+ child.val( ).price +`" data-quantity="`+ child.val( ).quantity +`" data-addedOn="`+ child.val( ).addedOn +`" data-addedBy="`+ child.val( ).addedBy +`" data-key="`+ child.key +`" data-ref="meals">
                <td class="edit" data-name="name">`+ child.val( ).name +`</td>
                <td class="" data-name="type">`+ child.val( ).type +`</td>
                <td class="edit food" data-name="quantity">`+ child.val( ).quantity +`</td>
                <td class="edit" data-name="price">`+ child.val( ).price +`</td>
                <td>`+ child.val( ).addedOn +`</td>
                <td><a href="" class="center del" data-record-id="`+ child.key +`" data-ref="meals"><i class="red-text material-icons">delete</i></a></td>
            </tr>`;
        });
        $( '#meals-table tbody' ).empty( ).html( rows );
    }
}

function get( what ) {

    let today   = new Date( );
    let toString  = today.toString( );
    let toArray = toString.split( ' ' );
    switch ( what ) {
        case 'time':
        return toArray[ 4 ];
        break;
        case 'date':
        return toArray[ 0 ]+', '+toArray[ 2 ]+'-'+toArray[ 1 ]+'-'+toArray[ 3 ];
        break;
        default:
        return 'Unknown parameter, expected date or time';

    }

}

function display( message, duration = 5000 ) {
    return Materialize.toast( message, duration );
}

function alignCenter( text ) {
    let doc = new jsPDF({
        orientation:'portrait',
        unit:'mm',
        format:[80, 80]
    });
    return ( 80 - ( (doc.getStringUnitWidth( text ) * 10) / 2.8125 ) ) / 2;
}

function prepareReceipt( id, orderType, servedBy, sub, delivery, cost, paid, change ) {
    let date = new Date( );

    // playground requires you to assign document definition to a variable called dd

    var dd = {
        pageSize: 'A7',
        pageMargins:[0,0,0,0],
        content: [
            { text:'KORLE - BU DINING', style:'header'},
            { text:'0303 968 384', style:'header'},
            { text: date.toDateString( )+' - '+date.toLocaleTimeString(), style:'normal'},
            {
                text: '*********************************************************',
                style: 'normal'
            },
            {
                text: 'Purchase Details',
                style: 'normal'
            },
            {
                text: '*********************************************************',
                style: 'normal'
            },
            {
                columns:[
                    {
                        width:'40%',
                        margin:[ 20, 0 ],
                        text:[ { text:'Sales #', fontSize: 8, alignment: 'left' } ]
                    },
                    {
                        width:'60%',
                        text:[ { text:': '+ id, fontSize: 8 } ]
                    }

                ]
            },
            {
                columns:[
                    {
                        width:'40%',
                        margin:[ 20, 0 ],
                        text:[ { text:'Customer #', fontSize:8, alignment: 'left' } ]
                    },
                    {
                        width:'60%',
                        text:[ { text:': 564654432', fontSize:8 } ]
                    }

                ]
            },
            {
                columns:[
                    {
                        width:'40%',
                        margin:[ 20, 0 ],
                        text:[ { text:'Type', fontSize:8, alignment: 'left' } ]
                    },
                    {
                        width:'60%',
                        text:[ { text:': '+ orderType, fontSize:8 } ]
                    }

                ]
            },
            {
                columns:[
                    {
                        width:'40%',
                        margin:[ 20, 0 ],
                        text:[ { text:'Served by', fontSize:8, alignment: 'left' } ]
                    },
                    {
                        width:'60%',
                        text:[ { text:': '+servedBy, fontSize:8 } ]
                    }

                ]
            },
            {
                text: '*********************************************************',
                style: 'normal'
            },
            {
                columns:[
                    {
                        width:'60%',
                        margin:[ 20, 0 ],
                        text:[{ text:'Item', fontSize: 8, bold: true, alignment: 'center' }]
                    },{
                        width:'10%',
                        margin:[ 20, 0 ],
                        text:[{ text:'Qty', fontSize: 8, bold: true, alignment: 'right' }]
                    },{
                        width:'30%',
                        margin:[ 20, 0 ],
                        text:[{ text:'Cost', fontSize: 8, bold: true, alignment: 'right' }]
                    }
                ]
            },
            {
                text: '-------------------------------------------------------------------------------------------', style: 'normal'
            },
            {
                text: '-------------------------------------------------------------------------------------------', style: 'normal'
            },
            {
                columns:[
                    {
                        width:'80%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text:'Sub Total:',
                                fontSize: 8,
                                alignment: 'right',
                                bold: true
                            }
                        ]
                    },{
                        width:'20%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text: sub,
                                fontSize: 8,
                                bold: true,
                                alignment: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                text: '-------------------------------------------------------------------------------------------', style: 'normal'
            },
            {
                columns:[
                    {
                        width:'80%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text:'Delivery Fee:',
                                fontSize: 8,
                                alignment: 'right'
                            }
                        ]
                    },{
                        width:'20%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text: delivery.toFixed( 2 ),
                                fontSize: 8,
                                bold: true,
                                alignment: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                columns:[
                    {
                        width:'80%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text:'Total:',
                                fontSize: 8,
                                alignment: 'right'
                            }
                        ]
                    },{
                        width:'20%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text: cost,
                                fontSize: 8,
                                bold: true,
                                alignment: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                columns:[
                    {
                        width:'80%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text:'Amount Paid:',
                                fontSize: 8,
                                alignment: 'right'
                            }
                        ]
                    },{
                        width:'20%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text: paid,
                                fontSize: 8,
                                bold: true,
                                alignment: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                columns:[
                    {
                        width:'80%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text:'Change:',
                                fontSize: 8,
                                alignment: 'right'
                            }
                        ]
                    },
                    {
                        width:'20%',
                        margin:[ 20, 0 ],
                        text:[
                            {
                                text: change,
                                fontSize: 8,
                                bold: true,
                                alignment: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                text: '**************************************',
                style: 'normal'
            },
            {
                text: 'Thank you! Hope to see you again!',
                style: 'normal'
            },
            {
                text: 'slogan',
                style: 'normal'
            },
            {
                text: '',
                style: 'normal'

            }
        ],
        styles: {
            header: {
                fontSize: 10,
                alignment: 'center',
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            normal:{
                fontSize: 8,
                alignment: 'center'
            }
        }
    };

    return dd;
}

function printReceipt( receipt ) {

    // dd.content.splice(12, 0, rows );
    var pdfDocGenerator = pdfMake.createPdf( receipt );
    pdfDocGenerator.print( );

}
