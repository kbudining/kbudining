$( document ).ready( function(){
    // Loading Page Contents Using URL
    let url = window.location.href.split( '#' );
    loadHTML( url[ 1 ] );
    // End Loading Page Contents Using URL

    // Loading page contents using click events
    $( document ).on( 'click', '.page-loader', function( e ) {
        loadHTML( $( this ).attr( 'data-page-load' ) );

        // let onSuccess   =   populateCategoryTable( snap );
        if ( $( this ).attr( 'data-page-load' ) === 'category' ) {

            loadDataFromFirebase( 'categories', '', snap => {
                populateCategoryTable( snap );
            });

        } else if ( $( this ).attr( 'data-page-load' ) === 'adddrink' ) {

            filterDataFromFirebase( 'categories', 'assigned_to', 'Drinks', snap => {
                let categories = '<option value="">Select category</option>';

                snap.forEach( child => {
                    categories += `<option value="`+ child.val( ).name+`">`+ child.val( ).name+`</option>`;
                });

                $( '#drink_category' ).empty( ).append( categories ).material_select( );
            });

            loadDataFromFirebase( 'drinks', '', snap => {
                populateDrinksTable( snap );
            });

        } else if ( $( this ).attr( 'data-page-load' ) === 'addmeal' ) {

            filterDataFromFirebase( 'categories', 'assigned_to', 'Meals', snap => {
                let categories = '<option value="">Select category</option>';

                snap.forEach( child => {
                    categories += `<option value="`+ child.val( ).name+`">`+ child.val( ).name +`</option>`;
                });

                $( '#meal_category' ).empty( ).append( categories ).material_select( );
            });

            loadDataFromFirebase( 'meals', '', snap => {
                populateMealsTable( snap );
            });

        } else if ( $( this ).attr( 'data-page-load' ) === 'addsales' ) {

            childAdded( 'sales', function ( snap ) {
                populateSalesTable( snap );
            });

            childRemoved( 'sales', function ( oldsnap ) {
                let id  =   oldsnap.key;
                $( '#sales-table' ).find( 'tr#'+id ).addClass( 'animated zoomOut' ).delay( 1000 ).empty( );
            });

            childChanged( 'sales', function ( snap ) {
                let id  =   snap.key;
                $( '#sales-table' ).find( 'tr#'+id ).find( 'td.status' ).text( snap.val( ).status );
            })
        }

    })
    // End Loading page contents using click events

    // Filter categories by assigned_to
    $( document ).on( 'change', '#filter_category', function () {
        let filter = $( this ).val( ).trim( );
        if ( filter !== 'all' ) {
            filterDataFromFirebase( 'categories', 'assigned_to', filter, snap => {
                populateCategoryTable( snap );
            });
        } else {
            loadDataFromFirebase( 'categories', '', snap => {
                populateCategoryTable( snap );
            });
        }
    })
    //
})
